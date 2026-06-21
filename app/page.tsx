import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-12 lg:grid-cols-[1.25fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-800">
              Slogans automáticos com DeepSeek AI
            </div>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Crie slogans inesquecíveis para sua marca em segundos.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Escreva a descrição do seu produto, gere cinco slogans criativos e acompanhe seu histórico em um painel seguro.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/signup">
                <Button>Começar gratuitamente</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary">Já tenho conta</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-white to-slate-100 p-8 shadow-xl shadow-slate-200/80">
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-950/95 p-8 text-white shadow-lg">
                <p className="text-sm uppercase tracking-[0.24em] text-brand-300">Exemplo</p>
                <h2 className="mt-4 text-2xl font-semibold">Solução de gestão de tempo para startups</h2>
                <p className="mt-3 text-slate-300">Transforme sua produtividade com inteligência e foco para equipes ágeis.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {['Impacto', 'Agilidade', 'Confiança', 'Clareza'].map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-semibold text-slate-900">{item}</p>
                    <p className="mt-2 text-sm text-slate-600">Mensagem inteligente para sua marca.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
