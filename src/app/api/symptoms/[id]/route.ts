import { deleteSymptom } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    deleteSymptom(id);
    return NextResponse.json({ message: 'Symptom deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete symptom' }, { status: 500 });
  }
}
