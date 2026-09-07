import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

async function handleKingsChatAuth(code: string, req: NextRequest) {
  const apiKey = process.env.KINGSCHAT_API_KEY;
  const clientId = process.env.KINGSCHAT_CLIENT_ID || 'e1d4e49c-ae48-4b0a-b7ea-bf451fccc203';
  const appUrl = process.env.APP_URL || 'https://sharersgym.com';

  if (!apiKey || apiKey === 'YOUR_KINGSCHAT_API_KEY_HERE') {
    return NextResponse.redirect(new URL('/sign-in?error=kingschat_api_key_missing', req.url));
  }

  // 1. Exchange code for access_token
  const tokenRes = await fetch('https://connect.kingsch.at/developer/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'code',
      client_id: clientId,
      code,
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    console.error('[KingsChat Callback] Token exchange failed:', errText);
    return NextResponse.redirect(new URL('/sign-in?error=token_exchange_failed', req.url));
  }

  const { access_token } = await tokenRes.json();

  // 2. Fetch User Profile
  const profileRes = await fetch('https://connect.kingsch.at/developer/api/user/profile', {
    method: 'GET',
    headers: {
      'api-key': apiKey,
      'Authorization': `Bearer ${access_token}`,
    },
  });

  if (!profileRes.ok) {
    return NextResponse.redirect(new URL('/sign-in?error=profile_fetch_failed', req.url));
  }

  const profileData = await profileRes.json();
  const profile = profileData.profile || profileData.user;

  const kingsChatId = profile.id || profile.user_id || profile.username;
  const username = (profile.username || `kc_${kingsChatId}`).toLowerCase().replace(/[^a-z0-9_]/g, '');
  const emailToUse =
    profile.email || `${username}@kingschat.users.sharersgym.com`;
  const fullName = profile.name || username;
  const firstName = fullName.split(' ')[0] || username;
  const lastName = fullName.split(' ').slice(1).join(' ') || '';

  // 3. Find or create Clerk user
  const client = await clerkClient();
  let clerkUser: any = null;

  try {
    const existing = await client.users.getUserList({ emailAddress: [emailToUse] });
    if (existing.data && existing.data.length > 0) {
      clerkUser = existing.data[0];
    }
  } catch (err) {
    console.warn('[KingsChat] Checking existing Clerk user:', err);
  }

  if (!clerkUser) {
    try {
      clerkUser = await client.users.createUser({
        emailAddress: [emailToUse],
        username: username.length >= 4 ? username : undefined,
        firstName,
        lastName,
        skipPasswordRequirement: true,
      });
    } catch (createErr) {
      const fallbackEmail = `${username}_${Date.now()}@kingschat.users.sharersgym.com`;
      clerkUser = await client.users.createUser({
        emailAddress: [fallbackEmail],
        firstName,
        lastName,
        skipPasswordRequirement: true,
      });
    }
  }

  // 4. Sync into database
  const userCount = await prisma.user.count();
  const role = userCount === 0 ? 'ADMIN' : 'CUSTOMER';

  await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      name: fullName,
      email: emailToUse,
      phone: profile.phone_number || undefined,
    },
    create: {
      clerkId: clerkUser.id,
      name: fullName,
      email: emailToUse,
      phone: profile.phone_number || undefined,
      role,
      credits: 0,
      tier: 'NONE',
    },
  });

  // 5. Generate Clerk sign-in token ticket
  const signInToken = await client.signInTokens.createSignInToken({
    userId: clerkUser.id,
    expiresInSeconds: 300,
  });

  // Redirect to sign-in page with ticket — Clerk automatically completes login!
  return NextResponse.redirect(new URL(`/sign-in?ticket=${signInToken.token}`, req.url));
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let code = '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      code = formData.get('code') as string;
    } else if (contentType.includes('application/json')) {
      const json = await req.json();
      code = json.code;
    }

    if (!code) {
      return NextResponse.redirect(new URL('/sign-in?error=missing_code', req.url));
    }

    return await handleKingsChatAuth(code, req);
  } catch (err: any) {
    console.error('[KingsChat Callback Error]:', err);
    return NextResponse.redirect(new URL('/sign-in?error=server_error', req.url));
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/sign-in?error=missing_code', req.url));
  }

  return await handleKingsChatAuth(code, req);
}
