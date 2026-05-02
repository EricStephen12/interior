import React from 'react';

export default function RefundPage() {
    return (
        <div className="pt-24 sm:pt-40 pb-16 sm:pb-32 bg-white min-h-screen selection:bg-secondary">
            <div className="max-w-4xl mx-auto px-4 prose prose-slate prose-lg">
                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Investment Protection</span>
                <h1 className="text-5xl md:text-7xl text-luxury text-primary mb-12">Exchange <span className="text-accent italic">Registry.</span></h1>
                <p className="text-text-muted font-light leading-relaxed mb-12 text-xl">We ensure your total satisfaction with the SHARERS collection. Please review our laboratory exchange protocols.</p>

                <h2 className="text-2xl font-bold text-primary mt-16 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">1. Membership Refund</h2>
                <p className="text-text-muted font-light leading-relaxed">We offer a 14-day satisfied-or-refunded policy for new memberships. If you feel SHARERS isn't the right fit for your training, we will issue a full refund for your first month.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">2. Apparel & Gear</h2>
                <p className="text-text-muted font-light leading-relaxed">Unused gear and apparel in original packaging can be returned within 14 days. For hygiene reasons, gym accessories that have been used cannot be returned.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">3. Session Cancellations</h2>
                <p className="text-text-muted font-light leading-relaxed">Single training or recovery sessions can be rescheduled or refunded if cancelled at least 24 hours in advance. No-shows will be charged the full session rate.</p>

                <div className="mt-20 pt-12 border-t border-primary/5">
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">SHARERS GYM • EST. 2026</p>
                </div>
            </div>
        </div>
    );
}
