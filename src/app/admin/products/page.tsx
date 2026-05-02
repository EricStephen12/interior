import { getProducts } from '@/lib/services/product'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Tag, Package } from 'lucide-react'
import Image from 'next/image'

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary uppercase font-display">
            The <span className="text-accent italic font-light lowercase">Inventory.</span>
          </h1>
          <p className="text-slate-500 font-medium whitespace-nowrap">Manage your high-tier collection.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="flex items-center gap-3 bg-primary text-white px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> New Product
        </Link>
      </div>

      <div className="glass-light overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-primary/5 bg-secondary/10">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary">Piece</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary">Brand</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary">Investment</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium">
                  The vault is empty. Deposit new pieces to begin.
                </td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr key={product.id} className="hover:bg-white/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-secondary relative overflow-hidden">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt="" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                             <Package className="w-6 h-6 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{product.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{product.type || 'Standard'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest border border-primary/10 px-3 py-1 bg-white">
                      {product.brand.name}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary">${product.price.toLocaleString()}</span>
                      {product.promoPrice && (
                        <span className="text-[9px] text-accent line-through font-bold">${product.promoPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black px-3 py-1 uppercase tracking-widest ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.isActive ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3">
                      <Link href={`/products/${product.id}`} className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/products/edit/${product.id}`} className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
