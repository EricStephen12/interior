'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    Loader2,
    Trash2,
    Package,
    Tag as TagIcon,
    Image as ImageIcon,
    Zap,
    CheckCircle2,
    Info,
    Edit3,
    Plus
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [isNegotiable, setIsNegotiable] = useState(true);

    // In a real app, we would fetch the product data using params.id
    const mockProduct = {
        name: 'Vitafoam Grandeur Mattress',
        brand: 'Vitafoam',
        category: 'Mattresses',
        description: 'The pinnacle of sleeping luxury, combining memory foam with breathability.',
        materials: 'High-density Memory Foam',
        firmness: 'Medium-Firm',
        finishing: 'Quilted Cashmere',
        warranty: '10 Years',
        price: 185000,
        promo_price: 165000,
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/account/products');
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/account/products"
                        className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-100 transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-2 py-0.5 rounded">Editing Essence</span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ID: {params.id}</span>
                        </div>
                        <h1 className="text-3xl font-black text-blue-950 tracking-tight">{mockProduct.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        title="Delete Essence"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-950 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-950/20 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Commit Updates
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Configuration */}
                <div className="lg:col-span-8 space-y-12">

                    {/* Identity Section */}
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-blue-950/5">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 bg-blue-950 rounded-xl flex items-center justify-center text-white">
                                <Package className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-blue-950">Essence Identity</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Product Name</label>
                                <input
                                    type="text"
                                    defaultValue={mockProduct.name}
                                    className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Brand Lineage</label>
                                    <select className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all appearance-none cursor-pointer">
                                        <option value={mockProduct.brand}>{mockProduct.brand}</option>
                                        <option>Mouka</option>
                                        <option>Sara Foam</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Category</label>
                                    <select className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-bold text-blue-950 outline-none transition-all appearance-none cursor-pointer">
                                        <option value={mockProduct.category}>{mockProduct.category}</option>
                                        <option>Pillows</option>
                                        <option>Furniture</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Master Description</label>
                                <textarea
                                    rows={4}
                                    defaultValue={mockProduct.description}
                                    className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl px-6 py-4 text-sm font-medium text-blue-950 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Elite Attributes */}
                    <section className="bg-slate-50 rounded-[2.5rem] border border-slate-200/50 p-10 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-blue-950">Elite Specification</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Core Material</label>
                                    <input type="text" defaultValue={mockProduct.materials} className="w-full bg-white border-slate-100 rounded-xl px-5 py-3 text-sm font-bold text-blue-950 outline-none focus:ring-2 focus:ring-sky-600/20 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Firmness Protocol</label>
                                    <input type="text" defaultValue={mockProduct.firmness} className="w-full bg-white border-slate-100 rounded-xl px-5 py-3 text-sm font-bold text-blue-950 outline-none focus:ring-2 focus:ring-sky-600/20 transition-all" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Finishing Aesthetic</label>
                                    <input type="text" defaultValue={mockProduct.finishing} className="w-full bg-white border-slate-100 rounded-xl px-5 py-3 text-sm font-bold text-blue-950 outline-none focus:ring-2 focus:ring-sky-600/20 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Warranty Security</label>
                                    <input type="text" defaultValue={mockProduct.warranty} className="w-full bg-white border-slate-100 rounded-xl px-5 py-3 text-sm font-bold text-blue-950 outline-none focus:ring-2 focus:ring-sky-600/20 transition-all" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Commercials & Media */}
                <div className="lg:col-span-4 space-y-12">
                    {/* Commercials */}
                    <section className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/20">
                        <div className="flex items-center gap-4 mb-10">
                            <TagIcon className="w-6 h-6 text-sky-400" />
                            <h2 className="text-xl font-black">Commercials</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block ml-1 opacity-60">Listing Price (₦)</label>
                                <input
                                    type="number"
                                    defaultValue={mockProduct.price}
                                    className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-blue-300 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block ml-1 opacity-60">Promo Price (Optional)</label>
                                <input
                                    type="number"
                                    defaultValue={mockProduct.promo_price}
                                    className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-blue-300 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all"
                                />
                            </div>

                            <div className="flex items-center justify-between p-6 bg-blue-900/30 rounded-2xl border border-white/5">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight block">Price Negotiable</span>
                                    <p className="text-[8px] font-bold text-sky-400/60 uppercase">Enable WhatsApp Bargaining</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isNegotiable}
                                        onChange={() => setIsNegotiable(!isNegotiable)}
                                    />
                                    <div className="w-11 h-6 bg-blue-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Media Review */}
                    <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-blue-950 uppercase tracking-widest">Asset Manager</h3>
                            <button type="button" className="text-[10px] font-black text-sky-600 hover:text-blue-950 uppercase tracking-widest transition-colors">Replace All</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden group cursor-pointer">
                                <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                    <Edit3 className="w-5 h-5 text-white" />
                                </div>
                                {/* Mock Image Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                            </div>
                            <button
                                type="button"
                                className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:text-sky-600 hover:border-sky-200 transition-all group"
                            >
                                <Plus className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Add Media</span>
                            </button>
                        </div>
                    </section>

                    {/* Visibility Controls */}
                    <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-blue-950 uppercase tracking-widest">Live Visibility</span>
                                <p className="text-[8px] font-black text-slate-400 tracking-tight uppercase">Visible in main shop</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                                <CheckCircle2 className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase">Active</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <Info className="w-4 h-4 text-sky-600 mt-1 shrink-0" />
                            <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                                Modifications reflect instantly on product grid and checkout systems.
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
