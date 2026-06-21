import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSessionByToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (sessionToken) {
    deleteSessionByToken(sessionToken);
  }

  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0)
  });

  return NextResponse.redirect(new URL('/login', req.url));
}
