'use client';

import React from 'react';
import { User, Bell, Shield, Smartphone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function SettingsPage() {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <div className="space-y-16 font-sans selection:bg-secondary">
            <div>
                <span className="text-[10px] font-black tracking-[0.5em] text-accent uppercase mb-4 block underline decoration-accent/20 underline-offset-8">Account Control</span>
                <h1 className="text-5xl font-black text-primary tracking-tight">Registry Protocol</h1>
                <p className="text-slate-400 font-light mt-4 uppercase tracking-widest text-xs">Configure your elite preferences and laboratory security keys.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-24">
                <div className="lg:col-span-2 space-y-12">
                    <SettingsSection
                        icon={User}
                        title="Registry Identity"
                        description="Manage your public-facing essence and secure contact details."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InputGroup label="Registry Email" value={user.email} disabled />
                            <InputGroup label="Member Signature" placeholder="e.g. Adebayo Johnson" />
                        </div>
                    </SettingsSection>

                    <SettingsSection
                        icon={Shield}
                        title="Security Architecture"
                        description="Re-authenticate or update your molecular security keys."
                    >
                        <button className="px-8 py-5 bg-primary text-white rounded-none font-black text-[10px] uppercase tracking-[0.4em] hover:bg-accent transition-all duration-700 shadow-2xl">
                            Update Security Protocol
                        </button>
                    </SettingsSection>
                </div>

                <div className="space-y-12">
                    <div className="bg-primary rounded-none p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent/5 pointer-events-none"></div>
                        <Bell className="w-10 h-10 text-accent mb-8 relative z-10" />
                        <h3 className="text-xl font-black uppercase tracking-[0.3em] mb-4 relative z-10 leading-tight">Elite Dispatch <br /> Notifications</h3>
                        <p className="text-white/60 text-sm font-light mb-10 leading-relaxed relative z-10">Receive real-time molecular updates on your essence trajectory via encrypted channels.</p>
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-12 h-6 bg-accent rounded-none relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-none" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Active Protocol</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsSection({ icon: Icon, title, description, children }: { icon: React.ElementType, title: string, description: string, children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-none p-10 border border-primary/5 shadow-2xl shadow-black/5">
            <div className="flex items-center gap-8 mb-12">
                <div className="w-14 h-14 rounded-none bg-secondary/30 flex items-center justify-center text-primary border border-primary/5">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-primary uppercase tracking-tight">{title}</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

function InputGroup({ label, value, placeholder, disabled }: { label: string, value?: string, placeholder?: string, disabled?: boolean }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block ml-1">{label}</label>
            <input
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full px-6 py-5 bg-secondary/10 border-b border-transparent focus:border-accent rounded-none text-sm font-medium text-primary outline-none transition-all tabular-nums disabled:opacity-30"
            />
        </div>
    );
}
