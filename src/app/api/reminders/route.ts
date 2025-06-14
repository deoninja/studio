import { getReminders, createReminder, deleteReminder } from '@/lib/mongodb-utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real app, you would get userId from session
    const userId = "current_user_id"; 
    const reminders = await getReminders(userId);
    return NextResponse.json(reminders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await createReminder({ ...data, userId: "current_user_id" });
    return NextResponse.json({ message: 'Reminder created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await deleteReminder(id);
    return NextResponse.json({ message: 'Reminder deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 });
  }
}
