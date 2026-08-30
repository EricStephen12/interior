'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCustomization } from '@/lib/customization-context';

const faqs = [
    {
        question: "What is 'The Pass'?",
        answer: "The Pass is your all-access membership to SHARERS GYM. It gives you 24/7 access to our training and recovery areas. No complex tiers—just one simple plan for progress."
    },
    {
        question: "How do I use my sessions?",
        answer: "Just scan your digital pass (QR code) at the entrance. Your dashboard will automatically track your entry and update your session history in real-time."
    },
    {
        question: "How much does it cost?",
        answer: "The Pass is ₦25,000 per month. If you're serious about the long run, our yearly plan is ₦250,000, giving you two months of training for free."
    },
    {
        question: "Can I pause my membership?",
        answer: "Yes. We believe in results, not contracts. If you need to step away, you can pause your membership directly from your dashboard or send us a message."
    }
];

export default function FaqsClient() {
    const { get } = useCustomization();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const badge = get('section.faqs.badge', 'FAQ');
    const title1 = get('section.faqs.title1', 'Common');
    const title2 = get('section.faqs.title2', 'Questions.');
    const subtitle = get('section.faqs.subtitle', 'Everything you need to know about our training and memberships.');

    return (
        <div className="pt-24 sm:pt-40 pb-16 sm:pb-32 bg-secondary/20 min-h-screen selection:bg-accent/20">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16 sm:mb-24">
                    <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">{badge}</span>
                    <h1 className="text-5xl md:text-7xl text-luxury text-primary mb-6">
                        {title1} <br /><span className="text-accent italic">{title2}</span>
                    </h1>
                    <p className="text-lg text-text-muted font-light uppercase tracking-widest">{subtitle}</p>
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
            </div>
        </div>
    );
}
