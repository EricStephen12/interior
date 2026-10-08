import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  AlertCircle, 
  Package, 
  Truck,
  Printer
} from 'lucide-react'
import PrintReceiptButton from '@/components/PrintReceiptButton'

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let order = await prisma.order.findUnique({ where: { id } })
  if (!order) {
    order = await prisma.order.findFirst({ where: { kingspayId: id } as any })
  }
  if (!order) notFound()

  // Fetch store settings for official contact information
  const settingsRows = await prisma.storeSetting.findMany({
    where: {
      key: {
        in: [
          'section.footer.email',
          'section.footer.phone',
          'section.footer.address',
          'contact.email',
          'contact.phone',
          'theme.company_name',
        ],
      },
    },
  })

  const settingsMap: Record<string, string> = {}
  for (const s of settingsRows) {
    settingsMap[s.key] = s.value
  }

  const storeEmail =
    settingsMap['section.footer.email'] ||
    settingsMap['contact.email'] ||
    process.env.CONTACT_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    'sharersmall@gmail.com'

  const storePhone =
    settingsMap['section.footer.phone'] ||
    settingsMap['contact.phone'] ||
    process.env.CONTACT_PHONE ||
    process.env.NEXT_PUBLIC_CONTACT_PHONE ||
    '+234 808 906 2085'

  const storeAddress =
    settingsMap['section.footer.address'] ||
    'Lagos, Nigeria'

  const storeCompanyName =
    settingsMap['theme.company_name'] ||
    'Sharers Gym'

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

  // Retrieve user & fitness profile if available to enrich customer details
  const [userRecord, fitnessRecord] = await Promise.all([
    order.userEmail ? prisma.user.findUnique({ where: { email: order.userEmail } }).catch(() => null) : null,
    order.userEmail ? (prisma as any).fitnessProfile?.findFirst({ where: { userEmail: order.userEmail } }).catch(() => null) : null,
  ])

  const shipping = (order.shippingDetails as any) || {}
  const customerEmail = order.userEmail || userRecord?.email || shipping.email || 'N/A'
  const customerName =
    shipping.name && shipping.name !== 'Valued Member' && shipping.name !== 'Guest Member'
      ? shipping.name
      : userRecord?.name || fitnessRecord?.userName || (customerEmail !== 'N/A' ? customerEmail.split('@')[0] : 'Valued Member')
  const customerPhone =
    shipping.phone ||
    shipping.phoneNumber ||
    shipping.contactPhone ||
    shipping.tel ||
    (order as any).phone ||
    userRecord?.phone ||
    fitnessRecord?.phone ||
    null
  const shippingAddress = shipping.address && shipping.address !== 'N/A' ? shipping.address : null
  const paymentType = shipping.paymentType || (order.kingspayId ? 'KingsPay Online' : 'Bank Transfer')
  const invoiceNumber = `SG-${order.id.slice(-8).toUpperCase()}`
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const getStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
      case 'COMPLETED':
        return { label: 'PAID', Icon: CheckCircle2, color: 'text-emerald-600' }
      case 'PROCESSING':
        return { label: 'PROCESSING', Icon: Package, color: 'text-blue-600' }
      case 'SHIPPED':
        return { label: 'SHIPPED', Icon: Truck, color: 'text-indigo-600' }
      case 'FAILED':
      case 'CANCELLED':
        return { label: 'CANCELLED', Icon: AlertCircle, color: 'text-red-600' }
      default:
        return { label: 'PENDING', Icon: Clock, color: 'text-amber-600' }
    }
  }

  const statusInfo = getStatus(order.status)
  const StatusIcon = statusInfo.Icon
  const subtotal = parsedItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0) || order.totalAmount

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:bg-white print:p-0 print:min-h-0">

      {/* Action Bar — hidden in print */}
      <div className="max-w-lg mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/track/${order.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Truck className="w-3.5 h-3.5" />
            Track
          </Link>
          <PrintReceiptButton />
        </div>
      </div>

      {/* Receipt Document */}
      <div className="max-w-lg mx-auto bg-white shadow-sm border border-slate-200 print:shadow-none print:border-none">

        {/* Red top stripe */}
        <div className="h-1 bg-[#f20d0d]" />

        <div className="px-8 py-8 print:px-6 print:py-6">

          {/* Header */}
          <div className="text-center mb-6 pb-6 border-b border-dashed border-slate-300">
            <div className="flex justify-center mb-3">
              <Image
                src="/logo.png"
                alt="Sharers Gym"
                width={120}
                height={38}
                className="h-9 w-auto object-contain"
                priority
              />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              {storeCompanyName}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {storeAddress} • {storeEmail}
            </p>
            {storePhone && (
              <p className="text-[10px] text-slate-400">
                {storePhone}
              </p>
            )}
          </div>

          {/* Invoice Info */}
          <div className="mb-5 flex justify-between items-start text-[11px]">
            <div>
              <p className="text-slate-400 uppercase tracking-wider text-[9px] font-bold mb-0.5">Receipt No.</p>
              <p className="font-mono font-bold text-slate-800">{invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 uppercase tracking-wider text-[9px] font-bold mb-0.5">Date</p>
              <p className="font-mono text-slate-700">{formattedDate}</p>
              <p className="font-mono text-slate-500 text-[10px]">{formattedTime}</p>
            </div>
          </div>

          {/* Status */}
          <div className="mb-5 flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
            <span className={`text-xs font-black uppercase tracking-wider ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Customer */}
          <div className="mb-5 pb-5 border-b border-dashed border-slate-200 text-[11px] space-y-1">
            <p className="text-slate-400 uppercase tracking-wider text-[9px] font-bold mb-1.5">Billed To</p>
            <p className="font-bold text-slate-800">{customerName}</p>
            <p className="text-slate-500">{customerEmail}</p>
            {customerPhone && <p className="text-slate-500">{customerPhone}</p>}
            {shippingAddress && <p className="text-slate-500">{shippingAddress}</p>}
          </div>

          {/* Payment */}
          <div className="mb-5 pb-5 border-b border-dashed border-slate-200 text-[11px] space-y-1">
            <p className="text-slate-400 uppercase tracking-wider text-[9px] font-bold mb-1.5">Payment</p>
            <p className="text-slate-700">{paymentType}</p>
            <p className="font-mono text-slate-500 text-[10px]">Ref: #{order.id.slice(-8).toUpperCase()}</p>
            {order.kingspayId && (
              <p className="font-mono text-slate-400 text-[10px] truncate">GW: {order.kingspayId.slice(0, 20)}…</p>
            )}
          </div>

          {/* Items */}
          <div className="mb-5 pb-5 border-b border-dashed border-slate-200">
            <p className="text-slate-400 uppercase tracking-wider text-[9px] font-bold mb-3">Items</p>
            <div className="space-y-2.5">
              {parsedItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-3 text-[11px]">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 leading-snug">{item.name}</p>
                    {item.variant && (
                      <p className="text-[10px] text-slate-400">{item.variant}</p>
                    )}
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity || 1}</p>
                  </div>
                  <p className="font-mono font-bold text-slate-800 whitespace-nowrap">
                    ₦{Number((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="mb-5 pb-5 border-b border-dashed border-slate-300 space-y-2 text-[11px]">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono">₦{Number(subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>VAT (7.5% — incl.)</span>
              <span className="text-emerald-600 font-semibold">Included</span>
            </div>
            {shipping.zone && (
              <div className="flex justify-between text-slate-500">
                <span>Delivery</span>
                <span className="font-mono">{shipping.zone}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-slate-200">
              <span className="font-black uppercase tracking-wider text-slate-900 text-xs">Total</span>
              <span className="font-mono font-black text-[#f20d0d] text-base">
                ₦{Number(order.totalAmount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[10px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-500">Thank you for your purchase.</p>
            <p>This is an official electronic receipt.</p>
            <p>Valid without physical seal or signature.</p>
            <div className="mt-3 pt-3 border-t border-dashed border-slate-200">
              <p className="font-mono text-[9px] text-slate-300 select-all break-all">
                {invoiceNumber} • {order.id}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom stripe */}
        <div className="h-1 bg-[#f20d0d]" />
      </div>

      {/* Below-receipt links — hidden in print */}
      <div className="max-w-lg mx-auto mt-4 text-center text-[11px] text-slate-500 print:hidden">
        Questions? <a href={`mailto:${storeEmail}`} className="underline font-semibold text-slate-700">{storeEmail}</a>
        {storePhone && (
          <span className="ml-2 text-slate-400">• <a href={`tel:${storePhone.replace(/\s+/g, '')}`} className="underline font-semibold text-slate-700">{storePhone}</a></span>
        )}
      </div>
    </div>
  )
}
