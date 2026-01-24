import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-20 sm:pt-32 pb-16 sm:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          <div className="space-y-8 sm:space-y-12">
            <div>
              <h1 className="text-5xl font-black text-blue-950 tracking-tight mb-6">
                Get in <span className="text-sky-600">Touch.</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Have questions about our products or delivery? Our team is ready to assist you.
                Whether you prefer a quick chat on WhatsApp or a detailed email, we&apos;re here to help.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <ContactInfo
                icon={MessageCircle}
                title="WhatsApp"
                value="Chat with us now"
                link="https://wa.me/234XXXXXXXXXX"
                color="text-green-600"
              />
              <ContactInfo
                icon={Phone}
                title="Call"
                value="+234 (0) XXX XXX XXXX"
              />
              <ContactInfo
                icon={Mail}
                title="Email"
                value="hello@smartbestbrands.com"
              />
              <ContactInfo
                icon={MapPin}
                title="Showroom"
                value="Abuja & Benin City, Nigeria"
              />
            </div>

            <div className="p-8 bg-sky-50 rounded-[2rem] border border-sky-100 flex items-start gap-6">
              <div className="bg-white p-3 rounded-2xl shadow-sm">
                <Clock className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-950 mb-1">Response Time</h4>
                <p className="text-sm text-gray-600">We typically respond within 15-30 minutes during business hours (8AM - 6PM).</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-blue-950 mb-8">Send a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input type="text" className="w-full px-5 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 shadow-sm" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                  <input type="text" className="w-full px-5 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 shadow-sm" placeholder="080 1234 5678" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Subject</label>
                <select className="w-full px-5 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 shadow-sm">
                  <option>Product Inquiry</option>
                  <option>Delivery Status</option>
                  <option>Bulk Orders</option>
                  <option>Others</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Message</label>
                <textarea rows={5} className="w-full px-5 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 shadow-sm resize-none" placeholder="How can we help you?" />
              </div>
              <button type="button" className="w-full flex items-center justify-center gap-2 bg-blue-950 hover:bg-sky-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all transform active:scale-[0.98]">
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon: Icon, title, value, link, color }: { icon: React.ElementType, title: string, value: string, link?: string, color?: string }) {
  return (
    <div className="group">
      <div className="flex items-center gap-4 mb-2">
        <Icon className={`w-5 h-5 ${color || 'text-indigo-600'}`} />
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{title}</h4>
      </div>
      {link ? (
        <a href={link} className="text-lg font-bold text-blue-950 hover:text-sky-600 transition-colors underline decoration-sky-200 decoration-4 underline-offset-4">
          {value}
        </a>
      ) : (
        <p className="text-lg font-bold text-blue-950">{value}</p>
      )}
    </div>
  );
}
