'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, CreditCard, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useMembership } from '@/lib/membership-context';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const { subscribe } = useMembership();
  const router = useRouter();
  const [deliveryZones, setDeliveryZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('whatsapp');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

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
      .catch(console.error);
  }, []);

  const cartTotal = state.items.reduce((acc, item) => {
    const price = item.variant?.promo_price || item.variant?.price || 0
    return acc + (price * item.quantity)
  }, 0);
  const total = cartTotal + (selectedZone?.price || 0);

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if membership is in the cart
    const hasMembership = state.items.some(
      item => item.product?.category === 'Memberships' 
        || item.product?.name.toLowerCase().includes('membership')
    );

    if (hasMembership) {
      subscribe(30); // Add 30 days to Member Pass
    }

    try {
      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: formData.email || 'customer@sharers.gym',
          totalAmount: total,
          items: state.items.map(i => ({ name: i.product?.name, quantity: i.quantity, price: i.variant?.price })),
          hasMembership
        })
      });
    } catch (err) {
      console.error(err);
    }

    clearCart();
    router.push('/dashboard');
  };

  return (
    <div className="pt-24 sm:pt-40 pb-24 bg-secondary/20 min-h-screen selection:bg-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Order Details</span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl text-luxury text-primary">Secure <span className="text-accent italic">Checkout.</span></h1>
        </div>

        <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-16 sm:gap-24">

          <div className="lg:col-span-2 space-y-16">
            {/* Delivery Information */}
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">WhatsApp Channel</label>
                  <input
                    required
                    type="text"
                    className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-medium tabular-nums"
                    placeholder="+..."
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Transport Protocol</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div>
              </div>
            </div>

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
                  active={paymentMethod === 'whatsapp'}
                  onClick={() => setPaymentMethod('whatsapp')}
                  icon={MessageCircle}
                  title="WhatsApp Confirmation"
                  description="Confirm your order and pay via secure payment link."
                />
                <PaymentOption
                  active={paymentMethod === 'online'}
                  onClick={() => setPaymentMethod('online')}
                  icon={CreditCard}
                  title="Card Payment"
                  description="Direct secure card processing (Coming Soon)"
                  disabled={true}
                />
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* Order Summary */}
            <div className="bg-primary text-white rounded-none p-10 sm:p-14 shadow-[0_50px_100px_rgba(0,0,0,0.3)] lg:sticky lg:top-32 relative overflow-hidden">
              {/* Subtle texture overlay */}
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

              <h2 className="text-3xl text-luxury mb-12 flex items-center gap-4 relative z-10">
                <ShoppingBag className="w-8 h-8 text-accent" />
                The Essence List
              </h2>

              <div className="space-y-8 mb-12 max-h-[400px] overflow-auto pr-4 custom-scrollbar relative z-10">
                {state.items.length > 0 ? state.items.map((item, idx) => {
                  const itemPrice = item.variant?.promo_price || item.variant?.price || 0
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
                <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest leading-tight">
                  <span className="max-w-[150px]">Shipping ({selectedZone?.name || '...'})</span>
                  <span className="tabular-nums font-light text-white text-lg">₦{selectedZone?.price?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between text-3xl font-light pt-8 border-t border-white/5">
                  <span className="uppercase tracking-tighter">Total</span>
                  <span className="text-accent tabular-nums underline decoration-accent/20 decoration-8 underline-offset-[-2px]">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={state.items.length === 0}
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
