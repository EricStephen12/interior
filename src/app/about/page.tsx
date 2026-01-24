import React from 'react';
import StorySection from '@/components/StorySection';
import { Truck, ShieldCheck, Heart, Award } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="pt-20">
            {/* Hero Header */}
            <div className="bg-blue-950 py-16 sm:py-24 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        Driven by <span className="text-sky-400">Comfort.</span>
                    </h1>
                    <p className="text-sky-200 text-lg md:text-xl font-medium leading-relaxed">
                        Nigeria&apos;s premier destination for authentic bedding and home essentials.
                        We bring the best brands directly to your doorstep.
                    </p>
                </div>
            </div>

            <StorySection />

            {/* Values Section */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <ValueCard
                            icon={ShieldCheck}
                            title="100% Authentic"
                            description="We only stock original products directly from authorized brand manufacturers."
                        />
                        <ValueCard
                            icon={Truck}
                            title="Reliable Delivery"
                            description="Specialized delivery services across Abuja and Benin, with more locations coming soon."
                        />
                        <ValueCard
                            icon={Award}
                            title="Full Warranty"
                            description="Every mattress and piece of furniture comes with a valid manufacturer's warranty."
                        />
                        <ValueCard
                            icon={Heart}
                            title="Customer First"
                            description="Our team is dedicated to helping you find the perfect fit for your home and budget."
                        />
                    </div>
                </div>
            </section>

            {/* Brands Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-gray-400 font-bold tracking-widest text-xs uppercase mb-12">Our Partner Brands</h2>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                        {['Vitafoam', 'Mouka', 'Sara Foam', 'Royal Foam', 'Unifoam'].map(brand => (
                            <span key={brand} className="text-3xl font-black text-blue-950/20">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function ValueCard({ icon: Icon, title, description }: any) {
    return (
        <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500">
                <Icon className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-blue-950 mb-3">{title}</h4>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}
