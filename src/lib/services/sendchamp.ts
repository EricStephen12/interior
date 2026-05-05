const BASE_URL = 'https://api.sendchamp.com/api/v1'

class SendChampService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.SENDCHAMP_API_KEY || ''
  }

  async sendEmail({ to, subject, html, sender_email = 'hello@sharersgym.com' }: {
    to: string; subject: string; html: string; sender_email?: string
  }) {
    if (!this.apiKey) return null

    const res = await fetch(`${BASE_URL}/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        to: [{ email: to }],
        subject,
        sender: { email: sender_email },
        message_body: { type: 'text/html', value: html }
      })
    })
    return res.json()
  }

  async sendSMS({ to, message, sender_name = 'SHARERS' }: {
    to: string[]; message: string; sender_name?: string
  }) {
    if (!this.apiKey) return null

    const res = await fetch(`${BASE_URL}/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ to, message, sender_name, route: 'dnd' })
    })
    return res.json()
  }
}

export const sendChamp = new SendChampService()
