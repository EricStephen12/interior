export interface SendChampEmailOptions {
  to: string;
  subject: string;
  html: string;
  sender_email?: string;
}

export interface SendChampSMSOptions {
  to: string[]; // Phone numbers array
  message: string;
  sender_name?: string;
}

/**
 * SendChamp Integration
 * Handles both Email marketing/transactional and SMS notifications.
 * SMS is only used for subscription expiration reminders.
 */
class SendChampService {
  private apiKey: string;
  private baseUrl: string = 'https://api.sendchamp.com/api/v1';

  constructor() {
    this.apiKey = process.env.SENDCHAMP_API_KEY || '';
  }

  /**
   * Send an Email via SendChamp
   */
  async sendEmail({ to, subject, html, sender_email = 'hello@sharers.gym' }: SendChampEmailOptions) {
    if (!this.apiKey) {
      console.warn('[SendChamp] API key missing. Email skipped.');
      return;
    }

    try {
      console.log(`[SendChamp] Sending Email to ${to} | Subject: ${subject}`);
      
      const response = await fetch(`${this.baseUrl}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          to: [{ email: to }],
          subject,
          sender: { email: sender_email },
          message_body: { type: 'text/html', value: html }
        })
      });

      const data = await response.json();
      console.log('[SendChamp] Email sent successfully:', data);
      return data;
    } catch (error) {
      console.error('[SendChamp] Failed to send email:', error);
      throw error;
    }
  }

  /**
   * Send an SMS via SendChamp
   * Strictly used for subscription expiration reminders
   */
  async sendSMS({ to, message, sender_name = 'SHARERS' }: SendChampSMSOptions) {
    if (!this.apiKey) {
      console.warn('[SendChamp] API key missing. SMS skipped.');
      return;
    }

    try {
      console.log(`[SendChamp] Sending Reminder SMS to ${to.join(', ')}`);

      const response = await fetch(`${this.baseUrl}/sms/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          to,
          message,
          sender_name,
          route: 'dnd'
        })
      });

      const data = await response.json();
      console.log('[SendChamp] Reminder SMS sent successfully:', data);
      return data;
    } catch (error) {
      console.error('[SendChamp] Failed to send reminder SMS:', error);
      throw error;
    }
  }
}

export const sendChamp = new SendChampService();
