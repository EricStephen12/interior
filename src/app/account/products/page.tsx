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
    name: 'SHARERS Diamond Petal Necklace',
    brand: 'SHARERS Signature',
    category: 'Jewelry',
    price: 3950,
    stock: 12,
    status: 'Active',
    image: '/images/exricx/luxury_diamond_necklace_1769449448575.png'
  },
  {
    id: '2',
    name: 'L\'Or de Jardin Parfum',
    brand: 'SHARERS Signature',
    category: 'Fragrance',
    price: 245,
    stock: 0,
    status: 'Out of Stock',
    image: '/images/exricx/luxury_perfume_detail_1769449375639.png'
  },
  {
    id: '3',
    name: 'SHARERS Pearl Droplets',
    brand: 'Artisan Gold',
    category: 'Jewelry',
    price: 720,
    stock: 45,
    status: 'Active',
    image: '/images/exricx/luxury_earrings_pearl_1769449548067.png'
  }
];

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-12 font-sans selection:bg-secondary">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <span className="text-[10px] font-black tracking-[0.5em] text-accent uppercase mb-4 block underline decoration-accent/20 underline-offset-8">Inventory Vault</span>
          <h1 className="text-5xl font-black text-primary tracking-tight">Essence Registry</h1>
          <p className="text-slate-400 font-light mt-4 uppercase tracking-widest text-xs">Manage your elite jewelry and fragrance catalog.</p>
        </div>
        <Link
          href="/account/products/create"
          className="btn-primary !bg-primary hover:!bg-accent hover:!text-white py-5 px-10 shadow-2xl"
        >
          <Plus className="w-5 h-5" /> ESTABLISH NEW ESSENCE
        </Link>
      </div>

      <div className="bg-white rounded-none border border-primary/5 shadow-2xl shadow-black/5 overflow-hidden">
        {/* Table Header / Filters */}
        <div className="p-10 border-b border-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-secondary/10">
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search registry, collections, essences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-b border-primary/10 focus:border-accent rounded-none py-4 pl-10 pr-4 text-sm font-medium text-primary outline-none transition-all tabular-nums"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-3 px-8 py-4 rounded-none bg-white text-primary border border-primary/5 hover:border-accent/40 shadow-sm transition-all text-[10px] font-black uppercase tracking-widest">
              <Filter className="w-4 h-4" /> Refine View
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white">
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-primary/5">Essence Artifact</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-primary/5">Vault Level</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-primary/5">Valuation</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-primary/5">Status</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-primary/5 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5 bg-white">
              {mockAdminProducts.map((product) => (
                <tr key={product.id} className="group hover:bg-secondary/10 transition-colors">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-24 bg-white rounded-none relative overflow-hidden flex-shrink-0 shadow-lg border border-primary/5 group-hover:scale-105 transition-transform duration-700">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-primary group-hover:text-accent transition-colors tracking-tight mb-2">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Package className="w-3 h-3" /> {product.category}
                          </span>
                          <span className="text-primary/10">|</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-accent">
                            {product.brand}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-1">
                      <span className={`text-base font-medium tabular-nums ${product.stock > 0 ? 'text-primary' : 'text-red-800'}`}>
                        {product.stock} Units
                      </span>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">In Vault</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-1">
                      <span className="text-xl font-light text-primary tabular-nums">$ {product.price.toLocaleString()}</span>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Unit Value</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-none bg-secondary/30 group/status">
                      {product.status === 'Active' ? (
                        <CheckCircle2 className="w-3 h-3 text-accent" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-800" />
                      )}
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                        {product.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="p-4 text-slate-300 hover:text-accent hover:bg-primary transition-all rounded-none shadow-sm">
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button className="p-4 text-slate-300 hover:text-white hover:bg-red-800 transition-all rounded-none shadow-sm">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-10 bg-secondary/10 flex items-center justify-between border-t border-primary/5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Registry Index: 1-3 of {mockAdminProducts.length} ESSENCES
          </p>
          <div className="flex gap-4">
            <button disabled className="px-6 py-3 bg-white border border-primary/5 rounded-none text-[9px] font-black uppercase tracking-widest text-slate-300 disabled:opacity-30 transition-all cursor-not-allowed">Protocol Back</button>
            <button disabled className="px-6 py-3 bg-white border border-primary/5 rounded-none text-[9px] font-black uppercase tracking-widest text-slate-300 disabled:opacity-30 transition-all cursor-not-allowed">Next Protocol</button>
          </div>
        </div>
      </div>
    </div>
  );
}
