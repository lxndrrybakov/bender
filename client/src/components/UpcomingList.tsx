import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { UpcomingGreeting } from '../types';

interface UpcomingListProps {
  items: UpcomingGreeting[];
}

export function UpcomingList({ items }: UpcomingListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">Запланированных поздравлений пока нет.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const scheduledDate = format(parseISO(item.scheduledFor), 'd MMMM yyyy', { locale: ru });

        return (
          <li key={item.id} className="border border-brand-100 rounded-xl px-4 py-3 bg-white">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-brand-700">{item.recipientName}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                  Осталось {item.daysLeft} дн.
                </span>
              </div>
              <p className="text-sm text-slate-600">{item.occasion}</p>
              <p className="text-xs text-slate-500">Дата отправки: {scheduledDate}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
