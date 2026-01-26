'use client';

import React, { useState } from 'react';
import { ShoppingBag, CreditCard, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

const DELIVERY_ZONES = [
  { id: 'intl', name: 'Global Vault Delivery (Express)', price: 150 },
  { id: 'domestic', name: 'Premium Domestic Logistics', price: 45 },
  { id: 'pickup', name: 'Private Lab Pickup', price: 0 }
];

export default function CheckoutPage() {
  const { state } = useCart();
  const [selectedZone, setSelectedZone] = useState(DELIVERY_ZONES[0]);
  const [paymentMethod, setPaymentMethod] = useState('whatsapp');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const cartTotal = state.items.reduce((acc, item) => {
    const price = item.variant?.promo_price || item.variant?.price || 0
    return acc + (price * item.quantity)
  }, 0);
  const total = cartTotal + selectedZone.price;

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const itemsList = state.items.map(i => `${i.product?.name} (${i.variant?.size?.name}) x${i.quantity}`).join(', ');
    const text = `EXRICX BEAUTY - Secure Vaulting Details:
Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.address}
Logistics: ${selectedZone.name}
Essence: ${itemsList}
Total Investment: $${total.toLocaleString()}
Protocol: ${paymentMethod === 'whatsapp' ? 'Concierge Confirmation' : 'Direct Encryption'}`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/2349033333333?text=${encodedText}`, '_blank');
  };

  return (
    <div className="pt-24 sm:pt-40 pb-24 bg-secondary/20 min-h-screen selection:bg-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Final Protocol</span>
          <h1 className="text-6xl md:text-8xl text-luxury text-primary">Secure <span className="text-accent italic">Vaulting.</span></h1>
        </div>

        <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-16 sm:gap-24">

          <div className="lg:col-span-2 space-y-16">
            {/* Delivery Information */}
            <div className="bg-white rounded-none p-8 sm:p-16 border border-primary/5 editorial-shadow space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-primary rounded-none flex items-center justify-center text-white shadow-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-primary tracking-tight uppercase">Logistics Destiny</h2>
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Vault Destination</label>
                <textarea
                  required
                  rows={2}
                  className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-medium resize-none leading-relaxed"
                  placeholder="Street, Suite, Country..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Transport Protocol</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {DELIVERY_ZONES.map(zone => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZone(zone)}
                      className={`p-8 rounded-none border-2 text-left transition-all duration-500 relative overflow-hidden group
                        ${selectedZone.id === zone.id
                          ? 'border-primary bg-primary text-white shadow-2xl'
                          : 'border-secondary bg-secondary/20 text-primary hover:border-accent/40'}`}
                    >
                      <p className="font-black uppercase tracking-widest text-[10px] mb-3">{zone.name}</p>
                      <p className={`text-xl font-light tabular-nums ${selectedZone.id === zone.id ? 'text-accent' : 'text-primary'}`}>
                        ${zone.price.toLocaleString()}
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
                <h2 className="text-3xl font-bold text-primary tracking-tight uppercase">Payment Encryption</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PaymentOption
                  active={paymentMethod === 'whatsapp'}
                  onClick={() => setPaymentMethod('whatsapp')}
                  icon={MessageCircle}
                  title="Concierge Confirmation"
                  description="Private authentication via secure WhatsApp link."
                />
                <PaymentOption
                  active={paymentMethod === 'online'}
                  onClick={() => setPaymentMethod('online')}
                  icon={CreditCard}
                  title="Vault Direct"
                  description="Direct encrypted laboratory processing (Scheduled)"
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
                      <p className="font-light tabular-nums text-lg">${(itemPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  )
                }) : (
                  <p className="text-slate-500 text-sm italic">The list is currently void.</p>
                )}
              </div>

              <div className="space-y-6 pt-10 border-t border-white/10 relative z-10">
                <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-light text-white text-lg">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest leading-tight">
                  <span className="max-w-[150px]">Logistics Protocol ({selectedZone.name})</span>
                  <span className="tabular-nums font-light text-white text-lg">${selectedZone.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-3xl font-light pt-8 border-t border-white/5">
                  <span className="uppercase tracking-tighter">Investment</span>
                  <span className="text-accent tabular-nums underline decoration-accent/20 decoration-8 underline-offset-[-2px]">${total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={state.items.length === 0}
                className="w-full mt-12 btn-primary !bg-white !text-primary hover:!bg-accent hover:!text-white disabled:opacity-20 py-7 relative z-10"
              >
                {paymentMethod === 'whatsapp' ? (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    INITIATE VAULTING PROTOCOL
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    EXECUTE ENCRYPTION
                  </>
                )}
              </button>

              <div className="text-center mt-8 relative z-10">
                <p className="text-[10px] text-accent font-black uppercase tracking-[0.5em] opacity-40">
                  EXRICX BEAUTY • AUTHENTICATED
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
      className={`p-6 rounded-3xl border-2 text-left transition-all relative ${active ? 'border-sky-600 bg-sky-50/50' : 'border-slate-50 bg-slate-50 hover:border-sky-200'} ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
    >
      <div className={`mb-4 w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm ${color || 'text-sky-600'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="font-bold text-blue-950 text-sm mb-2">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed font-medium">{description}</p>
      {active && (
        <div className="absolute top-6 right-6 text-sky-600">
          <CheckCircle2 className="w-5 h-5 fill-sky-600 text-white" />
        </div>
      )}
    </button>
  );
}
