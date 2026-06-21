'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';

export default function DashboardForm() {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!prompt.trim()) {
      setError('Informe a descrição do produto.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
        credentials: 'include'
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body?.message || 'Falha ao gerar slogans.');
        return;
      }

      setPrompt('');
      router.refresh();
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="prompt" className="mb-2 block text-sm font-medium text-slate-700">Descrição do produto</label>
        <Textarea
          id="prompt"
          name="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Conte qual é a proposta, diferencial e público-alvo do seu produto"
          required
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Gerando...' : 'Gerar 5 Slogans'}
      </Button>
    </form>
  );
}
