import prisma from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  AlertCircle, 
  FileText, 
  ArrowLeft, 
  Phone, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  Star,
  Search
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface TrackPageProps {
  params: Promise<{ id: string }>
}

export default async function TrackPackagePage({ params }: TrackPageProps) {
  const { id } = await params

  // Lookup order by primary ID or kingspayId
  let order = await prisma.order.findUnique({
    where: { id },
  })

  if (!order) {
    order = await prisma.order.findFirst({
      where: { kingspayId: id } as any,
    })
  }

  // Not Found State with interactive search box
  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5 text-amber-600">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            Package Not Found
          </h1>
          <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
            We couldn't find a package matching <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-800">{id}</code>. Please verify your Order Reference ID or KingsPay Reference.
          </p>

          <form action="/track" method="GET" className="space-y-3">
            <input
              type="text"
              name="id"
              placeholder="e.g. clr8... or SG-INV..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f20d0d]"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#f20d0d] hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-colors shadow-md"
            >
              Track Order
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-900 font-bold">
              ← Return to Store
            </Link>
            <a href="mailto:support@sharersgym.com" className="hover:text-[#f20d0d]">
              Need Help?
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Parse items safely
  let parsedItems: Array<{ productId?: string; id?: string; name: string; quantity: number; price: number; variant?: string; size?: string; images?: string[] }> = []
  if (Array.isArray(order.items)) {
    parsedItems = order.items as any
  } else if (typeof order.items === 'string') {
    try {
      const parsed = JSON.parse(order.items)
      parsedItems = Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      parsedItems = [{ name: 'Gym Apparel / Equipment', quantity: 1, price: order.totalAmount }]
    }
  }

  const shipping = (order.shippingDetails as any) || {}
  const customerName = shipping.name || 'Valued Athlete'
  const customerPhone = shipping.phone || '—'
  const shippingAddress = shipping.address || 'In-Gym Locker / Local Atelier Pickup'
  const trackingNote = shipping.trackingNote || ''
  const status = (order.status || 'PENDING').toUpperCase()

  // Timeline Step Calculations
  // Step 1: Order Confirmed
  // Step 2: Atelier Quality Inspection & Packing
  // Step 3: Dispatched with Courier / In Transit
  // Step 4: Delivered
  let currentStepIndex = 0
  if (['PAID', 'PROCESSING'].includes(status)) {
    currentStepIndex = 1 // Step 2 active
  } else if (status === 'SHIPPED') {
    currentStepIndex = 2 // Step 3 active
  } else if (['DELIVERED', 'COMPLETED'].includes(status)) {
    currentStepIndex = 3 // Step 4 completed
  }

  const isCancelled = status === 'CANCELLED' || status === 'FAILED'

  const steps = [
    {
      title: 'Order Confirmed',
      desc: 'Payment received & inventory allocated in system.',
      icon: CheckCircle2,
    },
    {
      title: 'Atelier Inspection & Packing',
      desc: 'Items hand-inspected, labeled, and sealed in official Sharers Gym packaging.',
      icon: Package,
    },
    {
      title: 'Dispatched / In Transit',
      desc: trackingNote ? `Courier: ${trackingNote}` : 'Handed over to express dispatch rider.',
      icon: Truck,
    },
    {
      title: 'Delivered',
      desc: 'Package received at your designated delivery address.',
      icon: MapPin,
    },
  ]

  const firstProductId = parsedItems[0]?.productId || parsedItems[0]?.id

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Link & Quick Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/receipt/${order.id}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200 shadow-xs uppercase tracking-wider"
            >
              <FileText className="w-3.5 h-3.5 text-[#f20d0d]" />
              <span>Official Receipt</span>
            </Link>
          </div>
        </div>

        {/* ── MAIN TRACKING CARD ── */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          
          {/* Top Crimson Accent Header */}
          <div className="h-2.5 bg-gradient-to-r from-[#f20d0d] via-red-600 to-[#f20d0d]" />

          <div className="p-6 sm:p-10">
            {/* Order Overview Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#f20d0d]">
                    Live Package Tracking
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight font-heading">
                  {status === 'DELIVERED' || status === 'COMPLETED'
                    ? 'Package Delivered'
                    : status === 'SHIPPED'
                    ? 'Package In Transit'
                    : status === 'PROCESSING' || status === 'PAID'
                    ? 'Preparing For Dispatch'
                    : isCancelled
                    ? 'Order Cancelled'
                    : 'Order Placed'}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Status Pill */}
              <div className="sm:text-right">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                  status === 'DELIVERED' || status === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : status === 'SHIPPED'
                    ? 'bg-sky-50 text-sky-700 border-sky-300'
                    : isCancelled
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : 'bg-amber-50 text-amber-700 border-amber-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    status === 'DELIVERED' || status === 'COMPLETED'
                      ? 'bg-emerald-500'
                      : status === 'SHIPPED'
                      ? 'bg-sky-500 animate-pulse'
                      : isCancelled
                      ? 'bg-rose-500'
                      : 'bg-amber-500 animate-pulse'
                  }`} />
                  {status}
                </span>
                <p className="text-[10px] text-slate-400 font-mono mt-1.5">
                  Est. Delivery: {status === 'DELIVERED' ? 'Fulfilled' : '24-48 Business Hours'}
                </p>
              </div>
            </div>

            {/* Cancelled Notice Banner */}
            {isCancelled && (
              <div className="my-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold uppercase tracking-wider">This Order Has Been Cancelled</p>
                  <p className="text-rose-700 mt-0.5">
                    If payment was settled or you need assistance re-ordering, contact our member concierge team at <a href="mailto:support@sharersgym.com" className="underline font-bold">support@sharersgym.com</a>.
                  </p>
                </div>
              </div>
            )}

            {/* ── 4-STEP VISUAL PROGRESS TIMELINE ── */}
            {!isCancelled && (
              <div className="py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  {steps.map((step, idx) => {
                    const isDone = idx < currentStepIndex || currentStepIndex === 3
                    const isCurrent = idx === currentStepIndex && currentStepIndex !== 3
                    const isUpcoming = idx > currentStepIndex
                    const StepIcon = step.icon

                    return (
                      <div key={idx} className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3 group">
                        
                        {/* Connecting Line between steps on Desktop */}
                        {idx < steps.length - 1 && (
                          <div 
                            className={`hidden md:block absolute top-5 left-[50%] w-full h-1 -z-0 transition-all ${
                              idx < currentStepIndex ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                          />
                        )}

                        {/* Step Icon Circle */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all relative z-10 ${
                          isDone 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                            : isCurrent
                            ? 'bg-[#f20d0d] border-[#f20d0d] text-white shadow-lg ring-4 ring-red-500/20'
                            : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}>
                          <StepIcon className="w-5 h-5" />
                        </div>

                        {/* Step Text Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-black uppercase tracking-wider ${
                            isDone ? 'text-slate-900' : isCurrent ? 'text-[#f20d0d]' : 'text-slate-400'
                          }`}>
                            {step.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Courier Tracking Note Alert */}
            {trackingNote && (
              <div className="mb-8 p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-3">
                <Truck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold uppercase tracking-wider text-sky-900">Courier Dispatch Note</p>
                  <p className="text-sky-800 mt-0.5 font-medium">{trackingNote}</p>
                </div>
              </div>
            )}

            {/* Post-Delivery Verified Review Prompt */}
            {(status === 'DELIVERED' || status === 'COMPLETED') && firstProductId && (
              <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Star className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-900">
                      How is your equipment performing?
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Share an authentic athlete review to help others select their gear.
                    </p>
                  </div>
                </div>
                <Link
                  href={`/products/${firstProductId}#reviews-section`}
                  className="px-4 py-2 bg-[#f20d0d] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0 shadow-xs"
                >
                  Leave a Review ⭐
                </Link>
              </div>
            )}

            {/* ── DESTINATION & COURIER DETAILS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              
              {/* Delivery Address Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 text-[#f20d0d]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Delivery Destination
                  </span>
                </div>
                <p className="text-sm font-black text-slate-900">{customerName}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{shippingAddress}</p>
                <p className="text-xs font-mono text-slate-500">Phone: {customerPhone}</p>
              </div>

              {/* Service Level & Atelier Guarantee */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Atelier Dispatch Protocol
                  </span>
                </div>
                <p className="text-sm font-black text-slate-900">Sharers Gym Logistics</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All equipment is packaged with shock-resistant protection and serialized before courier pickup.
                </p>
                <p className="text-xs text-slate-500">
                  Need priority rerouting? Contact <a href="mailto:support@sharersgym.com" className="text-[#f20d0d] underline font-bold">concierge</a>.
                </p>
              </div>
            </div>

            {/* ── PACKAGE CONTENTS PREVIEW ── */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">
                Package Contents ({parsedItems.reduce((s, i) => s + (i.quantity || 1), 0)} items)
              </h3>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {parsedItems.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                        {item.variant || item.size || 'Standard Edition'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-500 mr-3">
                        Qty: {item.quantity || 1}
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        ₦{Number(item.price * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center text-xs font-bold text-slate-500 px-2">
                <span>Total Order Value</span>
                <span className="text-sm font-black text-slate-900">
                  ₦{Number(order.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>Official Tracking ID: <code className="font-mono text-slate-800">{order.id}</code></span>
            <div className="flex items-center gap-4">
              <a href="mailto:support@sharersgym.com" className="hover:text-slate-900 flex items-center gap-1 font-semibold">
                <Mail className="w-3.5 h-3.5 text-[#f20d0d]" />
                Concierge Support
              </a>
              <Link href={`/receipt/${order.id}`} className="hover:text-slate-900 flex items-center gap-1 font-semibold">
                <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                View Receipt
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
