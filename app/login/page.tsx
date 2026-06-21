"use client";

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      window.location.href = '/dashboard';
      return;
    }

    const result = await response.json();
    setError(result?.message || 'Credenciais inválidas.');
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/80">
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Login</p>
          <h1 className="text-3xl font-semibold text-slate-950">Acesse seu painel de slogans</h1>
          <p className="text-sm leading-6 text-slate-600">Use seu email e senha para acessar com segurança.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Senha</label>
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Novo por aqui? <Link href="/signup" className="font-semibold text-brand-600">Criar conta</Link>
        </p>
      </div>
    </main>
  );
}
