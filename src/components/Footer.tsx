'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-amber-100 border-t border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-serif font-semibold mb-4 text-amber-900">HEAD OFFICE</h3>
              <div className="space-y-3 text-amber-800">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">123 Design Street</p>
                    <p>Furniture City, FC 12345</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-amber-600" />
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-amber-600" />
                  <p>hello@furnilux.com</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-serif font-semibold mb-2 text-amber-900">LAST UPDATES</h4>
              <p className="text-amber-700 text-sm">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="text-xl font-serif font-semibold text-amber-900">
              SIGN UP FOR SALE, NEW ARRIVALS & MORE
            </h4>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg border border-amber-200 bg-white text-amber-900 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="privacy"
                  className="rounded border-amber-300 bg-white text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="privacy" className="text-sm text-amber-800">
                  I agree to the privacy policy
                </label>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-amber-200 mt-12 pt-8 text-center"
        >
          <p className="text-amber-700 text-sm">
            Copyright © interiors {currentYear}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
