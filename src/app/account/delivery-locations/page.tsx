'use client';

import React, { useState } from 'react';
import {
    Plus,
    MapPin,
    Truck,
    Trash2,
    Edit2,
    Search,
    Globe,
    Navigation,
    Clock,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const mockLocations = [
    {
        id: '1',
        name: 'Abuja (Within City)',
        price: 5000,
        estimatedDays: '1-2 Days',
        status: 'ACTIVE',
        orders: 45
    },
    {
        id: '2',
        name: 'Benin City',
        price: 7500,
        estimatedDays: '2-3 Days',
        status: 'ACTIVE',
        orders: 28
    },
    {
        id: '3',
        name: 'Lagos Island',
        price: 12000,
        estimatedDays: '3-5 Days',
        status: 'INACTIVE',
        orders: 12
    }
];

export default function DeliveryLocationsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-blue-950 tracking-tight flex items-center gap-4">
                        Logistics <span className="text-sky-600">&</span> Delivery
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">Expand your reach by adding new delivery jurisdictions.</p>
                </div>
                <button
                    className="bg-blue-950 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-950/20 transform active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Establish Zone
                </button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <Globe className="w-20 h-20" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Territories</p>
                    <h3 className="text-3xl font-black text-blue-950">02</h3>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase mt-2">Operational</p>
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <Truck className="w-20 h-20" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg. Logistics Fee</p>
                    <h3 className="text-3xl font-black text-blue-950">₦6,250</h3>
                    <p className="text-[10px] font-bold text-sky-600 uppercase mt-2">Zone Weighted</p>
                </div>
                <div className="bg-blue-950 rounded-[2rem] p-8 shadow-xl shadow-blue-950/10 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-4 h-4 text-sky-400" />
                        <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Expansion Protocol</p>
                    </div>
                    <p className="text-sm font-medium text-white/80 leading-relaxed">
                        New zones are automatically integrated into the checkout flow upon activation.
                    </p>
                </div>
            </div>

            {/* List Module */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-950/5 overflow-hidden font-sans">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Query jurisdictions..."
                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-medium outline-none focus:ring-2 focus:ring-sky-600 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Jurisdiction</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Logistics Fee</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Timeframe</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {mockLocations.map((loc) => (
                                <tr key={loc.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-950 transition-colors border border-slate-100">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-blue-950 leading-tight">{loc.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{loc.orders} Successful Dispatches</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-black text-blue-950">₦{loc.price.toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-sky-600 uppercase tracking-widest">Base Rate</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                            <Clock className="w-4 h-4 text-slate-300" />
                                            {loc.estimatedDays}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${loc.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <ShieldCheck className="w-3 h-3" />
                                            {loc.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-950 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
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
