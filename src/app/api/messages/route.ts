import { getMessages, createMessage } from '@/lib/mongodb-utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real app, you would get userId from session
    const userId = "current_user_id"; 
    const messages = await getMessages(userId);
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await createMessage({ ...data, userId: "current_user_id" });
    return NextResponse.json({ message: 'Message created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
