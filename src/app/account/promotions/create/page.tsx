'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    Loader2,
    Layout,
    Tag,
    Calendar,
    Target,
    CreditCard,
    Image as ImageIcon,
    Info,
    ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreatePromotionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [promoType, setPromoType] = useState('BANNED');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/account/promotions');
        }, 1500);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/account/promotions"
                        className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-100 transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-blue-950 tracking-tight">Initiate Campaign</h1>
                        <p className="text-slate-500 font-medium">Design a new high-conversion promotion or banner.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/account/promotions')}
                        className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-950 transition-colors"
                    >
                        Abort
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-950 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-950/20 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Deploy Campaign
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Configuration */}
                <div className="lg:col-span-8 space-y-12">

                    {/* Campaign Strategy */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-blue-950/5">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                                <Target className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-blue-950">Strategic Blueprint</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPromoType('BANNED')}
                                    className={`p-6 rounded-3xl border-2 text-left transition-all ${promoType === 'BANNED' ? 'border-sky-600 bg-sky-50/50' : 'border-slate-50 bg-slate-50'}`}
                                >
                                    <Layout className={`w-8 h-8 mb-4 ${promoType === 'BANNED' ? 'text-sky-600' : 'text-slate-400'}`} />
                                    <p className="font-bold text-blue-950 text-sm mb-1">Visual Banner</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Featured Hero Display</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPromoType('DISCOUNT')}
                                    className={`p-6 rounded-3xl border-2 text-left transition-all ${promoType === 'DISCOUNT' ? 'border-sky-600 bg-sky-50/50' : 'border-slate-50 bg-slate-50'}`}
                                >
                                    <Tag className={`w-8 h-8 mb-4 ${promoType === 'DISCOUNT' ? 'text-sky-600' : 'text-slate-400'}`} />
                                    <p className="font-bold text-blue-950 text-sm mb-1">Price Discount</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Grid-level Reduction</p>
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Campaign Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all"
                                    placeholder="e.g. Easter Comfort Extravaganza"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Target Audience / Reach</label>
                                    <select className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all appearance-none cursor-pointer">
                                        <option>Storewide</option>
                                        <option>Vitafoam Only</option>
                                        <option>Mattress Category</option>
                                        <option>Benin City Residents</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Campaign Horizon (Ends)</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media Module */}
                    <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200/50 p-10 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-blue-950 rounded-xl flex items-center justify-center text-white">
                                <ImageIcon className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-blue-950">Creative Assets</h2>
                        </div>

                        <div className="aspect-video bg-white border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-sky-200 transition-all">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-sky-50 group-hover:text-sky-600 transition-all mb-4">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-950 transition-colors">Invoke Hero Asset</p>
                            <p className="text-[9px] font-bold text-slate-300 mt-2 uppercase">Preferred: 1920x600 PNG/JPG</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Economics */}
                <div className="lg:col-span-4 space-y-12">
                    <div className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/20">
                        <div className="flex items-center gap-4 mb-10">
                            <CreditCard className="w-6 h-6 text-sky-400" />
                            <h2 className="text-xl font-black">Economics</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block ml-1 opacity-60">Reduction Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button type="button" className="py-3 bg-blue-900 rounded-xl text-[10px] font-black border-2 border-sky-600">PERCENT %</button>
                                    <button type="button" className="py-3 bg-blue-900/30 rounded-xl text-[10px] font-black border-2 border-transparent">FIXED ₦</button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block ml-1 opacity-60">Magnitude</label>
                                <input
                                    type="number"
                                    className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-blue-300 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all"
                                    placeholder="e.g. 15"
                                />
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <div className="flex items-start gap-4 p-4 bg-blue-900/30 rounded-2xl">
                                    <Info className="w-4 h-4 text-sky-400 mt-1 shrink-0" />
                                    <p className="text-[9px] font-bold text-sky-200/70 leading-relaxed uppercase tracking-widest">
                                        Discounts apply automatically at checkout for targeted items during active periods.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-[2.5rem] p-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-950">Visibility Status</span>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Active upon deployment</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-950 transition-colors"></div>
                            </label>
                        </div>

                        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl group hover:shadow-lg transition-all">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Preview Layout</span>
                            <Layout className="w-4 h-4 text-slate-300 group-hover:text-blue-950" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
