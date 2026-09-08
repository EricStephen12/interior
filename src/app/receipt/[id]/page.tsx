import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Printer, ArrowLeft, ShieldCheck } from 'lucide-react'

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Try lookup by ID or kingspayId
  let order = await prisma.order.findUnique({
    where: { id },
  })

  if (!order) {
    order = await prisma.order.findFirst({
      where: { kingspayId: id } as any,
    })
  }

  if (!order) {
    notFound()
  }

  // Parse items
  let parsedItems: Array<{ name: string; quantity: number; price: number; variant?: string }> = []
  if (Array.isArray(order.items)) {
    parsedItems = order.items as any
  } else if (typeof order.items === 'string') {
    try {
      const parsed = JSON.parse(order.items)
      parsedItems = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      parsedItems = [{ name: 'Gym Apparel / Access Pass', quantity: 1, price: order.totalAmount }]
    }
  }

  const shipping = (order.shippingDetails as any) || {}
  const customerName = shipping.name || 'Valued Member'
  const customerEmail = order.userEmail
  const customerPhone = shipping.phone || '—'
  const shippingAddress = shipping.address || 'In-Gym / Electronic Delivery'
  const paymentType = shipping.paymentType || (order.kingspayId ? 'KingsPay Online Gateway' : 'Bank Transfer')
  const invoiceNumber = `SG-INV-${order.id.slice(-8).toUpperCase()}`
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans print:bg-white print:text-black print:p-0">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between print:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <button
          // @ts-ignore
          onClick="window.print()"
          id="print-btn"
          className="flex items-center gap-2 bg-[#f20d0d] text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Receipt Paper Card */}
      <div className="max-w-3xl mx-auto bg-[#0d111a] border border-[#1e2738] rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:p-6 print:bg-white print:text-black">
        {/* Decorative Red Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#f20d0d] via-red-500 to-[#f20d0d] print:hidden" />

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-[#1e2738] pb-8 mb-8 print:border-gray-200">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f20d0d] block mb-1">
              Official Tax & Payment Receipt
            </span>
            <h1 className="text-3xl font-black tracking-tight text-white print:text-black">SHARERS GYM</h1>
            <p className="text-xs text-slate-400 print:text-gray-500 mt-1">
              Lagos, Nigeria • support@sharersgym.com • sharersgym.com
            </p>
          </div>

          <div className="text-left sm:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 print:border-gray-300 print:text-black">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{order.status === 'PAID' || order.status === 'COMPLETED' ? 'Paid & Verified' : order.status}</span>
            </div>
            <p className="text-xs font-mono font-bold text-white print:text-black">{invoiceNumber}</p>
            <p className="text-[11px] text-slate-400 print:text-gray-500">{formattedDate}</p>
          </div>
        </div>

        {/* Customer & Payment Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 pb-8 border-b border-[#1e2738] print:border-gray-200 text-xs">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 print:text-gray-500 block mb-2">
              Billed To
            </span>
            <p className="font-bold text-sm text-white print:text-black">{customerName}</p>
            <p className="text-slate-300 print:text-gray-700">{customerEmail}</p>
            {customerPhone && <p className="text-slate-400 print:text-gray-500">Tel: {customerPhone}</p>}
            <p className="text-slate-400 print:text-gray-500 mt-1">{shippingAddress}</p>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 print:text-gray-500 block mb-2">
              Payment Method & Ref
            </span>
            <p className="font-bold text-white print:text-black">{paymentType}</p>
            <p className="font-mono text-slate-400 print:text-gray-500 text-[11px] mt-1">
              Order ID: #{order.id.slice(-8).toUpperCase()}
            </p>
            {order.kingspayId && (
              <p className="font-mono text-slate-400 print:text-gray-500 text-[11px]">
                Gateway Ref: {order.kingspayId}
              </p>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1e2738] text-[10px] font-black uppercase tracking-widest text-slate-400 print:border-gray-300 print:text-gray-600">
                <th className="py-3">Description</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Unit Price</th>
                <th className="py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2738] print:divide-gray-200">
              {parsedItems.map((item, idx) => (
                <tr key={idx} className="text-slate-200 print:text-black">
                  <td className="py-3.5 pr-4 font-semibold">
                    {item.name}
                    {item.variant && (
                      <span className="block text-[10px] text-slate-400 print:text-gray-500 uppercase tracking-wider font-normal">
                        Variant: {item.variant}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-center font-mono">{item.quantity || 1}</td>
                  <td className="py-3.5 text-right font-mono">₦{Number(item.price || 0).toLocaleString()}</td>
                  <td className="py-3.5 text-right font-mono font-bold text-white print:text-black">
                    ₦{Number((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Totals */}
        <div className="flex justify-end mb-10">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400 print:text-gray-600">
              <span>Subtotal</span>
              <span className="font-mono">₦{Number(order.totalAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400 print:text-gray-600">
              <span>VAT / Service Tax</span>
              <span className="font-mono">₦0 (Included)</span>
            </div>
            <div className="flex justify-between text-sm font-black text-white print:text-black pt-3 border-t border-[#1e2738] print:border-gray-300">
              <span className="uppercase tracking-wider">Total Paid</span>
              <span className="font-mono text-[#f20d0d] print:text-black text-base">
                ₦{Number(order.totalAmount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Official Security Watermark Footer */}
        <div className="pt-8 border-t border-[#1e2738] print:border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 print:text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#f20d0d] print:text-black" />
            <span className="font-bold tracking-wider uppercase text-[10px]">
              Officially Authenticated & Issued by Sharers Gym Lagos
            </span>
          </div>
          <p className="text-[10px] font-mono">Generated electronically • Valid without signature</p>
        </div>
      </div>

      {/* Script to trigger window.print on print-btn click */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              var btn = document.getElementById('print-btn');
              if (btn) {
                btn.addEventListener('click', function() { window.print(); });
              }
            });
          `,
        }}
      />
    </div>
  )
}
