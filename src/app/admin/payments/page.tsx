'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Building2, 
  Key, 
  Eye, 
  EyeOff, 
  Check, 
  Save, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw,
  Coins,
  Copy,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function AdminPaymentsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const [settings, setSettings] = useState<Record<string, string>>({
    payment_kingspay_enabled: 'true',
    payment_kingspay_secret_key: '',
    payment_kingspay_env: 'production',
    payment_kingspay_app_url: '',
    espees_exchange_rate: '2050',
    payment_manual_enabled: 'true',
    payment_manual_bank_name: 'Zenith Bank',
    payment_manual_account_name: 'SHARERS GYM ATELIER LTD',
    payment_manual_account_number: '1223456789',
    payment_manual_instructions: 'Please transfer the exact order amount. Use your Full Name or Phone Number as payment reference.',
  });

  useEffect(() => {
    fetch('/api/admin/payments')
      .then(r => r.json())
      .then(data => {
        if (data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {
        showToast('Failed to load payment settings', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        showToast('Payment gateways & bank account updated successfully!', 'success');
      } else {
        throw new Error('Save error');
      }
    } catch {
      showToast('Failed to save payment settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    showToast('Account number copied to clipboard', 'info');
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="h-10 w-64 bg-secondary/40 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-secondary/30 animate-pulse rounded-xl" />
          <div className="h-96 bg-secondary/30 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-primary/5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-primary uppercase tracking-tight font-heading">
            Payment Gateways & Manual Accounts
          </h1>
          <p className="text-xs font-medium text-text-muted mt-1">
            Configure live KingsPay API keys, Espees conversion rates, and the store's official manual bank transfer account.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-primary hover:bg-accent disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Settings
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
        
        {/* ── CARD 1: KINGSPAY GATEWAY & ESPEES ── */}
        <div className="bg-white border border-primary/10 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Gateway Header */}
            <div className="flex items-center justify-between pb-4 border-b border-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                  <CreditCard className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-base font-black text-primary uppercase tracking-wider">KingsPay Gateway</h2>
                  <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Debit Card / KingsChat / Espees</span>
                </div>
              </div>

              {/* Enable Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.payment_kingspay_enabled === 'true'}
                  onChange={e => handleChange('payment_kingspay_enabled', e.target.checked ? 'true' : 'false')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>

            {/* Secret API Key */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center justify-between">
                <span>KingsPay Secret API Key</span>
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="text-[10px] text-accent flex items-center gap-1 font-semibold hover:underline"
                >
                  {showSecretKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showSecretKey ? 'Hide' : 'Reveal'}
                </button>
              </label>
              <div className="relative">
                <input
                  type={showSecretKey ? 'text' : 'password'}
                  value={settings.payment_kingspay_secret_key}
                  onChange={e => handleChange('payment_kingspay_secret_key', e.target.value)}
                  placeholder="kp_sec_live_xxxxxxxxxxxxxxxx"
                  className="w-full p-3 bg-secondary/30 border border-primary/10 rounded text-xs font-mono font-bold text-primary focus:outline-none focus:border-accent"
                />
              </div>
              <p className="text-[10px] text-text-muted">
                Generated from your KingsPay Merchant Dashboard. Keep this key secure.
              </p>
            </div>

            {/* Environment Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-wider block">Gateway Environment</label>
              <div className="grid grid-cols-2 gap-3">
                {['production', 'test'].map(env => {
                  const isSelected = settings.payment_kingspay_env === env;
                  return (
                    <button
                      key={env}
                      type="button"
                      onClick={() => handleChange('payment_kingspay_env', env)}
                      className={`p-3 rounded border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-secondary/30 border-primary/10 text-primary hover:bg-secondary'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${env === 'production' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {env === 'production' ? 'Live Production' : 'Sandbox / Test'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Espees Exchange Rate */}
            <div className="space-y-2 pt-2 border-t border-primary/5">
              <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-accent" />
                Espees Exchange Rate (₦ per 1 ESP)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-xs font-bold text-text-muted">₦</span>
                <input
                  type="number"
                  value={settings.espees_exchange_rate}
                  onChange={e => handleChange('espees_exchange_rate', e.target.value)}
                  placeholder="2050"
                  className="w-full pl-8 pr-3 py-2.5 bg-secondary/30 border border-primary/10 rounded text-xs font-mono font-bold text-primary focus:outline-none focus:border-accent"
                />
              </div>
              <p className="text-[10px] text-text-muted">
                Used to compute the exact Espees amount when members pay using Espees tokens.
              </p>
            </div>

          </div>

          <div className="pt-4 border-t border-primary/5 flex items-center justify-between text-[11px] text-text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Direct KingsPay SDK Integration
            </span>
            <a
              href="https://kingspay-gs.com"
              target="_blank"
              rel="noreferrer"
              className="text-accent font-bold hover:underline flex items-center gap-1"
            >
              Merchant Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* ── CARD 2: MANUAL BANK TRANSFER ACCOUNT ── */}
        <div className="bg-white border border-primary/10 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Manual Account Header */}
            <div className="flex items-center justify-between pb-4 border-b border-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-primary uppercase tracking-wider">Manual Bank Transfer</h2>
                  <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Direct Bank Wire / USSD / App</span>
                </div>
              </div>

              {/* Enable Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.payment_manual_enabled === 'true'}
                  onChange={e => handleChange('payment_manual_enabled', e.target.checked ? 'true' : 'false')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>

            {/* Bank Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wider block">Bank Name</label>
              <input
                type="text"
                value={settings.payment_manual_bank_name}
                onChange={e => handleChange('payment_manual_bank_name', e.target.value)}
                placeholder="e.g. Zenith Bank / GTBank / Access Bank"
                className="w-full p-3 bg-secondary/30 border border-primary/10 rounded text-xs font-bold text-primary focus:outline-none focus:border-accent"
              />
            </div>

            {/* Account Name & Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary uppercase tracking-wider block">Account Name</label>
                <input
                  type="text"
                  value={settings.payment_manual_account_name}
                  onChange={e => handleChange('payment_manual_account_name', e.target.value)}
                  placeholder="SHARERS GYM ATELIER LTD"
                  className="w-full p-3 bg-secondary/30 border border-primary/10 rounded text-xs font-bold text-primary focus:outline-none focus:border-accent uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-primary uppercase tracking-wider block">Account Number (NUBAN)</label>
                <input
                  type="text"
                  value={settings.payment_manual_account_number}
                  onChange={e => handleChange('payment_manual_account_number', e.target.value)}
                  placeholder="1223456789"
                  className="w-full p-3 bg-secondary/30 border border-primary/10 rounded text-xs font-mono font-bold text-primary focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary uppercase tracking-wider block">Customer Transfer Instructions</label>
              <textarea
                rows={2}
                value={settings.payment_manual_instructions}
                onChange={e => handleChange('payment_manual_instructions', e.target.value)}
                placeholder="Instructions for the customer..."
                className="w-full p-3 bg-secondary/30 border border-primary/10 rounded text-xs font-medium text-primary focus:outline-none focus:border-accent"
              />
            </div>

            {/* Live Customer Checkout Card Preview */}
            <div className="pt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-2">Live Customer Card Preview:</span>
              <div className="p-4 bg-secondary/30 border border-accent/30 rounded-xl space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-accent tracking-wider">{settings.payment_manual_bank_name || 'Bank Name'}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.payment_manual_account_number)}
                    className="text-[10px] font-bold text-primary flex items-center gap-1 bg-white px-2 py-1 rounded shadow-xs hover:text-accent transition-colors"
                  >
                    {copiedAccount ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedAccount ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="font-mono text-base font-black text-primary tracking-widest">
                  {settings.payment_manual_account_number || '0000000000'}
                </div>
                <div className="text-[10px] font-bold text-text-muted uppercase">
                  {settings.payment_manual_account_name || 'ACCOUNT NAME'}
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-primary/5 flex items-center justify-between text-[11px] text-text-muted">
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              Manual bank transfers require 1-click Admin verification in Orders.
            </span>
          </div>
        </div>

      </form>
    </div>
  );
}
