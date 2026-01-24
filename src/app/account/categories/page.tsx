'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit3, Grid, Check, X } from 'lucide-react';

const mockCategories = [
    { id: '1', name: 'Mattresses', productCount: 24 },
    { id: '2', name: 'Pillows', productCount: 12 },
    { id: '3', name: 'Beddings', productCount: 8 },
    { id: '4', name: 'Furniture', productCount: 4 },
];

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState(mockCategories);
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '' });

    const handleAddCategory = () => {
        if (newCategory.name) {
            setCategories([...categories, { id: Date.now().toString(), name: newCategory.name, productCount: 0 }]);
            setNewCategory({ name: '' });
            setIsAdding(false);
        }
    };

    const handleDeleteCategory = (id: string) => {
        setCategories(categories.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-blue-950 tracking-tight">Product Categories</h1>
                    <p className="text-slate-500 mt-1 font-medium">Manage the organizational structure of your catalog.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-blue-950 hover:bg-sky-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/10"
                >
                    <Plus className="w-4 h-4" /> Add New Category
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Categories List */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map((cat) => (
                        <motion.div
                            layout
                            key={cat.id}
                            className="bg-white border border-slate-100 rounded-3xl p-8 group hover:shadow-xl hover:shadow-blue-900/5 transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-sky-50 transition-colors" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 bg-blue-950 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-sky-600 transition-colors shadow-lg shadow-blue-900/20">
                                    <Grid className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-blue-950 mb-2">{cat.name}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    {cat.productCount} Active Products
                                </p>

                                <div className="mt-8 flex items-center gap-2 pt-4 border-t border-slate-50">
                                    <button className="flex-1 bg-slate-50 hover:bg-sky-50 hover:text-sky-600 text-slate-400 p-3 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                        <Edit3 className="w-4 h-4" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(cat.id)}
                                        className="w-12 h-12 bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl transition-all flex items-center justify-center"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
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
                            <h2 className="text-2xl font-black mb-8 leading-tight">Create New <br /> Category</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 block mb-3 opacity-60">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ name: e.target.value })}
                                        className="w-full bg-blue-900/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder-blue-300 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all"
                                        placeholder="e.g. Ergonomic Chairs"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleAddCategory}
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
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 text-center space-y-6">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-blue-950 mx-auto border border-slate-100">
                                <Grid className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-blue-950 tracking-tight">Structural Integrity</h3>
                                <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">Categories define how customers navigate your store's essence.</p>
                            </div>
                            <div className="pt-2">
                                <span className="inline-block px-4 py-2 bg-sky-50 text-sky-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                    SEO Optimized
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
