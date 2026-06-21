import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { createSession, getUserByEmail, hashPassword, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body?.email || '').toLowerCase().trim();
  const password = String(body?.password || '');

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ message: 'Email e senha válidos são obrigatórios.' }, { status: 400 });
  }

  if (getUserByEmail(email)) {
    return NextResponse.json({ message: 'Este email já está em uso.' }, { status: 409 });
  }

  const passwordHash = hashPassword(password);
  const createdAt = new Date().toISOString();
  const insert = db.prepare('INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)');
  const result = insert.run(email, passwordHash, createdAt);
  const userId = Number(result.lastInsertRowid);
  const session = createSession(userId);

  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: session.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(session.expiresAt)
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
