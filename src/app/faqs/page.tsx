'use client';

import React, { useState } from 'react';
import { Plus, Minus, Search } from 'lucide-react';

const faqs = [
    {
        question: "Do you sell original mattresses?",
        answer: "Absolutely. We are authorized distributors for all the brands listed on our site, including Vitafoam, Mouka, and Royal Foam. Every mattress comes in its original factory packaging with a valid manufacturer warranty."
    },
    {
        question: "How long does delivery take?",
        answer: "For locations within Abuja and Benin, delivery typically takes 24-48 hours. For other locations, it may take 3-5 business days depending on the size of the order and the brand's availability."
    },
    {
        question: "How do I pay for my order?",
        answer: "You can pay securely online via our integrated payment gateway or opt for the 'Order on WhatsApp' method where we can arrange for bank transfers. We currently do not support Pay on Delivery for most large furniture items."
    },
    {
        question: "Can I return a mattress?",
        answer: "Due to hygiene reasons, mattresses cannot be returned once the nylon seal has been removed. However, if there is a factory defect, we will facilitate a replacement through the manufacturer's warranty process."
    },
    {
        question: "Do you offer bulk discounts?",
        answer: "Yes, we offer special pricing for hotels, hospitals, and large corporate orders. Please reach out to us via our contact page for a custom quote."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="pt-20 sm:pt-32 pb-16 sm:pb-24 bg-sky-50/20 min-h-screen">
            <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-10 sm:mb-16">
                    <h1 className="text-4xl sm:text-5xl font-black text-blue-950 tracking-tight mb-4">FAQs</h1>
                    <p className="text-lg text-gray-600 font-medium">Everything you need to know about Smart Best Brands.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`rounded-[2rem] border transition-all duration-300 ${openIndex === idx ? 'bg-white border-sky-100 shadow-xl shadow-sky-600/10' : 'bg-transparent border-gray-100'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-8 text-left"
                            >
                                <span className="text-lg font-bold text-blue-950 pr-8">{faq.question}</span>
                                <div className={`p-2 rounded-xl transition-colors ${openIndex === idx ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </div>
                            </button>
                            {openIndex === idx && (
                                <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <p className="text-gray-600 leading-relaxed font-medium border-t border-gray-50 pt-4">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 sm:mt-20 p-8 sm:p-12 bg-blue-950 rounded-[2rem] sm:rounded-[3rem] text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                        <p className="text-sky-200 mb-8 max-w-sm mx-auto">Can&apos;t find the answer you&apos;re looking for? Please chat with our friendly team.</p>
                        <a href="/contact" className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl transition-all">
                            Get in Touch
                        </a>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-sky-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
