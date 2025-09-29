import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Greeting } from '../types';

interface GreetingListProps {
  items: Greeting[];
  emptyLabel: string;
}

export function GreetingList({ items, emptyLabel }: GreetingListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">{emptyLabel}</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const scheduledDate = format(parseISO(item.scheduledFor), 'd MMMM yyyy', { locale: ru });
        const sentDate = item.sentAt
          ? format(parseISO(item.sentAt), 'd MMM yyyy, HH:mm', { locale: ru })
          : '—';

        return (
          <li
            key={item.id}
            className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 hover:bg-white transition"
          >
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-brand-600 uppercase tracking-wide">
                  {item.occasion}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                  {item.status === 'sent' ? 'Отправлено' : item.status === 'failed' ? 'Ошибка' : 'Запланировано'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold text-slate-900">{item.recipientName}</span>
                <span className="text-sm text-slate-500">{item.recipientEmail}</span>
              </div>
              <p className="text-sm text-slate-600 whitespace-pre-line">{item.message}</p>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 mt-2">
                <span>
                  <strong className="block text-slate-400 uppercase tracking-wide">Запланировано на</strong>
                  {scheduledDate}
                </span>
                <span>
                  <strong className="block text-slate-400 uppercase tracking-wide">Отправлено</strong>
                  {sentDate}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
