import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm', className)} {...props} />;
}
