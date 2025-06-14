import { getMoodEntries, createMoodEntry } from '@/lib/mongodb-utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real app, you would get userId from session
    const userId = "current_user_id"; 
    const entries = await getMoodEntries(userId);
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch mood entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await createMoodEntry({ ...data, userId: "current_user_id" });
    return NextResponse.json({ message: 'Mood entry created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create mood entry' }, { status: 500 });
  }
}
