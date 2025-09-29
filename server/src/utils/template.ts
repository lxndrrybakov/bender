interface EmailTemplateOptions {
  greetingText: string;
  recipientName: string;
  occasion: string;
}

export function renderEmailTemplate({ greetingText, recipientName, occasion }: EmailTemplateOptions): string {
  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>Поздравление от Bender</title>
    <style>
      body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f7fb; color: #0f172a; margin: 0; padding: 0; }
      .container { max-width: 640px; margin: 0 auto; padding: 32px 24px; }
      .card { background: #ffffff; border-radius: 20px; padding: 32px; box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08); }
      .badge { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #eff6ff; color: #1d4ed8; font-weight: 600; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
      .footer { font-size: 12px; color: #64748b; margin-top: 32px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <span class="badge">${occasion}</span>
        <h1 style="margin-top: 24px; font-size: 24px;">${recipientName}, команда Bender поздравляет вас!</h1>
        <p style="line-height: 1.6; white-space: pre-line;">${greetingText}</p>
        <p style="margin-top: 24px; font-weight: 600;">С заботой, ваша команда Bender</p>
        <p class="footer">Вы получили это письмо, потому что являетесь клиентом риелторского агентства. Если письмо пришло по ошибке, просто проигнорируйте его.</p>
      </div>
    </div>
  </body>
</html>`;
}
