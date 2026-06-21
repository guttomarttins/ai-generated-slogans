import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSessionByToken, getUserById, SESSION_COOKIE_NAME } from '@/lib/auth';

const DEEPSEEK_API_URL = 'https://api.deepseek.ai/v1/generate';

function parseDeepSeekText(responseBody: any) {
  return (
    String(responseBody?.text || responseBody?.choices?.[0]?.text || responseBody?.data?.[0]?.text || '').trim()
  );
}

export async function POST(req: Request) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value || new URL(req.url).searchParams.get('sessionToken');
  if (!token) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  const session = getSessionByToken(token);
  if (!session || new Date(session.expires_at).getTime() <= Date.now()) {
    return NextResponse.json({ message: 'Sessão inválida.' }, { status: 401 });
  }

  const user = getUserById(session.user_id);
  if (!user) {
    return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 401 });
  }

  const body = await req.json();
  const prompt = String(body?.prompt || '').trim();
  if (!prompt) {
    return NextResponse.json({ message: 'Prompt é obrigatório.' }, { status: 400 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: 'Chave DeepSeek não configurada.' }, { status: 500 });
  }

  // Local developer helper: if DEEPSEEK_API_KEY is set to 'mock', return generated
  // slogans without calling the external API. This lets us run local tests.
  if (apiKey === 'mock') {
    const generated = Array.from({ length: 5 }).map((_, i) => `${prompt} — Slogan ${i + 1}`);

    const insert = db.prepare('INSERT INTO slogans (user_id, prompt, slogan, created_at) VALUES (?, ?, ?, ?)');
    const now = new Date().toISOString();
    const transaction = db.transaction((values: string[][]) => {
      for (const [promptValue, slogan] of values) {
        insert.run(user.id, promptValue, slogan, now);
      }
    });
    transaction(generated.map((s) => [prompt, s]));

    return NextResponse.json({ slogans: generated });
  }

  const promptText = `Gere 5 slogans curtos e criativos para o produto com esta descrição: ${prompt}. Separe cada slogan por ponto e vírgula.`;

  const deepseekResponse = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ prompt: promptText, max_tokens: 150 })
  });

  if (!deepseekResponse.ok) {
    const text = await deepseekResponse.text();
    return NextResponse.json({ message: `DeepSeek retornou erro: ${text}` }, { status: 502 });
  }

  const result = await deepseekResponse.json();
  const sloganText = parseDeepSeekText(result);
  if (!sloganText) {
    return NextResponse.json({ message: 'Resposta DeepSeek inválida.' }, { status: 502 });
  }

  const generated = sloganText.split(/[\.;\\n]/).map((item: string) => item.trim()).filter(Boolean).slice(0, 5);

  const insert = db.prepare('INSERT INTO slogans (user_id, prompt, slogan, created_at) VALUES (?, ?, ?, ?)');
  const now = new Date().toISOString();
  const transaction = db.transaction((values: string[][]) => {
    for (const [promptValue, slogan] of values) {
      insert.run(user.id, promptValue, slogan, now);
    }
  });

  transaction(generated.map((slogan) => [prompt, slogan]));

  return NextResponse.json({ slogans: generated });
}
