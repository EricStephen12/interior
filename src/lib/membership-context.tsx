'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface CheckIn {
    id: string
    date: string
    protocol: string
}

interface Order {
    id: string
    totalAmount: number
    items: any
    status: string
    createdAt: string
}

interface MembershipState {
    hasActiveMembership: boolean
    totalCredits: number
    remainingCredits: number
    checkInHistory: CheckIn[]
    orderHistory: Order[]
    memberId: string
    tier: string
    role: 'ADMIN' | 'CUSTOMER' | 'NONE'
}

interface MembershipContextType {
    state: MembershipState
    subscribe: (credits: number) => void
    checkIn: (protocol: string) => void
    refreshMembership: () => Promise<void>
    resetMembership: () => void
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined)

const INITIAL_STATE: MembershipState = {
    hasActiveMembership: false,
    totalCredits: 0,
    remainingCredits: 0,
    checkInHistory: [],
    orderHistory: [],
    memberId: 'PENDING',
    tier: 'NONE',
    role: 'NONE'
}

export function MembershipProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<MembershipState>(() => {
        if (typeof window !== 'undefined') {
            const cached = sessionStorage.getItem('membership_state')
            if (cached) {
                try {
                    return JSON.parse(cached)
                } catch (e) {
                    // ignore
                }
            }
        }
        return INITIAL_STATE
    })
    const { isSignedIn, user, isLoaded } = useUser()

    const fetchMembership = async () => {
        try {
            const res = await fetch('/api/membership')
            if (res.ok) {
                const data = await res.json()
                if (data.user) {
                    const newState: MembershipState = {
                        hasActiveMembership: data.user.tier !== 'NONE',
                        totalCredits: data.user.credits + data.user.checkIns.length,
                        remainingCredits: data.user.credits,
                        memberId: data.user.memberId,
                        tier: data.user.tier,
                        role: data.user.role,
                        checkInHistory: data.user.checkIns.map((c: any) => ({
                            id: c.id,
                            date: c.date,
                            protocol: c.protocol
                        })),
                        orderHistory: data.orders || []
                    }
                    setState(newState)
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('membership_state', JSON.stringify(newState))
                    }
                }
            }
        } catch {
            // Silently fail
        }
    }

    useEffect(() => {
        if (isLoaded) {
            if (isSignedIn) {
                fetchMembership()
            } else {
                setState(INITIAL_STATE)
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('membership_state')
                }
            }
        }
    }, [isSignedIn, user, isLoaded])

    const refreshMembership = async () => {
        if (isSignedIn) {
            await fetchMembership()
        }
    }

    const subscribe = (credits: number) => {
        setState(prev => ({
            ...prev,
            hasActiveMembership: true,
            totalCredits: prev.totalCredits + credits,
            remainingCredits: prev.remainingCredits + credits,
        }))
    }

    const checkIn = async (protocol: string) => {
        try {
            const res = await fetch('/api/membership', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'CHECK_IN', protocol })
            })

            if (res.ok) {
                const data = await res.json()
                if (data.user) {
                        const newState: MembershipState = {
                            hasActiveMembership: data.user.tier !== 'NONE',
                            totalCredits: data.user.credits + data.user.checkIns.length,
                            remainingCredits: data.user.credits,
                            memberId: data.user.memberId,
                            tier: data.user.tier,
                            role: data.user.role,
                            checkInHistory: data.user.checkIns.map((c: any) => ({
                                id: c.id,
                                date: c.date,
                                protocol: c.protocol
                            })),
                            orderHistory: data.orders || []
                        }
                        setState(newState)
                        if (typeof window !== 'undefined') {
                            sessionStorage.setItem('membership_state', JSON.stringify(newState))
                        }
                }
            }
        } catch {
            // Silently fail
        }
    }

    const resetMembership = () => {
        setState(INITIAL_STATE)
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('membership_state')
        }
    }

    return (
        <MembershipContext.Provider value={{ state, subscribe, checkIn, refreshMembership, resetMembership }}>
            {children}
        </MembershipContext.Provider>
    )
}

export function useMembership() {
    const context = useContext(MembershipContext)
    if (context === undefined) {
        throw new Error('useMembership must be used within a MembershipProvider')
    }
    return context
}
