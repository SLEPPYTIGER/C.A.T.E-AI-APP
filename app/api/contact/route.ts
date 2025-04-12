import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    // Here you would typically integrate with an email service like SendGrid, Nodemailer, etc.
    // For now, we'll simulate a successful email send
    console.log('Sending email:', {
      to: 'Itshaani123@Gmail.com',
      from: email,
      subject: `Contact Form Message from ${name}`,
      text: message,
    });

    // Simulate a delay to make it feel more realistic
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}