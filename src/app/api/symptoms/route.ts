import { getSymptoms, addSymptom } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const symptoms = await getSymptoms();
    return NextResponse.json(symptoms);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch symptoms' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await addSymptom(data);
    return NextResponse.json({ message: 'Symptom added' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add symptom' }, { status: 500 });
  }
}
