import { getMedications, createMedication, deleteMedication } from '@/lib/mongodb-utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real app, you would get userId from session
    const userId = "current_user_id"; 
    const medications = await getMedications(userId);
    return NextResponse.json(medications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch medications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await createMedication({ ...data, userId: "current_user_id" });
    return NextResponse.json({ message: 'Medication created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create medication' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await deleteMedication(id);
    return NextResponse.json({ message: 'Medication deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete medication' }, { status: 500 });
  }
}
