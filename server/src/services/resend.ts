interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

interface ResendResponse {
  id: string;
}

const RESEND_API_URL = 'https://api.resend.com/emails';
const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL ?? 'no-reply@bender.local';

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<ResendResponse> {
  if (!resendApiKey) {
    console.info('[Resend] API ключ не задан, письмо не будет отправлено.');
    console.info('[Resend] Черновик письма:', { to, subject, html });
    return { id: 'mocked-email-id' };
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to,
      subject,
      html
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend API error: ${message}`);
  }

  return response.json() as Promise<ResendResponse>;
}
