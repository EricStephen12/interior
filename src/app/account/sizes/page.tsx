'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit3, Ruler, Check, X } from 'lucide-react';

const mockSizes = [
    { id: '1', label: 'Single (3.5x6)', dimensions: '42" x 75"' },
    { id: '2', label: 'Double (4.5x6)', dimensions: '54" x 75"' },
    { id: '3', label: 'Family (6x6)', dimensions: '72" x 72"' },
    { id: '4', label: 'King (6x7)', dimensions: '72" x 84"' },
];

export default function AdminSizesPage() {
    const [sizes, setSizes] = useState(mockSizes);
    const [isAdding, setIsAdding] = useState(false);
    const [newSize, setNewSize] = useState({ label: '', dimensions: '' });

    const handleAddSize = () => {
        if (newSize.label) {
            setSizes([...sizes, { id: Date.now().toString(), ...newSize }]);
            setNewSize({ label: '', dimensions: '' });
            setIsAdding(false);
        }
    };

    const handleDeleteSize = (id: string) => {
        setSizes(sizes.filter(s => s.id !== id));
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 tracking-tight">Global Size Table</h1>
                    <p className="text-slate-500 mt-1 font-medium">Standardized sizes used across all brands and products.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-blue-950 hover:bg-sky-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/10"
                >
                    <Plus className="w-4 h-4" /> Add New Standard
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sizes List */}
                <div className="lg:col-span-2 space-y-4">
                    {sizes.map((size) => (
                        <motion.div
                            layout
                            key={size.id}
                            className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center justify-between group hover:shadow-xl hover:shadow-blue-900/5 transition-all"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-950 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                                    <Ruler className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-blue-950">{size.label}</h3>
                                    <p className="text-sm text-slate-400 font-medium">{size.dimensions || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-3 text-slate-400 hover:text-sky-600 transition-colors">
                                    <Edit3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteSize(size.id)}
                                    className="p-3 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Add/Edit Sidebar */}
                <div className="space-y-6">
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-blue-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-950/20 sticky top-8"
                        >
                            <h2 className="text-2xl font-black mb-8 leading-tight">Define New <br /> Standard Size</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block mb-3 opacity-60">
                                        Size Label
                                    </label>
                                    <input
                                        type="text"
                                        value={newSize.label}
                                        onChange={(e) => setNewSize({ ...newSize, label: e.target.value })}
                                        className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-blue-300 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all font-sans"
                                        placeholder="e.g. King (6x7)"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block mb-3 opacity-60">
                                        Dimensions (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={newSize.dimensions}
                                        onChange={(e) => setNewSize({ ...newSize, dimensions: e.target.value })}
                                        className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-blue-300 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all font-sans"
                                        placeholder='e.g. 72" x 84"'
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleAddSize}
                                        className="flex-1 bg-sky-600 hover:bg-sky-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4" /> Confirm
                                    </button>
                                    <button
                                        onClick={() => setIsAdding(false)}
                                        className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {!isAdding && (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 text-center space-y-6">
                            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 mx-auto border-2 border-slate-100">
                                <Ruler className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-blue-950">Standardized Scale</h3>
                                <p className="text-sm text-slate-400 mt-2 font-medium">Uniform sizes ensure consistency across different mattress brands.</p>
                            </div>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="text-sky-600 font-black text-[10px] uppercase tracking-widest hover:text-blue-950 transition-colors"
                            >
                                Learn about global sizing &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
