const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promoteAdmin() {
  const email = 'sharersgymtest@gmail.com';
  console.log(`🚀 Promoting ${email} to ADMIN...`);

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });
    console.log('✅ Success! User is now an ADMIN.');
    console.log(user);
  } catch (error) {
    console.error('❌ Failed. Make sure the user has signed up on the live site first!');
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

promoteAdmin();
