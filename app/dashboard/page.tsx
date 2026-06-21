import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import DashboardForm from '@/components/dashboard/dashboard-form';
import db from '@/lib/db';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function getUserFromSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(sessionToken);
  if (!session) return null;
  if (new Date(session.expires_at).getTime() <= Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token = ?').run(sessionToken);
    return null;
  }

  return db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id);
}

export default async function DashboardPage() {
  const user = await getUserFromSession();
  if (!user) {
    redirect('/login');
  }

  const slogans = db.prepare('SELECT * FROM slogans WHERE user_id = ? ORDER BY created_at DESC LIMIT 10').all(user.id);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/70">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Bem-vindo de volta</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-950">Painel de geração de slogans</h1>
              <p className="mt-3 max-w-2xl text-slate-600">Digite uma descrição e crie cinco slogans prontos para usar em campanhas e landing pages.</p>
            </div>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50">
                Sair
              </button>
            </form>
          </div>
        </div>

        <Card className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-600">Gerador AI</p>
            <h2 className="text-2xl font-semibold text-slate-950">Nova descrição do produto</h2>
          </div>
          <DashboardForm />
        </Card>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Histórico</p>
              <h2 className="text-2xl font-semibold text-slate-950">Últimos slogans gerados</h2>
            </div>
          </div>
          <div className="grid gap-4">
            {slogans.length ? slogans.map((item: any) => (
              <Card key={item.id} className="space-y-3">
                <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
                  <span>{new Date(item.created_at).toLocaleString('pt-BR')}</span>
                </div>
                <p className="text-sm text-slate-600">{item.prompt}</p>
                <p className="text-lg font-semibold text-slate-950">{item.slogan}</p>
              </Card>
            )) : (
              <Card>
                <p className="text-slate-600">Nenhum slogan gerado ainda. Use o formulário acima para criar o primeiro.</p>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
