export type Channel = 'email';

export interface Greeting {
  id: string;
  recipientName: string;
  recipientEmail: string;
  occasion: string;
  message: string;
  scheduledFor: string;
  sentAt?: string;
  channel: Channel;
  status: 'sent' | 'scheduled' | 'failed';
}

export interface UpcomingGreeting extends Greeting {
  daysLeft: number;
}

export interface SendGreetingInput {
  recipientName: string;
  recipientEmail: string;
  occasion: string;
  scheduledFor?: string;
  message?: string;
}
