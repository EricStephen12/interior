const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function runTest() {
  console.log('🚀 Starting Standalone Resend Test...');
  const testEmail = 'deamirclothingstores@gmail.com';

  try {
    const data = await resend.emails.send({
      from: 'SHARERS GYM <support@sharersgym.com>',
      to: [testEmail],
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
    console.log('✅ Success! Result:', data);
  } catch (error) {
    console.error('❌ Failed:', error);
  }
}

runTest();
