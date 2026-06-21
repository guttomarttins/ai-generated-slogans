import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import db, { UserRecord, SessionRecord } from './db';

export const SESSION_COOKIE_NAME = 'deep_slogan_session';
const SESSION_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compareSync(password, passwordHash);
}

export function getUserByEmail(email: string): UserRecord | undefined {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

export function getUserById(id: number): UserRecord | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function createSession(userId: number) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_EXPIRES_MS).toISOString();
  db.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)').run(userId, token, expiresAt);
  return { token, expiresAt };
}

export function getSessionByToken(token: string): SessionRecord | undefined {
  return db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
}

export function deleteSessionByToken(token: string) {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

export function getCurrentUser(): UserRecord | null {
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return null;
  }

  const session = getSessionByToken(sessionToken);
  if (!session) {
    return null;
  }

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    deleteSessionByToken(sessionToken);
    return null;
  }

  return getUserById(session.user_id) ?? null;
}

export function setSessionCookie(token: string) {
  const expires = new Date(Date.now() + SESSION_EXPIRES_MS);
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires
  });
}

export function clearSessionCookie() {
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0)
  });
}
