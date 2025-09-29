import { HfInference } from '@huggingface/inference';
import type { SendGreetingInput } from '../types.js';

const MODEL_NAME = 'tiiuae/falcon-7b-instruct';
const hfToken = process.env.HF_API_TOKEN;

const inference = hfToken ? new HfInference(hfToken) : null;

function buildPrompt(input: SendGreetingInput): string {
  return `Ты — помощник по работе с клиентами риелторского агентства. Составь тёплое, профессиональное поздравление для клиента.\n` +
    `Формат: 3-5 предложений, дружелюбный тон, деликатное упоминание агентства и готовность помочь.\n` +
    `Имя клиента: ${input.recipientName}.\n` +
    `Повод: ${input.occasion}.\n` +
    `Если это уместно, добавь пожелания, связанные с жильём или недвижимостью.`;
}

export async function generateGreeting(input: SendGreetingInput): Promise<string> {
  if (input.message && input.message.trim().length > 0) {
    return input.message.trim();
  }

  if (!inference) {
    return fallbackGreeting(input);
  }

  try {
    const response = await inference.textGeneration({
      model: MODEL_NAME,
      inputs: buildPrompt(input),
      parameters: {
        max_new_tokens: 220,
        temperature: 0.7,
        top_p: 0.9,
        repetition_penalty: 1.2
      }
    });

    if (typeof response === 'string') {
      return sanitize(response);
    }

    if (Array.isArray(response) && response.length > 0 && 'generated_text' in response[0]) {
      return sanitize(String(response[0].generated_text));
    }

    if ('generated_text' in (response as Record<string, unknown>)) {
      return sanitize(String((response as Record<string, unknown>).generated_text));
    }
  } catch (error) {
    console.error('Не удалось получить текст от Hugging Face:', error);
  }

  return fallbackGreeting(input);
}

function sanitize(text: string): string {
  return text
    .replace(/^[^A-Za-zА-Яа-яЁё]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function fallbackGreeting(input: SendGreetingInput): string {
  return `Здравствуйте, ${input.recipientName}! Поздравляем вас с событием «${input.occasion}». ` +
    'Команда агентства Bender благодарит за доверие и всегда готова помочь с любыми вопросами недвижимости. ' +
    'Пусть в вашем доме будет тепло, уют и новые поводы для радости!';
}
