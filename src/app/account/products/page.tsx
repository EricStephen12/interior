'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Trash2,
  ExternalLink,
  Tag,
  Package,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Image from 'next/image';

const mockAdminProducts = [
  {
    id: '1',
    name: 'Vitafoam Grandeur Mattress',
    brand: 'Vitafoam',
    category: 'Mattresses',
    price: 185000,
    stock: 12,
    status: 'Active',
    image: '/images/Modern Luxury Home Furniture Bedroom Bed Set Queen King Size Headboard Stainless Steel Base Bed.jpeg'
  },
  {
    id: '2',
    name: 'Mouka Flora Mattress',
    brand: 'Mouka',
    category: 'Mattresses',
    price: 95000,
    stock: 0,
    status: 'Out of Stock',
    image: '/images/Marshmallow Bed Frame.jpeg'
  },
  {
    id: '3',
    name: 'Royal Foam Executive Pillow',
    brand: 'Royal Foam',
    category: 'Pillows',
    price: 12500,
    stock: 45,
    status: 'Active',
    image: '/images/Modern Throw Pillow & Decorative Accent Pillows for Sofas, Chairs & Beds _ CB2.jpeg'
  }
];

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-blue-950 tracking-tight">Product Inventory</h1>
          <p className="text-slate-500 font-medium">Manage your elite mattress and furniture catalog.</p>
        </div>
        <Link
          href="/account/products/create"
          className="bg-blue-950 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-950/20"
        >
          <Plus className="w-4 h-4" /> Establish New Essence
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-950/5 overflow-hidden">
        {/* Table Header / Filters */}
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-sky-600 transition-colors" />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-transparent focus:border-sky-600 focus:bg-white focus:ring-4 focus:ring-sky-50 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium text-blue-950 outline-none transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-950 hover:bg-slate-100 transition-all text-[10px] font-black uppercase tracking-widest">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Product</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financials</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visibility</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockAdminProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl relative overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-blue-950 group-hover:text-sky-600 transition-colors leading-tight mb-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-1">
                            <Package className="w-3 h-3" /> {product.category}
                          </span>
                          <span className="text-slate-200">/</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-sky-600">
                            {product.brand}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <span className={`text-sm font-black ${product.stock > 0 ? 'text-blue-950' : 'text-red-500'}`}>
                        {product.stock} Units
                      </span>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">In Storage</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <span className="text-sm font-black text-blue-950">₦ {product.price.toLocaleString()}</span>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Listing Value</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 group/status">
                      {product.status === 'Active' ? (
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                        {product.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="p-3 text-slate-300 hover:text-blue-950 hover:bg-white rounded-xl transition-all">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-slate-50/30 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing 1-3 of {mockAdminProducts.length} ESSENCES
          </p>
          <div className="flex gap-2">
            <button disabled className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-300 disabled:opacity-50 transition-all">Previous</button>
            <button disabled className="px-4 py-2 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-300 disabled:opacity-50 transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
