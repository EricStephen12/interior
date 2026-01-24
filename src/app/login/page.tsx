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
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-10 border border-slate-100 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-950 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-950/20">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-blue-950 tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-slate-400 font-medium lowercase">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email Essence</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-sky-600 transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-blue-950 outline-none transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Security Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-sky-600 transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-blue-950 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-blue-950 focus:ring-blue-950" />
                            <span className="text-xs font-bold text-slate-400 group-hover:text-blue-950 transition-colors">Remember Me</span>
                        </label>
                        <button type="button" className="text-xs font-black text-sky-600 hover:underline uppercase tracking-widest">Forgot Access?</button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-950 hover:bg-sky-600 text-white font-black text-xs uppercase tracking-[0.3em] py-5 rounded-2xl transition-all shadow-xl shadow-blue-950/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Authenticate Essence
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <p className="text-sm font-medium text-slate-400 mb-6">First time here?</p>
                    <Link
                        href="/auth/register"
                        className="inline-flex items-center gap-2 text-xs font-black text-blue-950 uppercase tracking-widest hover:text-sky-600 transition-colors"
                    >
                        Initialize New Account
                        <ShieldCheck className="w-4 h-4" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
