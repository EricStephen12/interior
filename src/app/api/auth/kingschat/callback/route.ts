import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

async function handleKingsChatAuth(code: string, req: NextRequest, originParam?: string) {
  const apiKey = process.env.KINGSCHAT_API_KEY;
  const clientId = process.env.KINGSCHAT_CLIENT_ID || process.env.NEXT_PUBLIC_KINGSCHAT_CLIENT_ID;
  const appUrl = process.env.APP_URL || 'https://sharersgym.com';

  if (!apiKey || apiKey === 'YOUR_KINGSCHAT_API_KEY_HERE') {
    return NextResponse.redirect(new URL('/sign-in?error=kingschat_api_key_missing', req.url), 303);
  }

  if (!clientId) {
    return NextResponse.redirect(new URL('/sign-in?error=kingschat_client_id_missing', req.url), 303);
  }

  // 1. Exchange code for access_token (Step 6 of official docs)
  let accessToken = code;
  if (!code.startsWith('eyJ') && code.length < 100) {
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
      return NextResponse.redirect(new URL('/sign-in?error=token_exchange_failed', req.url), 303);
    }

    const tokenData = await tokenRes.json();
    accessToken = tokenData.access_token;
  }

  // 2. Fetch User Profile
  const profileRes = await fetch('https://connect.kingsch.at/developer/api/user/profile', {
    method: 'GET',
    headers: {
      'api-key': apiKey,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!profileRes.ok) {
    return NextResponse.redirect(new URL('/sign-in?error=profile_fetch_failed', req.url), 303);
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

  const avatarUrl = profile.avatar_url || profile.avatar || profile.profile_picture_url || profile.picture || null;

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

  if (clerkUser) {
    try {
      await client.users.updateUser(clerkUser.id, {
        firstName: firstName || clerkUser.firstName,
        lastName: lastName || clerkUser.lastName,
        publicMetadata: {
          ...(clerkUser.publicMetadata || {}),
          kingschatId: kingsChatId,
          kingschatUsername: username,
          kingschatAvatar: avatarUrl,
          provider: 'kingschat',
          lastKingsChatSync: new Date().toISOString(),
        },
      });
    } catch (updateErr) {
      console.warn('[KingsChat] Updating existing Clerk user metadata:', updateErr);
    }
  } else {
    try {
      clerkUser = await client.users.createUser({
        emailAddress: [emailToUse],
        username: username.length >= 4 ? username : undefined,
        firstName,
        lastName,
        skipPasswordRequirement: true,
        publicMetadata: {
          kingschatId: kingsChatId,
          kingschatUsername: username,
          kingschatAvatar: avatarUrl,
          provider: 'kingschat',
          lastKingsChatSync: new Date().toISOString(),
        },
      });
    } catch (createErr) {
      const fallbackEmail = `${username}_${Date.now()}@kingschat.users.sharersgym.com`;
      clerkUser = await client.users.createUser({
        emailAddress: [fallbackEmail],
        firstName,
        lastName,
        skipPasswordRequirement: true,
        publicMetadata: {
          kingschatId: kingsChatId,
          kingschatUsername: username,
          kingschatAvatar: avatarUrl,
          provider: 'kingschat',
          lastKingsChatSync: new Date().toISOString(),
        },
      });
    }
  }

  // 4. Sync into database & generate Clerk sign-in ticket in parallel
  const [_, signInToken] = await Promise.all([
    prisma.user.upsert({
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
        role: 'CUSTOMER',
        credits: 0,
        tier: 'NONE',
      },
    }),
    client.signInTokens.createSignInToken({
      userId: clerkUser.id,
      expiresInSeconds: 300,
    }),
  ]);

  // Redirect to lightweight SSO callback handler to eliminate form loading & bot reCAPTCHA delays
  const redirectUrl = new URL('/auth/callback', req.url);
  redirectUrl.searchParams.set('ticket', signInToken.token);
  redirectUrl.searchParams.set('__clerk_ticket', signInToken.token);
  if (originParam && originParam.startsWith('/') && !originParam.startsWith('//')) {
    redirectUrl.searchParams.set('redirect_url', originParam);
  }
  // 303 See Other instructs browser to convert incoming POST form submission to GET redirect
  return NextResponse.redirect(redirectUrl, 303);
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let code = '';
    let originParam = '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      code = (formData.get('code') || formData.get('authorization_code') || formData.get('accessToken') || formData.get('access_token')) as string;
      originParam = (formData.get('origin') as string) || '';
    } else if (contentType.includes('application/json')) {
      const json = await req.json();
      code = json.code || json.authorization_code || json.accessToken || json.access_token;
      originParam = json.origin || '';
    }

    if (!code) {
      return NextResponse.redirect(new URL('/sign-in?error=missing_code', req.url), 303);
    }

    return await handleKingsChatAuth(code, req, originParam);
  } catch (err: any) {
    console.error('[KingsChat Callback Error]:', err);
    return NextResponse.redirect(new URL('/sign-in?error=server_error', req.url), 303);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code') || searchParams.get('authorization_code') || searchParams.get('access_token') || searchParams.get('accessToken');
  const originParam = searchParams.get('origin') || '';

  if (!code) {
    return NextResponse.redirect(new URL('/sign-in?error=missing_code', req.url));
  }

  return await handleKingsChatAuth(code, req, originParam);
}
