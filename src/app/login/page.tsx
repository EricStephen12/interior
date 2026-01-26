'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            const role = email.includes('admin') ? 'ADMIN' : 'CUSTOMER';
            login(role, email);
            router.push('/account');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Aesthetic Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/50 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md bg-white rounded-none shadow-[20px_50px_100px_rgba(0,0,0,0.1)] p-12 sm:p-16 border border-primary/5 relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-primary rounded-none flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <LogIn className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-4 block underline decoration-accent/20 underline-offset-8">The Registry</span>
                    <h1 className="text-4xl text-luxury text-primary mb-3">Welcome <br /><span className="text-accent italic">Back.</span></h1>
                    <p className="text-slate-400 font-light uppercase tracking-widest text-[9px]">Identity Verification Required</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Laboratory Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-accent transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-primary/10 focus:border-accent rounded-none py-4 pl-10 pr-4 text-sm font-medium text-primary outline-none transition-all tabular-nums"
                                placeholder="name@exricx.luxury"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Encryption Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-accent transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-b border-primary/10 focus:border-accent rounded-none py-4 pl-10 pr-4 text-sm font-medium text-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-1 pt-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded-none border-primary/10 text-primary focus:ring-accent" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">Remember Identity</span>
                        </label>
                        <button type="button" className="text-[10px] font-black text-accent hover:text-primary uppercase tracking-widest transition-colors">Forgot Protocol?</button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full flex items-center justify-center gap-4 py-6"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Authenticate Identity
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-10 border-t border-primary/5 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">New to the Registry?</p>
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:text-accent transition-colors"
                    >
                        Initialize New Protocol
                        <ShieldCheck className="w-5 h-5" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
