'use client';

import React, { useState } from 'react';

interface KingsChatButtonProps {
  label?: string;
  className?: string;
}

export default function KingsChatButton({
  label = 'Continue with KingsChat',
  className = '',
}: KingsChatButtonProps) {
  const [loading, setLoading] = useState(false);

  const clientId =
    process.env.NEXT_PUBLIC_KINGSCHAT_CLIENT_ID || 'e1d4e49c-ae48-4b0a-b7ea-bf451fccc203';

  const handleKingsChatLogin = () => {
    setLoading(true);
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://www.sharersgym.com';
    const callbackUrl = 'https://www.sharersgym.com/api/auth/kingschat/callback';
    const originToUse = currentOrigin.includes('localhost') ? currentOrigin : 'https://www.sharersgym.com';

    // Direct navigation to the official KingsChat login portal with approved callback and origin
    const params = new URLSearchParams({
      clientId,
      client_id: clientId,
      origin: originToUse,
      redirect_uri: callbackUrl,
      redirectUri: callbackUrl,
      scopes: '["profile"]',
    });
    window.location.href = `https://accounts.kingschat.online/log-in?${params.toString()}`;
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleKingsChatLogin}
        disabled={loading}
        className={`w-full h-[44px] flex items-center justify-center gap-2.5 bg-[#0A78F2] hover:bg-[#0062C4] active:scale-[0.99] text-white font-semibold text-xs rounded-full shadow-none hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Redirecting to KingsChat...</span>
          </div>
        ) : (
          <>
            {/* KingsChat Official Icon */}
            <svg
              className="w-4 h-4 flex-shrink-0"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="8" fill="white" fillOpacity="0.25" />
              <path
                d="M16 6C10.477 6 6 10.029 6 15c0 2.478 1.13 4.717 2.975 6.326L8 26l5.05-1.573c.928.367 1.93.573 2.95.573 5.523 0 10-4.029 10-9s-4.477-9-10-9z"
                fill="white"
              />
              <circle cx="11.5" cy="15" r="1.5" fill="#0A78F2" />
              <circle cx="16" cy="15" r="1.5" fill="#0A78F2" />
              <circle cx="20.5" cy="15" r="1.5" fill="#0A78F2" />
            </svg>
            <span>{label}</span>
          </>
        )}
      </button>
    </div>
  );
}
