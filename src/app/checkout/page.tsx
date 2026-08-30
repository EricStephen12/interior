'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ShoppingBag, CreditCard, MessageCircle, MapPin, CheckCircle2, Shield, Truck, Building2, Copy, Check, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useMembership } from '@/lib/membership-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomization } from '@/lib/customization-context';
import Link from 'next/link';

function CheckoutContent() {
  const { get } = useCustomization();
  const checkoutBadge = get('section.checkout.badge', 'Order Details');
  const checkoutTitle1 = get('section.checkout.title1', 'Secure');
  const checkoutTitle2 = get('section.checkout.title2', 'Checkout.');
  const checkoutStep1Title = get('section.checkout.step1Title', 'Delivery Address');
  const checkoutStep2Title = get('section.checkout.step2Title', 'Payment Method');
  const checkoutDeliveryMethodTitle = get('section.checkout.deliveryMethodTitle', 'Delivery & Dispatch Method');
  const checkoutDeliveryMethodSubtitle = get('section.checkout.deliveryMethodSubtitle', 'Select your preferred courier service level.');
  const checkoutDeliveryNote = get('section.checkout.deliveryNote', 'All orders dispatched with express tracking within 24 hours.');
  const checkoutSummaryTitle = get('section.checkout.summaryTitle', 'Order Summary');
  const checkoutPayBtn = get('section.checkout.payBtn', 'SECURE TRANSACTION');

  const { state, clearCart } = useCart();
  const searchParams = useSearchParams();
  const isCreditTopup = searchParams.get('type') === 'credits';
  const creditUnit = searchParams.get('unit') || 'days';
  const creditPack = isCreditTopup ? {
    amount: parseInt(searchParams.get('amount') || '0'),
    unit: creditUnit,
    price: parseFloat(searchParams.get('price') || '0'),
    label: searchParams.get('label') || 'ACCESS PASS'
  } : null;

  const { subscribe } = useMembership();
  const { user } = useUser();
  const router = useRouter();
  const [deliveryZones, setDeliveryZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'kingspay' | 'espees' | 'manual_transfer'>('kingspay');
  const [transferReference, setTransferReference] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [manualOrderSuccess, setManualOrderSuccess] = useState<any>(null);

  const [paymentConfig, setPaymentConfig] = useState<any>({
    kingspayEnabled: true,
    manualEnabled: true,
    espeesExchangeRate: 2050,
    manualBank: {
      bankName: 'Zenith Bank',
      accountName: 'SHARERS GYM ATELIER LTD',
      accountNumber: '1223456789',
      instructions: 'Please transfer the exact order amount. Use your Full Name or Phone Number as the payment reference.',
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  // Load public payment gateways & bank account
  useEffect(() => {
    fetch('/api/payment-methods')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setPaymentConfig(data);
          if (!data.kingspayEnabled && data.manualEnabled) {
            setPaymentMethod('manual_transfer');
          }
        }
      })
      .catch(() => {});
  }, []);

  // Poll for status checks in the background (for KingsPay)
  useEffect(() => {
    if (!isVerifying || !pendingOrderId) return;

    let intervalId: any;

    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(`/api/checkout/status?orderId=${pendingOrderId}`);
        const data = await res.json();
        if (data.success && data.status === 'COMPLETED') {
          clearInterval(intervalId);
          clearCart();
          router.push('/dashboard?payment=success');
        } else if (data.success && data.status === 'FAILED') {
          clearInterval(intervalId);
          setIsVerifying(false);
          setPendingOrderId(null);
          setError(data.message || 'Payment was cancelled or failed.');
        }
      } catch (err) {
        console.error('Error polling order status:', err);
      }
    };

    intervalId = setInterval(checkPaymentStatus, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isVerifying, pendingOrderId, clearCart, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        phone: user.primaryPhoneNumber?.phoneNumber || ''
      }));
    }
  }, [user]);

  const [promoCode, setPromoCode] = useState('');
  const [activePromo, setActivePromo] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);

  useEffect(() => {
    fetch('/api/delivery')
      .then(res => res.json())
      .then(data => {
        if (data.locations && data.locations.length > 0) {
          const zones = data.locations.map((loc: any) => ({
            id: loc.id,
            name: loc.name,
            price: loc.basePrice
          }));
          setDeliveryZones(zones);
          setSelectedZone(zones[0]);
        }
      })
      .catch(() => {});
  }, []);

  const cartTotal = isCreditTopup 
    ? (creditPack?.price || 0)
    : state.items.reduce((total, item) => {
        const variant = item.variant as any;
        const itemPrice = variant?.promo_price || variant?.promoPrice || variant?.price || 0;
        return total + (itemPrice * item.quantity);
      }, 0);

  const discountAmount = activePromo ? (
    activePromo.discountType === 'PERCENTAGE'
      ? (cartTotal * activePromo.discountValue) / 100
      : activePromo.discountValue
  ) : 0;

  const total = Math.max(0, cartTotal - discountAmount) + (!isCreditTopup ? (selectedZone?.price || 0) : 0);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) return;
    setApplyingPromo(true);
    setPromoError('');
    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode })
      });
      const data = await res.json();
      if (data.success) {
        setActivePromo(data);
      } else {
        setPromoError(data.error || 'Invalid code');
      }
    } catch {
      setPromoError('Validation failed');
    } finally {
      setApplyingPromo(false);
    }
  };

  const copyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    const hasMembership = state.items.some(
      item => item.product?.category === 'Memberships'
        || item.product?.name?.toLowerCase().includes('membership')
    );

    // If KingsPay, pre-open a blank window to avoid popup blocker
    let newWindow: Window | null = null;
    if (paymentMethod !== 'manual_transfer') {
      newWindow = typeof window !== 'undefined' ? window.open('about:blank', '_blank') : null;
    }

    try {
      const res = await fetch('/api/checkout/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.primaryEmailAddress?.emailAddress || formData.email,
          phone: formData.phone,
          totalAmount: total,
          items: isCreditTopup 
            ? [{ name: `${creditPack?.amount} ${creditPack?.unit === 'hours' ? (creditPack?.amount === 1 ? 'Hour' : 'Hours') : (creditPack?.amount === 1 ? 'Day' : 'Days')} (${creditPack?.label})`, quantity: 1, price: creditPack?.price }]
            : state.items.map(i => ({ name: i.product?.name, quantity: i.quantity, price: i.variant?.price })),
          hasMembership: hasMembership || isCreditTopup,
          creditAmount: isCreditTopup ? (creditPack?.amount || 0) : (hasMembership ? 30 : 0),
          name: formData.name,
          paymentMethod: paymentMethod,
          shippingAddress: !isCreditTopup ? formData.address : undefined,
          deliveryZone: !isCreditTopup ? selectedZone?.name : undefined,
          transferReference: paymentMethod === 'manual_transfer' ? transferReference : undefined,
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (newWindow) newWindow.close();
        throw new Error(data.details ? `${data.error} Details: ${data.details}` : (data.error || 'Failed to initialize order'));
      }

      // Branch 1: Manual Bank Transfer Success
      if (data.manualTransfer) {
        clearCart();
        setManualOrderSuccess({
          orderId: data.orderId,
          totalAmount: total,
          bank: paymentConfig?.manualBank,
          customerName: formData.name,
          transferRef: transferReference
        });
        setIsProcessing(false);
        return;
      }

      // Branch 2: KingsPay Gateway
      if (newWindow) {
        newWindow.location.href = data.redirectUrl;
      }

      setPendingOrderId(data.orderId);
      setIsVerifying(true);
    } catch (err: any) {
      console.error('Payment initialization failed:', err);
      if (newWindow) newWindow.close();
      setError(err.message || 'Payment initialization failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentError = searchParams.get('error');

  return (
    <div className="pt-24 sm:pt-40 pb-24 bg-secondary/20 min-h-screen selection:bg-accent/20">
      
      {/* ── MANUAL BANK TRANSFER SUCCESS RECEIPT MODAL ── */}
      <AnimatePresence>
        {manualOrderSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-primary/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white max-w-lg w-full rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-primary/10 my-8"
            >
              <div className="flex items-center gap-3 text-emerald-600">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-primary">Transfer Order Placed</h3>
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Order Ref: {manualOrderSuccess.orderId.slice(0, 8)}</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-amber-800">
                  <Clock className="w-4 h-4 shrink-0" />
                  Awaiting Bank Transfer Confirmation
                </p>
                <p className="text-[11px] opacity-90">
                  Please transfer the exact amount of <strong>₦{manualOrderSuccess.totalAmount.toLocaleString()}</strong> to the official account below. Our team will verify and dispatch your items immediately.
                </p>
              </div>

              {/* Official Bank Account Details */}
              <div className="p-5 bg-secondary/30 rounded-xl border border-primary/10 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted uppercase font-bold text-[10px]">Bank Name</span>
                  <span className="font-black text-primary uppercase">{manualOrderSuccess.bank?.bankName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted uppercase font-bold text-[10px]">Account Name</span>
                  <span className="font-bold text-primary uppercase">{manualOrderSuccess.bank?.accountName}</span>
                </div>
                <div className="pt-2 border-t border-primary/5 flex justify-between items-center">
                  <div>
                    <span className="text-text-muted uppercase font-bold text-[10px] block">Account Number</span>
                    <span className="font-mono text-lg font-black text-primary">{manualOrderSuccess.bank?.accountNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyAccount(manualOrderSuccess.bank?.accountNumber)}
                    className="px-3 py-1.5 bg-white border border-primary/10 rounded text-xs font-bold text-primary hover:text-accent flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedAccount ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {manualOrderSuccess.transferRef && (
                <div className="text-[11px] text-text-muted">
                  <strong>Your Reference Note:</strong> {manualOrderSuccess.transferRef}
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/dashboard"
                  className="flex-1 py-3.5 bg-primary hover:bg-accent text-white text-xs font-black uppercase tracking-wider rounded text-center transition-colors shadow-md"
                >
                  Go To Member Portal
                </Link>
                <Link
                  href="/products"
                  className="py-3.5 px-6 bg-secondary hover:bg-secondary/80 text-primary text-xs font-bold uppercase tracking-wider rounded text-center transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KINGSPAY LIVE VERIFYING MODAL */}
      <AnimatePresence>
        {(isProcessing || isVerifying) && !manualOrderSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/95 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="max-w-xs space-y-6 flex flex-col items-center"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full border-[3px] border-accent/20 border-t-accent animate-spin" />
                <Shield className="w-5 h-5 text-accent animate-pulse" />
              </div>
              
              {isProcessing ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-white tracking-widest uppercase">Connecting</h3>
                  <p className="text-[8px] font-black text-accent uppercase tracking-[0.3em] animate-pulse">Initializing Order...</p>
                </div>
              ) : (
                <div className="space-y-6 w-full">
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-white tracking-tight uppercase">Awaiting Confirmation</h3>
                    <p className="text-[8px] font-black text-accent uppercase tracking-[0.3em] animate-pulse">Verifying payment...</p>
                  </div>
                  
                  <div className="pt-2 flex flex-col items-center w-full">
                    <button
                      type="button"
                      onClick={() => {
                        setIsVerifying(false);
                        setPendingOrderId(null);
                      }}
                      className="text-[9px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors py-2 px-6 border border-white/10 hover:border-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">{checkoutBadge}</span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl text-luxury text-primary font-heading uppercase">{checkoutTitle1} <span className="text-accent italic lowercase">{checkoutTitle2}</span></h1>
        </div>

        {(error || paymentError) && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500 text-red-500 text-xs font-black uppercase tracking-[0.2em] text-center rounded">
            {error || (paymentError === 'payment_failed' ? 'Payment was cancelled or failed.' : 'Payment verification failed.')}
          </div>
        )}

        <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 sm:gap-20">

          <div className="space-y-16">
            {/* Delivery Information - Only show if NOT a credit topup */}
            {!isCreditTopup && (
            <div className="bg-white rounded-xl p-8 sm:p-16 border border-primary/5 editorial-shadow space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-primary rounded flex items-center justify-center text-white shadow-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-primary tracking-tight uppercase font-heading">{checkoutStep1Title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-0 py-4 bg-transparent border-b border-primary/10 focus:outline-none focus:border-accent transition-colors font-medium"
                    placeholder="Legal Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    className="w-full px-0 py-4 bg-transparent border-b border-primary/10 focus:outline-none focus:border-accent transition-colors font-medium tabular-nums"
                    placeholder="+234..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Shipping Address</label>
                <textarea
                  required
                  rows={2}
                  className="w-full px-0 py-4 bg-transparent border-b border-primary/10 focus:outline-none focus:border-accent transition-colors font-medium resize-none leading-relaxed"
                  placeholder="Street, Suite, City..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-primary/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-[11px] font-black text-primary uppercase tracking-widest block">
                      {checkoutDeliveryMethodTitle}
                    </label>
                    <p className="text-xs text-text-muted mt-0.5">{checkoutDeliveryMethodSubtitle}</p>
                  </div>
                  {deliveryZones.length > 0 && (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-secondary/80 text-primary px-2.5 py-1 rounded border border-primary/10 w-fit">
                      {deliveryZones.length} Zones Available
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {deliveryZones.map(zone => {
                    const isSelected = selectedZone?.id === zone.id;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => setSelectedZone(zone)}
                        className={`p-5 text-left rounded transition-all relative flex flex-col justify-between gap-4 border ${
                          isSelected
                            ? 'border-accent bg-accent/5 shadow-md ring-1 ring-accent/30'
                            : 'border-primary/10 bg-secondary/10 hover:border-primary/30 hover:bg-secondary/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-accent text-white' : 'bg-secondary text-primary'
                            }`}>
                              <Truck className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-black uppercase tracking-wider text-xs text-primary leading-tight">{zone.name}</p>
                              <p className="text-[10px] text-text-muted mt-0.5">Express Dispatch</p>
                            </div>
                          </div>

                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? 'border-accent bg-accent text-white' : 'border-primary/30 bg-transparent'
                          }`}>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-primary/5 flex items-baseline justify-between">
                          <span className="text-[9px] font-black uppercase tracking-wider text-text-muted">Courier Rate</span>
                          <span className={`text-base font-black tabular-nums ${isSelected ? 'text-accent' : 'text-primary'}`}>
                            ₦{zone.price.toLocaleString()}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  {deliveryZones.length === 0 && (
                    <div className="col-span-full py-10 bg-secondary/10 border border-dashed border-primary/15 text-center rounded">
                      <Truck className="w-6 h-6 mx-auto text-text-muted/40 mb-2" />
                      <p className="text-xs font-bold text-text-muted">No delivery zones configured yet</p>
                    </div>
                  )}
                </div>

                {checkoutDeliveryNote && (
                  <p className="text-[10px] text-text-muted/70 italic flex items-center gap-1.5 pt-1">
                    <Shield className="w-3 h-3 text-accent shrink-0" />
                    {checkoutDeliveryNote}
                  </p>
                )}
              </div>
            </div>
            )}

            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl p-8 sm:p-16 border border-primary/5 editorial-shadow space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-primary rounded flex items-center justify-center text-white shadow-xl">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-primary tracking-tight uppercase font-heading">{checkoutStep2Title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentConfig?.kingspayEnabled && (
                  <PaymentOption
                    active={paymentMethod === 'kingspay'}
                    onClick={() => setPaymentMethod('kingspay')}
                    icon={CreditCard}
                    title="KingsPay Card"
                    description="Pay securely using Debit Card / KingsPay."
                  />
                )}

                {paymentConfig?.kingspayEnabled && (
                  <PaymentOption
                    active={paymentMethod === 'espees'}
                    onClick={() => setPaymentMethod('espees')}
                    icon={CreditCard}
                    title="Espees Token"
                    description={`Pay via Espees (Rate: ₦${paymentConfig?.espeesExchangeRate || 2050}/ESP).`}
                  />
                )}

                {paymentConfig?.manualEnabled && (
                  <PaymentOption
                    active={paymentMethod === 'manual_transfer'}
                    onClick={() => setPaymentMethod('manual_transfer')}
                    icon={Building2}
                    title="Bank Transfer"
                    description="Direct Bank Wire / Mobile Transfer."
                  />
                )}
              </div>

              {/* ── MANUAL BANK DETAILS CARD (WHEN SELECTED) ── */}
              {paymentMethod === 'manual_transfer' && paymentConfig?.manualBank && (
                <div className="p-6 bg-secondary/30 rounded-2xl border border-accent/20 space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-accent font-black text-xs uppercase tracking-widest">
                      <Building2 className="w-4 h-4" /> Official Atelier Account
                    </div>
                    <span className="text-[10px] font-bold text-text-muted uppercase">Verified Bank</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block">Bank Name</span>
                      <span className="text-sm font-black text-primary uppercase">{paymentConfig.manualBank.bankName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block">Account Name</span>
                      <span className="text-sm font-black text-primary uppercase">{paymentConfig.manualBank.accountName}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-primary/10 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-wider block">NUBAN Account Number</span>
                      <span className="text-xl font-mono font-black text-primary tracking-widest">{paymentConfig.manualBank.accountNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyAccount(paymentConfig.manualBank.accountNumber)}
                      className="px-4 py-2 bg-secondary hover:bg-primary hover:text-white rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedAccount ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider block">
                      Sender Name / Transfer Reference (Optional)
                    </label>
                    <input
                      type="text"
                      value={transferReference}
                      onChange={e => setTransferReference(e.target.value)}
                      placeholder="e.g. Paid from John Doe (GTBank)"
                      className="w-full p-3.5 bg-white border border-primary/10 rounded text-xs font-medium text-primary focus:outline-none focus:border-accent"
                    />
                    <p className="text-[10px] text-text-muted">
                      {paymentConfig.manualBank.instructions}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="space-y-12">
            {/* Order Summary */}
            <div className="bg-primary text-white rounded-2xl p-8 sm:p-12 shadow-[0_50px_100px_rgba(0,0,0,0.3)] lg:sticky lg:top-32 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

              <h2 className="text-3xl text-luxury mb-12 flex items-center gap-4 relative z-10 font-heading">
                <ShoppingBag className="w-8 h-8 text-accent" />
                {checkoutSummaryTitle}
              </h2>

              <div className="space-y-8 mb-12 max-h-[400px] overflow-auto pr-4 custom-scrollbar relative z-10">
                {isCreditTopup ? (
                    <div className="flex justify-between items-start gap-6 pb-6 border-b border-white/5">
                      <div className="flex-1">
                        <p className="font-bold text-sm tracking-tight mb-2">SHARERS GYM ACCESS PASS</p>
                        <p className="text-accent text-[10px] font-black uppercase tracking-widest leading-none opacity-80">
                          {creditPack?.amount} {creditPack?.unit === 'hours' ? (creditPack?.amount === 1 ? 'HOUR' : 'HOURS') : (creditPack?.amount === 1 ? 'DAY' : 'DAYS')} • {creditPack?.label}
                        </p>
                      </div>
                      <p className="font-light tabular-nums text-lg font-mono">₦{creditPack?.price.toLocaleString()}</p>
                    </div>
                ) : state.items.length > 0 ? state.items.map((item, idx) => {
                  const variant = item.variant as any;
                  const itemPrice = variant?.promo_price || variant?.promoPrice || variant?.price || 0;
                  return (
                    <div key={idx} className="flex justify-between items-start gap-6 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-bold text-sm tracking-tight mb-2 uppercase">{item.product?.name}</p>
                        <p className="text-accent text-[10px] font-black uppercase tracking-widest leading-none opacity-80">
                          {item.variant?.size?.name} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-light tabular-nums text-lg font-mono">₦{(itemPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  );
                }) : (
                  <p className="text-slate-500 text-sm italic">Your cart is empty.</p>
                )}
              </div>

              <div className="space-y-6 pt-10 border-t border-white/10 relative z-10">
                <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-light text-white text-lg font-mono">₦{cartTotal.toLocaleString()}</span>
                </div>
                {activePromo && (
                  <div className="flex justify-between text-green-400 text-xs font-black uppercase tracking-widest">
                    <span>Discount ({activePromo.code})</span>
                    <span className="tabular-nums font-light text-green-400 text-lg font-mono">-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {!isCreditTopup && (
                    <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest leading-tight">
                        <span className="max-w-[150px]">Shipping ({selectedZone?.name || '...'})</span>
                        <span className="tabular-nums font-light text-white text-lg font-mono">₦{selectedZone?.price?.toLocaleString() || 0}</span>
                    </div>
                )}
                <div className="flex justify-between text-3xl font-light pt-8 border-t border-white/5">
                  <span className="uppercase tracking-tighter font-heading">Total</span>
                  <span className="text-accent tabular-nums font-mono font-bold">₦{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              {!isCreditTopup && !activePromo && (
                <div className="mt-8 relative z-10 px-2">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="PROMO CODE"
                      className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-accent transition-colors rounded"
                    />
                    <button 
                      type="button"
                      onClick={applyPromoCode}
                      disabled={applyingPromo || !promoCode}
                      className="bg-accent text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all disabled:opacity-30 rounded"
                      style={{ borderRadius: 'var(--radius-brand-none, 0px)' }}
                    >
                      {applyingPromo ? '...' : 'APPLY'}
                    </button>
                  </div>
                  {promoError && <p className="text-red-400 text-[8px] font-black uppercase mt-2 tracking-widest">{promoError}</p>}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || (!isCreditTopup && state.items.length === 0)}
                className="w-full mt-12 group relative h-20 bg-white text-primary overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                style={{ borderRadius: 'var(--radius-brand-none, 0px)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative z-10 flex items-center justify-center gap-4">
                  {isProcessing && (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                  <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                    {isProcessing 
                      ? 'RECORDING TRANSACTION...' 
                      : paymentMethod === 'manual_transfer'
                      ? `PLACE TRANSFER ORDER • ₦${total.toLocaleString()}`
                      : `${checkoutPayBtn} • ₦${total.toLocaleString()}`}
                  </span>
                </div>
              </button>

              <div className="text-center mt-8 relative z-10">
                <p className="text-[10px] text-accent font-black uppercase tracking-[0.5em] opacity-40">
                  SHARERS GYM • AUTHENTICATED
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function PaymentOption({ icon: Icon, title, description, active, onClick, color, disabled }: { icon: React.ElementType, title: string, description: string, active: boolean, onClick: () => void, color?: string, disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-6 rounded-xl border text-left transition-all relative ${active ? 'border-primary bg-primary text-white shadow-lg' : 'border-primary/10 bg-white hover:border-accent'} ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
      style={{ borderRadius: 'var(--radius-brand-none, 0px)' }}
    >
      <div className={`mb-4 w-10 h-10 rounded flex items-center justify-center border border-white/10 ${active ? 'bg-secondary/20 text-white' : 'bg-secondary text-primary'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h4 className={`font-black uppercase tracking-widest text-[10px] mb-2 ${active ? 'text-white' : 'text-primary'}`}>{title}</h4>
      <p className={`text-xs font-light leading-relaxed ${active ? 'text-white/60' : 'text-text-muted'}`}>{description}</p>
      {active && (
        <div className="absolute top-6 right-6 text-accent">
          <CheckCircle2 className="w-5 h-5 fill-accent text-white" />
        </div>
      )}
    </button>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
