import React from 'react';

export default function RefundPage() {
    return (
        <div className="pt-24 sm:pt-40 pb-16 sm:pb-32 bg-white min-h-screen selection:bg-secondary">
            <div className="max-w-4xl mx-auto px-4 prose prose-slate prose-lg">
                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Refunds & Exchanges</span>
                <h1 className="text-5xl md:text-7xl text-luxury text-primary mb-12">Refund <span className="text-accent italic">Policy.</span></h1>
                <p className="text-text-muted font-medium leading-relaxed mb-12 text-xl">
                    We want you to be fully satisfied with your SHARERS GYM experience. Please review our comprehensive return, exchange, and cancellation policies below.
                </p>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-widest border-l-4 border-accent pl-6">1. Physical Products & Gear</h2>
                        <div className="space-y-4 text-text-muted font-medium leading-relaxed">
                            <p>1.1. Unused apparel, gear, and accessories in their original packaging with tags intact can be returned within 14 days of receipt for a full refund or exchange.</p>
                            <p>1.2. For hygiene reasons, certain items including but not limited to water bottles, lifting belts that have been worn, and supplements cannot be returned once opened or used.</p>
                            <p>1.3. Shipping costs for returns are the responsibility of the customer unless the item received was defective or incorrect.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-widest border-l-4 border-accent pl-6">2. Memberships & Gym Passes</h2>
                        <div className="space-y-4 text-text-muted font-medium leading-relaxed">
                            <p>2.1. All membership plans, whether monthly or annual, are billed upfront and are non-refundable once the billing cycle begins.</p>
                            <p>2.2. You may cancel your membership at any time via your user dashboard. Cancellations prevent future billing but do not trigger a prorated refund for the current cycle.</p>
                            <p>2.3. We do not offer a "satisfaction guarantee" refund on memberships. We recommend purchasing a day pass if you wish to trial the facility before committing.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-widest border-l-4 border-accent pl-6">3. Digital Access (Day Passes)</h2>
                        <div className="space-y-4 text-text-muted font-medium leading-relaxed">
                            <p>3.1. Day passes purchased via the platform are non-refundable and hold no direct fiat cash value.</p>
                            <p>3.2. If a transaction using a day pass fails or a booked class is cancelled by the facility, the pass will be fully reimbursed to your account.</p>
                        </div>
                    </section>
                </div>

                <div className="mt-20 pt-12 border-t border-primary/5">
                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">SHARERS GYM • EST. 2024</p>
                    <p className="text-xs text-text-muted font-medium mt-4">Last Updated: July 2026</p>
                </div>
            </div>
        </div>
    );
}
