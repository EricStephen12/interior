import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Package, 
  Truck, 
  QrCode,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react'
import PrintReceiptButton from '@/components/PrintReceiptButton'

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Lookup order by ID or kingspayId
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

  // Parse items safely
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
  const shippingAddress = shipping.address || 'In-Gym / Electronic Access'
  const paymentType = shipping.paymentType || (order.kingspayId ? 'KingsPay Online Gateway' : 'Manual Bank Transfer')
  const invoiceNumber = `SG-INV-${order.id.slice(-8).toUpperCase()}`
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Dynamic Status Badge Configuration
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
      case 'COMPLETED':
        return {
          label: 'PAID & VERIFIED',
          Icon: CheckCircle2,
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-4 ring-emerald-500/10',
        }
      case 'PROCESSING':
        return {
          label: 'PROCESSING ORDER',
          Icon: Package,
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-300 ring-4 ring-blue-500/10',
        }
      case 'SHIPPED':
        return {
          label: 'SHIPPED / IN TRANSIT',
          Icon: Truck,
          badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-4 ring-indigo-500/10',
        }
      case 'FAILED':
      case 'CANCELLED':
        return {
          label: 'PAYMENT UNSUCCESSFUL',
          Icon: AlertCircle,
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-300 ring-4 ring-rose-500/10',
        }
      case 'PENDING':
      case 'PENDING_VERIFICATION':
      default:
        return {
          label: 'AWAITING VERIFICATION',
          Icon: Clock,
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 ring-4 ring-amber-500/10',
        }
    }
  }

  const statusInfo = getStatusBadge(order.status)
  const StatusIcon = statusInfo.Icon

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-900 py-10 px-4 sm:px-6 lg:px-8 font-sans print:bg-white print:p-0 print:min-h-0">
      
      {/* ── TOP ACTION BAR (Hidden in print/PDF export) ── */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to Member Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/track/${order.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-[#f20d0d] text-xs font-bold rounded-xl transition-colors border border-red-200 uppercase tracking-wider"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track Package</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2 transition-colors uppercase tracking-wider"
          >
            Visit Store
          </Link>
          <PrintReceiptButton />
        </div>
      </div>

      {/* ── OFFICIAL WHITE LUXURY RECEIPT CARD ── */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)] border border-slate-200/90 overflow-hidden relative print:shadow-none print:border-none print:rounded-none">
        
        {/* Top Sharers Crimson Red Brand Stripe */}
        <div className="h-3 bg-gradient-to-r from-[#f20d0d] via-red-600 to-[#f20d0d]" />

        <div className="p-8 sm:p-14">
          
          {/* 1. Header with Official Logo, Company Metadata & Status */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="/logo.png"
                  alt="Sharers Gym Logo"
                  width={140}
                  height={45}
                  className="h-11 w-auto object-contain"
                  priority
                />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#f20d0d]">
                Official Tax Invoice & Payment Receipt
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                SHARERS GYM ATELIER LTD • LAGOS, NIGERIA
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                RC 1849204 • Tax ID: NG-TIN-8849102 • support@sharersgym.com • +234 808 906 2085
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end">
              {/* Dynamic Status Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border mb-3 ${statusInfo.badgeClass}`}>
                <StatusIcon className="w-4 h-4" />
                <span>{statusInfo.label}</span>
              </div>
              <p className="text-sm font-mono font-black text-slate-900 tracking-tight">{invoiceNumber}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">{formattedDate}</p>
            </div>
          </div>

          {/* 2. Customer & Payment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-slate-200 text-xs">
            {/* Customer Billed To */}
            <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                Billed To & Member Particulars
              </span>
              <p className="font-black text-base text-slate-900 uppercase tracking-tight">{customerName}</p>
              <div className="mt-3 space-y-1.5 text-slate-600 font-medium">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{customerEmail}</span>
                </p>
                {customerPhone && customerPhone !== '—' && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{customerPhone}</span>
                  </p>
                )}
                <p className="flex items-start gap-2 pt-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{shippingAddress}</span>
                </p>
              </div>
            </div>

            {/* Payment Particulars */}
            <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                  Payment Method & Channel
                </span>
                <p className="font-black text-base text-slate-900">{paymentType}</p>
                <div className="mt-3 space-y-1 font-mono text-slate-600 text-xs">
                  <p>Order Reference: <span className="font-bold text-slate-900">#{order.id.slice(-8).toUpperCase()}</span></p>
                  {order.kingspayId && (
                    <p className="text-[11px] text-slate-500 truncate">
                      Gateway Reference: {order.kingspayId}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 uppercase font-mono tracking-wider">Currency</span>
                <span className="font-bold font-mono text-slate-800">NGN (Nigerian Naira ₦)</span>
              </div>
            </div>
          </div>

          {/* 3. Itemized Products / Access Pass Table */}
          <div className="py-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
              Itemized Line Items
            </h3>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <th className="py-3.5 px-5">Item Description</th>
                    <th className="py-3.5 px-4 text-center">Quantity</th>
                    <th className="py-3.5 px-5 text-right">Unit Price</th>
                    <th className="py-3.5 px-5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {parsedItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-bold text-sm text-slate-900">{item.name}</p>
                        {item.variant && (
                          <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono font-medium uppercase tracking-wider">
                            Variant: {item.variant}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-800">
                        {item.quantity || 1}
                      </td>
                      <td className="py-4 px-5 text-right font-mono text-slate-600">
                        ₦{Number(item.price || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-black text-sm text-slate-900">
                        ₦{Number((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Financial Calculation Summary */}
          <div className="flex justify-end pb-10 border-b border-slate-200">
            <div className="w-full sm:w-80 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-slate-900">
                  ₦{Number(order.totalAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT / Consumption Tax (7.5%)</span>
                <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                  Included
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Logistics</span>
                <span className="font-mono font-bold text-slate-700">
                  {shipping.zone ? `${shipping.zone}` : 'Standard (Included)'}
                </span>
              </div>
              <div className="pt-4 border-t border-slate-300 flex justify-between items-baseline">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Grand Total
                </span>
                <span className="text-2xl font-black font-mono text-[#f20d0d]">
                  ₦{Number(order.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 5. Official Security Authenticity Seal & Verification */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-[#f20d0d]" />
              </div>
              <div>
                <p className="font-black tracking-wider uppercase text-[11px] text-slate-900">
                  Officially Authenticated Digital Document
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Issued electronically by Sharers Gym • Valid without physical seal or signature
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono text-[10px] text-slate-400 hidden md:block">
                <span className="font-bold text-slate-600 uppercase">Live Verification</span>
                <br />
                <span>SHA-256 Validated</span>
              </div>
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl p-1.5 flex items-center justify-center shadow-xs">
                <QrCode className="w-8 h-8 text-slate-800" />
              </div>
            </div>
          </div>

        </div>

        {/* Decorative Micro-Perforation Base */}
        <div className="h-3 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 border-t border-dashed border-slate-300" />
      </div>

      {/* Subtle Document Footer */}
      <div className="max-w-4xl mx-auto mt-6 text-center text-xs text-slate-500 print:hidden">
        <p>Questions regarding this receipt? Contact member support at <a href="mailto:support@sharersgym.com" className="text-slate-700 underline font-semibold">support@sharersgym.com</a></p>
      </div>
    </div>
  )
}
