import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="pt-20 sm:pt-32 pb-16 sm:pb-24 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto px-4 prose prose-sky">
                <h1 className="text-4xl font-black text-blue-950 mb-8">Privacy Policy</h1>
                <p className="text-gray-600 mb-6">Your privacy is important to us. This policy explains how we collect and use your data.</p>

                <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mt-8 sm:mt-12 mb-4">Information Collection</h2>
                <p className="text-gray-600">We collect information such as your name, email, phone number, and delivery address to process your orders and provide better service.</p>

                <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mt-8 sm:mt-12 mb-4">Data Usage</h2>
                <p className="text-gray-600">Your data is only used for order fulfillment, customer support, and occasional promotional updates if you opted in.</p>

                <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mt-8 sm:mt-12 mb-4">Data Security</h2>
                <p className="text-gray-600">We implement industry-standard security measures to protect your personal information from unauthorized access.</p>
            </div>
        </div>
    );
}
