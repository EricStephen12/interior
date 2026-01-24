'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Tag as TagIcon,
    DollarSign,
    Percent,
    CheckCircle2,
    ChevronLeft,
    CalendarDays,
    Target,
    Layout,
    Save
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreatePromotionPage() {
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center gap-6">
                <Link
                    href="/account/promotions"
                    className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-100 transition-all group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-blue-950 tracking-tight">Create Campaign</h1>
                    <p className="text-slate-500 font-medium font-sans">Initialize a new discount or marketing banner.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {/* Basic Identity */}
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-blue-950/5">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Layout className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-blue-950 uppercase tracking-widest">Campaign Identity</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Promotion Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border-transparent focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all"
                                    placeholder="e.g. Valentines Comfort Flash Sale"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Promo Type</label>
                                    <select className="w-full bg-slate-50 border-transparent focus:ring-4 focus:ring-indigo-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none cursor-pointer">
                                        <option>Discount Only</option>
                                        <option>Homepage Banner</option>
                                        <option>Pop-up Alert</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Targeting</label>
                                    <select className="w-full bg-slate-50 border-transparent focus:ring-4 focus:ring-indigo-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none cursor-pointer">
                                        <option>All Mattresses</option>
                                        <option>Specific Brand</option>
                                        <option>Furniture Sets</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Logic & Values */}
                    <section className="bg-slate-50 rounded-[2.5rem] border border-slate-200/50 p-10">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <Target className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-blue-950 uppercase tracking-widest">Incentive Logic</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Discount Basis</label>
                                    <div className="flex bg-white rounded-2xl p-1 border border-slate-100 shadow-sm">
                                        <button className="flex-1 py-3 px-4 rounded-xl bg-blue-950 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                            <Percent className="w-3 h-3" /> Percentage
                                        </button>
                                        <button className="flex-1 py-3 px-4 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                            <DollarSign className="w-3 h-3" /> Fixed Amount
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Value Amount</label>
                                <input
                                    type="number"
                                    className="w-full bg-white border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                                    placeholder="15"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    {/* Schedule */}
                    <div className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/20">
                        <div className="flex items-center gap-4 mb-8">
                            <CalendarDays className="w-5 h-5 text-sky-400" />
                            <h3 className="text-lg font-black uppercase tracking-widest leading-none">Timeline</h3>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-sky-400/60 block ml-1">Launch Protocol</label>
                                <input type="date" className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-sky-400/60 block ml-1">Expiration Protocols</label>
                                <input type="date" className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* Commit Section */}
                    <div className="bg-emerald-50 rounded-[2.5rem] p-10 border border-emerald-100">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Ready for Launch</p>
                                    <p className="text-[8px] font-black text-emerald-600/60 uppercase">System validation complete</p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/account/promotions')}
                                className="w-full bg-blue-950 hover:bg-sky-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-4 shadow-xl transition-all transform active:scale-95 group uppercase tracking-[0.2em] text-[10px]"
                            >
                                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Deploy Campaign
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, subValue, color }: { icon: React.ElementType, label: string, value: string, subValue: string, color: string }) {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm group hover:shadow-xl hover:shadow-blue-950/5 transition-all">
            <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black text-blue-950 tracking-tight mb-1">{value}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">{subValue}</p>
            </div>
        </div>
    );
}
