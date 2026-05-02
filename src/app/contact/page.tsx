import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Connect with the SHARERS GYM performance lab. Inquire about memberships, personal training, and recovery lab bookings.",
};

export default function ContactPage() {
  return (
    <div className="pt-20 sm:pt-32 pb-16 sm:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          <div className="space-y-12 sm:space-y-16">
            <div>
              <span className="text-[10px] font-black tracking-[0.6em] text-accent uppercase mb-8 block">Member Support</span>
              <h1 className="text-4xl sm:text-6xl md:text-8xl text-luxury text-primary mb-8">
                Get in <span className="text-accent italic">Touch.</span>
              </h1>
              <p className="text-base sm:text-xl text-text-muted font-light leading-relaxed">
                Whether you’re ready to start training, have a question about your membership, or just want to see the facility, we’re here to help.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <ContactInfo
                icon={MessageCircle}
                title="WhatsApp Direct"
                value="Secure Channel"
                link="https://wa.me/234XXXXXXXXXX"
              />
              <ContactInfo
                icon={Mail}
                title="Performance Lab"
                value="ops@SHARERS.GYM"
              />
              <ContactInfo
                icon={Phone}
                title="Direct Line"
                value="+234 (0) 900 SHARERS"
              />
              <ContactInfo
                icon={MapPin}
                title="The Arena"
                value="Lagos • London • Dubai"
              />
            </div>

            <div className="p-6 sm:p-10 bg-secondary/30 rounded-none border border-primary/5 flex items-start gap-8 editorial-shadow">
              <div className="bg-white p-4 rounded-none shadow-sm flex-shrink-0">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h4 className="font-black text-primary uppercase tracking-widest mb-3">Fast Response</h4>
                <p className="text-sm text-text-muted leading-relaxed font-light">We value your time. Current members get a response within 15 minutes. General questions are usually answered within a few hours.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-none p-8 sm:p-16 border border-primary/5 editorial-shadow">
            <h2 className="text-2xl sm:text-4xl text-luxury text-primary mb-12">Send us a <br /><span className="text-accent italic">Message</span></h2>
            <form className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Full Name</label>
                  <input type="text" className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors tabular-nums" placeholder="Full Name" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">WhatsApp / Phone</label>
                  <input type="text" className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors tabular-nums" placeholder="+234..." />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">What can we help you with?</label>
                <select className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors appearance-none">
                  <option>Membership & The Pass</option>
                  <option>Personal Training</option>
                  <option>Recovery Lab Booking</option>
                  <option>General Question</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">The Message</label>
                <textarea rows={5} className="w-full px-0 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors resize-none" placeholder="Describe your precision requirement..." />
              </div>
              <div className="pt-8">
                <button type="button" className="btn-primary w-full flex items-center justify-center gap-4">
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon: Icon, title, value, link, color }: { icon: React.ElementType, title: string, value: string, link?: string, color?: string }) {
  return (
    <div className="group border-l border-primary/10 pl-8">
      <div className="flex items-center gap-4 mb-3">
        <Icon className={`w-5 h-5 text-accent`} />
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</h4>
      </div>
      {link ? (
        <a href={link} className="text-base sm:text-xl md:text-2xl font-light text-primary hover:text-accent transition-colors underline decoration-accent/20 underline-offset-8">
          {value}
        </a>
      ) : (
        <p className="text-base sm:text-xl md:text-2xl font-light text-primary tracking-tight">{value}</p>
      )}
    </div>
  );
}
