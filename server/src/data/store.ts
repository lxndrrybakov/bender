import { nanoid } from 'nanoid';
import { differenceInCalendarDays, formatISO, isAfter } from '../utils/date.js';
import type { Greeting, SendGreetingInput, UpcomingGreeting } from '../types.js';

const sentGreetings: Greeting[] = [
  {
    id: nanoid(),
    recipientName: 'Анна Ковалёва',
    recipientEmail: 'anna.k@example.com',
    occasion: 'Годовщина сделки',
    message:
      'Анна, поздравляем с годовщиной покупки квартиры! Пусть дом наполняется теплом и радостью, а рядом будут только хорошие соседи.',
    scheduledFor: formatISO(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)),
    sentAt: formatISO(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 + 1000 * 60 * 5)),
    channel: 'email',
    status: 'sent'
  },
  {
    id: nanoid(),
    recipientName: 'Дмитрий Сергеев',
    recipientEmail: 'd.sergeev@example.com',
    occasion: 'День рождения',
    message:
      'Дмитрий, поздравляем с днём рождения! Желаем новых горизонтов, тёплых встреч и удачных сделок.',
    scheduledFor: formatISO(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)),
    sentAt: formatISO(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 2)),
    channel: 'email',
    status: 'sent'
  }
];

const upcomingGreetings: UpcomingGreeting[] = [
  {
    id: nanoid(),
    recipientName: 'Мария Романова',
    recipientEmail: 'm.romanova@example.com',
    occasion: 'Годовщина сотрудничества',
    message:
      'Мария, благодарим вас за доверие! Через неделю отметим год успешного сотрудничества — подготовим особое письмо.',
    scheduledFor: formatISO(new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)),
    channel: 'email',
    status: 'scheduled',
    daysLeft: 7
  },
  {
    id: nanoid(),
    recipientName: 'Игорь Петров',
    recipientEmail: 'i.petrov@example.com',
    occasion: 'День рождения',
    message:
      'Игорь, уже скоро ваш день рождения! Подготовим поздравление с акцентом на семейный уют и комфорт.',
    scheduledFor: formatISO(new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)),
    channel: 'email',
    status: 'scheduled',
    daysLeft: 14
  }
];

export function listSentGreetings(): Greeting[] {
  return [...sentGreetings].sort((a, b) => (b.sentAt ?? b.scheduledFor).localeCompare(a.sentAt ?? a.scheduledFor));
}

export function listUpcomingGreetings(): UpcomingGreeting[] {
  const now = new Date();
  return upcomingGreetings
    .map((item) => ({
      ...item,
      daysLeft: Math.max(0, differenceInCalendarDays(new Date(item.scheduledFor), now))
    }))
    .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
}

export function addGreeting(payload: SendGreetingInput & { message: string; status: Greeting['status'] }): Greeting {
  const scheduledFor = payload.scheduledFor ? new Date(payload.scheduledFor) : new Date();
  const greeting: Greeting = {
    id: nanoid(),
    recipientName: payload.recipientName,
    recipientEmail: payload.recipientEmail,
    occasion: payload.occasion,
    message: payload.message,
    scheduledFor: formatISO(scheduledFor),
    sentAt: payload.status === 'sent' ? formatISO(new Date()) : undefined,
    channel: 'email',
    status: payload.status
  };

  if (payload.status === 'sent' || payload.status === 'failed') {
    sentGreetings.unshift(greeting);
  } else {
    const upcoming: UpcomingGreeting = {
      ...greeting,
      daysLeft: Math.max(0, differenceInCalendarDays(scheduledFor, new Date()))
    };
    upcomingGreetings.push(upcoming);
  }

  return greeting;
}

export function markGreetingAsSent(id: string): Greeting | undefined {
  const upcomingIndex = upcomingGreetings.findIndex((item) => item.id === id);
  if (upcomingIndex === -1) {
    return undefined;
  }

  const [upcoming] = upcomingGreetings.splice(upcomingIndex, 1);
  const sent: Greeting = {
    ...upcoming,
    status: 'sent',
    sentAt: formatISO(new Date())
  };
  sentGreetings.unshift(sent);
  return sent;
}

export function shouldSendNow(date: Date): boolean {
  return !isAfter(date, new Date());
}
