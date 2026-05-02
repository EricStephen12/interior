import React from 'react';

export default function TermsPage() {
    return (
        <div className="pt-24 sm:pt-40 pb-16 sm:pb-32 bg-white min-h-screen selection:bg-secondary">
            <div className="max-w-4xl mx-auto px-4 prose prose-slate prose-lg">
                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Legal Identity</span>
                <h1 className="text-5xl md:text-7xl text-luxury text-primary mb-12">Registry <span className="text-accent italic">Terms.</span></h1>
                <p className="text-text-muted font-light leading-relaxed mb-12 text-xl">Welcome to SHARERS GYM. By accessing the vault, you agree to the following elite protocols.</p>

                <h2 className="text-2xl font-bold text-primary mt-16 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">1. The Pass Protocol</h2>
                <p className="text-text-muted font-light leading-relaxed">Access to SHARERS GYM is granted via 'The Pass'. Members must scan their digital QR code to enter the facility. Passes are personal and non-transferable.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">2. Safety & Use</h2>
                <p className="text-text-muted font-light leading-relaxed">By using our facilities, you acknowledge the inherent risks of physical training. SHARERS GYM is not liable for injuries resulting from improper use of equipment or underlying health conditions.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">3. Billing & Payments</h2>
                <p className="text-text-muted font-light leading-relaxed">All memberships are billed in Naira (₦). Monthly subscriptions automatically renew unless cancelled or paused via the member dashboard.</p>

                <h2 className="text-2xl font-bold text-primary mt-12 mb-6 uppercase tracking-widest border-l-4 border-accent pl-6">4. Facility Conduct</h2>
                <p className="text-text-muted font-light leading-relaxed">We maintain a high-performance environment. Any behavior that disrupts the training experience of other members may result in immediate suspension of 'The Pass'.</p>

                <div className="mt-20 pt-12 border-t border-primary/5">
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">SHARERS GYM • EST. 2026</p>
                </div>
            </div>
        </div>
    );
}
