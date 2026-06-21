import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

const baseStyles = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(baseStyles, props.className)} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx(baseStyles, 'min-h-[140px] resize-none', props.className)} {...props} />;
}
