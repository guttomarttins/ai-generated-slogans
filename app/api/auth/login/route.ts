import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { createSession, getUserByEmail, verifyPassword, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body?.email || '').toLowerCase().trim();
  const password = String(body?.password || '');

  if (!email || !password) {
    return NextResponse.json({ message: 'Email e senha são obrigatórios.' }, { status: 400 });
  }

  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ message: 'Email ou senha inválidos.' }, { status: 401 });
  }

  const session = createSession(user.id);
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: session.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(session.expiresAt)
  });

  return NextResponse.json({ ok: true });
}
