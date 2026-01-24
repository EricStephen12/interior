import React from 'react';

export default function RefundPage() {
    return (
        <div className="pt-20 sm:pt-32 pb-16 sm:pb-24 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 prose prose-sky">
                <h1 className="text-4xl font-black text-blue-950 mb-8">Refund & Return Policy</h1>
                <p className="text-gray-600 mb-6">We want you to be satisfied with your purchase. Please read our policy carefully.</p>

                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mt-8 sm:mt-12 mb-4">1. Mattresses</h2>
                <p className="text-gray-600">For hygiene reasons, mattresses cannot be returned or refunded once the original factory nylon has been opened or tampered with.</p>

                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mt-8 sm:mt-12 mb-4">2. Furniture</h2>
                <p className="text-gray-600">Furniture items can only be returned if they are damaged upon delivery. Please inspect all items during the delivery process.</p>

                <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mt-8 sm:mt-12 mb-4">3. Refund Process</h2>
                <p className="text-gray-600">Eligible refunds will be processed within 7-14 business days via bank transfer or the original payment method.</p>
            </div>
        </div>
    );
}
