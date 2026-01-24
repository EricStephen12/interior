'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateBrandPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // This would be connected to Supabase/Cloudinary later
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            router.push('/account/brands');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/account/brands"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Brand</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Create a new brand to categorize products.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">

                {/* Brand Logo Upload */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand Logo</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Click to upload logo</p>
                        <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG up to 2MB</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-600 outline-none transition-all"
                            placeholder="e.g. Vitafoam"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-600 outline-none transition-all resize-none"
                            placeholder="Brief description about the brand..."
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                        <input type="checkbox" id="featured" className="w-5 h-5 text-sky-600 rounded focus:ring-sky-600" />
                        <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                            Feature this brand on homepage
                        </label>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-950 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Brand
                    </button>
                </div>
            </form>
        </div>
    );
}
