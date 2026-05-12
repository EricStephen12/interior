'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, Loader2, Link as LinkIcon } from 'lucide-react';

function SyncEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const kcId = searchParams.get('kc_id');
  const name = searchParams.get('name');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/kingschat/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, kingschatId: kcId })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard?kc_login=success');
        }, 2000);
      } else {
        setError(data.error || 'Sync failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 sm:p-12 shadow-2xl border border-primary/5"
      >
        <div className="text-center mb-10">
          <LinkIcon className="w-10 h-10 text-accent mx-auto mb-6" />
          <h1 className="text-3xl font-black text-primary uppercase tracking-tight">Sync <span className="text-accent italic font-light lowercase">Account.</span></h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 leading-loose">
            Welcome, <span className="text-primary">{name || 'Member'}</span>. <br />
            Enter your email to link your KingsChat and secure your days.
          </p>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center space-y-4"
          >
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <p className="text-sm font-bold text-primary">Protocol Synchronized.</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Redirecting to Dashboard...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSync} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Member Email</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 py-4 bg-transparent border-b border-primary/10 rounded-none focus:outline-none focus:border-accent transition-colors font-medium text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {error && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">{error}</p>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full h-14 bg-primary text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-accent transition-all duration-500 shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'SYNCHRONIZE PROTOCOL'}
            </button>
            
            <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest pt-4">
              SECURE DIGITAL AUTHENTICATION
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function SyncEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SyncEmailContent />
        </Suspense>
    )
}
