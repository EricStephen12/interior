'use client'

import { useState } from 'react'
import { Megaphone, MailCheck, Loader2, Check, Sparkles, Send } from 'lucide-react'

export default function AdminQuickActions({
  initialBannerEnabled = true,
  initialBannerMessage = 'Limited Time — Free Delivery on Orders Above ₦50,000',
  initialBannerCode = 'FREESHIP',
}: {
  initialBannerEnabled?: boolean
  initialBannerMessage?: string
  initialBannerCode?: string
}) {
  // Banner state
  const [bannerEnabled, setBannerEnabled] = useState(initialBannerEnabled)
  const [bannerMessage, setBannerMessage] = useState(initialBannerMessage)
  const [bannerCode, setBannerCode] = useState(initialBannerCode)
  const [savingBanner, setSavingBanner] = useState(false)
  const [bannerSaved, setBannerSaved] = useState(false)

  // Executive briefing state
  const [sendingDigest, setSendingDigest] = useState(false)
  const [digestSuccess, setDigestSuccess] = useState<string | null>(null)

  const handleSaveBanner = async () => {
    setSavingBanner(true)
    setBannerSaved(false)
    try {
      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: [
            { key: 'section.banner.enabled', value: bannerEnabled ? 'true' : 'false' },
            { key: 'section.banner.message', value: bannerMessage.trim() },
            { key: 'section.banner.code', value: bannerCode.trim() },
          ],
        }),
      })
      if (res.ok) {
        setBannerSaved(true)
        setTimeout(() => setBannerSaved(false), 2500)
      } else {
        alert('Failed to save announcement banner.')
      }
    } catch {
      alert('Network error saving announcement.')
    } finally {
      setSavingBanner(false)
    }
  }

  const handleSendDigest = async () => {
    setSendingDigest(true)
    setDigestSuccess(null)
    try {
      const res = await fetch('/api/admin/daily-digest', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.success) {
        setDigestSuccess(`Briefing sent to sharersmall@gmail.com!`)
        setTimeout(() => setDigestSuccess(null), 5000)
      } else {
        alert(data.error || 'Failed to dispatch digest.')
      }
    } catch {
      alert('Network error dispatching digest.')
    } finally {
      setSendingDigest(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
      {/* 1. Live Announcement Banner Manager (Spans 2 cols) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-bold">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-primary uppercase tracking-wider">Storefront Announcement Banner</h3>
                <p className="text-[11px] text-slate-400">Live promo & notice bar at the very top of all visitor pages.</p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={bannerEnabled}
                onChange={e => setBannerEnabled(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
              <span className={`text-[10px] font-black uppercase tracking-wider ${bannerEnabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                {bannerEnabled ? 'Active' : 'Off'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                Banner Notice / Message
              </label>
              <input
                type="text"
                value={bannerMessage}
                onChange={e => setBannerMessage(e.target.value)}
                placeholder="e.g. 🔥 Weekend Flash Sale: 20% Off All Gym Passes!"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                Promo Code (Optional)
              </label>
              <input
                type="text"
                value={bannerCode}
                onChange={e => setBannerCode(e.target.value.toUpperCase())}
                placeholder="e.g. FREESHIP"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-accent" /> Updates live on site instantly
          </span>
          <button
            type="button"
            onClick={handleSaveBanner}
            disabled={savingBanner}
            className="flex items-center gap-2 bg-primary text-white hover:bg-accent px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
          >
            {savingBanner ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : bannerSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved & Live!</span>
              </>
            ) : (
              <span>Publish Banner</span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Executive Operations & Daily Digest (1 col) */}
      <div className="bg-gradient-to-br from-[#0b0f19] to-[#020617] text-white rounded-2xl border border-gray-800 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <MailCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Executive Digest</h3>
              <p className="text-[10px] text-slate-400">Resend Free Automation</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Receive a 24-hour summary of total revenue, facility check-ins, new member registrations, and low-stock items directly in your inbox.
          </p>

          {digestSuccess && (
            <div className="p-2.5 mb-4 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-[11px] font-bold flex items-center gap-2">
              <Check className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{digestSuccess}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSendDigest}
          disabled={sendingDigest}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 shadow-md"
        >
          {sendingDigest ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Compiling & Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send Executive Briefing</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
