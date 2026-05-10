import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
  async sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY missing. Email not sent.');
      return null;
    }

    try {
      const data = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'SHARERS GYM <support@sharersgym.com>',
        to: [to],
        subject,
        html,
      });
      return data;
    } catch (error) {
      console.error('Resend error:', error);
      return null;
    }
  }
};
