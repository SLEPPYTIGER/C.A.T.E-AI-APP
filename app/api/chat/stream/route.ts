import { submitQuestion } from "@/lib/langgraph";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { getConvexClient } from "@/lib/convex";
import {
  ChatRequestBody,
  StreamMessage,
  StreamMessageType,
  SSE_DATA_PREFIX,
  SSE_LINE_DELIMITER,
  TokenMessage,
  ToolStartMessage,
  ToolEndMessage
} from "@/lib/types";

export const runtime = "edge";

function sendSSEMessage(
  writer: WritableStreamDefaultWriter<Uint8Array>,
  data: StreamMessage
) {
  const encoder = new TextEncoder();
  
  // Handle large tool outputs more efficiently
  if (data.type === StreamMessageType.ToolEnd) {
    const toolEndData = data as ToolEndMessage;
    if (
      toolEndData.output &&
      typeof toolEndData.output === 'string' &&
      toolEndData.output.length > 32768 // 32KB
    ) {
      // Truncate large tool outputs to prevent memory issues
      console.warn(`Large tool output detected (${toolEndData.output.length} bytes), truncating`);
      const truncatedData = {
        ...toolEndData,
        output: toolEndData.output.substring(0, 32768) + "... [output truncated due to size]"
      };
      return writer.write(
        encoder.encode(
          `${SSE_DATA_PREFIX}${JSON.stringify(truncatedData)}${SSE_LINE_DELIMITER}`
        )
      );
    }
  }
  
  // Handle large tool inputs
  if (data.type === StreamMessageType.ToolStart) {
    const toolStartData = data as ToolStartMessage;
    if (
      toolStartData.input &&
      typeof toolStartData.input === 'string' &&
      toolStartData.input.length > 32768 // 32KB
    ) {
      // Truncate large tool inputs to prevent memory issues
      console.warn(`Large tool input detected (${toolStartData.input.length} bytes), truncating`);
      const truncatedData = {
        ...toolStartData,
        input: toolStartData.input.substring(0, 32768) + "... [input truncated due to size]"
      };
      return writer.write(
        encoder.encode(
          `${SSE_DATA_PREFIX}${JSON.stringify(truncatedData)}${SSE_LINE_DELIMITER}`
        )
      );
    }
  }
  
  // For large messages, split into smaller chunks
  const jsonData = JSON.stringify(data);
  if (jsonData.length > 16384) { // 16KB
    console.warn(`Large SSE message detected (${jsonData.length} bytes), splitting`);
    
    // For token messages, we can safely truncate
    if (data.type === StreamMessageType.Token) {
      const tokenData = data as TokenMessage;
      if (typeof tokenData.token === 'string' && tokenData.token.length > 16384) {
        const truncatedData = {
          ...tokenData,
          token: tokenData.token.substring(0, 16384) + "... [token truncated due to size]"
        };
        return writer.write(
          encoder.encode(
            `${SSE_DATA_PREFIX}${JSON.stringify(truncatedData)}${SSE_LINE_DELIMITER}`
          )
        );
      }
    }
    
    // Otherwise try to send in chunks of 16KB
    const chunkSize = 16384;
    const message = `${SSE_DATA_PREFIX}${jsonData}${SSE_LINE_DELIMITER}`;
    const encodedMessage = encoder.encode(message);
    
    // Send in chunks to avoid large allocations
    for (let i = 0; i < encodedMessage.length; i += chunkSize) {
      const chunk = encodedMessage.slice(i, Math.min(i + chunkSize, encodedMessage.length));
      writer.write(chunk);
    }
    return Promise.resolve();
  }
  
  // Normal case for reasonably sized messages
  return writer.write(
    encoder.encode(
      `${SSE_DATA_PREFIX}${jsonData}${SSE_LINE_DELIMITER}`
    )
  );
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, newMessage, chatId } =
      (await req.json()) as ChatRequestBody;
    const convex = getConvexClient();

    // Get buffer size from environment variable or use default
    const bufferSize = parseInt(process.env.NEXT_STREAMING_BUFFER_SIZE || "4096");
    console.log(`Using streaming buffer size: ${bufferSize} bytes`);
    
    // Create stream with optimized queue strategy for better memory management
    const stream = new TransformStream({
      // Add a transformer to handle chunks more efficiently
      transform(chunk, controller) {
        // Ensure chunks don't exceed the configured buffer size
        if (chunk && chunk.length > bufferSize) {
          // Split large chunks into smaller ones using the configured buffer size
          const chunkSize = Math.min(bufferSize, 4096); // Use smaller of bufferSize or 4KB for better handling
          for (let i = 0; i < chunk.length; i += chunkSize) {
            controller.enqueue(chunk.slice(i, Math.min(i + chunkSize, chunk.length)));
          }
        } else {
          controller.enqueue(chunk);
        }
      }
    }, {
      // Use the same buffer size for highWaterMark
      highWaterMark: bufferSize,
      size(chunk) {
        // More accurate size calculation
        return chunk?.length || 1;
      }
    });
    const writer = stream.writable.getWriter();

    const response = new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
        "Transfer-Encoding": "chunked",
        "Content-Encoding": "gzip",
        "Keep-Alive": "timeout=120",
        "X-Content-Type-Options": "nosniff"
      },
    });

    // Handle the streaming response
    (async () => {
      try {
        // Send initial connection established message
        await sendSSEMessage(writer, { type: StreamMessageType.Connected });

        // Send user message to Convex
        await convex.mutation(api.messages.send, {
          chatId,
          content: newMessage,
        });

        // Convert messages to LangChain format
        const langChainMessages = [
          ...messages.map((msg) =>
            msg.role === "user"
              ? new HumanMessage(msg.content)
              : new AIMessage(msg.content)
          ),
          new HumanMessage(newMessage),
        ];

        try {
          // Create the event stream
          const eventStream = await submitQuestion(langChainMessages, chatId);

          // Process the events
          for await (const event of eventStream) {
            // console.log("🔄 Event:", event);

            if (event.event === "on_chat_model_stream") {
              const token = event.data.chunk;
              if (token) {
                // Access the text property from the AIMessageChunk
                const text = token.content.at(0)?.["text"];
                if (text) {
                  await sendSSEMessage(writer, {
                    type: StreamMessageType.Token,
                    token: text,
                  });
                }
              }
            } else if (event.event === "on_tool_start") {
              await sendSSEMessage(writer, {
                type: StreamMessageType.ToolStart,
                tool: event.name || "unknown",
                input: event.data.input,
              });
            } else if (event.event === "on_tool_end") {
              const toolMessage = new ToolMessage(event.data.output);

              await sendSSEMessage(writer, {
                type: StreamMessageType.ToolEnd,
                tool: toolMessage.lc_kwargs.name || "unknown",
                output: event.data.output,
              });
            }
          }

          // Send completion message without storing the response
          await sendSSEMessage(writer, { type: StreamMessageType.Done });
        } catch (streamError) {
          console.error("Error in event stream:", streamError);
          await sendSSEMessage(writer, {
            type: StreamMessageType.Error,
            error:
              streamError instanceof Error
                ? streamError.message
                : "Stream processing failed",
          });
        }
      } catch (error) {
        console.error("Error in stream:", error);
        await sendSSEMessage(writer, {
          type: StreamMessageType.Error,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        try {
          await writer.close();
        } catch (closeError) {
          console.error("Error closing writer:", closeError);
        }
      }
    })();

    return response;
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" } as const,
      { status: 500 }
    );
  }
}