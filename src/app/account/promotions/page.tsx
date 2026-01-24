'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Calendar,
    Tag as TagIcon,
    CheckCircle2,
    XCircle,
    Clock,
    ExternalLink,
    Zap,
    Layout
} from 'lucide-react';

interface Promotion {
    id: string;
    title: string;
    type: string;
    discountType: string;
    discountValue: number;
    status: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED';
    validUntil: string;
    target: string;
    impressions: number;
    conversions: number;
}

const mockPromotions: Promotion[] = [
    {
        id: '1',
        title: 'New Year Comfort Bash',
        type: 'BANNED', // Banner or Discount
        discountType: 'Percentage',
        discountValue: 15,
        status: 'ACTIVE',
        validUntil: '2026-02-28',
        target: 'All Mattresses',
        impressions: 1240,
        conversions: 45
    },
    {
        id: '2',
        title: 'Vitafoam Exclusive Week',
        type: 'DISCOUNT',
        discountType: 'Fixed',
        discountValue: 20000,
        status: 'SCHEDULED',
        validUntil: '2026-03-15',
        target: 'Vitafoam Brand',
        impressions: 0,
        conversions: 0
    },
    {
        id: '3',
        title: 'Flash Furniture Clearance',
        type: 'BANNED',
        discountType: 'Percentage',
        discountValue: 30,
        status: 'EXPIRED',
        validUntil: '2026-01-15',
        target: 'Furniture Category',
        impressions: 5600,
        conversions: 112
    }
];

export default function PromotionsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-blue-950 tracking-tight">Promotions Hub</h1>
                    <p className="text-slate-500 font-medium">Manage your site-wide discounts and marketing banners.</p>
                </div>
                <Link
                    href="/account/promotions/create"
                    className="bg-blue-950 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-950/20 transform active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Create Promotion
                </Link>
            </div>

            {/* Stats Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Zap}
                    label="Active Campaigns"
                    value="4"
                    subValue="+2 this week"
                    color="bg-sky-50 text-sky-600"
                />
                <StatCard
                    icon={Layout}
                    label="Total Impressions"
                    value="18.5k"
                    subValue="Across 3 banners"
                    color="bg-indigo-50 text-indigo-600"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Avg. Conversion"
                    value="4.2%"
                    subValue="Promo efficiency"
                    color="bg-emerald-50 text-emerald-600"
                />
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-600 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2 hover:border-sky-100 hover:text-sky-600 transition-all">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Promotions Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-blue-950/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign Details</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Targeting</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Discount</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Performance</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {mockPromotions.map((promo) => (
                                <tr key={promo.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${promo.type === 'BANNED' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {promo.type === 'BANNED' ? <Layout className="w-6 h-6" /> : <TagIcon className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-blue-950">{promo.title}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                                    <Calendar className="w-3 h-3" />
                                                    Until {new Date(promo.validUntil).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg">
                                            {promo.target}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-blue-950">
                                                {promo.discountType === 'Percentage' ? `${promo.discountValue}% OFF` : `₦${promo.discountValue.toLocaleString()} OFF`}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{promo.discountType} Base</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={promo.status} />
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold text-blue-950">{promo.impressions.toLocaleString()} views</span>
                                            <span className="text-[10px] font-black text-sky-600 uppercase">{promo.conversions} orders</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-sky-600 transition-all">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-600 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

function StatusBadge({ status }: { status: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' }) {
    const styles: Record<string, string> = {
        ACTIVE: 'bg-emerald-50 text-emerald-600',
        SCHEDULED: 'bg-sky-50 text-sky-600',
        EXPIRED: 'bg-slate-50 text-slate-400'
    };

    const icons: Record<string, React.ElementType> = {
        ACTIVE: CheckCircle2,
        SCHEDULED: Clock,
        EXPIRED: XCircle
    };

    const Icon = icons[status];

    return (
        <span className={`flex items-center gap-2 w-fit px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
            <Icon className="w-3 h-3" />
            {status}
        </span>
    );
}
