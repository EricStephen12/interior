'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'CUSTOMER';
    name?: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Basic mock auth logic since environment variables are skipped
        // In a real scenario, we'd check Supabase session here
        const checkAuth = async () => {
            // Simulate session check
            const storedUser = localStorage.getItem('sbb_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const isAccountRoute = pathname.startsWith('/account');

            if (isAccountRoute && !user) {
                router.push('/login');
            }
        }
    }, [isLoading, user, pathname, router]);

    const login = (role: 'ADMIN' | 'CUSTOMER', email: string) => {
        const newUser: User = { id: 'u1', email, role, name: email.split('@')[0] };
        localStorage.setItem('sbb_user', JSON.stringify(newUser));
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('sbb_user');
        setUser(null);
        router.push('/login');
    };

    return { user, isLoading, login, logout };
}
