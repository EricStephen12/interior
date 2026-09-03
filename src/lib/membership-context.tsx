'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'

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

export interface ActivePlanInfo {
    hasPass: boolean
    planName: string
    planType: 'HOURLY' | 'DAILY' | 'MEMBERSHIP' | 'NONE'
    unitLabel: string
    remainingDisplay: string
    isHourly: boolean
}

export function getActivePassInfo(state: MembershipState): ActivePlanInfo {
    // Look through all orders
    const orders = state.orderHistory || []
    
    let foundPlanName = ''
    let isHourly = false

    for (const order of orders) {
        // Only inspect successful/active orders (or in review)
        if (!['COMPLETED', 'PAID', 'DELIVERED', 'PENDING_VERIFICATION'].includes(order.status)) {
            continue
        }

        let items: any[] = []
        if (Array.isArray(order.items)) {
            items = order.items
        } else if (typeof order.items === 'string') {
            try {
                const parsed = JSON.parse(order.items)
                items = Array.isArray(parsed) ? parsed : [parsed]
            } catch {
                items = [{ name: order.items }]
            }
        }

        for (const item of items) {
            const rawName = (item.name || '').trim()
            const lower = rawName.toLowerCase()

            if (lower.includes('hour') || lower.includes('hr') || lower.includes('session')) {
                foundPlanName = rawName
                isHourly = true
                break
            } else if (lower.includes('day') || lower.includes('month') || lower.includes('pass') || lower.includes('access')) {
                foundPlanName = rawName
                isHourly = false
                break
            }
        }

        if (foundPlanName) break
    }

    // Format clean plan title
    let cleanPlanName = foundPlanName
    if (cleanPlanName) {
        // Example: "2 Hours (2 Hours Session)" -> "2 Hours Session"
        // Example: "2 Hours (Silver Pack)" -> "2 Hours Session (Silver Pack)"
        // Example: "1 Day (1 Day Pass)" -> "1 Day Pass"
        if (cleanPlanName.includes('(') && cleanPlanName.includes(')')) {
            const match = cleanPlanName.match(/^(.*?)\s*\((.*?)\)$/)
            if (match) {
                const prefix = match[1].trim() // e.g. "2 Hours" or "1 Day"
                const inside = match[2].trim() // e.g. "2 Hours Session" or "Silver Pack"
                if (inside.toLowerCase().includes('hour') || inside.toLowerCase().includes('day') || inside.toLowerCase().includes('pass') || inside.toLowerCase().includes('session')) {
                    cleanPlanName = inside
                } else {
                    cleanPlanName = `${prefix} Pass`
                }
            }
        }
    }

    const unitLabel = isHourly 
        ? (state.remainingCredits === 1 ? 'Hour' : 'Hours') 
        : (state.remainingCredits === 1 ? 'Day' : 'Days')

    // If no order name was found but user has credits
    if (!cleanPlanName && (state.remainingCredits > 0 || state.totalCredits > 0)) {
        const total = state.totalCredits || state.remainingCredits
        cleanPlanName = `${total} ${total === 1 ? (isHourly ? 'Hour' : 'Day') : (isHourly ? 'Hours' : 'Days')} Pass`
    }

    const hasPass = state.remainingCredits > 0 || state.totalCredits > 0 || state.hasActiveMembership

    let planType: 'HOURLY' | 'DAILY' | 'MEMBERSHIP' | 'NONE' = 'NONE'
    if (isHourly) {
        planType = 'HOURLY'
    } else if (cleanPlanName.toLowerCase().includes('month') || (state.totalCredits >= 20)) {
        planType = 'MEMBERSHIP'
    } else if (hasPass) {
        planType = 'DAILY'
    }

    return {
        hasPass,
        planName: cleanPlanName || (hasPass ? `${state.remainingCredits} Pass Active` : 'No Active Pass'),
        planType,
        unitLabel,
        remainingDisplay: `${state.remainingCredits} ${unitLabel}`,
        isHourly
    }
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
    const { getToken } = useAuth()

    const fetchMembership = async () => {
        try {
            const token = await getToken()
            const headers: Record<string, string> = {}
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
            const res = await fetch('/api/membership', { headers })
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
            const token = await getToken()
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }
            const res = await fetch('/api/membership', {
                method: 'POST',
                headers,
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
