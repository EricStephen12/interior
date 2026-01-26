'use client';

import React, { useState } from 'react';
import { Plus, Minus, Search } from 'lucide-react';

const faqs = [
    {
        question: "Are EXRICX pieces authenticated?",
        answer: "Every piece from the EXRICX vault undergoes rigorous laboratory authentication. Jewelry is accompanied by a molecular certification and fragrances are verified for profile purity and age-stability."
    },
    {
        question: "What is the dispatch trajectory?",
        answer: "Global express vaulting typically takes 3-7 business days. Priority members receive dispatch verification within 2 laboratory hours of order finalization."
    },
    {
        question: "Protocol for bespoke curation?",
        answer: "Secure payments are processed via our encrypted gateway. For bespoke diamond curation or private fragrance batching, please initiate a Concierge Protocol via WhatsApp for personalized invoicing."
    },
    {
        question: "Return and Exchange Registry?",
        answer: "Due to the intimate nature of signature fragrances and molecular jewelry certifications, returns are only accepted for structural lab defects. Exchanges are available within 14 days for pristine, unsealed pieces."
    },
    {
        question: "Bespoke Corporate Procurement?",
        answer: "We offer tailored curation for private events and corporate registries. Please contact our Global Concierge for volume-based investment protocols."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="pt-24 sm:pt-40 pb-16 sm:pb-32 bg-secondary/20 min-h-screen selection:bg-accent/20">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16 sm:mb-24">
                    <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">The Knowledge Base</span>
                    <h1 className="text-5xl md:text-7xl text-luxury text-primary mb-6">Common <br /><span className="text-accent italic">Inquiries.</span></h1>
                    <p className="text-lg text-text-muted font-light uppercase tracking-widest">Protocol Information for EXRICX LUXURY.</p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`rounded-none border transition-all duration-700 ${openIndex === idx ? 'bg-white border-primary/5 editorial-shadow' : 'bg-transparent border-primary/5 hover:border-accent/40'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-10 text-left"
                            >
                                <span className="text-xl font-bold text-primary pr-8 uppercase tracking-tight">{faq.question}</span>
                                <div className={`p-3 rounded-none transition-all duration-500 ${openIndex === idx ? 'bg-primary text-white shadow-xl' : 'bg-secondary text-primary'}`}>
                                    {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </div>
                            </button>
                            {openIndex === idx && (
                                <div className="px-10 pb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                                    <p className="text-text-muted leading-relaxed font-light text-lg border-t border-primary/5 pt-8">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-24 sm:mt-32 p-10 sm:p-20 bg-primary rounded-none text-center text-white relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
                    <div className="relative z-10">
                        <h2 className="text-4xl text-luxury mb-8">Unresolved <br /><span className="text-accent italic">Curiosity?</span></h2>
                        <p className="text-white/60 mb-12 max-w-sm mx-auto font-light text-lg">Our Global Concierge is available for deeper laboratory and investment inquiries.</p>
                        <a href="/contact" className="btn-primary !bg-white !text-primary hover:!bg-accent hover:!text-white py-6">
                            Initiate Protocol
                        </a>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>
                </div>
            </div>
        </div>
    );
}
