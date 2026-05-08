'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ShoppingBag, CreditCard, MessageCircle, MapPin, CheckCircle2, Shield } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useMembership } from '@/lib/membership-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Script from 'next/script';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

function CheckoutContent() {
  const { state, clearCart } = useCart();
  const searchParams = useSearchParams();
  const isCreditTopup = searchParams.get('type') === 'credits';
  const creditPack = isCreditTopup ? {
    amount: parseInt(searchParams.get('amount') || '0'),
    price: parseFloat(searchParams.get('price') || '0'),
    label: searchParams.get('label') || 'TOPUP'
  } : null;

  const { subscribe } = useMembership();
  const { user } = useUser();
  const router = useRouter();
  const [deliveryZones, setDeliveryZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

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
    : state.items.reduce((acc, item) => {
        // Handle both promo_price (Supabase style) and promoPrice (Prisma style)
        const variant = item.variant as any;
        const price = variant?.promo_price || variant?.promoPrice || variant?.price || 0;
        return acc + (price * item.quantity);
      }, 0);
      
  const discountAmount = activePromo ? (cartTotal * (activePromo.discount / 100)) : 0;
  const total = isCreditTopup ? cartTotal : Math.max(0, (cartTotal + (selectedZone?.price || 0) - discountAmount));

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

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasMembership = state.items.some(
      item => item.product?.category === 'Memberships'
        || item.product?.name?.toLowerCase().includes('membership')
    );

    if (isCreditTopup) {
      subscribe(creditPack?.amount || 0);
    } else if (hasMembership) {
      subscribe(30); // Standard membership is 30 credits
    }

    if (isCreditTopup) {
      // Logic handled after successful payment
    }

    const paystack = new window.PaystackPop();
    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder', 
      email: user?.primaryEmailAddress?.emailAddress || formData.email,
      amount: Math.round(total * 100), // Paystack works in kobo
      currency: 'NGN',
      channels: ['bank_transfer'],
      metadata: {
        creditAmount: isCreditTopup ? (creditPack?.amount || 0) : (hasMembership ? 30 : 0),
        hasMembership: hasMembership || isCreditTopup,
        items: isCreditTopup 
          ? [{ name: `${creditPack?.amount} Credits (${creditPack?.label})`, quantity: 1, price: creditPack?.price }]
          : state.items.map(i => ({ name: i.product?.name, quantity: i.quantity, price: i.variant?.price })),
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: formData.name
          }
        ]
      },
      onSuccess: async (transaction: any) => {
        // Record order in DB
        try {
          await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userEmail: user?.primaryEmailAddress?.emailAddress || formData.email,
              phone: formData.phone,
              totalAmount: total,
              items: isCreditTopup 
                ? [{ name: `${creditPack?.amount} Credits (${creditPack?.label})`, quantity: 1, price: creditPack?.price }]
                : state.items.map(i => ({ name: i.product?.name, quantity: i.quantity, price: i.variant?.price })),
              hasMembership: hasMembership || isCreditTopup,
              creditAmount: isCreditTopup ? (creditPack?.amount || 0) : (hasMembership ? 30 : 0),
              promoUsed: activePromo?.code || null,
              paystackRef: transaction.reference
            })
          });

          if (isCreditTopup) {
            subscribe(creditPack?.amount || 0);
          } else if (hasMembership) {
            subscribe(30);
          }

          clearCart();
          router.push('/dashboard?payment=success');
        } catch (err) {
          console.error('Failed to record order', err);
          router.push('/dashboard?payment=manual_review');
        }
      },
      onCancel: () => {
        alert('Payment cancelled. Please try again to secure your gear.');
      }
    });
  };

  return (
    <div className="pt-24 sm:pt-40 pb-24 bg-secondary/20 min-h-screen selection:bg-accent/20">
      <Script src="https://js.paystack.co/v2/inline.js" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Order Details</span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl text-luxury text-primary">Secure <span className="text-accent italic">Checkout.</span></h1>
        </div>

        <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 sm:gap-20">

          <div className="space-y-16">
            {/* Delivery Information - Only show if NOT a credit topup */}
            {!isCreditTopup && (
            <div className="bg-white rounded-none p-8 sm:p-16 border border-primary/5 editorial-shadow space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-primary rounded-none flex items-center justify-center text-white shadow-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-primary tracking-tight uppercase">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-medium"
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
                    className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-medium tabular-nums"
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
                  className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-medium resize-none leading-relaxed"
                  placeholder="Street, Suite, City..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Delivery Method</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deliveryZones.map(zone => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZone(zone)}
                      className={`p-8 rounded-none border-2 text-left transition-all duration-500 relative overflow-hidden group
                        ${selectedZone?.id === zone.id
                          ? 'border-primary bg-primary text-white shadow-2xl'
                          : 'border-secondary bg-secondary/20 text-primary hover:border-accent/40'}`}
                    >
                      <p className="font-black uppercase tracking-widest text-[10px] mb-3">{zone.name}</p>
                      <p className={`text-xl font-light tabular-nums ${selectedZone?.id === zone.id ? 'text-accent' : 'text-primary'}`}>
                        ₦{zone.price.toLocaleString()}
                      </p>
                    </button>
                  ))}
                  {deliveryZones.length === 0 && (
                    <div className="col-span-full py-12 bg-secondary/10 border border-dashed border-primary/10 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No delivery methods available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-none p-8 sm:p-16 border border-primary/5 editorial-shadow space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-primary rounded-none flex items-center justify-center text-white shadow-xl">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-primary tracking-tight uppercase">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PaymentOption
                  active={paymentMethod === 'bank_transfer'}
                  onClick={() => setPaymentMethod('bank_transfer')}
                  icon={CreditCard}
                  title="Direct Bank Transfer"
                  description="Secure transfer via Paystack Titan virtual account."
                />
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* Order Summary */}
            <div className="bg-primary text-white rounded-none p-8 sm:p-12 shadow-[0_50px_100px_rgba(0,0,0,0.3)] lg:sticky lg:top-32 relative overflow-hidden">
              {/* Subtle texture overlay */}
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

              <h2 className="text-3xl text-luxury mb-12 flex items-center gap-4 relative z-10">
                <ShoppingBag className="w-8 h-8 text-accent" />
                The Essence List
              </h2>

              <div className="space-y-8 mb-12 max-h-[400px] overflow-auto pr-4 custom-scrollbar relative z-10">
                {isCreditTopup ? (
                    <div className="flex justify-between items-start gap-6 pb-6 border-b border-white/5">
                      <div className="flex-1">
                        <p className="font-bold text-sm tracking-tight mb-2">SHARERS CREDIT TOP-UP</p>
                        <p className="text-accent text-[10px] font-black uppercase tracking-widest leading-none opacity-80">
                          {creditPack?.amount} CREDITS • {creditPack?.label}
                        </p>
                      </div>
                      <p className="font-light tabular-nums text-lg">₦{creditPack?.price.toLocaleString()}</p>
                    </div>
                ) : state.items.length > 0 ? state.items.map((item, idx) => {
                  const variant = item.variant as any;
                  const itemPrice = variant?.promo_price || variant?.promoPrice || variant?.price || 0
                  return (
                    <div key={idx} className="flex justify-between items-start gap-6 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-bold text-sm tracking-tight mb-2">{item.product?.name}</p>
                        <p className="text-accent text-[10px] font-black uppercase tracking-widest leading-none opacity-80">
                          {item.variant?.size?.name} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-light tabular-nums text-lg">₦{(itemPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  )
                }) : (
                  <p className="text-slate-500 text-sm italic">The list is currently void.</p>
                )}
              </div>

              <div className="space-y-6 pt-10 border-t border-white/10 relative z-10">
                <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-light text-white text-lg">₦{cartTotal.toLocaleString()}</span>
                </div>
                {activePromo && (
                  <div className="flex justify-between text-green-400 text-xs font-black uppercase tracking-widest">
                    <span>Discount ({activePromo.code})</span>
                    <span className="tabular-nums font-light text-green-400 text-lg">-₦{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                {!isCreditTopup && (
                    <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest leading-tight">
                        <span className="max-w-[150px]">Shipping ({selectedZone?.name || '...'})</span>
                        <span className="tabular-nums font-light text-white text-lg">₦{selectedZone?.price?.toLocaleString() || 0}</span>
                    </div>
                )}
                <div className="flex justify-between text-3xl font-light pt-8 border-t border-white/5">
                  <span className="uppercase tracking-tighter">Total</span>
                  <span className="text-accent tabular-nums underline decoration-accent/20 decoration-8 underline-offset-[-2px]">₦{total.toLocaleString()}</span>
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
                      className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-accent transition-colors"
                    />
                    <button 
                      type="button"
                      onClick={applyPromoCode}
                      disabled={applyingPromo || !promoCode}
                      className="bg-accent text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all disabled:opacity-30"
                    >
                      {applyingPromo ? '...' : 'APPLY'}
                    </button>
                  </div>
                  {promoError && <p className="text-red-400 text-[8px] font-black uppercase mt-2 tracking-widest">{promoError}</p>}
                </div>
              )}

              <button
                type="submit"
                disabled={!isCreditTopup && state.items.length === 0}
                className="w-full mt-12 btn-primary !bg-white !text-primary hover:!bg-accent hover:!text-white disabled:opacity-20 py-7 relative z-10"
              >
                <MessageCircle className="w-5 h-5" />
                COMPLETE ORDER
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
      className={`p-6 rounded-none border text-left transition-all relative ${active ? 'border-primary bg-primary text-white' : 'border-primary/10 bg-white hover:border-accent'} ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
    >
      <div className={`mb-4 w-10 h-10 rounded-none flex items-center justify-center border border-white/10 ${active ? 'bg-secondary/20 text-white' : 'bg-secondary text-primary'}`}>
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
