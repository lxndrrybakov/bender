export interface Greeting {
  id: string;
  recipientName: string;
  recipientEmail: string;
  occasion: string;
  message: string;
  scheduledFor: string;
  sentAt?: string;
  channel: 'email';
  status: 'sent' | 'scheduled' | 'failed';
}

export interface UpcomingGreeting extends Greeting {
  daysLeft: number;
}

export interface SendGreetingPayload {
  recipientName: string;
  recipientEmail: string;
  occasion: string;
  scheduledFor?: string;
  message?: string;
}
