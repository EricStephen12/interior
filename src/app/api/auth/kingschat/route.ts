import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.KINGSCHAT_CLIENT_ID;
  const redirectUri = process.env.KINGSCHAT_REDIRECT_URI;
  const scope = 'profile'; // KingsChat profile scope

  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'KingsChat credentials not configured' }, { status: 500 });
  }

  // KingsChat Authorize URL
  const authUrl = `https://connect.kingsch.at/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;

  return NextResponse.redirect(authUrl);
}
