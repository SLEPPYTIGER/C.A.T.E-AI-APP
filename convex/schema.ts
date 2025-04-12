import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    title: v.string(),
    userId: v.string(),
    createdAt: v.number(),
<<<<<<< HEAD
  }),
  messages: defineTable({
    chatId: v.id("chats"),
    content: v.string(),
    userId: v.string(),
    createdAt: v.number(),
  }).index("by_chatId", ["chatId"]),
=======
  }).index("by_user", ["userId"]),

  messages: defineTable({
    chatId: v.id("chats"),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    createdAt: v.number(),
  }).index("by_chat", ["chatId"]),
>>>>>>> a89900a86c9edb2d4213a789d9bdfbf54be1d2ac
});