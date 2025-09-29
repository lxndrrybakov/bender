import type { Greeting, SendGreetingPayload, UpcomingGreeting } from '../types';

const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Не удалось выполнить запрос');
  }

  return response.json() as Promise<T>;
}

export const api = {
  async getSentGreetings(): Promise<Greeting[]> {
    const response = await fetch('/api/greetings/sent');
    return handleResponse<Greeting[]>(response);
  },

  async getUpcomingGreetings(): Promise<UpcomingGreeting[]> {
    const response = await fetch('/api/greetings/upcoming');
    return handleResponse<UpcomingGreeting[]>(response);
  },

  async sendGreeting(payload: SendGreetingPayload): Promise<Greeting> {
    const response = await fetch('/api/greetings/send', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(payload)
    });

    return handleResponse<Greeting>(response);
  }
};
