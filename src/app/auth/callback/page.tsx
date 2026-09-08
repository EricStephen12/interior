'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useSignIn } from '@clerk/nextjs/legacy'
import { useRouter, useSearchParams } from 'next/navigation'

function CallbackHandler() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const processedRef = useRef(false)

  useEffect(() => {
    const dest = searchParams.get('redirect_url') || '/dashboard'

    if (!isLoaded || processedRef.current) return

    const ticketParam = searchParams.get('ticket') || searchParams.get('__clerk_ticket')
    if (!ticketParam) {
      router.replace('/sign-in')
      return
    }

    const ticket: string = ticketParam
    processedRef.current = true

    async function handleSignIn() {
      try {
        if (!signIn) {
          throw new Error('SignIn not available')
        }

        const res = await signIn.create({
          strategy: 'ticket',
          ticket,
        })

        if (res.status === 'complete' && res.createdSessionId) {
          await setActive({ session: res.createdSessionId })
          window.location.href = dest
        } else {
          // Fallback to sign-in page with ticket
          window.location.href = `/sign-in?__clerk_ticket=${encodeURIComponent(ticket)}&redirect_url=${encodeURIComponent(dest)}`
        }
      } catch (err: any) {
        console.warn('[KingsChat SSO Ticket Handler Error]:', err)
        if (
          err?.errors?.[0]?.code === 'session_exists' ||
          err?.message?.includes('session_exists')
        ) {
          window.location.href = dest
          return
        }
        // Direct seamless fallback to native Clerk sign in
        window.location.href = `/sign-in?__clerk_ticket=${encodeURIComponent(ticket)}&redirect_url=${encodeURIComponent(dest)}`
      }
    }

    handleSignIn()
  }, [isLoaded, signIn, setActive, router, searchParams])

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
