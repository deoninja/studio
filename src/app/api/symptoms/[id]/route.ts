import { deleteSymptom } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await deleteSymptom(id);
    return NextResponse.json({ message: 'Symptom deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete symptom' }, { status: 500 });
  }
}
