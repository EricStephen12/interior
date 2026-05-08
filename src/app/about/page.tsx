import React from 'react';
import StorySection from '@/components/StorySection';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about the origin of SHARERS GYM. We didn't build a gym. We built the place we wished existed.",
};

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero - Cinematic but controlled */}
            <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-end overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=90"
                        alt="SHARERS GYM Interior"
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/75" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 w-full">
                    <span className="text-[10px] font-black tracking-[0.8em] text-accent uppercase mb-4 block">OUR ORIGIN</span>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.85] font-display mb-4 sm:mb-6">
                        We didn&apos;t build a gym. <br />
                        <span className="text-accent italic font-light">We built the place we wished existed.</span>
                    </h1>
                </div>
            </section>

            {/* The Real Story - Split Layout */}
            <section className="py-16 sm:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* Image */}
                        <div className="relative">
                            <div className="aspect-[4/5] relative overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80"
                                    alt="SHARERS Training"
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-primary/10" />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 hidden lg:block" />
                        </div>

                        {/* Copy - Written like a human */}
                        <div className="space-y-6 sm:space-y-10">
                            <div>
                                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-4 block">HOW IT STARTED</span>
                                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-primary tracking-tighter leading-[0.9] font-display">
                                    Started with <br />
                                    <span className="text-accent italic font-light">a question.</span>
                                </h2>
                            </div>

                            <div className="space-y-5 text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
                                <p>&ldquo;Why does every gym feel the same?&rdquo;</p>
                                <p>Same machines lined up in rows. Same music nobody asked for. Same energy that makes you want to leave the second you walk in. We got tired of it.</p>
                                <p>So we built something different. Not different for the sake of it — different because it had to be. A space where you actually want to train. Where the coaches know your name and your goals. Where recovery isn&apos;t an afterthought, it&apos;s built into the process.</p>
                                <p>SHARERS isn&apos;t for everyone. And that&apos;s the point.</p>
                            </div>

                            <div className="flex items-center gap-6 pt-4">
                                <div className="w-16 h-[2px] bg-accent" />
                                <span className="text-[9px] font-black tracking-[0.4em] text-primary/40 uppercase">Lagos, Nigeria</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section Component */}
            <section className="py-2">
                <StorySection />
            </section>

            {/* What makes us different — editorial strips, not a grid */}
            <section className="py-16 sm:py-32 bg-primary relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
                    <span className="text-[30vw] font-black leading-none whitespace-nowrap">SHARERS</span>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="mb-12 sm:mb-20">
                        <span className="text-[10px] font-black tracking-[0.8em] text-accent uppercase mb-4 block">WHAT&apos;S DIFFERENT</span>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter leading-[0.9] font-display">
                            The stuff that <span className="text-accent italic font-light">actually matters.</span>
                        </h2>
                    </div>

                    <div className="space-y-0">
                        <DifferenceRow
                            title="Real Coaching"
                            description="Not someone watching you from across the room. Coaches who build your program around your body, track your progress, and adjust on the fly."
                        />
                        <DifferenceRow
                            title="Performance Precision"
                            description="Every movement, every set, and every rep is tracked and optimized. We don't guess—we use data and top-tier coaching to drive your athletic mastery."
                        />
                        <DifferenceRow
                            title="Equipment That Makes Sense"
                            description="Every rack, every machine, every piece of gear was chosen for a reason. If it doesn't make you better, it's not in here."
                        />
                        <DifferenceRow
                            title="The Pass"
                            description="Your membership isn't a contract. It's a flexible credit system that tracks sessions and works around your life — not the other way around."
                        />
                        <DifferenceRow
                            title="People Who Get It"
                            description="The vibe matters. This is a space full of people who show up, put in the work, and don't need to be convinced why it matters."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-primary tracking-tighter font-display mb-4 sm:mb-6">
                        You already know if this <span className="text-accent italic font-light">is for you.</span>
                    </h3>
                    <p className="text-sm sm:text-base text-slate-400 font-medium mb-8 sm:mb-12 max-w-lg mx-auto">
                        Stop thinking about it. Come see the space, talk to the coaches, and decide for yourself.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <Link href="/dashboard" className="w-full sm:w-auto bg-primary text-white px-8 sm:px-12 py-4 sm:py-5 text-center hover:bg-accent transition-all duration-500">
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">Start The Protocol</span>
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto border-2 border-primary text-primary px-8 sm:px-12 py-4 sm:py-5 text-center hover:bg-primary hover:text-white transition-all duration-500">
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">Talk To Us</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function DifferenceRow({ title, description }: { title: string, description: string }) {
    return (
        <div className="group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-12 py-8 sm:py-10 border-b border-white/5 hover:border-accent/20 transition-all duration-500">
            <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight sm:w-48 flex-shrink-0 group-hover:text-accent transition-colors duration-500">{title}</h4>
            <p className="text-xs sm:text-sm text-white/40 font-medium leading-relaxed group-hover:text-white/60 transition-colors duration-500">{description}</p>
        </div>
    );
}
