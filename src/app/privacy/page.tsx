import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="pt-24 sm:pt-40 pb-16 sm:pb-32 bg-white min-h-screen selection:bg-secondary">
            <div className="max-w-4xl mx-auto px-4 prose prose-slate prose-lg">
                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Digital Integrity</span>
                <h1 className="text-5xl md:text-7xl text-luxury text-primary mb-12">Data <span className="text-accent italic">Protocol.</span></h1>
                <p className="text-text-muted font-light leading-relaxed mb-12 text-xl">Your identity is your primary asset. This protocol outlines our procedures for encrypted data handling.</p>

                <h2 className="text-2xl font-bold text-primary mt-16 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">Member Data</h2>
                <p className="text-text-muted font-light leading-relaxed">We collect essential information like your name, contact details, and payment history to manage your 'The Pass' membership and provide a seamless training experience.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">Training History</h2>
                <p className="text-text-muted font-light leading-relaxed">Your check-in history and performance data are utilized strictly to track your progress and optimize our facility schedules. We do not share your training logs with third parties.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">Security Standards</h2>
                <p className="text-text-muted font-light leading-relaxed">We use industry-standard encryption to protect your personal and payment information. Your digital pass and member dashboard are secured via modern authentication protocols.</p>

                <div className="mt-20 pt-12 border-t border-primary/5">
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">SHARERS GYM • EST. 2026</p>
                </div>
            </div>
        </div>
    );
}
