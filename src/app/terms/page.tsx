import React from 'react';

export default function TermsPage() {
    return (
        <div className="pt-24 sm:pt-40 pb-16 sm:pb-32 bg-white min-h-screen selection:bg-secondary">
            <div className="max-w-4xl mx-auto px-4 prose prose-slate prose-lg">
                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Terms & Conditions</span>
                <h1 className="text-5xl md:text-7xl text-luxury text-primary mb-12">Terms of <span className="text-accent italic">Use.</span></h1>
                <p className="text-text-muted font-medium leading-relaxed mb-12 text-xl">
                    Welcome to SHARERS GYM. By accessing our website, purchasing our products, or using our facilities, you agree to comply with and be bound by the following terms and conditions of use.
                </p>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-widest border-l-4 border-accent pl-6">1. Facility Access & Memberships</h2>
                        <div className="space-y-4 text-text-muted font-medium leading-relaxed">
                            <p>1.1. Access to SHARERS GYM is granted exclusively via your digital member pass or active membership subscription.</p>
                            <p>1.2. Memberships are strictly personal, non-transferable, and non-refundable. Sharing your digital pass with unauthorized individuals will result in immediate termination of your membership without refund.</p>
                            <p>1.3. SHARERS GYM reserves the right to deny entry, suspend, or terminate memberships at our sole discretion for violations of facility conduct or safety policies.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-widest border-l-4 border-accent pl-6">2. E-Commerce & Day Passes</h2>
                        <div className="space-y-4 text-text-muted font-medium leading-relaxed">
                            <p>2.1. All physical products, day passes, and memberships are billed in Nigerian Naira (₦) through our authorized payment gateways.</p>
                            <p>2.2. Day Passes purchased through the platform have no cash value, cannot be exchanged for fiat currency, and are to be used exclusively for in-app or in-gym services and bookings.</p>
                            <p>2.3. We reserve the right to modify prices, access exchange rates, and product availability at any time without prior notice.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-widest border-l-4 border-accent pl-6">3. Health & Safety Waiver</h2>
                        <div className="space-y-4 text-text-muted font-medium leading-relaxed">
                            <p>3.1. By utilizing SHARERS GYM facilities, you acknowledge that physical exercise involves inherent risks, including but not limited to bodily injury, property damage, or death.</p>
                            <p>3.2. You certify that you are in good physical condition and have no medical conditions that would prevent your participation in physical activities.</p>
                            <p>3.3. SHARERS GYM, its staff, owners, and affiliates are not liable for any injuries or damages sustained while using the facility, equipment, or participating in classes.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-widest border-l-4 border-accent pl-6">4. Facility Conduct</h2>
                        <div className="space-y-4 text-text-muted font-medium leading-relaxed">
                            <p>4.1. We maintain a high-performance environment. Members are expected to rack their weights, wipe down equipment after use, and respect the personal space of others.</p>
                            <p>4.2. Photography and videography are permitted for personal use only, provided they do not capture or disrupt other members without their explicit consent.</p>
                            <p>4.3. Any harassment, intimidation, or disruptive behavior will result in immediate expulsion from the premises.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-widest border-l-4 border-accent pl-6">5. Intellectual Property</h2>
                        <div className="space-y-4 text-text-muted font-medium leading-relaxed">
                            <p>5.1. The "SHARERS GYM" brand, logo, website design, original content, and digital assets are the exclusive intellectual property of SHARERS GYM.</p>
                            <p>5.2. You may not reproduce, distribute, or use our intellectual property for commercial purposes without explicit written consent.</p>
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
