import { getProfile, updateProfile } from '@/lib/mongodb-utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real app, you would get userId from session
    const userId = "current_user_id"; 
    const profile = await getProfile(userId);
    return NextResponse.json(profile || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    await updateProfile("current_user_id", data);
    return NextResponse.json({ message: 'Profile updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
