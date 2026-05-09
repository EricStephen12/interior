import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export const emailService = {
    async sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('SMTP credentials missing. Email not sent.')
            return null
        }

        try {
            const info = await transporter.sendMail({
                from: process.env.EMAIL_FROM || '"SHARERS GYM" <hello@sharersgym.com>',
                to,
                subject,
                html,
            })
            return info
        } catch (error) {
            console.error('Nodemailer error:', error)
            return null
        }
    }
}
