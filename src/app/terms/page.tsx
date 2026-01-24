import React from 'react';

export default function TermsPage() {
    return (
        <div className="pt-20 sm:pt-32 pb-16 sm:pb-24 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 prose prose-sky">
                <h1 className="text-4xl font-black text-blue-950 mb-8">Terms & Conditions</h1>
                <p className="text-gray-600 mb-6">Welcome to Smart Best Brands. By accessing this website, you agree to be bound by these terms and conditions.</p>

                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mt-8 sm:mt-12 mb-4">1. Product Authenticity</h2>
                <p className="text-gray-600">We guarantee that all products sold on our platform are 100% authentic and sourced directly from the manufacturers or authorized distributors.</p>

                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mt-8 sm:mt-12 mb-4">2. Pricing & Payments</h2>
                <p className="text-gray-600">Prices are subject to change without notice. Payments must be made in full before delivery for furniture and large mattress orders.</p>

                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mt-8 sm:mt-12 mb-4">3. Delivery Policy</h2>
                <p className="text-gray-600">Our primary delivery zones are Abuja and Benin. Delivery outside these zones may attract additional charges and longer wait times.</p>

                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mt-8 sm:mt-12 mb-4">4. Warranty</h2>
                <p className="text-gray-600">Warranty claims must be handled through the respective brand manufacturers. We will assist in facilitating the process.</p>
            </div>
        </div>
    );
}
