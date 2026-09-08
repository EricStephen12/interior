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

  // 1. Exchange code for access_token (or reuse if token was provided directly)
  let accessToken = code;
  if (!code.startsWith('eyJ') && code.length < 100) {
    const tokenRes = await fetch('https://connect.kingsch.at/developer/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'code',
        client_id: clientId,
        code,
        redirect_uri: 'https://www.sharersgym.com/api/auth/kingschat/callback',
      }),
    });

    if (!tokenRes.ok) {
      // Fallback without redirect_uri if strict match is not enforced
      const retryRes = await fetch('https://connect.kingsch.at/developer/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'code',
          client_id: clientId,
          code,
        }),
      });

      if (!retryRes.ok) {
        const errText = await retryRes.text();
        console.error('[KingsChat Callback] Token exchange failed:', errText);
        return NextResponse.redirect(new URL('/sign-in?error=token_exchange_failed', req.url));
      }

      const retryData = await retryRes.json();
      accessToken = retryData.access_token;
    } else {
      const tokenData = await tokenRes.json();
      accessToken = tokenData.access_token;
    }
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

  // Redirect to sign-in page with both ticket params for seamless client SSO consumption
  const redirectUrl = new URL('/sign-in', req.url);
  redirectUrl.searchParams.set('ticket', signInToken.token);
  redirectUrl.searchParams.set('__clerk_ticket', signInToken.token);
  return NextResponse.redirect(redirectUrl);
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let code = '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      code = (formData.get('code') || formData.get('authorization_code') || formData.get('accessToken') || formData.get('access_token')) as string;
    } else if (contentType.includes('application/json')) {
      const json = await req.json();
      code = json.code || json.authorization_code || json.accessToken || json.access_token;
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
  const code = searchParams.get('code') || searchParams.get('authorization_code') || searchParams.get('access_token') || searchParams.get('accessToken');

  if (!code) {
    return NextResponse.redirect(new URL('/sign-in?error=missing_code', req.url));
  }

  return await handleKingsChatAuth(code, req);
}
