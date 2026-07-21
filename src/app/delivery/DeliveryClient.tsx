'use client'

import { motion } from 'framer-motion'
import { TruckIcon, ClockIcon, ShieldCheckIcon, PhoneIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function DeliveryClient() {
  return (
    <div className="pt-24 min-h-screen bg-secondary/20 selection:bg-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">SHIPPING & DELIVERY</span>
          <h1 className="text-6xl md:text-8xl text-luxury text-primary mb-8">
            Getting Your <span className="text-accent italic">Gear.</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
            We ship our apparel, nutrition, and training gear nationwide. Every order is packed carefully and sent fast so you can get back to training.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
          {/* Delivery Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-12"
          >
            {/* Delivery Options */}
            <div className="bg-white p-10 sm:p-16 rounded-none border border-primary/5 editorial-shadow">
              <div className="flex items-center mb-10">
                <TruckIcon className="h-10 w-10 text-accent mr-6" />
                <h2 className="text-3xl font-bold text-primary tracking-tight uppercase">
                  Shipping Options
                </h2>
              </div>

              <div className="space-y-10">
                <div className="flex items-start space-x-6">
                  <CheckCircleIcon className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-3 tracking-widest">Standard Shipping</h3>
                    <p className="text-text-muted font-medium text-sm leading-relaxed">Complimentary on orders over ₦50,000. Delivered to your doorstep within 3-5 business days nationwide.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <CheckCircleIcon className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-3 tracking-widest">Express Delivery</h3>
                    <p className="text-text-muted font-medium text-sm leading-relaxed">₦5,000 flat rate. Next-day delivery for Lagos orders placed before 12 PM.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <CheckCircleIcon className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-3 tracking-widest">In-Gym Pickup</h3>
                    <p className="text-text-muted font-medium text-sm leading-relaxed">Free. Pick up your order directly at The Arena in Lagos. Ready within 2 hours of purchase.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Areas */}
            <div className="bg-white p-10 sm:p-16 rounded-none border border-primary/5 editorial-shadow">
              <div className="flex items-center mb-10">
                <MapPinIcon className="h-10 w-10 text-accent mr-6" />
                <h2 className="text-3xl font-bold text-primary tracking-tight uppercase">
                  Coverage
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <CheckCircleIcon className="h-5 w-5 text-accent" />
                  <span className="text-primary font-medium tracking-tight">Lagos & Environs (Same day / Next day)</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircleIcon className="h-5 w-5 text-accent" />
                  <span className="text-primary font-medium tracking-tight">Rest of Nigeria (3-5 business days)</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircleIcon className="h-5 w-5 text-accent" />
                  <span className="text-primary font-medium tracking-tight">West Africa Shipping (3-5 business days)</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delivery Process & Policies */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-12"
          >
            {/* Delivery Process */}
            <div className="bg-white p-10 sm:p-16 rounded-none border border-primary/5 editorial-shadow">
              <div className="flex items-center mb-10">
                <ClockIcon className="h-10 w-10 text-accent mr-6" />
                <h2 className="text-3xl font-bold text-primary tracking-tight uppercase">
                  How It Works
                </h2>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="bg-secondary text-primary rounded-none border border-primary/5 w-10 h-10 flex items-center justify-center font-black text-xs shadow-sm">
                    01
                  </div>
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-2 tracking-widest">Order Processing</h3>
                    <p className="text-text-muted text-sm leading-relaxed">Once your order is confirmed, our team picks and packs your gear from our inventory.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-secondary text-primary rounded-none border border-primary/5 w-10 h-10 flex items-center justify-center font-black text-xs shadow-sm">
                    02
                  </div>
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-2 tracking-widest">Quality Check</h3>
                    <p className="text-text-muted text-sm leading-relaxed">We inspect every piece of apparel and check every seal to make sure it's correct.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-secondary text-primary rounded-none border border-primary/5 w-10 h-10 flex items-center justify-center font-black text-xs shadow-sm">
                    03
                  </div>
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-2 tracking-widest">Secure Packaging</h3>
                    <p className="text-text-muted text-sm leading-relaxed">Everything is packed securely in tamper-evident packaging so it arrives in perfect shape.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-secondary text-primary rounded-none border border-primary/5 w-10 h-10 flex items-center justify-center font-black text-xs shadow-sm">
                    04
                  </div>
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-2 tracking-widest">Fast Dispatch</h3>
                    <p className="text-text-muted text-sm leading-relaxed">We hand over to our trusted courier partners and send you a tracking link right away.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Information */}
            <div className="bg-primary p-10 text-white rounded-none shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="flex items-center mb-10 relative z-10">
                <PhoneIcon className="h-10 w-10 text-accent mr-6" />
                <h2 className="text-3xl font-bold uppercase tracking-tight">
                  Need Help?
                </h2>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <PhoneIcon className="h-5 w-5 text-accent" />
                  <a href="tel:+2348089062085" className="text-white/80 font-medium tracking-wide hover:text-accent transition-colors">+234 808 906 2085</a>
                </div>
                <div className="flex items-center space-x-4">
                  <ShieldCheckIcon className="h-5 w-5 text-accent" />
                  <span className="text-white/80 font-medium tracking-wide">sharersmall@gmail.com</span>
                </div>
              </div>

              <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-none relative z-10">
                <p className="text-[11px] text-accent font-black uppercase tracking-[0.2em] mb-2 leading-none">Important Note</p>
                <p className="text-xs text-white/60 leading-relaxed font-light italic">
                  For bulk orders or gym equipment delivery, contact us directly so we can coordinate setup and dropoff.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-24 sm:mt-32"
        >
          <div className="bg-white p-10 sm:p-20 rounded-none border border-primary/5 editorial-shadow">
            <h2 className="text-4xl text-luxury text-primary mb-16 text-center">
              Delivery <span className="text-accent italic">Questions.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <h3 className="font-bold text-primary uppercase text-sm mb-4 tracking-[0.2em]">Can I track my order?</h3>
                <p className="text-text-muted text-sm leading-relaxed">Yes. As soon as your order is dispatched, you'll receive a tracking number via email or SMS.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary uppercase text-sm mb-4 tracking-[0.2em]">Do you ship outside Lagos?</h3>
                <p className="text-text-muted text-sm leading-relaxed">Yes, we ship to all states across Nigeria, as well as select international locations.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary uppercase text-sm mb-4 tracking-[0.2em]">Can I change my delivery address?</h3>
                <p className="text-text-muted text-sm leading-relaxed">You can update your address if you contact us before the package leaves our warehouse (usually within 2 hours of ordering).</p>
              </div>

              <div>
                <h3 className="font-bold text-primary uppercase text-sm mb-4 tracking-[0.2em]">What if my apparel doesn't fit?</h3>
                <p className="text-text-muted text-sm leading-relaxed">No worries. We offer free exchanges within 7 days for unworn apparel with tags still on.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
