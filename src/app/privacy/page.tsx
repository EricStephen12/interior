import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="pt-24 sm:pt-40 pb-16 sm:pb-32 bg-white min-h-screen selection:bg-secondary">
            <div className="max-w-4xl mx-auto px-4 prose prose-slate prose-lg">
                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Digital Integrity</span>
                <h1 className="text-5xl md:text-7xl text-luxury text-primary mb-12">Data <span className="text-accent italic">Protocol.</span></h1>
                <p className="text-text-muted font-light leading-relaxed mb-12 text-xl">Your identity is your primary asset. This protocol outlines our procedures for encrypted data handling.</p>

                <h2 className="text-2xl font-bold text-primary mt-16 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">Registry Acquisition</h2>
                <p className="text-text-muted font-light leading-relaxed">We collect high-precision data including legal name, encrypted communication channels, and secure vault destinations to facilitate exclusive access to the SHARERS collection.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">Laboratory Usage</h2>
                <p className="text-text-muted font-light leading-relaxed">Your data is utilized strictly for investment fulfillment, bespoke concierge support, and exclusive access to new essence launches within the SHARERS ecosystem.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">Encryption Standards</h2>
                <p className="text-text-muted font-light leading-relaxed">We implement laboratory-grade security architectures to ensure your digital signature remains uncompromised by external unauthorized entities.</p>

                <div className="mt-20 pt-12 border-t border-primary/5">
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">SHARERS GYM • EST. 2026</p>
                </div>
            </div>
        </div>
    );
}
