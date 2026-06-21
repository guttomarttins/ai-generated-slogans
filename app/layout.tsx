import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DeepSlogan - Gerador de Slogans AI',
  description: 'Crie slogans criativos com IA para seu produto ou marca.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
