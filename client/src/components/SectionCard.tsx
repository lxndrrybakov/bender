import type { PropsWithChildren, ReactNode } from 'react';

interface SectionCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionCard({ title, description, action, children }: SectionCardProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {description ? <p className="text-sm text-slate-500 mt-1">{description}</p> : null}
        </div>
        {action}
      </header>
      <div className="flex-1 min-h-0">{children}</div>
    </section>
  );
}
