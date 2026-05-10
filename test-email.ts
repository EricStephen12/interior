import { emailService } from './src/lib/services/email';
import dotenv from 'dotenv';

dotenv.config();

async function runTest() {
  console.log('🚀 Starting Resend Test...');
  const testEmail = process.argv[2];

  if (!testEmail) {
    console.error('❌ Please provide an email address: npm run test-email yourname@example.com');
    process.exit(1);
  }

  const result = await emailService.sendEmail({
    to: testEmail,
    subject: '🔥 SHARERS GYM: System Integration Success',
    html: `
      <div style="font-family: sans-serif; padding: 40px; border: 1px solid #eee;">
        <h1 style="color: #6366f1;">System Online!</h1>
        <p>This email proves that <strong>Resend</strong> is successfully connected to your <strong>Cloudflare</strong> domain.</p>
        <p>Your business email <strong>support@sharersgym.com</strong> is now fully operational.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="font-size: 10px; color: #999;">SHARERS GYM - PRE-LAUNCH VERIFICATION</p>
      </div>
    `
  });

  if (result && 'data' in result && result.data) {
    console.log('✅ Success! Check your inbox (and spam folder just in case).');
    console.log('Result ID:', result.data.id);
  } else {
    console.error('❌ Failed. Check if your RESEND_API_KEY is correct in .env');
  }
}

runTest();
