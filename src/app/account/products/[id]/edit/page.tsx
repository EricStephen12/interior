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
        name: 'EXRICX Diamond Petal Necklace',
        brand: 'EXRICX Signature',
        category: 'Jewelry',
        description: 'A masterpiece of precision. Hand-set diamonds in a floral petal arrangement, suspended on an 18k white gold chain.',
        materials: '18k White Gold, VS+ Diamonds',
        firmness: 'N/A',
        finishing: 'Micro-polished',
        warranty: 'Lifetime Certification',
        price: 3950,
        promo_price: 3500,
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
        <div className="max-w-6xl mx-auto space-y-16 pb-32 font-sans selection:bg-secondary">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-primary/5">
                <div className="flex items-center gap-8">
                    <Link
                        href="/account/products"
                        className="w-14 h-14 bg-white rounded-none border border-primary/5 flex items-center justify-center text-slate-300 hover:text-accent hover:border-accent transition-all duration-500 group editorial-shadow"
                    >
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent border border-accent/20 px-3 py-1">Editing Essence</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Vault: {params.id}</span>
                        </div>
                        <h1 className="text-5xl font-black text-primary tracking-tight leading-none">{mockProduct.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        className="w-14 h-14 flex items-center justify-center text-slate-300 hover:text-red-800 hover:bg-red-50 transition-all rounded-none"
                        title="Evict Essence"
                    >
                        <Trash2 className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn-primary !bg-primary hover:!bg-accent hover:!text-white py-5 px-10 shadow-2xl transition-all duration-700 disabled:opacity-30"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        COMMIT TO REGISTRY
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Main Configuration */}
                <div className="lg:col-span-8 space-y-16">

                    {/* Identity Section */}
                    <section className="bg-white rounded-none border border-primary/5 p-12 shadow-2xl shadow-black/5">
                        <div className="flex items-center gap-6 mb-12">
                            <div className="w-12 h-12 bg-primary rounded-none flex items-center justify-center text-white shadow-xl">
                                <Package className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Essence Identity</h2>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block ml-1">Essence Name</label>
                                <input
                                    type="text"
                                    defaultValue={mockProduct.name}
                                    className="w-full bg-secondary/10 border-b border-transparent focus:border-accent rounded-none px-6 py-5 text-lg font-bold text-primary outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block ml-1">Collection Lineage</label>
                                    <select className="w-full bg-secondary/10 border-b border-transparent focus:border-accent rounded-none px-6 py-5 text-sm font-bold text-primary outline-none transition-all appearance-none cursor-pointer">
                                        <option value={mockProduct.brand}>{mockProduct.brand}</option>
                                        <option>Noir Collection</option>
                                        <option>Luxe Lab</option>
                                        <option>Artisan Gold</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block ml-1">Essence Type</label>
                                    <select className="w-full bg-secondary/10 border-b border-transparent focus:border-accent rounded-none px-6 py-5 text-sm font-bold text-primary outline-none transition-all appearance-none cursor-pointer">
                                        <option value={mockProduct.category}>{mockProduct.category}</option>
                                        <option>Fragrance</option>
                                        <option>Bespoke Jewelry</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block ml-1">Laboratory Narrative</label>
                                <textarea
                                    rows={5}
                                    defaultValue={mockProduct.description}
                                    className="w-full bg-secondary/10 border-b border-transparent focus:border-accent rounded-none px-6 py-5 text-base font-light text-primary outline-none transition-all resize-none leading-relaxed"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Elite Attributes */}
                    <section className="bg-secondary/10 rounded-none border border-primary/5 p-12 relative overflow-hidden">
                        <div className="flex items-center gap-6 mb-12 relative z-10">
                            <div className="w-12 h-12 bg-accent rounded-none flex items-center justify-center text-white shadow-xl">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Molecular Specs</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block ml-1">Structural Material</label>
                                    <input type="text" defaultValue={mockProduct.materials} className="w-full bg-white border border-primary/5 rounded-none px-6 py-4 text-sm font-bold text-primary outline-none focus:border-accent transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block ml-1">Stability Protocol</label>
                                    <input type="text" defaultValue={mockProduct.firmness} className="w-full bg-white border border-primary/5 rounded-none px-6 py-4 text-sm font-bold text-primary outline-none focus:border-accent transition-all" />
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block ml-1">Surface Aesthetic</label>
                                    <input type="text" defaultValue={mockProduct.finishing} className="w-full bg-white border border-primary/5 rounded-none px-6 py-4 text-sm font-bold text-primary outline-none focus:border-accent transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block ml-1">Lab Warranty Security</label>
                                    <input type="text" defaultValue={mockProduct.warranty} className="w-full bg-white border border-primary/5 rounded-none px-6 py-4 text-sm font-bold text-primary outline-none focus:border-accent transition-all" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Commercials & Media */}
                <div className="lg:col-span-4 space-y-16">
                    {/* Commercials */}
                    <section className="bg-primary rounded-none p-12 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent/5 pointer-events-none"></div>
                        <div className="flex items-center gap-6 mb-12 relative z-10">
                            <TagIcon className="w-8 h-8 text-accent" />
                            <h2 className="text-2xl font-black uppercase tracking-tight">Valuation</h2>
                        </div>

                        <div className="space-y-10 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent block ml-1 opacity-80">Registry Price ($)</label>
                                <input
                                    type="number"
                                    defaultValue={mockProduct.price}
                                    className="w-full bg-white/5 border-b border-white/10 focus:border-accent rounded-none py-5 text-xl font-light text-white tabular-nums focus:ring-0 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-accent block ml-1 opacity-80">Adjustment Valuation</label>
                                <input
                                    type="number"
                                    defaultValue={mockProduct.promo_price}
                                    className="w-full bg-white/5 border-b border-white/10 focus:border-accent rounded-none py-5 text-xl font-light text-white tabular-nums focus:ring-0 outline-none transition-all"
                                />
                            </div>

                            <div className="p-8 bg-white/5 border border-white/10 rounded-none group-hover:bg-white/10 transition-all duration-700">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-tight block">Bespoke Inquiries</span>
                                        <p className="text-[8px] font-black text-accent/60 uppercase tracking-widest">Enable Concierge Pricing</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={isNegotiable}
                                            onChange={() => setIsNegotiable(!isNegotiable)}
                                        />
                                        <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:bg-accent/40"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Media Manager */}
                    <section className="bg-white border border-primary/5 rounded-none p-10 shadow-2xl shadow-black/5">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Asset Vault</h3>
                            <button type="button" className="text-[9px] font-black text-accent hover:text-primary uppercase tracking-[0.4em] transition-all">Flush Artifacts</button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="aspect-square bg-secondary/20 rounded-none border border-primary/5 relative overflow-hidden group cursor-pointer editorial-shadow">
                                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center z-10">
                                    <Edit3 className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center text-slate-100">
                                    <ImageIcon className="w-10 h-10" />
                                </div>
                            </div>
                            <button
                                type="button"
                                className="aspect-square bg-secondary/10 rounded-none border border-dashed border-primary/10 flex flex-col items-center justify-center text-slate-300 hover:text-accent hover:border-accent transition-all duration-700 group"
                            >
                                <Plus className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform duration-700" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Add Artifact</span>
                            </button>
                        </div>
                    </section>
                </div>
            </form>
        </div>
    );
}
