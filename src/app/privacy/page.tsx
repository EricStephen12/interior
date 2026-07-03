import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="pt-24 sm:pt-40 pb-16 sm:pb-32 bg-white min-h-screen selection:bg-secondary">
            <div className="max-w-4xl mx-auto px-4 prose prose-slate prose-lg">
                <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-6 block">Privacy Policy</span>
                <h1 className="text-5xl md:text-7xl text-luxury text-primary mb-12">Privacy <span className="text-accent italic">Policy.</span></h1>
                <p className="text-text-muted font-medium leading-relaxed mb-12 text-xl">
                    We respect your privacy. This policy outlines how SHARERS GYM collects, uses, and protects your personal information across our website, mobile applications, and physical facilities.
                </p>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-widest border-l-4 border-accent pl-6">1. Information We Collect</h2>
                        <div className="space-y-4 text-text-muted font-medium leading-relaxed">
                            <p>1.1. <strong>Account & Membership Data:</strong> We collect essential information such as your name, email address, phone number, and physical address when you register for an account, subscribe to our newsletter, or purchase a membership.</p>
                            <p>1.2. <strong>Financial Data:</strong> For e-commerce and membership purchases, we securely process payment information via authorized third-party gateways (e.g., Paystack, KingsPay). We do not store full credit card numbers on our servers.</p>
                            <p>1.3. <strong>Facility Usage Data:</strong> We track facility check-ins and class bookings to optimize scheduling and manage facility capacity safely.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-widest border-l-4 border-accent pl-6">2. How We Use Your Data</h2>
                        <div className="space-y-4 text-text-muted font-medium leading-relaxed">
                            <p>2.1. To provide and maintain our services, including processing transactions and managing your digital access pass.</p>
                            <p>2.2. To communicate with you regarding your membership status, facility updates, exclusive promotions, and marketing (which you can opt out of at any time).</p>
                            <p>2.3. To improve our web platform, e-commerce experience, and physical gym layout based on aggregated usage analytics.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-widest border-l-4 border-accent pl-6">3. Data Sharing & Disclosure</h2>
                        <div className="space-y-4 text-text-muted font-medium leading-relaxed">
                            <p>3.1. We do not sell your personal data to third parties.</p>
                            <p>3.2. We may share necessary information with trusted service providers (e.g., payment processors, email delivery services) solely for the purpose of operating our business.</p>
                            <p>3.3. We may disclose information if required by law or in response to valid requests by public authorities.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-primary mb-4 uppercase tracking-widest border-l-4 border-accent pl-6">4. Data Security</h2>
                        <div className="space-y-4 text-text-muted font-medium leading-relaxed">
                            <p>4.1. We implement industry-standard encryption, SSL protocols, and modern authentication via Clerk to protect your personal and payment information.</p>
                            <p>4.2. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security against sophisticated cyber attacks.</p>
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
