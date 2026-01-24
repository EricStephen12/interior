'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    Upload,
    Loader2,
    Settings,
    CreditCard,
    Tag,
    Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isNegotiable, setIsNegotiable] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Logic will be wired to Prisma later
        setTimeout(() => {
            setLoading(false);
            router.push('/account/products');
        }, 1500);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24 font-sans">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/account/products"
                        className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-100 transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-blue-950 tracking-tight">Add New Essence</h1>
                        <p className="text-slate-500 font-medium">Define a new brand product in the global catalog.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/account/products')}
                        className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-950 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-950 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-950/20 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Establish Product
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Core Data */}
                <div className="lg:col-span-8 space-y-12">

                    {/* Basic Identity Section */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-blue-950/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Tag className="w-24 h-24" />
                        </div>

                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                                <Info className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-blue-950">Identity Details</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Product Nomenclature</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all"
                                    placeholder="e.g. Vitafoam Grandeur Orthopedic"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Brand Origin</label>
                                    <select className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all appearance-none cursor-pointer">
                                        <option value="">Select Brand...</option>
                                        <option value="vitafoam">Vitafoam</option>
                                        <option value="mouka">Mouka</option>
                                        <option value="royal">Royal Foam</option>
                                        <option value="sara">Sara Foam</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Global Size Scale</label>
                                    <select className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all appearance-none cursor-pointer">
                                        <option value="">Select Size...</option>
                                        <option value="1">Single (3.5x6)</option>
                                        <option value="2">Double (4.5x6)</option>
                                        <option value="3">Family (6x6)</option>
                                        <option value="4">King (6x7)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Editorial Description (Optional)</label>
                                <textarea
                                    rows={5}
                                    className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-medium text-blue-950 outline-none transition-all"
                                    placeholder="Craft a luxury narrative for this product..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Elite Attributes Section */}
                    <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200/50 p-10 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-blue-950 rounded-xl flex items-center justify-center text-white">
                                <Settings className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-blue-950">Elite Attributes</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Materials Used</label>
                                <input type="text" className="w-full bg-white border-transparent focus:border-sky-600 focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all shadow-sm" placeholder="e.g. Memory Foam, Latex" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Firmness Rating</label>
                                <select className="w-full bg-white border-transparent focus:border-sky-600 focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all appearance-none cursor-pointer shadow-sm">
                                    <option>Standard Medium</option>
                                    <option>Plush Soft</option>
                                    <option>Superior Hard</option>
                                    <option>Orthopedic Support</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Finishing / Style</label>
                                <input type="text" className="w-full bg-white border-transparent focus:border-sky-600 focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all shadow-sm" placeholder="e.g. Damascus Fabric Quilting" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Warranty Scope</label>
                                <input type="text" className="w-full bg-white border-transparent focus:border-sky-600 focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all shadow-sm" placeholder="e.g. 10 Years Manufacturer Warranty" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing & Media */}
                <div className="lg:col-span-4 space-y-12">

                    {/* Media Module */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-blue-950/5">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-black text-blue-950 tracking-tight">Galleria</h2>
                            <Upload className="w-4 h-4 text-sky-600" />
                        </div>

                        <div className="aspect-[4/5] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center hover:bg-slate-50 hover:border-sky-200 transition-all cursor-pointer group mb-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-sky-50 group-hover:text-sky-600 transition-all mb-4">
                                <Upload className="w-8 h-8" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-950 transition-colors">Invoke Master Image</p>
                            <p className="text-[9px] font-bold text-slate-300 mt-2 uppercase tracking-tighter">Powered by Cloudinary</p>
                        </div>
                        <p className="text-[9px] text-center font-bold text-slate-300 uppercase tracking-widest italic">High resolution assets required</p>
                    </div>

                    {/* Financial Module */}
                    <div className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/20">
                        <div className="flex items-center gap-4 mb-10">
                            <CreditCard className="w-6 h-6 text-sky-400" />
                            <h2 className="text-xl font-black">Financials</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block ml-1 opacity-60">Listing Price (₦)</label>
                                <input type="number" className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-blue-300 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all" placeholder="0.00" />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block ml-1 opacity-60">Elite Promo Price (₦)</label>
                                <input type="number" className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-blue-300 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all" placeholder="Optional" />
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-white/10 group cursor-pointer" onClick={() => setIsNegotiable(!isNegotiable)}>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Negotiable Price</span>
                                    <p className="text-[8px] font-bold text-sky-400 uppercase tracking-tight">Allow customer negotiation</p>
                                </div>
                                <div className={`w-12 h-6 rounded-full transition-all relative ${isNegotiable ? 'bg-sky-600' : 'bg-blue-900'}`}>
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-lg ${isNegotiable ? 'left-7' : 'left-1'}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meta Section */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-950">Active Status</span>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Live on storefront</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-950 transition-colors"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
