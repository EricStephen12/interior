import { sendChamp } from './sendchamp'

export const emailService = {
    async sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
        return sendChamp.sendEmail({
            to,
            subject,
            html,
            sender_email: process.env.EMAIL_FROM || 'support@sharersgym.com'
        })
    }
}
