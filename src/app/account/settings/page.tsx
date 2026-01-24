'use client';

import React from 'react';
import { User, Bell, Shield, Smartphone, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function SettingsPage() {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-black text-blue-950 tracking-tight">Account Protocol</h1>
                <p className="text-slate-500 font-medium">Configure your elite preferences and security keys.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <SettingsSection
                        icon={User}
                        title="Profile Identity"
                        description="Manage your public-facing essence and contact details."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Email Identity" value={user.email} disabled />
                            <InputGroup label="Display Name" placeholder="e.g. Adebayo Johnson" />
                        </div>
                    </SettingsSection>

                    <SettingsSection
                        icon={Shield}
                        title="Security Architecture"
                        description="Re-authenticate or update your protective security keys."
                    >
                        <button className="px-6 py-4 bg-slate-50 text-blue-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">
                            Update Security Key
                        </button>
                    </SettingsSection>
                </div>

                <div className="space-y-8">
                    <div className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/10">
                        <Bell className="w-8 h-8 text-sky-400 mb-6" />
                        <h3 className="text-lg font-black uppercase tracking-widest mb-4">Elite Dispatch Notifications</h3>
                        <p className="text-sky-100 text-sm font-medium mb-6">Receive real-time updates on your essence trajectory via WhatsApp or Email.</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-6 bg-sky-600 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingsSection({ icon: Icon, title, description, children }: { icon: React.ElementType, title: string, description: string, children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-950/5">
            <div className="flex items-center gap-6 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-950">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-blue-950 uppercase tracking-widest">{title}</h2>
                    <p className="text-xs text-slate-400 font-medium">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

function InputGroup({ label, value, placeholder, disabled }: { label: string, value?: string, placeholder?: string, disabled?: boolean }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{label}</label>
            <input
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl text-sm font-bold text-blue-950 outline-none transition-all duration-300 disabled:opacity-50 shadow-inner"
            />
        </div>
    );
}
