'use client'

import { motion } from 'framer-motion'
import { TruckIcon, ClockIcon, ShieldCheckIcon, PhoneIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function DeliveryPage() {
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
          <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Global Logistics</span>
          <h1 className="text-6xl md:text-8xl text-luxury text-primary mb-8">
            Secure <span className="text-accent italic">Transit.</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
            We ensure your investment arrives in pristine condition.
            Our white-glove logistics team manages every essence with laboratory precision.
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
                  Logistics Protocol
                </h2>
              </div>

              <div className="space-y-10">
                <div className="flex items-start space-x-6">
                  <CheckCircleIcon className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-3 tracking-widest">Global Express Vaulting</h3>
                    <p className="text-text-muted font-medium text-sm leading-relaxed">Complimentary on investments over $5,000. Estimated delivery within 7 business days worldwide.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <CheckCircleIcon className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-3 tracking-widest">Molecular Packaging</h3>
                    <p className="text-text-muted font-medium text-sm leading-relaxed">$50 flat fee. Includes temperature-controlled fragrance sealing and jewelry pressure-locking.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <CheckCircleIcon className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-3 tracking-widest">White-Glove Handover</h3>
                    <p className="text-text-muted font-medium text-sm leading-relaxed">$150 premium. Includes in-person authentication and personalized collection walkthrough.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Areas */}
            <div className="bg-white p-10 sm:p-16 rounded-none border border-primary/5 editorial-shadow">
              <div className="flex items-center mb-10">
                <MapPinIcon className="h-10 w-10 text-accent mr-6" />
                <h2 className="text-3xl font-bold text-primary tracking-tight uppercase">
                  The Network
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <CheckCircleIcon className="h-5 w-5 text-accent" />
                  <span className="text-primary font-medium tracking-tight">Mainland Europe & United Kingdom</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircleIcon className="h-5 w-5 text-accent" />
                  <span className="text-primary font-medium tracking-tight">Middle East & GCC Registry</span>
                </div>
                <div className="flex items-center space-x-4">
                  <CheckCircleIcon className="h-5 w-5 text-accent" />
                  <span className="text-primary font-medium tracking-tight">North America & Asia-Pacific Labs</span>
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
                  The Methodology
                </h2>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="bg-secondary text-primary rounded-none border border-primary/5 w-10 h-10 flex items-center justify-center font-black text-xs shadow-sm">
                    01
                  </div>
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-2 tracking-widest">Vault Allocation</h3>
                    <p className="text-text-muted text-sm leading-relaxed">Your piece is moved from our high-security inventory to the clean-room packing facility.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-secondary text-primary rounded-none border border-primary/5 w-10 h-10 flex items-center justify-center font-black text-xs shadow-sm">
                    02
                  </div>
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-2 tracking-widest">Lab Authentication</h3>
                    <p className="text-text-muted text-sm leading-relaxed">Final molecular and structural verification by our resident gemologists and perfumers.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-secondary text-primary rounded-none border border-primary/5 w-10 h-10 flex items-center justify-center font-black text-xs shadow-sm">
                    03
                  </div>
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-2 tracking-widest">Encrypted Seal</h3>
                    <p className="text-text-muted text-sm leading-relaxed">Atmospheric sealing for fragrances and tamper-evident locking for jewelry boxes.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-secondary text-primary rounded-none border border-primary/5 w-10 h-10 flex items-center justify-center font-black text-xs shadow-sm">
                    04
                  </div>
                  <div>
                    <h3 className="font-bold text-primary uppercase text-sm mb-2 tracking-widest">Concierge Dispatch</h3>
                    <p className="text-text-muted text-sm leading-relaxed">Courier collection on a secure, private logistics channel for immediate tracking.</p>
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
                  Concierge Live
                </h2>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <PhoneIcon className="h-5 w-5 text-accent" />
                  <span className="text-white/80 font-medium tracking-wide">+44 (0) 20 SHARERS LUX</span>
                </div>
                <div className="flex items-center space-x-4">
                  <ShieldCheckIcon className="h-5 w-5 text-accent" />
                  <span className="text-white/80 font-medium tracking-wide">logistics@sharersgym.com</span>
                </div>
              </div>

              <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-none relative z-10">
                <p className="text-[11px] text-accent font-black uppercase tracking-[0.2em] mb-2 leading-none">Confidential Note</p>
                <p className="text-xs text-white/60 leading-relaxed font-light italic">
                  For high-value vault transfers exceeding $50k, we require a 24-hour verification window before dispatch protocol.
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
              Logistics <span className="text-accent italic">Inquiries.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <h3 className="font-bold text-primary uppercase text-sm mb-4 tracking-[0.2em]">Is the packaging discreet?</h3>
                <p className="text-text-muted text-sm leading-relaxed">Absolutely. All SHARERS piece shipments use unmarked security outer-casing to ensure privacy and protection.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary uppercase text-sm mb-4 tracking-[0.2em]">What about lab-to-lab handling?</h3>
                <p className="text-text-muted text-sm leading-relaxed">Fragrances are kept in temperature-optimized environments through the entire transit chain to preserve the essence profile.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary uppercase text-sm mb-4 tracking-[0.2em]">Can I redirect a dispatch?</h3>
                <p className="text-text-muted text-sm leading-relaxed">Due to security protocols, address redirection is only available within 2 laboratory hours of the initial order verification.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary uppercase text-sm mb-4 tracking-[0.2em]">Do you service private addresses?</h3>
                <p className="text-text-muted text-sm leading-relaxed">We deliver to all residential, corporate, and private lab destinations globally, including secure apartment complexes.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

