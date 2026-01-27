import React from 'react';

export default function RefundPage() {
    return (
        <div className="pt-24 sm:pt-40 pb-16 sm:pb-32 bg-white min-h-screen selection:bg-secondary">
            <div className="max-w-4xl mx-auto px-4 prose prose-slate prose-lg">
                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Investment Protection</span>
                <h1 className="text-5xl md:text-7xl text-luxury text-primary mb-12">Exchange <span className="text-accent italic">Registry.</span></h1>
                <p className="text-text-muted font-light leading-relaxed mb-12 text-xl">We ensure your total satisfaction with the SHARERS collection. Please review our laboratory exchange protocols.</p>

                <h2 className="text-2xl font-bold text-primary mt-16 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">1. Essence Curation</h2>
                <p className="text-text-muted font-light leading-relaxed">For hygiene and profile preservation, signature fragrances cannot be returned once the molecular seal has been compromised or atmo-locked packaging opened.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">2. Gemstone Artifacts</h2>
                <p className="text-text-muted font-light leading-relaxed">Jewelry installments may be exchanged within 14 laboratory days provided they remain in pristine, vault-ready condition with all authentication tags intact.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">3. Refund Finalization</h2>
                <p className="text-text-muted font-light leading-relaxed">Eligible valuation adjustments will be processed within 7-14 business days via the original encrypted payment channel.</p>

                <div className="mt-20 pt-12 border-t border-primary/5">
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">SHARERS GYM • EST. 2026</p>
                </div>
            </div>
        </div>
    );
}
