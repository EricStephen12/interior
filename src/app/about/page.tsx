import React from 'react';
import StorySection from '@/components/StorySection';
import { Truck, ShieldCheck, Heart, Award } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about the origin of SHARERS GYM. Where elite architecture meets athletic power, creating a collision of performance and design.",
};

export default function AboutPage() {
    return (
        <div className="pt-20">
            {/* Hero Header */}
            <div className="bg-primary py-20 sm:py-48 text-center relative overflow-hidden">
                {/* Subtle Background Accent */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 blur-[150px] rounded-full"></div>
                </div>

                <div className="max-w-5xl mx-auto px-4 relative z-10">
                    <span className="text-[10px] font-black tracking-[0.8em] text-accent uppercase mb-12 block">OUR ORIGIN</span>
                    <h1 className="text-5xl sm:text-7xl md:text-9xl text-luxury text-white mb-8 sm:mb-12">
                        Excellence as a <span className="text-accent italic font-light">Lifestyle.</span>
                    </h1>
                    <p className="text-slate-400 text-base sm:text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                        From the master's chair to the performance floor. <br />
                        SHARERS is the collision of elite architecture and athletic power.
                    </p>
                </div>
            </div>

            <section className="py-2">
                <StorySection />
            </section>

            {/* Values Section */}
            <section className="py-20 sm:py-48 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24">
                        <ValueCard
                            icon={ShieldCheck}
                            title="Expert Coaching"
                            description="Our coaches and physiotherapists are experienced professionals dedicated to helping you reach your full potential."
                        />
                        <ValueCard
                            icon={Award}
                            title="Top-Tier Equipment"
                            description="From custom racks to advanced recovery tools, we provide the best environment for your training."
                        />
                        <ValueCard
                            icon={Truck}
                            title="White Glove"
                            description="Global delivery for apparel and seamless digital pass check-ins, ensuring your journey is elite."
                        />
                        <ValueCard
                            icon={Heart}
                            title="The Pass"
                            description="Flexible session tracking tailored to your lifestyle. Your performance, our priority."
                        />
                    </div>
                </div>
            </section>

            {/* Brands Grid - Refined into Collections */}
            <section className="py-16 sm:py-32 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-accent font-black tracking-[0.5em] text-[10px] uppercase mb-16 underline decoration-accent/20 underline-offset-8">Signature Protocols</h2>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-32 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
                        {['SHARERS ELITE', 'PERFORMANCE LAB', 'APPAREL CORE', 'BOUTIQUE'].map(collection => (
                            <span key={collection} className="text-xl md:text-2xl font-black text-primary tracking-[0.3em] font-sans">{collection}</span>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function ValueCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
    return (
        <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-secondary text-primary rounded-none flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-700 editorial-shadow">
                <Icon className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-primary mb-4 tracking-tight uppercase">{title}</h4>
            <p className="text-text-muted font-medium leading-relaxed">{description}</p>
        </div>
    );
}
