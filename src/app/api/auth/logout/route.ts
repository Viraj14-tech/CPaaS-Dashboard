import { deleteSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  await deleteSession();
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
