'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CheckIn {
    id: string
    date: string
    protocol: string
}

interface MembershipState {
    hasActiveMembership: boolean
    totalCredits: number
    remainingCredits: number
    checkInHistory: CheckIn[]
    memberId: string
}

interface MembershipContextType {
    state: MembershipState
    subscribe: (credits: number) => void
    checkIn: (protocol: string) => void
    resetMembership: () => void
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined)

const INITIAL_STATE: MembershipState = {
    hasActiveMembership: true,
    totalCredits: 30,
    remainingCredits: 30,
    checkInHistory: [],
    memberId: 'SR-772910'
}

export function MembershipProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<MembershipState>(INITIAL_STATE)

    // Load from DB instead of local storage
    useEffect(() => {
        const fetchMembership = async () => {
            try {
                const res = await fetch('/api/membership')
                if (res.ok) {
                    const data = await res.json()
                    if (data.user) {
                        setState({
                            hasActiveMembership: data.user.tier !== 'NONE',
                            totalCredits: data.user.credits + data.user.checkIns.length,
                            remainingCredits: data.user.credits,
                            memberId: data.user.memberId,
                            checkInHistory: data.user.checkIns.map((c: any) => ({
                                id: c.id,
                                date: c.date,
                                protocol: c.protocol
                            }))
                        })
                    }
                }
            } catch (err) {
                console.error('Failed to fetch membership', err)
            }
        }
        fetchMembership()
    }, [])

    const subscribe = (credits: number) => {
        // Optimistic UI update - actual DB update happens in /api/checkout
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
                    setState({
                        hasActiveMembership: data.user.tier !== 'NONE',
                        totalCredits: data.user.credits + data.user.checkIns.length,
                        remainingCredits: data.user.credits,
                        memberId: data.user.memberId,
                        checkInHistory: data.user.checkIns.map((c: any) => ({
                            id: c.id,
                            date: c.date,
                            protocol: c.protocol
                        }))
                    })
                }
            }
        } catch (err) {
            console.error('Failed to check in', err)
        }
    }

    const resetMembership = () => {
        setState(INITIAL_STATE);
        // We omit DB reset for safety, just reset local UI
    }

    return (
        <MembershipContext.Provider value={{ state, subscribe, checkIn, resetMembership }}>
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
