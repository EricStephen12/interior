import React from 'react';

export default function TermsPage() {
    return (
        <div className="pt-24 sm:pt-40 pb-16 sm:pb-32 bg-white min-h-screen selection:bg-secondary">
            <div className="max-w-4xl mx-auto px-4 prose prose-slate prose-lg">
                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Legal Identity</span>
                <h1 className="text-5xl md:text-7xl text-luxury text-primary mb-12">Registry <span className="text-accent italic">Terms.</span></h1>
                <p className="text-text-muted font-light leading-relaxed mb-12 text-xl">Welcome to EXRICX BEAUTY. By accessing the vault, you agree to the following elite protocols.</p>

                <h2 className="text-2xl font-bold text-primary mt-16 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">1. Piece Authenticity</h2>
                <p className="text-text-muted font-light leading-relaxed">We guarantee that every essence and artifact sold is 100% laboratory-certified and sourced directly from the EXRICX production labs.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">2. Investment & Protocols</h2>
                <p className="text-text-muted font-light leading-relaxed">Valuations are subject to global material market fluctuations. All investments must be finalized via secure encryption before dispatch protocol.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">3. Logistics Destinies</h2>
                <p className="text-text-muted font-light leading-relaxed">Our global network ensures secure handover. Regional logistics variations may occur based on laboratory proximity and vault availability.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">4. Lab Warranty</h2>
                <p className="text-text-muted font-light leading-relaxed">Structural integrity claims are managed via the EXRICX Laboratory Registry. Our concierge will facilitate the molecular verification process.</p>

                <div className="mt-20 pt-12 border-t border-primary/5">
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">EXRICX BEAUTY • EST. 2026</p>
                </div>
            </div>
        </div>
    );
}
