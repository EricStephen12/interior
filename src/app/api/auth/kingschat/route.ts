import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let accessToken = body.accessToken;
    const code = body.code;

    const apiKey = process.env.KINGSCHAT_API_KEY;
    const clientId = process.env.KINGSCHAT_CLIENT_ID || 'e1d4e49c-ae48-4b0a-b7ea-bf451fccc203';

    if (!apiKey || apiKey === 'YOUR_KINGSCHAT_API_KEY_HERE') {
      return NextResponse.json(
        { error: 'KingsChat API Key is missing. Please add your KINGSCHAT_API_KEY in .env file.' },
        { status: 500 }
      );
    }

    // If an authorization code was passed, exchange it for an accessToken
    if (!accessToken && code) {
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
        console.error('[KingsChat] Token exchange failed:', errText);
        return NextResponse.json(
          { error: 'Failed to exchange KingsChat authorization code' },
          { status: 400 }
        );
      }

      const tokenData = await tokenRes.json();
      accessToken = tokenData.access_token;
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'No accessToken provided' }, { status: 400 });
    }

    // Fetch user profile from KingsChat Developer API
    const profileRes = await fetch('https://connect.kingsch.at/developer/api/user/profile', {
      method: 'GET',
      headers: {
        'api-key': apiKey,
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!profileRes.ok) {
      const errText = await profileRes.text();
      console.error('[KingsChat] Profile fetch failed:', errText);
      return NextResponse.json(
        { error: 'Could not fetch profile from KingsChat. Ensure API Key is valid.' },
        { status: 401 }
      );
    }

    const profileData = await profileRes.json();
    const profile = profileData.profile || profileData.user;

    if (!profile) {
      return NextResponse.json({ error: 'Invalid profile data from KingsChat' }, { status: 400 });
    }

    const kingsChatId = profile.id || profile.user_id || profile.username;
    const username = (profile.username || `kc_${kingsChatId}`).toLowerCase().replace(/[^a-z0-9_]/g, '');
    const emailToUse =
      profile.email ||
      `${username}@kingschat.users.sharersgym.com`;
    const fullName = profile.name || username;
    const firstName = fullName.split(' ')[0] || username;
    const lastName = fullName.split(' ').slice(1).join(' ') || '';

    // Synchronize or create user in Clerk
    const client = await clerkClient();
    let clerkUser: any = null;

    try {
      const existing = await client.users.getUserList({
        emailAddress: [emailToUse],
      });
      if (existing.data && existing.data.length > 0) {
        clerkUser = existing.data[0];
      }
    } catch (err) {
      console.warn('[KingsChat] Checking existing Clerk user warning:', err);
    }

    // Try finding by username if not found by email
    if (!clerkUser && username) {
      try {
        const byUsername = await client.users.getUserList({
          username: [username],
        });
        if (byUsername.data && byUsername.data.length > 0) {
          clerkUser = byUsername.data[0];
        }
      } catch (err) {
        // ignore username lookup errors
      }
    }

    // Create new Clerk user if none exists
    if (!clerkUser) {
      try {
        clerkUser = await client.users.createUser({
          emailAddress: [emailToUse],
          username: username.length >= 4 ? username : undefined,
          firstName,
          lastName,
          skipPasswordRequirement: true,
        });
      } catch (createErr: any) {
        console.error('[KingsChat] Failed to create user in Clerk:', createErr);
        // Fallback: create with randomized email if conflict
        const fallbackEmail = `${username}_${Date.now()}@kingschat.users.sharersgym.com`;
        clerkUser = await client.users.createUser({
          emailAddress: [fallbackEmail],
          firstName,
          lastName,
          skipPasswordRequirement: true,
        });
      }
    }

    // Synchronize user into Neon / PostgreSQL database
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
        role: role,
        credits: 0,
        tier: 'NONE',
      },
    });

    // Generate Clerk sign-in ticket token
    const signInToken = await client.signInTokens.createSignInToken({
      userId: clerkUser.id,
      expiresInSeconds: 300,
    });

    return NextResponse.json({
      success: true,
      token: signInToken.token,
      profile: {
        name: fullName,
        username,
        avatar: profile.avatar || null,
      },
    });
  } catch (error: any) {
    console.error('[KingsChat Auth Error]:', error);
    return NextResponse.json(
      { error: error.message || 'KingsChat authentication failed' },
      { status: 500 }
    );
  }
}
