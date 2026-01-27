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

    // Load from local storage for demo persistence
    useEffect(() => {
        const saved = localStorage.getItem('sharers_membership')
        if (saved) {
            setState(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('sharers_membership', JSON.stringify(state))
    }, [state])

    const subscribe = (credits: number) => {
        setState(prev => ({
            ...prev,
            hasActiveMembership: true,
            totalCredits: prev.totalCredits + credits,
            remainingCredits: prev.remainingCredits + credits,
        }))
    }

    const checkIn = (protocol: string) => {
        setState(prev => {
            if (prev.remainingCredits <= 0) {
                console.log("SHARERS LOG: No credits remaining");
                return prev;
            }

            const newCheckIn: CheckIn = {
                id: Math.random().toString(36).substr(2, 9),
                date: new Date().toISOString(),
                protocol
            };

            console.log("SHARERS LOG: Checked in to", protocol);

            return {
                ...prev,
                remainingCredits: prev.remainingCredits - 1,
                checkInHistory: [newCheckIn, ...prev.checkInHistory]
            };
        });
    }

    const resetMembership = () => {
        setState(INITIAL_STATE);
        localStorage.removeItem('sharers_membership');
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
