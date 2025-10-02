'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function StorySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900">
              OUR STORY
            </h2>
               <p className="text-lg text-black leading-relaxed">
                 For over two decades, we&apos;ve been crafting furniture that tells a story.
                 Each piece in our collection is born from a passion for quality, comfort,
                 and timeless design that transcends trends. Our commitment to innovation
                 and quality has made us a trusted name in luxury furniture.
               </p>
               <p className="text-lg text-black leading-relaxed">
                 From our humble beginnings as a small workshop to becoming a trusted name
                 in luxury furniture, we&apos;ve never compromised on our commitment to excellence.
                 Every chair, table, and sofa is a testament to our dedication to creating
                 spaces that inspire and comfort.
               </p>
          </motion.div>

             {/* Interior Image */}
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="relative"
             >
               <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                 <img
                   src="/images/2230mm Modern White Velvet 3-Seater Sofa Channel Tufted Upholstered Luxury Solid Wood｜Homary.jpeg"
                   alt="Luxury Interior Living Room"
                   className="w-full h-full object-cover"
                 />
                 {/* Subtle overlay for better integration */}
                 <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-amber-900/20"></div>
               </div>
             </motion.div>
        </div>

        {/* Storefront Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             {/* Storefront Image */}
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="relative order-2 lg:order-1"
             >
               <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                 <img
                   src="/images/Timber Olio Green Sofa.jpeg"
                   alt="Furniture Storefront Display"
                   className="w-full h-full object-cover"
                 />
                 {/* Subtle overlay for better integration */}
                 <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-amber-900/20"></div>
                 {/* Storefront sign */}
                 <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-amber-900 text-lg font-bold bg-white/90 px-4 py-2 rounded-full shadow-lg">
                   interiors
                 </div>
               </div>
             </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6 order-1 lg:order-2"
          >
               <p className="text-lg text-black leading-relaxed">
                 Our passion for design drives everything we do. We partner with leading
                 brands and artisans to bring you the finest furniture pieces that
                 combine style, comfort, and durability. Our commitment to customer
                 service ensures your complete satisfaction.
               </p>
               <p className="text-lg text-black leading-relaxed">
                 From contemporary minimalism to classic elegance, our showroom showcases
                 the full range of our craftsmanship. Touch the fabrics, feel the wood grain,
                 and discover why our furniture has been trusted by thousands of satisfied customers.
               </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
