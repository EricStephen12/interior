'use client'

import { motion } from 'framer-motion'
import { TruckIcon, ClockIcon, ShieldCheckIcon, PhoneIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function DeliveryPage() {
  return (
    <div className="pt-16 min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif font-bold text-amber-900 mb-6">
            Delivery & Shipping
          </h1>
          <p className="text-xl text-amber-800 max-w-3xl mx-auto">
            We ensure your luxury furniture arrives safely and on time.
            Our professional delivery team handles everything with care.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Delivery Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Delivery Options */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <TruckIcon className="h-8 w-8 text-amber-600 mr-3" />
                <h2 className="text-2xl font-serif font-semibold text-amber-900">
                  Delivery Options
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Standard Delivery</h3>
                    <p className="text-amber-700">Free delivery on orders over $1,000. Estimated 7-14 business days.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Express Delivery</h3>
                    <p className="text-amber-700">$150 fee. Estimated 3-7 business days for most items.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">White Glove Delivery</h3>
                    <p className="text-amber-700">$250 fee. Includes assembly, placement, and debris removal.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Areas */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <MapPinIcon className="h-8 w-8 text-amber-600 mr-3" />
                <h2 className="text-2xl font-serif font-semibold text-amber-900">
                  Shipping Areas
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="text-amber-700">Continental United States</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="text-amber-700">Canada (additional fees may apply)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-amber-600" />
                  <span className="text-amber-700">International shipping available upon request</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delivery Process & Policies */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Delivery Process */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <ClockIcon className="h-8 w-8 text-amber-600 mr-3" />
                <h2 className="text-2xl font-serif font-semibold text-amber-900">
                  Delivery Process
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Order Processing</h3>
                    <p className="text-amber-700 text-sm">We verify your order and prepare it for shipment within 1-2 business days.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Quality Check</h3>
                    <p className="text-amber-700 text-sm">Every item undergoes final inspection before packaging.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Secure Packaging</h3>
                    <p className="text-amber-700 text-sm">Professional packaging to ensure safe transit of your luxury items.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Delivery & Setup</h3>
                    <p className="text-amber-700 text-sm">Professional delivery team handles transportation and placement.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <PhoneIcon className="h-8 w-8 text-amber-600 mr-3" />
                <h2 className="text-2xl font-serif font-semibold text-amber-900">
                  Need Help?
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-amber-600" />
                  <span className="text-amber-700">Call us: +1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-5 w-5 text-amber-600" />
                  <span className="text-amber-700">Email: delivery@interiors.com</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Note:</span> For large furniture items, we recommend scheduling delivery during business hours when someone can be present to receive and inspect the items.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-serif font-semibold text-amber-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Do you offer assembly services?</h3>
                <p className="text-amber-700 text-sm">Yes! Our White Glove delivery service includes professional assembly and placement of your furniture items.</p>
              </div>

              <div>
                <h3 className="font-semibold text-amber-900 mb-2">What if my item arrives damaged?</h3>
                <p className="text-amber-700 text-sm">We offer a 30-day return policy and will replace any damaged items at no additional cost to you.</p>
              </div>

              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Can I change my delivery date?</h3>
                <p className="text-amber-700 text-sm">Yes, you can reschedule your delivery up to 48 hours before the scheduled date by contacting our customer service.</p>
              </div>

              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Do you deliver to apartments?</h3>
                <p className="text-amber-700 text-sm">Absolutely! We deliver to all residential locations including apartments, condos, and high-rise buildings.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

