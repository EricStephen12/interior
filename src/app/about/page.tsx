import React from 'react';
import StorySection from '@/components/StorySection';
import { Truck, ShieldCheck, Heart, Award } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="pt-20">
            {/* Hero Header */}
            <div className="bg-primary py-24 sm:py-32 text-center relative overflow-hidden">
                {/* Subtle Background Accent */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 blur-[120px] rounded-full"></div>
                </div>

                <div className="max-w-5xl mx-auto px-4 relative z-10">
                    <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-8 block">The Origin</span>
                    <h1 className="text-6xl md:text-8xl text-luxury text-white mb-8">
                        Precision as a <span className="text-accent italic">Philosophy.</span>
                    </h1>
                    <p className="text-slate-400 text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto uppercase tracking-wide">
                        Born from the tech lab. Perfected by the artisan. <br />
                        The collision of engineering and elegance.
                    </p>
                </div>
            </div>

            <section className="py-2">
                <StorySection />
            </section>

            {/* Values Section */}
            <section className="py-24 sm:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                        <ValueCard
                            icon={ShieldCheck}
                            title="Lab Certified"
                            description="Every gemstone and essence is tech-verified for purity and molecular precision."
                        />
                        <ValueCard
                            icon={Award}
                            title="24k Standard"
                            description="Unapologetic quality. We settle for nothing less than the pinnacle of material excellence."
                        />
                        <ValueCard
                            icon={Truck}
                            title="Secure Vaulting"
                            description="Global white-glove delivery, ensuring your essence arrives in pristine condition."
                        />
                        <ValueCard
                            icon={Heart}
                            title="Member Registry"
                            description="Bespoke service tailored to the modern woman. Your precision, our priority."
                        />
                    </div>
                </div>
            </section>

            {/* Brands Grid - Refined into Collections */}
            <section className="py-32 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-accent font-black tracking-[0.5em] text-[10px] uppercase mb-16 underline decoration-accent/20 underline-offset-8">Signature Collections</h2>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-32 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000">
                        {['EXRICX SIGNATURE', 'NOIR COLLECTION', 'LUXE LAB', 'ARTISAN GOLD'].map(collection => (
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
