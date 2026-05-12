import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, kingschatId } = await req.json();

    if (!email || !kingschatId) {
      return NextResponse.json({ error: 'Missing information' }, { status: 400 });
    }

    // 1. Check if this KingsChat ID is already linked (security check)
    const existingKc = await prisma.user.findUnique({
      where: { kingschatId }
    });

    if (existingKc) {
       return NextResponse.json({ error: 'KingsChat account already linked' }, { status: 400 });
    }

    // 2. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (user) {
      // 3. Link existing user
      await prisma.user.update({
        where: { id: user.id },
        data: { kingschatId }
      });
      return NextResponse.json({ success: true, message: 'Linked successfully' });
    } else {
      // 4. If user doesn't exist, we should probably tell them to sign up first 
      // or we can create a placeholder user if you prefer.
      // For now, let's assume they should have an account or be signing up.
      return NextResponse.json({ error: 'No account found with this email. Please sign up first.' }, { status: 404 });
    }

  } catch (error) {
    console.error('Sync Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
