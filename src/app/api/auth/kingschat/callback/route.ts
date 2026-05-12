import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClerkClient } from '@clerk/nextjs/server';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/sign-in?error=kingschat_failed', req.url));
  }

  try {
    // 1. Exchange code for token
    const tokenRes = await fetch('https://connect.kingsch.at/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.KINGSCHAT_CLIENT_ID!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.KINGSCHAT_REDIRECT_URI!
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
       console.error('KingsChat Token Error:', tokenData);
       return NextResponse.redirect(new URL('/sign-in?error=token_failed', req.url));
    }

    // 2. Fetch User Profile
    const profileRes = await fetch('https://api.kingsch.at/v1/profile', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });

    const profileData = await profileRes.json();
    // KingsChat structure is usually { body: { id: "...", name: "..." } } or similar
    const kcUser = profileData.body || profileData;
    const kingschatId = kcUser.id;

    if (!kingschatId) {
      return NextResponse.redirect(new URL('/sign-in?error=profile_failed', req.url));
    }

    // 3. Check Database for linked user
    const existingUser = await prisma.user.findUnique({
      where: { kingschatId }
    });

    if (existingUser) {
      // User found! Create a Clerk Sign-In Ticket
      // Since we are doing a custom flow, we'll use a redirect with a success flag
      // and handle the auto-login in the dashboard
      return NextResponse.redirect(new URL(`/dashboard?kc_login=success&email=${existingUser.email}`, req.url));
    } else {
      // New User or Unlinked User! Go to Sync Page
      // Store KingsChat ID in a temporary cookie or pass via URL
      const syncUrl = new URL('/auth/sync-email', req.url);
      syncUrl.searchParams.set('kc_id', kingschatId);
      syncUrl.searchParams.set('name', kcUser.name || '');
      return NextResponse.redirect(syncUrl);
    }

  } catch (error) {
    console.error('KingsChat Auth Error:', error);
    return NextResponse.redirect(new URL('/sign-in?error=internal_error', req.url));
  }
}
