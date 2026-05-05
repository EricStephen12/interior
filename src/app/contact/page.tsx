import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Zap, ArrowUpRight } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Connect with the SHARERS GYM performance lab. Inquire about memberships, personal training, and recovery lab bookings.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Cinematic Hero */}
      <section className="relative h-[50vh] sm:h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=2000&q=90"
            alt="SHARERS GYM Contact"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 w-full">
          <span className="text-[10px] font-black tracking-[0.8em] text-accent uppercase mb-4 block">MEMBER SUPPORT</span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] font-display">
            Get in <span className="text-accent italic font-light">Touch.</span>
          </h1>
          <p className="text-sm sm:text-base text-white/40 font-medium mt-4 max-w-lg">
            Whether you're ready to start training or have a question about your membership, we're here.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

            {/* Left Column - Contact Form */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="bg-secondary/20 p-6 sm:p-10 md:p-16 border border-primary/5">
                <div className="mb-8 sm:mb-14">
                  <span className="text-[10px] font-black tracking-[0.4em] text-accent uppercase mb-3 block">DIRECT LINE</span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-primary tracking-tighter leading-[0.9] font-display">
                    Send us a <span className="text-accent italic font-light">Message.</span>
                  </h2>
                </div>

                <ContactForm />
              </div>
            </div>

            {/* Right Column - Contact Details */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-6 sm:space-y-8">

              {/* Contact Cards */}
              <ContactCard
                icon={MessageCircle}
                title="WhatsApp Direct"
                value="Instant Chat"
                subtitle="Fastest response • Usually within minutes"
                link="https://wa.me/234XXXXXXXXXX"
                accent
              />
              <ContactCard
                icon={Mail}
                title="Email Us"
                value="ops@sharersgym.com"
                subtitle="Business inquiries & partnerships"
              />
              <ContactCard
                icon={Phone}
                title="Call Direct"
                value="+234 (0) 900 SHARERS"
                subtitle="Available Mon–Sat • 6AM – 10PM"
              />
              <ContactCard
                icon={MapPin}
                title="The Arena"
                value="Lagos, Nigeria"
                subtitle="Come see the space for yourself"
              />

              {/* Response Time Card */}
              <div className="bg-primary p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                  <span className="text-[8rem] font-black leading-none">S</span>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-[10px] font-black tracking-[0.4em] text-accent uppercase">Fast Response</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black mb-2 tracking-tight">Under 15 minutes.</h4>
                  <p className="text-xs sm:text-sm text-white/40 font-medium leading-relaxed">
                    Current members get priority response. General questions are answered within a few hours.
                  </p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="border border-primary/10 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Operating Hours</span>
                </div>
                <div className="space-y-3">
                  <HourRow day="Monday – Friday" hours="5:00 AM – 11:00 PM" />
                  <HourRow day="Saturday" hours="6:00 AM – 10:00 PM" />
                  <HourRow day="Sunday" hours="7:00 AM – 8:00 PM" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function ContactCard({ icon: Icon, title, value, subtitle, link, accent }: {
  icon: React.ElementType, title: string, value: string, subtitle: string, link?: string, accent?: boolean
}) {
  const Wrapper = link ? 'a' : 'div';
  const wrapperProps = link ? { href: link, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Wrapper {...wrapperProps} className={`group block p-5 sm:p-6 border transition-all duration-500 ${accent
      ? 'bg-accent/5 border-accent/20 hover:bg-accent/10 hover:border-accent/40'
      : 'border-primary/5 hover:border-accent/20 bg-white'
    } ${link ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start gap-4 sm:gap-6">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
          accent ? 'bg-accent text-white' : 'bg-secondary text-primary group-hover:bg-accent group-hover:text-white'
        }`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</span>
            {link && <ArrowUpRight className="w-3 h-3 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
          <p className="text-base sm:text-lg font-bold text-primary tracking-tight truncate">{value}</p>
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1">{subtitle}</p>
        </div>
      </div>
    </Wrapper>
  );
}

function HourRow({ day, hours }: { day: string, hours: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-primary/5 last:border-0">
      <span className="text-xs sm:text-sm font-bold text-primary">{day}</span>
      <span className="text-[10px] sm:text-xs font-black text-accent tracking-wider">{hours}</span>
    </div>
  );
}
