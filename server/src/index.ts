import { createServer } from 'node:http';
import { config } from 'dotenv';
import { handleCors, parseJsonBody, sendJson } from './utils/http.js';
import { listSentGreetings, listUpcomingGreetings, addGreeting, shouldSendNow } from './data/store.js';
import type { SendGreetingInput } from './types.js';
import { generateGreeting } from './services/generator.js';
import { sendEmail } from './services/resend.js';
import { renderEmailTemplate } from './utils/template.js';

config();

const port = Number.parseInt(process.env.PORT ?? '4000', 10);

const server = createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  if (handleCors(req, res)) {
    return;
  }

  const url = new URL(req.url, 'http://localhost');

  try {
    if (req.method === 'GET' && url.pathname === '/api/health') {
      sendJson(res, 200, { status: 'ok', service: 'Bender API' });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/greetings/sent') {
      const items = listSentGreetings();
      sendJson(res, 200, items);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/greetings/upcoming') {
      const items = listUpcomingGreetings();
      sendJson(res, 200, items);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/greetings/send') {
      const payload = await parseJsonBody<SendGreetingInput>(req);

      if (!payload.recipientName || !payload.recipientEmail || !payload.occasion) {
        sendJson(res, 400, { error: 'Не заполнены обязательные поля.' });
        return;
      }

      const scheduledDate = payload.scheduledFor ? new Date(payload.scheduledFor) : new Date();
      if (Number.isNaN(scheduledDate.getTime())) {
        sendJson(res, 400, { error: 'Некорректная дата отправки.' });
        return;
      }

      const greetingText = await generateGreeting(payload);
      const sendImmediately = !payload.scheduledFor || shouldSendNow(scheduledDate);

      if (sendImmediately) {
        try {
          await sendEmail({
            to: payload.recipientEmail,
            subject: `Поздравление: ${payload.occasion}`,
            html: renderEmailTemplate({
              greetingText,
              recipientName: payload.recipientName,
              occasion: payload.occasion
            })
          });

          const greeting = addGreeting({
            ...payload,
            message: greetingText,
            status: 'sent'
          });

          sendJson(res, 201, greeting);
          return;
        } catch (error) {
          const greeting = addGreeting({
            ...payload,
            message: greetingText,
            status: 'failed'
          });
          sendJson(res, 502, {
            error: 'Не удалось отправить письмо через Resend. Попробуйте позже.',
            greeting
          });
          return;
        }
      }

      const greeting = addGreeting({
        ...payload,
        message: greetingText,
        status: 'scheduled'
      });

      sendJson(res, 201, greeting);
      return;
    }

    sendJson(res, 404, { error: 'Неизвестный маршрут' });
  } catch (error) {
    console.error('Внутренняя ошибка сервера', error);
    sendJson(res, 500, { error: 'Внутренняя ошибка сервиса Bender' });
  }
});

server.listen(port, () => {
  console.log(`🚀 Bender API запущен на http://localhost:${port}`);
});
