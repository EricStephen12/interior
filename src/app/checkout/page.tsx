'use client';

import React, { useState } from 'react';
import { ShoppingBag, CreditCard, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

const DELIVERY_ZONES = [
  { id: 'abuja', name: 'Abuja (Within City)', price: 5000 },
  { id: 'benin', name: 'Benin City', price: 7500 },
  { id: 'other', name: 'Other Locations (Request Quote)', price: 0 }
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
    const text = `New Order Details:
Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.address}
Zone: ${selectedZone.name}
Items: ${itemsList}
Total: ₦${total.toLocaleString()}
Payment: ${paymentMethod === 'whatsapp' ? 'Confirm via WhatsApp' : 'Online Payment'}`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/2349033333333?text=${encodedText}`, '_blank');
  };

  return (
    <div className="pt-24 sm:pt-32 pb-24 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight mb-12">Checkout</h1>

        <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Information */}
            <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-950 rounded-2xl flex items-center justify-center text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-blue-950">Delivery Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-sky-600 shadow-inner"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-sky-600 shadow-inner"
                    placeholder="e.g. 08012345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Delivery Address</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-sky-600 shadow-inner resize-none"
                  placeholder="Full street address, apartment, suite, etc."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Select Delivery Zone</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DELIVERY_ZONES.map(zone => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZone(zone)}
                      className={`p-6 rounded-3xl border-2 text-left transition-all ${selectedZone.id === zone.id ? 'border-sky-600 bg-sky-50/50' : 'border-slate-50 bg-slate-50 hover:border-sky-200'}`}
                    >
                      <p className="font-bold text-blue-950 text-sm mb-1">{zone.name}</p>
                      <p className="text-sky-600 font-black">₦{zone.price.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-sm border border-slate-100 space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-950 rounded-2xl flex items-center justify-center text-white">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-blue-950">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PaymentOption
                  active={paymentMethod === 'whatsapp'}
                  onClick={() => setPaymentMethod('whatsapp')}
                  icon={MessageCircle}
                  title="Pay & Confirm on WhatsApp"
                  description="Chat with our agent to confirm and finalize payment."
                  color="text-green-600"
                />
                <PaymentOption
                  active={paymentMethod === 'online'}
                  onClick={() => setPaymentMethod('online')}
                  icon={CreditCard}
                  title="Online Payment"
                  description="Pay securely via Paystack/Stripe (Coming Soon)"
                  disabled={true}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-blue-950 text-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 shadow-xl shadow-blue-100 lg:sticky lg:top-32">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-sky-400" />
                Order Summary
              </h2>

              <div className="space-y-6 mb-8 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                {state.items.length > 0 ? state.items.map((item, idx) => {
                  const itemPrice = item.variant?.promo_price || item.variant?.price || 0
                  return (
                    <div key={idx} className="flex justify-between items-start gap-4 pb-4 border-b border-blue-900 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-bold text-sm leading-tight mb-1">{item.product?.name}</p>
                        <p className="text-sky-400 text-[10px] font-black uppercase tracking-widest leading-none">
                          {item.variant?.size?.name} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-black">₦{(itemPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  )
                }) : (
                  <p className="text-sky-300 text-sm italic opacity-50">Your cart is empty.</p>
                )}
              </div>

              <div className="space-y-4 pt-8 border-t border-blue-900/50">
                <div className="flex justify-between text-slate-400 text-sm font-medium">
                  <span>Subtotal</span>
                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm font-medium">
                  <span>Delivery ({selectedZone.name})</span>
                  <span>₦{selectedZone.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-2xl font-black pt-4">
                  <span>Total</span>
                  <span className="text-sky-400">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={state.items.length === 0}
                className="w-full mt-10 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all transform active:scale-95 group"
              >
                {paymentMethod === 'whatsapp' ? (
                  <>
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    COMPLETE ON WHATSAPP
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    PAY SECURELY
                  </>
                )}
              </button>

              <p className="text-[10px] text-center mt-6 text-slate-500 uppercase tracking-[0.2em] font-black leading-relaxed">
                Authored by Smart Best Brands
              </p>
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
