'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'

function CallbackHandler() {
  const clerk = useClerk()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const processedRef = useRef(false)

  useEffect(() => {
    if (!clerk.loaded || processedRef.current) return

    const ticket = searchParams.get('ticket') || searchParams.get('__clerk_ticket')
    if (!ticket) {
      router.replace('/sign-in')
      return
    }

    processedRef.current = true

    // Direct, instant ticket exchange avoiding the heavy <SignIn /> component and bot reCAPTCHA
    clerk.client.signIn
      .create({
        strategy: 'ticket',
        ticket,
      })
      .then(async (res: any) => {
        if (res.status === 'complete' && res.createdSessionId) {
          await clerk.setActive({ session: res.createdSessionId })
          window.location.href = '/dashboard'
        } else {
          router.replace('/sign-in?error=sso_incomplete')
        }
      })
      .catch((err: any) => {
        console.error('[KingsChat SSO Ticket Error]:', err)
        setError('Authentication ticket could not be validated.')
        setTimeout(() => router.replace('/sign-in'), 1500)
      })
  }, [clerk, router, searchParams])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="relative w-14 h-14 mb-5">
        <div className="w-14 h-14 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
      </div>
      <h2 className="text-xl font-bold tracking-tight mb-1">
        {error ? 'Session Verification Failed' : 'Welcome to Sharers Gym'}
      </h2>
      <p className="text-xs text-white/60 tracking-wider uppercase font-mono">
        {error || 'Securing your KingsChat session...'}
      </p>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  )
}
