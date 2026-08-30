'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Type, 
  Palette, 
  Sliders, 
  Layers, 
  Save, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ExternalLink, 
  RefreshCw, 
  Sparkles, 
  ChevronRight, 
  Megaphone, 
  Zap, 
  BookOpen, 
  ShoppingBag, 
  Anchor, 
  ArrowLeft, 
  FileText, 
  HelpCircle, 
  Mail, 
  Info,
  Shield,
  CreditCard,
  UploadCloud,
  Image as ImageIcon,
  Video as VideoIcon,
  Check,
  X,
  Loader2,
  Package,
  Truck,
  RotateCcw,
  Maximize2,
  Square,
  Newspaper,
  Plus,
  Trash2
} from 'lucide-react'
import { THEME_DEFAULTS, THEME_KEYS, ThemeKey } from '@/app/api/theme/route'
import { useToast } from '@/components/ToastProvider'

const FONTS_HEADING = [
  'Cormorant Garamond',
  'Playfair Display',
  'Cinzel',
  'Bodoni Moda',
  'Prata',
  'Syne',
  'Montserrat',
  'Oswald',
  'Unna',
  'Fraunces'
]

const FONTS_BODY = [
  'Outfit',
  'Plus Jakarta Sans',
  'Inter',
  'Space Grotesk',
  'DM Sans',
  'Manrope',
  'Poppins',
  'Roboto'
]

const PRESETS = [
  {
    name: 'Sharers Elite',
    primary: '#020617',
    accent: '#6366f1',
    heading: 'Cormorant Garamond',
    body: 'Outfit',
    radius: '0px',
    tracking: '-0.04em'
  },
  {
    name: 'Royal Gold',
    primary: '#09090b',
    accent: '#eab308',
    heading: 'Playfair Display',
    body: 'Plus Jakarta Sans',
    radius: '0px',
    tracking: '-0.02em'
  },
  {
    name: 'Emerald Luxury',
    primary: '#022c22',
    accent: '#10b981',
    heading: 'Cinzel',
    body: 'Manrope',
    radius: '6px',
    tracking: '0.02em'
  },
  {
    name: 'Cyber Cyan',
    primary: '#030712',
    accent: '#06b6d4',
    heading: 'Syne',
    body: 'Space Grotesk',
    radius: '12px',
    tracking: '-0.03em'
  },
]

// All available pages across the storefront
const PAGES = [
  { label: 'Home Page', path: '/' },
  { label: 'Shop / Arsenal Catalog', path: '/products' },
  { label: 'Product Details (PDP)', path: '/products' },
  { label: 'Journal / Playbook Blog', path: '/blog' },
  { label: 'About & Ethos', path: '/about' },
  { label: 'Contact Terminal', path: '/contact' },
  { label: 'FAQs Protocol', path: '/faqs' },
  { label: 'Member Portal', path: '/dashboard' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Use', path: '/terms' },
  { label: 'Refund Policy', path: '/refund' },
]

// Map each page to its configurable sections
const PAGE_SECTIONS_MAP: Record<string, { id: string; label: string; icon: any; descKey: string }[]> = {
  '/': [
    { id: 'banner', label: 'Announcement Banner', icon: Megaphone, descKey: 'section.banner.message' },
    { id: 'hero', label: 'Hero Showcase & Media', icon: Zap, descKey: 'section.hero.title1' },
    { id: 'story', label: 'Story & Cinematic Videos', icon: BookOpen, descKey: 'section.story.badge1' },
    { id: 'shop', label: 'Arsenal Shop Grid', icon: ShoppingBag, descKey: 'section.shop.title1' },
    { id: 'footer', label: 'Global Footer & Logo', icon: Anchor, descKey: 'section.footer.address' },
  ],
  '/products': [
    { id: 'shop', label: 'Arsenal Shop Header', icon: ShoppingBag, descKey: 'section.shop.title1' },
    { id: 'pdp', label: 'Product Details (PDP) Customizer', icon: Package, descKey: 'section.pdp.btnAddToCart' },
    { id: 'banner', label: 'Announcement Banner', icon: Megaphone, descKey: 'section.banner.message' },
    { id: 'footer', label: 'Global Footer & Logo', icon: Anchor, descKey: 'section.footer.address' },
  ],
  '/blog': [
    { id: 'blog', label: 'Journal / Blog Header', icon: Newspaper, descKey: 'section.blog.title1' },
    { id: 'banner', label: 'Announcement Banner', icon: Megaphone, descKey: 'section.banner.message' },
    { id: 'footer', label: 'Global Footer & Logo', icon: Anchor, descKey: 'section.footer.address' },
  ],
  '/about': [
    { id: 'about', label: 'About Ethos & Hero', icon: Info, descKey: 'section.about.title1' },
    { id: 'story', label: 'Origin Mission Chapter', icon: BookOpen, descKey: 'section.story.badge1' },
    { id: 'footer', label: 'Global Footer & Logo', icon: Anchor, descKey: 'section.footer.address' },
  ],
  '/contact': [
    { id: 'contact', label: 'Contact Hero & Terminal', icon: Mail, descKey: 'section.contact.title1' },
    { id: 'footer', label: 'Global Footer & Logo', icon: Anchor, descKey: 'section.footer.address' },
  ],
  '/faqs': [
    { id: 'faqs', label: 'FAQs Header & Info', icon: HelpCircle, descKey: 'section.faqs.title1' },
    { id: 'footer', label: 'Global Footer & Logo', icon: Anchor, descKey: 'section.footer.address' },
  ],
  '/checkout': [
    { id: 'checkout', label: 'Checkout Terminal & Steps', icon: CreditCard, descKey: 'section.checkout.title1' },
    { id: 'cart', label: 'Cart Drawer & Upsells', icon: ShoppingBag, descKey: 'section.cart.title' },
    { id: 'banner', label: 'Announcement Banner', icon: Megaphone, descKey: 'section.banner.message' },
    { id: 'footer', label: 'Global Footer & Logo', icon: Anchor, descKey: 'section.footer.address' },
  ],
  '/dashboard': [
    { id: 'hero', label: 'Portal Welcome Accent', icon: CreditCard, descKey: 'section.hero.tagline' },
    { id: 'cart', label: 'Cart Drawer & Upsells', icon: ShoppingBag, descKey: 'section.cart.title' },
    { id: 'footer', label: 'Global Footer & Logo', icon: Anchor, descKey: 'section.footer.address' },
  ],
  '/privacy': [
    { id: 'privacy', label: 'Privacy Policy Header', icon: Shield, descKey: 'section.privacy.title1' },
    { id: 'footer', label: 'Global Footer & Logo', icon: Anchor, descKey: 'section.footer.address' },
  ],
  '/terms': [
    { id: 'terms', label: 'Terms of Use Header', icon: FileText, descKey: 'section.terms.title1' },
    { id: 'footer', label: 'Global Footer & Logo', icon: Anchor, descKey: 'section.footer.address' },
  ],
  '/refund': [
    { id: 'refund', label: 'Refund Policy Header', icon: FileText, descKey: 'section.refund.title1' },
    { id: 'footer', label: 'Global Footer & Logo', icon: Anchor, descKey: 'section.footer.address' },
  ],
}

/** Media Field with Drag/Click File Upload to Cloudinary + Direct URL input */
function MediaCustomizerField({
  label,
  value,
  type = 'image',
  onChange,
  onReset
}: {
  label: string
  value: string
  type?: 'image' | 'video'
  onChange: (url: string) => void
  onReset?: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.secure_url) {
        onChange(data.secure_url)
      } else {
        alert(data.error || 'Failed to upload media')
      }
    } catch {
      alert('Network upload error')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2 p-3 bg-secondary/30 rounded border border-primary/10">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
          {type === 'video' ? <VideoIcon className="w-3.5 h-3.5 text-accent" /> : <ImageIcon className="w-3.5 h-3.5 text-accent" />}
          {label}
        </label>
        {onReset && (
          <button
            onClick={onReset}
            className="text-[10px] text-text-muted hover:text-red-500 transition-colors font-bold"
          >
            Reset
          </button>
        )}
      </div>

      {/* Media Preview Box */}
      <div className="relative rounded overflow-hidden bg-black/5 aspect-video flex items-center justify-center border border-primary/5 group">
        {type === 'video' ? (
          <video
            key={value}
            src={value}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png' }}
          />
        )}

        {/* Upload Overlay Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1.5 bg-white text-primary text-xs font-black uppercase tracking-wider rounded shadow-md flex items-center gap-1.5 hover:bg-accent hover:text-white transition-all"
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
            Replace {type}
          </button>
        </div>
      </div>

      {/* Upload button + URL input */}
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept={type === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/png,image/jpeg,image/webp,image/svg+xml'}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 bg-primary text-white text-[11px] font-bold uppercase rounded flex items-center gap-1.5 hover:bg-accent transition-colors disabled:opacity-40 shrink-0"
        >
          {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
          Upload File
        </button>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Or paste media URL..."
          className="flex-1 p-2 bg-white border border-primary/10 text-xs font-mono text-primary rounded focus:outline-none focus:border-accent"
        />
      </div>
    </div>
  )
}

/** Reusable Button & Action CTA Customizer */
function SectionCTAButtonField({
  label = "Call-To-Action Button",
  textKey,
  linkKey,
  v,
  update,
  defaultText = "Explore Collection",
  defaultLink = "/shop"
}: {
  label?: string
  textKey: string
  linkKey?: string
  v: (key: string, fallback?: string) => string
  update: (key: string, value: string) => void
  defaultText?: string
  defaultLink?: string
}) {
  return (
    <div className="pt-2 border-t border-primary/5 space-y-2">
      <label className="text-xs font-bold text-primary uppercase tracking-wider block">{label}</label>
      <div className={linkKey ? "grid grid-cols-1 sm:grid-cols-2 gap-2" : "space-y-1"}>
        <div>
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-1">Button Label</span>
          <input
            type="text"
            value={v(textKey, defaultText)}
            onChange={e => update(textKey, e.target.value)}
            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded uppercase focus:outline-none focus:border-accent"
            placeholder="Button Text"
          />
        </div>
        {linkKey && (
          <div>
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-1">Destination Link</span>
            <input
              type="text"
              value={v(linkKey, defaultLink)}
              onChange={e => update(linkKey, e.target.value)}
              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-mono text-primary rounded focus:outline-none focus:border-accent"
              placeholder="/shop or URL"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function toHexColor(val: string, fallback = '#000000'): string {
  if (!val) return fallback
  const cleaned = val.trim()
  if (/^#([0-9a-fA-F]{3}){1,2}$/.test(cleaned)) {
    if (cleaned.length === 4) {
      return `#${cleaned[1]}${cleaned[1]}${cleaned[2]}${cleaned[2]}${cleaned[3]}${cleaned[3]}`
    }
    return cleaned
  }
  return fallback
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/** In-App Color Studio with Hex Input, Sliders & Curated Swatches (No Ugly Native Dialog) */
/** In-App Color Studio with Hex Input, Sliders, Curated Swatches & Custom Color Palette */
function ColorPickerField({
  label,
  value,
  onChange,
  onReset,
  defaultValue = '#000000'
}: {
  label: string
  value: string
  onChange: (val: string) => void
  onReset?: () => void
  defaultValue?: string
}) {
  const [showSliders, setShowSliders] = useState(false)
  const [hue, setHue] = useState(240)
  const [lightness, setLightness] = useState(50)
  const [customSwatches, setCustomSwatches] = useState<string[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sharers_user_swatches')
      if (saved) setCustomSwatches(JSON.parse(saved))
    } catch {}
  }, [])

  const saveToCustomSwatches = (colorToSave: string) => {
    if (!colorToSave || customSwatches.includes(colorToSave)) return
    const updated = [colorToSave, ...customSwatches].slice(0, 16)
    setCustomSwatches(updated)
    try {
      localStorage.setItem('sharers_user_swatches', JSON.stringify(updated))
    } catch {}
  }

  const removeCustomSwatch = (colorToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = customSwatches.filter(c => c !== colorToRemove)
    setCustomSwatches(updated)
    try {
      localStorage.setItem('sharers_user_swatches', JSON.stringify(updated))
    } catch {}
  }

  const greysAndNeutrals = [
    '#020617', // Obsidian
    '#09090b', // Deep Zinc
    '#1e293b', // Slate Dark
    '#475569', // Charcoal
    '#64748b', // Slate Grey
    '#808080', // Medium Grey
    '#94a3b8', // Muted Slate
    '#cbd5e1', // Silver
    '#f8fafc', // Clean White
  ]

  const accentGems = [
    '#6366f1', // Indigo Electric
    '#818cf8', // Lavender
    '#a855f7', // Amethyst
    '#ec4899', // Hyper Pink
    '#ef4444', // Crimson Red
    '#f97316', // Tangerine
    '#eab308', // Atelier Gold
    '#10b981', // Emerald
    '#14b8a6', // Teal Luxe
    '#06b6d4', // Cyber Cyan
  ]

  const handleHueChange = (newHue: number) => {
    setHue(newHue)
    const newHex = hslToHex(newHue, 90, lightness)
    onChange(newHex)
  }

  const handleLightnessChange = (newL: number) => {
    setLightness(newL)
    const newHex = hslToHex(hue, 90, newL)
    onChange(newHex)
  }

  return (
    <div className="p-3 bg-secondary/30 rounded-lg border border-primary/10 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-primary uppercase tracking-wider block">{label}</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSliders(!showSliders)}
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded transition-colors ${
              showSliders ? 'bg-primary text-white' : 'bg-secondary text-text-muted hover:text-primary'
            }`}
          >
            {showSliders ? 'Sliders Active' : 'Sliders'}
          </button>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="text-[10px] font-bold text-text-muted hover:text-accent transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Color Input Row */}
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-lg border border-primary/20 shadow-xs shrink-0 ring-1 ring-primary/5 transition-transform"
          style={{ backgroundColor: value || defaultValue }}
        />
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="#000000"
            className="w-full p-2 bg-white border border-primary/10 text-xs font-mono font-black text-primary rounded focus:outline-none focus:border-accent uppercase tracking-wider shadow-2xs"
          />
        </div>
        <button
          type="button"
          onClick={() => saveToCustomSwatches(value || defaultValue)}
          className="p-2 bg-secondary hover:bg-primary hover:text-white text-text-muted rounded border border-primary/10 text-[10px] font-black uppercase transition-colors shrink-0 flex items-center gap-1"
          title="Save this color to your custom swatches"
        >
          <Plus className="w-3 h-3" /> Save Color
        </button>
      </div>

      {/* In-App Live Hue & Lightness Sliders */}
      {showSliders && (
        <div className="p-2.5 bg-white rounded-md border border-primary/10 space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-bold text-text-muted uppercase">
              <span>Hue Spectrum</span>
              <span>{hue}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={e => handleHueChange(parseInt(e.target.value))}
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
              }}
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-bold text-text-muted uppercase">
              <span>Lightness / Shade</span>
              <span>{lightness}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={lightness}
              onChange={e => handleLightnessChange(parseInt(e.target.value))}
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #000000, ' + hslToHex(hue, 90, 50) + ', #ffffff)'
              }}
            />
          </div>
        </div>
      )}

      {/* Row 0: User Added Custom Colors */}
      {customSwatches.length > 0 && (
        <div className="space-y-1">
          <span className="text-[8px] font-black text-accent uppercase tracking-widest block">Your Saved Colors:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {customSwatches.map(swatch => (
              <div key={swatch} className="relative group">
                <button
                  type="button"
                  onClick={() => onChange(swatch)}
                  className={`w-5 h-5 rounded-md border transition-all ${
                    value?.toLowerCase() === swatch.toLowerCase()
                      ? 'scale-125 border-primary shadow-xs ring-2 ring-accent z-10'
                      : 'border-primary/20 hover:scale-110'
                  }`}
                  style={{ backgroundColor: swatch }}
                  title={swatch}
                />
                <button
                  type="button"
                  onClick={(e) => removeCustomSwatch(swatch, e)}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-[8px] leading-none hidden group-hover:flex items-center justify-center shadow-xs"
                  title="Remove swatch"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 1: Greys & Neutrals */}
      <div className="space-y-1">
        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest block">Greys & Neutrals:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {greysAndNeutrals.map(swatch => (
            <button
              key={swatch}
              type="button"
              onClick={() => onChange(swatch)}
              className={`w-5 h-5 rounded-md border transition-all ${
                value?.toLowerCase() === swatch.toLowerCase()
                  ? 'scale-125 border-primary shadow-xs ring-2 ring-accent z-10'
                  : 'border-primary/20 hover:scale-110'
              }`}
              style={{ backgroundColor: swatch }}
              title={swatch}
            />
          ))}
        </div>
      </div>

      {/* Row 2: Atelier Accents */}
      <div className="space-y-1">
        <span className="text-[8px] font-black text-text-muted uppercase tracking-widest block">Atelier Accents:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {accentGems.map(swatch => (
            <button
              key={swatch}
              type="button"
              onClick={() => onChange(swatch)}
              className={`w-5 h-5 rounded-md border transition-all ${
                value?.toLowerCase() === swatch.toLowerCase()
                  ? 'scale-125 border-primary shadow-xs ring-2 ring-accent z-10'
                  : 'border-primary/20 hover:scale-110'
              }`}
              style={{ backgroundColor: swatch }}
              title={swatch}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ThemeStudioPage() {
  const [theme, setTheme] = useState<Record<string, string>>(THEME_DEFAULTS)
  const [initialTheme, setInitialTheme] = useState<Record<string, string>>(THEME_DEFAULTS)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeMainTab, setActiveMainTab] = useState<'sections' | 'global'>('sections')
  const [selectedSection, setSelectedSection] = useState<string | null>('banner')
  const [activeGlobalTab, setActiveGlobalTab] = useState<'fonts' | 'colors' | 'shape' | 'presets'>('fonts')
  const [currentPath, setCurrentPath] = useState('/')
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor')
  const [customPresets, setCustomPresets] = useState<any[]>([])
  const [isAddingPreset, setIsAddingPreset] = useState(false)
  const [presetForm, setPresetForm] = useState<{
    name: string
    primary: string
    accent: string
    secondary: string
    heading: string
    body: string
    radius: string
    tracking: string
    extraColors: { id: string; name: string; value: string }[]
  }>({
    name: '',
    primary: '#020617',
    accent: '#6366f1',
    secondary: '#f8fafc',
    heading: 'Cormorant Garamond',
    body: 'Outfit',
    radius: '0px',
    tracking: '-0.04em',
    extraColors: []
  })
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { showToast } = useToast()

  // Load custom presets from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sharers_custom_presets')
      if (saved) {
        setCustomPresets(JSON.parse(saved))
      }
    } catch {
      // ignore parsing error
    }
  }, [])

  const openAddPreset = () => {
    setPresetForm({
      name: '',
      primary: v('theme.color.primary', '#020617'),
      accent: v('theme.color.accent', '#6366f1'),
      secondary: v('theme.color.secondary', '#f8fafc'),
      heading: v('theme.font.heading', 'Cormorant Garamond'),
      body: v('theme.font.body', 'Outfit'),
      radius: v('theme.radius.brand', '0px'),
      tracking: v('theme.tracking.heading', '-0.04em'),
      extraColors: []
    })
    setIsAddingPreset(true)
  }

  const handleSaveCustomPreset = (e: React.FormEvent) => {
    e.preventDefault()
    if (!presetForm.name.trim()) {
      showToast('Please enter a preset name', 'error')
      return
    }

    const newPreset = {
      id: Date.now().toString(),
      name: presetForm.name.trim(),
      primary: presetForm.primary,
      accent: presetForm.accent,
      secondary: presetForm.secondary,
      heading: presetForm.heading,
      body: presetForm.body,
      radius: presetForm.radius,
      tracking: presetForm.tracking,
      extraColors: presetForm.extraColors
    }

    const updated = [newPreset, ...customPresets]
    setCustomPresets(updated)
    try {
      localStorage.setItem('sharers_custom_presets', JSON.stringify(updated))
    } catch {}

    // Apply immediately to the live site
    applyPreset(newPreset)
    showToast(`Saved & applied custom preset "${newPreset.name}"`, 'success')
    setIsAddingPreset(false)
  }

  const handleDeleteCustomPreset = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = customPresets.filter(p => p.id !== id)
    setCustomPresets(updated)
    try {
      localStorage.setItem('sharers_custom_presets', JSON.stringify(updated))
    } catch {}
    showToast(`Deleted preset "${name}"`, 'info')
  }

  // Load existing theme & products from API
  useEffect(() => {
    Promise.all([
      fetch('/api/theme').then(r => r.json()),
      fetch('/api/products').then(r => r.json()).catch(() => ({ products: [] }))
    ]).then(([themeData, productsData]) => {
      if (themeData?.theme) {
        setTheme(themeData.theme)
        setInitialTheme(themeData.theme)
      }
      if (productsData?.products) {
        setProducts(productsData.products)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Listen to navigation events from preview iframe (e.g. clicking a product card)
  useEffect(() => {
    const handleIframeNav = (e: MessageEvent) => {
      if (e.data?.type === 'SHARERS_IFRAME_NAVIGATE' && e.data.path) {
        setCurrentPath(e.data.path)
        setSelectedSection(null)
      }
    }
    window.addEventListener('message', handleIframeNav)
    return () => window.removeEventListener('message', handleIframeNav)
  }, [])

  // Send live updates to real iframe via postMessage
  const syncIframe = (newTheme: Record<string, string>) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'SHARERS_THEME_PREVIEW', theme: newTheme },
        '*'
      )
    }
  }

  const update = (key: string, value: string) => {
    const updated = { ...theme, [key]: value }

    // If global accent changed -> cascade to section accents
    if (key === 'theme.color.accent') {
      updated['section.hero.accent'] = value
      updated['section.story.accent'] = value
      updated['section.shop.accent'] = value
      updated['section.footer.accent'] = value
      updated['section.pdp.btnPass'] = value
    }

    // If global primary changed -> cascade to section text colors
    if (key === 'theme.color.primary') {
      updated['section.hero.text'] = value
      updated['section.story.text'] = value
      updated['section.shop.text'] = value
      updated['section.footer.text'] = value
    }

    // If global secondary changed -> cascade to section backgrounds
    if (key === 'theme.color.secondary') {
      updated['section.hero.bg'] = value
      updated['section.story.bg'] = value
      updated['section.shop.bg'] = value
      updated['section.footer.bg'] = value
    }

    setTheme(updated)
    syncIframe(updated)
  }

  const applyPreset = (p: typeof PRESETS[0] | any) => {
    const updated = {
      ...theme,
      'theme.color.primary': p.primary,
      'theme.color.accent': p.accent,
      'theme.color.secondary': p.secondary || '#f8fafc',
      'theme.font.heading': p.heading,
      'theme.font.body': p.body,
      'theme.radius.brand': p.radius,
      'theme.tracking.heading': p.tracking || '-0.04em',
      'section.hero.accent': p.accent,
      'section.hero.text': p.primary,
      'section.story.accent': p.accent,
      'section.story.text': p.primary,
      'section.shop.accent': p.accent,
      'section.shop.text': p.primary,
      'section.footer.accent': p.accent,
      'section.pdp.btnPass': p.accent,
    }
    setTheme(updated)
    syncIframe(updated)
    showToast(`Applied ${p.name} preset`, 'info')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = Object.entries(theme).map(([key, value]) => ({ key, value }))
      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })

      if (res.ok) {
        setInitialTheme(theme)
        showToast('All page, catalog & PDP customizations published live!', 'success')
      } else {
        throw new Error('Save error')
      }
    } catch {
      showToast('Failed to publish customizations', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setTheme(THEME_DEFAULTS)
    syncIframe(THEME_DEFAULTS)
    showToast('Reset to default customizations', 'info')
  }

  const refreshIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = currentPath
    }
  }

  const changePage = (path: string) => {
    setCurrentPath(path)
    setSelectedSection(null)
    if (iframeRef.current) {
      iframeRef.current.src = path
    }
  }

  const hasChanges = JSON.stringify(theme) !== JSON.stringify(initialTheme)

  const v = (key: string, fallback = '') => theme[key] ?? THEME_DEFAULTS[key] ?? fallback

  // Dynamic Page options list including individual real products
  const pageOptions = [
    { label: 'Home Page', path: '/' },
    { label: 'Shop / Arsenal Catalog', path: '/products' },
    ...(products.length > 0
      ? products.map(p => ({
          label: `Product Detail: ${p.name}`,
          path: `/products/${p.id}`
        }))
      : [{ label: 'Product Details (PDP)', path: '/products' }]),
    { label: 'About & Ethos', path: '/about' },
    { label: 'Checkout Terminal', path: '/checkout' },
    { label: 'Contact Terminal', path: '/contact' },
    { label: 'FAQs Protocol', path: '/faqs' },
    { label: 'Member Portal', path: '/dashboard' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Use', path: '/terms' },
    { label: 'Refund Policy', path: '/refund' },
  ]

  // Get current page sections list
  const activePageSections = currentPath.startsWith('/products/') && currentPath !== '/products'
    ? [
        { id: 'pdp', label: 'Product Details (PDP) Customizer', icon: Package, descKey: 'section.pdp.btnAddToCart' },
        { id: 'banner', label: 'Announcement Banner', icon: Megaphone, descKey: 'section.banner.message' },
        { id: 'footer', label: 'Global Footer & Logo', icon: Anchor, descKey: 'section.footer.address' },
      ]
    : (PAGE_SECTIONS_MAP[currentPath] || PAGE_SECTIONS_MAP['/'])

  const currentPageLabel = pageOptions.find(p => p.path === currentPath)?.label || 
    (currentPath.startsWith('/products/') ? 'Product Details (PDP)' : 'Custom Page')

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center bg-[#fafafa]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[100vh] overflow-hidden bg-[#fafafa] text-primary font-sans">
      
      {/* ── TOP SHOPIFY-GRADE CONTROL BAR ── */}
      <header className="h-14 bg-white border-b border-primary/10 px-3 sm:px-4 flex items-center justify-between shrink-0 z-30 shadow-xs">
        
        {/* Left: Brand & Page Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <h1 className="text-xs font-black uppercase tracking-widest text-primary hidden sm:inline">Theme Studio</h1>
          </div>

          {/* Dynamic Page Selector Dropdown */}
          <div className="relative">
            <select
              value={currentPath}
              onChange={e => changePage(e.target.value)}
              className="bg-secondary/40 border border-primary/10 text-primary text-xs font-bold px-2.5 py-1.5 rounded cursor-pointer focus:outline-none focus:border-accent max-w-[140px] sm:max-w-none truncate"
            >
              {pageOptions.map((p, idx) => (
                <option key={idx} value={p.path}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Mobile Viewport Toggle (Editor vs Live Preview) */}
          <div className="flex sm:hidden items-center bg-secondary p-0.5 rounded border border-primary/10">
            <button
              onClick={() => setMobileView('editor')}
              className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all ${
                mobileView === 'editor' ? 'bg-white text-primary shadow-xs' : 'text-text-muted hover:text-primary'
              }`}
            >
              Controls
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all ${
                mobileView === 'preview' ? 'bg-white text-primary shadow-xs' : 'text-text-muted hover:text-primary'
              }`}
            >
              Preview
            </button>
          </div>

          {hasChanges && (
            <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded">
              Unsaved
            </span>
          )}
        </div>

        {/* Center: Device Viewport Switcher (Desktop/Tablet/Mobile) */}
        <div className="hidden sm:flex items-center bg-secondary p-1 rounded border border-primary/10">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded text-xs transition-all ${device === 'desktop' ? 'bg-white text-primary shadow-xs font-bold' : 'text-text-muted hover:text-primary'}`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded text-xs transition-all ${device === 'tablet' ? 'bg-white text-primary shadow-xs font-bold' : 'text-text-muted hover:text-primary'}`}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded text-xs transition-all ${device === 'mobile' ? 'bg-white text-primary shadow-xs font-bold' : 'text-text-muted hover:text-primary'}`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={refreshIframe}
            className="p-1.5 sm:p-2 text-text-muted hover:text-primary rounded hover:bg-secondary transition-colors"
            title="Reload Preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="hidden sm:inline-block px-3 py-1.5 text-xs font-bold text-text-muted hover:text-primary transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="px-3 sm:px-4 py-1.5 bg-primary hover:bg-accent disabled:opacity-40 text-white text-xs font-black uppercase tracking-wider rounded flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Save & Publish</span>
            <span className="sm:hidden">Save</span>
          </button>
        </div>
      </header>

      {/* ── WORKSPACE: SHOPIFY SIDEBAR + REAL LIVE STOREFRONT IFRAME ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* LEFT SETTINGS PANEL - Full height and smooth scrolling on mobile */}
        <aside className={`w-full md:w-84 lg:w-96 bg-white border-r border-primary/10 flex flex-col shrink-0 overflow-y-auto custom-scrollbar z-20 shadow-xs h-full ${
          mobileView === 'editor' ? 'flex' : 'hidden md:flex'
        }`}>
          
          {/* Main Mode Toggle: Sections vs Global Theme */}
          <div className="grid grid-cols-2 p-2 bg-secondary/40 border-b border-primary/5 gap-1 text-xs font-black uppercase tracking-wider">
            <button
              onClick={() => { setActiveMainTab('sections'); setSelectedSection(null) }}
              className={`py-2 px-2 rounded flex items-center justify-center gap-1.5 transition-all ${
                activeMainTab === 'sections'
                  ? 'bg-white text-primary shadow-xs font-bold border border-primary/5'
                  : 'text-text-muted hover:text-primary'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Page Sections</span>
            </button>
            <button
              onClick={() => setActiveMainTab('global')}
              className={`py-2 px-2 rounded flex items-center justify-center gap-1.5 transition-all ${
                activeMainTab === 'global'
                  ? 'bg-white text-primary shadow-xs font-bold border border-primary/5'
                  : 'text-text-muted hover:text-primary'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Global Tokens</span>
            </button>
          </div>

          {/* ═══════════ MODE 1: DYNAMIC SECTIONS TREE FOR CURRENT PAGE ═══════════ */}
          {activeMainTab === 'sections' && (
            <div className="flex-1 flex flex-col">
              
              {/* If no specific section selected -> show dynamic sections list for this page */}
              {!selectedSection ? (
                <div className="p-3 space-y-1">
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-text-muted flex items-center justify-between">
                    <span className="truncate max-w-[200px]">{currentPageLabel} Sections</span>
                    <span className="text-accent font-bold shrink-0">{activePageSections.length} Sections</span>
                  </div>

                  {activePageSections.map(sec => (
                    <button
                      key={sec.id}
                      onClick={() => setSelectedSection(sec.id)}
                      className="w-full p-3.5 rounded bg-white hover:bg-secondary/40 border border-transparent hover:border-primary/10 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-secondary flex items-center justify-center text-primary group-hover:text-accent">
                          <sec.icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-primary block leading-tight">{sec.label}</span>
                          <span className="text-[10px] text-text-muted truncate block max-w-[200px] mt-0.5">
                            {v(sec.descKey)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              ) : (
                /* Active Section Inspector */
                <div className="flex-1 flex flex-col">
                  {/* Back header */}
                  <div className="px-4 py-3 bg-secondary/20 border-b border-primary/5 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedSection(null)}
                      className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sections</span>
                    </button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                      {selectedSection}
                    </span>
                  </div>

                  {/* Section Controls */}
                  <div className="p-5 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
                    
                    {/* SECTION: BANNER */}
                    {selectedSection === 'banner' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-secondary/20 rounded border border-primary/5">
                          <span className="text-xs font-bold text-primary">Enable Banner</span>
                          <input
                            type="checkbox"
                            checked={v('section.banner.enabled') === 'true'}
                            onChange={e => update('section.banner.enabled', e.target.checked ? 'true' : 'false')}
                            className="w-4 h-4 accent-accent cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Headline Text</label>
                          <textarea
                            rows={2}
                            value={v('section.banner.message')}
                            onChange={e => update('section.banner.message', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-semibold text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Coupon Code</label>
                          <input
                            type="text"
                            value={v('section.banner.code')}
                            onChange={e => update('section.banner.code', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent font-mono"
                          />
                        </div>

                        {/* Banner Colors */}
                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">Section Colors</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <ColorPickerField
                              label="Banner Background"
                              value={v('section.banner.bg')}
                              defaultValue={THEME_DEFAULTS['section.banner.bg']}
                              onChange={val => update('section.banner.bg', val)}
                              onReset={() => update('section.banner.bg', THEME_DEFAULTS['section.banner.bg'])}
                            />
                            <ColorPickerField
                              label="Banner Text Color"
                              value={v('section.banner.text')}
                              defaultValue={THEME_DEFAULTS['section.banner.text']}
                              onChange={val => update('section.banner.text', val)}
                              onReset={() => update('section.banner.text', THEME_DEFAULTS['section.banner.text'])}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION: HERO */}
                    {selectedSection === 'hero' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Tagline Badge</label>
                          <input
                            type="text"
                            value={v('section.hero.tagline')}
                            onChange={e => update('section.hero.tagline', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent uppercase tracking-widest"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title Line 1</label>
                            <input
                              type="text"
                              value={v('section.hero.title1')}
                              onChange={e => update('section.hero.title1', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title Line 2 (Accent)</label>
                            <input
                              type="text"
                              value={v('section.hero.title2')}
                              onChange={e => update('section.hero.title2', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded focus:outline-none focus:border-accent italic"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Subtitle Copy</label>
                          <textarea
                            rows={3}
                            value={v('section.hero.subtitle')}
                            onChange={e => update('section.hero.subtitle', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-semibold text-primary rounded focus:outline-none focus:border-accent leading-relaxed"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Button Text</label>
                            <input
                              type="text"
                              value={v('section.hero.btnText')}
                              onChange={e => update('section.hero.btnText', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent uppercase tracking-wider"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Button Link</label>
                            <input
                              type="text"
                              value={v('section.hero.btnLink')}
                              onChange={e => update('section.hero.btnLink', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-mono text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-primary/5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Exclusive Badge & Copy</label>
                          <input
                            type="text"
                            value={v('section.hero.exclusiveBadge')}
                            onChange={e => update('section.hero.exclusiveBadge', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent mb-2"
                            placeholder="Badge label"
                          />
                          <textarea
                            rows={2}
                            value={v('section.hero.exclusiveText')}
                            onChange={e => update('section.hero.exclusiveText', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent"
                            placeholder="Exclusive description"
                          />
                        </div>

                        {/* Hero Media Customizers */}
                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">Hero Media Assets</span>
                          <MediaCustomizerField
                            label="Hero Background Banner"
                            value={v('section.hero.image')}
                            type="image"
                            onChange={url => update('section.hero.image', url)}
                            onReset={() => update('section.hero.image', THEME_DEFAULTS['section.hero.image'])}
                          />
                          <MediaCustomizerField
                            label="Floating PIP Video"
                            value={v('section.hero.pipVideo')}
                            type="video"
                            onChange={url => update('section.hero.pipVideo', url)}
                            onReset={() => update('section.hero.pipVideo', THEME_DEFAULTS['section.hero.pipVideo'])}
                          />
                        </div>

                        {/* Hero Section Custom Colors */}
                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">Section Colors</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <ColorPickerField
                              label="Hero Background"
                              value={v('section.hero.bg')}
                              defaultValue={THEME_DEFAULTS['section.hero.bg']}
                              onChange={val => update('section.hero.bg', val)}
                              onReset={() => update('section.hero.bg', THEME_DEFAULTS['section.hero.bg'])}
                            />
                            <ColorPickerField
                              label="Hero Text Color"
                              value={v('section.hero.text')}
                              defaultValue={THEME_DEFAULTS['section.hero.text']}
                              onChange={val => update('section.hero.text', val)}
                              onReset={() => update('section.hero.text', THEME_DEFAULTS['section.hero.text'])}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION: STORY */}
                    {selectedSection === 'story' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Chapter I Badge</label>
                          <input
                            type="text"
                            value={v('section.story.badge1')}
                            onChange={e => update('section.story.badge1', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent uppercase"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 1</label>
                            <input
                              type="text"
                              value={v('section.story.title1_1')}
                              onChange={e => update('section.story.title1_1', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 2 (Accent)</label>
                            <input
                              type="text"
                              value={v('section.story.title1_2')}
                              onChange={e => update('section.story.title1_2', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded focus:outline-none focus:border-accent italic"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Chapter I Paragraphs (1, 2, 3)</label>
                          <textarea
                            rows={2}
                            value={v('section.story.p1')}
                            onChange={e => update('section.story.p1', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent mb-2"
                            placeholder="Paragraph 1"
                          />
                          <textarea
                            rows={2}
                            value={v('section.story.p2')}
                            onChange={e => update('section.story.p2', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent mb-2"
                            placeholder="Paragraph 2"
                          />
                          <textarea
                            rows={2}
                            value={v('section.story.p3')}
                            onChange={e => update('section.story.p3', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent"
                            placeholder="Paragraph 3"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Established Tag</label>
                          <input
                            type="text"
                            value={v('section.story.est')}
                            onChange={e => update('section.story.est', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent uppercase"
                          />
                        </div>

                        {/* Chapter II */}
                        <div className="pt-3 border-t border-primary/5 space-y-3">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider block">Chapter II Details</span>
                          <input
                            type="text"
                            value={v('section.story.badge2')}
                            onChange={e => update('section.story.badge2', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            placeholder="Badge 2"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={v('section.story.title2_1')}
                              onChange={e => update('section.story.title2_1', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded"
                              placeholder="Title 2 Line 1"
                            />
                            <input
                              type="text"
                              value={v('section.story.title2_2')}
                              onChange={e => update('section.story.title2_2', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded"
                              placeholder="Title 2 Line 2"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={v('section.story.p4')}
                            onChange={e => update('section.story.p4', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded mb-2"
                            placeholder="Chapter II Lead Copy"
                          />
                          <textarea
                            rows={2}
                            value={v('section.story.p5')}
                            onChange={e => update('section.story.p5', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded"
                            placeholder="Chapter II Body Copy"
                          />
                        </div>

                        {/* Story Media (Cinematic Videos) */}
                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">Story Cinematic Videos</span>
                          <MediaCustomizerField
                            label="Chapter I Main Video"
                            value={v('section.story.video1')}
                            type="video"
                            onChange={url => update('section.story.video1', url)}
                            onReset={() => update('section.story.video1', THEME_DEFAULTS['section.story.video1'])}
                          />
                          <MediaCustomizerField
                            label="Chapter II Detail Video"
                            value={v('section.story.video2')}
                            type="video"
                            onChange={url => update('section.story.video2', url)}
                            onReset={() => update('section.story.video2', THEME_DEFAULTS['section.story.video2'])}
                          />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-primary/5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase">Stat 1</label>
                            <input
                              type="text"
                              value={v('section.story.stat1Val')}
                              onChange={e => update('section.story.stat1Val', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              placeholder="REAL"
                            />
                            <input
                              type="text"
                              value={v('section.story.stat1Label')}
                              onChange={e => update('section.story.stat1Label', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-[10px] text-text-muted rounded"
                              placeholder="Results Driven"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase">Stat 2</label>
                            <input
                              type="text"
                              value={v('section.story.stat2Val')}
                              onChange={e => update('section.story.stat2Val', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              placeholder="EXPERT"
                            />
                            <input
                              type="text"
                              value={v('section.story.stat2Label')}
                              onChange={e => update('section.story.stat2Label', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-[10px] text-text-muted rounded"
                              placeholder="Coaching Team"
                            />
                          </div>
                        </div>

                        {/* Story Custom Colors */}
                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">Section Colors</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <ColorPickerField
                              label="Story Background"
                              value={v('section.story.bg')}
                              defaultValue={THEME_DEFAULTS['section.story.bg']}
                              onChange={val => update('section.story.bg', val)}
                              onReset={() => update('section.story.bg', THEME_DEFAULTS['section.story.bg'])}
                            />
                            <ColorPickerField
                              label="Story Text Color"
                              value={v('section.story.text')}
                              defaultValue={THEME_DEFAULTS['section.story.text']}
                              onChange={val => update('section.story.text', val)}
                              onReset={() => update('section.story.text', THEME_DEFAULTS['section.story.text'])}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION: SHOP */}
                    {selectedSection === 'shop' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Section Badge</label>
                          <input
                            type="text"
                            value={v('section.shop.badge')}
                            onChange={e => update('section.shop.badge', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent uppercase"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 1</label>
                            <input
                              type="text"
                              value={v('section.shop.title1')}
                              onChange={e => update('section.shop.title1', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 2 (Accent)</label>
                            <input
                              type="text"
                              value={v('section.shop.title2')}
                              onChange={e => update('section.shop.title2', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Subtitle Description</label>
                          <textarea
                            rows={3}
                            value={v('section.shop.subtitle')}
                            onChange={e => update('section.shop.subtitle', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">"All Items" Filter Pill Text</label>
                          <input
                            type="text"
                            value={v('section.shop.filterAll')}
                            onChange={e => update('section.shop.filterAll', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>

                        {/* Shop Custom Colors */}
                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">Section Colors</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <ColorPickerField
                              label="Shop Background"
                              value={v('section.shop.bg')}
                              defaultValue={THEME_DEFAULTS['section.shop.bg']}
                              onChange={val => update('section.shop.bg', val)}
                              onReset={() => update('section.shop.bg', THEME_DEFAULTS['section.shop.bg'])}
                            />
                            <ColorPickerField
                              label="Shop Text Color"
                              value={v('section.shop.text')}
                              defaultValue={THEME_DEFAULTS['section.shop.text']}
                              onChange={val => update('section.shop.text', val)}
                              onReset={() => update('section.shop.text', THEME_DEFAULTS['section.shop.text'])}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION: PRODUCT DETAILS PAGE (PDP) */}
                    {selectedSection === 'pdp' && (
                      <div className="space-y-4">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider block">Buttons & Cart Actions</span>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary block">Add To Bag Text</label>
                            <input
                              type="text"
                              value={v('section.pdp.btnAddToCart')}
                              onChange={e => update('section.pdp.btnAddToCart', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded uppercase focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary block">Pass Button Text</label>
                            <input
                              type="text"
                              value={v('section.pdp.btnPass')}
                              onChange={e => update('section.pdp.btnPass', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded uppercase focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-primary/5 space-y-3">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider block">PDP 3-Column Trust Bar</span>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-text-muted uppercase">Badge 1 Label</label>
                              <input
                                type="text"
                                value={v('section.pdp.badge1')}
                                onChange={e => update('section.pdp.badge1', e.target.value)}
                                className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-text-muted uppercase">Badge 2 Label</label>
                              <input
                                type="text"
                                value={v('section.pdp.badge2')}
                                onChange={e => update('section.pdp.badge2', e.target.value)}
                                className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-text-muted uppercase">Badge 3 Label</label>
                              <input
                                type="text"
                                value={v('section.pdp.badge3')}
                                onChange={e => update('section.pdp.badge3', e.target.value)}
                                className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-primary/5 space-y-3">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider block">PDP Section Titles</span>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-text-muted uppercase">Product Specs Title</label>
                              <input
                                type="text"
                                value={v('section.pdp.metaTitle')}
                                onChange={e => update('section.pdp.metaTitle', e.target.value)}
                                className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-text-muted uppercase">Reviews Section Title</label>
                              <input
                                type="text"
                                value={v('section.pdp.reviewsTitle')}
                                onChange={e => update('section.pdp.reviewsTitle', e.target.value)}
                                className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-text-muted uppercase">Recently Viewed Section Title</label>
                              <input
                                type="text"
                                value={v('section.pdp.recentlyTitle')}
                                onChange={e => update('section.pdp.recentlyTitle', e.target.value)}
                                className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION: CART */}
                    {selectedSection === 'cart' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Drawer Title</label>
                          <input
                            type="text"
                            value={v('section.cart.title')}
                            onChange={e => update('section.cart.title', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded uppercase focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary block">Checkout Button</label>
                            <input
                              type="text"
                              value={v('section.cart.checkoutBtn')}
                              onChange={e => update('section.cart.checkoutBtn', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded uppercase focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary block">Continue Button</label>
                            <input
                              type="text"
                              value={v('section.cart.continueBtn')}
                              onChange={e => update('section.cart.continueBtn', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-primary/5 space-y-2">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Empty State Copy</label>
                          <input
                            type="text"
                            value={v('section.cart.emptyTitle')}
                            onChange={e => update('section.cart.emptyTitle', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded mb-1"
                            placeholder="Empty title"
                          />
                          <textarea
                            rows={2}
                            value={v('section.cart.emptyDesc')}
                            onChange={e => update('section.cart.emptyDesc', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs rounded"
                            placeholder="Empty description"
                          />
                        </div>

                        <div className="pt-2 border-t border-primary/5 space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Upsell Section Header</label>
                          <input
                            type="text"
                            value={v('section.cart.upsellTitle')}
                            onChange={e => update('section.cart.upsellTitle', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    )}

                    {/* SECTION: CHECKOUT */}
                    {selectedSection === 'checkout' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Terminal Badge</label>
                          <input
                            type="text"
                            value={v('section.checkout.badge')}
                            onChange={e => update('section.checkout.badge', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded uppercase focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary block">Title 1</label>
                            <input
                              type="text"
                              value={v('section.checkout.title1')}
                              onChange={e => update('section.checkout.title1', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary block">Title 2 (Accent)</label>
                            <input
                              type="text"
                              value={v('section.checkout.title2')}
                              onChange={e => update('section.checkout.title2', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded focus:outline-none focus:border-accent italic"
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-primary/5 space-y-2">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Form Step Headers</label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={v('section.checkout.step1Title')}
                              onChange={e => update('section.checkout.step1Title', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              placeholder="Step 1: Delivery Address"
                            />
                            <input
                              type="text"
                              value={v('section.checkout.step2Title')}
                              onChange={e => update('section.checkout.step2Title', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              placeholder="Step 2: Payment Method"
                            />
                            <input
                              type="text"
                              value={v('section.checkout.summaryTitle')}
                              onChange={e => update('section.checkout.summaryTitle', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              placeholder="Order Summary Title"
                            />
                          </div>
                        </div>

                        {/* Delivery Method Customization */}
                        <div className="pt-2 border-t border-primary/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider">Delivery Method Settings</label>
                            <a
                              href="/admin/delivery"
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
                            >
                              Edit Rates & Zones ↗
                            </a>
                          </div>
                          <input
                            type="text"
                            value={v('section.checkout.deliveryMethodTitle')}
                            onChange={e => update('section.checkout.deliveryMethodTitle', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                            placeholder="Delivery & Dispatch Method"
                          />
                          <input
                            type="text"
                            value={v('section.checkout.deliveryMethodSubtitle')}
                            onChange={e => update('section.checkout.deliveryMethodSubtitle', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs text-text-muted rounded"
                            placeholder="Select your preferred courier service level."
                          />
                          <textarea
                            rows={2}
                            value={v('section.checkout.deliveryNote')}
                            onChange={e => update('section.checkout.deliveryNote', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs rounded"
                            placeholder="Courier tracking note..."
                          />
                        </div>

                        <div className="pt-2 border-t border-primary/5 space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Payment Submit Button Text</label>
                          <input
                            type="text"
                            value={v('section.checkout.payBtn')}
                            onChange={e => update('section.checkout.payBtn', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded uppercase focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    )}

                    {/* SECTION: FOOTER */}
                    {selectedSection === 'footer' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Brand Tagline</label>
                          <textarea
                            rows={2}
                            value={v('section.footer.tagline')}
                            onChange={e => update('section.footer.tagline', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Newsletter Badge</label>
                            <input
                              type="text"
                              value={v('section.footer.newsletterBadge')}
                              onChange={e => update('section.footer.newsletterBadge', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-semibold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Newsletter Title</label>
                            <input
                              type="text"
                              value={v('section.footer.newsletterTitle')}
                              onChange={e => update('section.footer.newsletterTitle', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-semibold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">HQ Location</label>
                          <input
                            type="text"
                            value={v('section.footer.address')}
                            onChange={e => update('section.footer.address', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-semibold text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Support Email</label>
                            <input
                              type="email"
                              value={v('section.footer.email')}
                              onChange={e => update('section.footer.email', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-semibold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Phone Line</label>
                            <input
                              type="text"
                              value={v('section.footer.phone')}
                              onChange={e => update('section.footer.phone', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-semibold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Copyright Notice</label>
                          <input
                            type="text"
                            value={v('section.footer.copyright')}
                            onChange={e => update('section.footer.copyright', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>

                        {/* Footer Logo Media */}
                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">Footer Logo Asset</span>
                          <MediaCustomizerField
                            label="Footer Brand Logo"
                            value={v('section.footer.logo')}
                            type="image"
                            onChange={url => update('section.footer.logo', url)}
                            onReset={() => update('section.footer.logo', THEME_DEFAULTS['section.footer.logo'])}
                          />
                        </div>

                        {/* Footer Custom Colors */}
                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">Section Colors</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <ColorPickerField
                              label="Footer Background"
                              value={v('section.footer.bg')}
                              defaultValue={THEME_DEFAULTS['section.footer.bg']}
                              onChange={val => update('section.footer.bg', val)}
                              onReset={() => update('section.footer.bg', THEME_DEFAULTS['section.footer.bg'])}
                            />
                            <ColorPickerField
                              label="Footer Text Color"
                              value={v('section.footer.text')}
                              defaultValue={THEME_DEFAULTS['section.footer.text']}
                              onChange={val => update('section.footer.text', val)}
                              onReset={() => update('section.footer.text', THEME_DEFAULTS['section.footer.text'])}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION: CONTACT */}
                    {selectedSection === 'contact' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Contact Hero Badge</label>
                          <input
                            type="text"
                            value={v('section.contact.badge')}
                            onChange={e => update('section.contact.badge', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent uppercase"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 1</label>
                            <input
                              type="text"
                              value={v('section.contact.title1')}
                              onChange={e => update('section.contact.title1', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 2 (Accent)</label>
                            <input
                              type="text"
                              value={v('section.contact.title2')}
                              onChange={e => update('section.contact.title2', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Hero Subtitle</label>
                          <textarea
                            rows={2}
                            value={v('section.contact.subtitle')}
                            onChange={e => update('section.contact.subtitle', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>

                        {/* Contact Hero Media */}
                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">Contact Hero Image</span>
                          <MediaCustomizerField
                            label="Contact Main Hero Image"
                            value={v('section.contact.image')}
                            type="image"
                            onChange={url => update('section.contact.image', url)}
                            onReset={() => update('section.contact.image', THEME_DEFAULTS['section.contact.image'])}
                          />
                        </div>

                        {/* Form Title */}
                        <div className="pt-2 border-t border-primary/5 space-y-2">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Direct Message Form Titles</label>
                          <input
                            type="text"
                            value={v('section.contact.formBadge')}
                            onChange={e => update('section.contact.formBadge', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded mb-2"
                            placeholder="Badge: DIRECT LINE"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={v('section.contact.formTitle1')}
                              onChange={e => update('section.contact.formTitle1', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              placeholder="Direct Dispatch"
                            />
                            <input
                              type="text"
                              value={v('section.contact.formTitle2')}
                              onChange={e => update('section.contact.formTitle2', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded"
                              placeholder="Message."
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-primary/5 space-y-2">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Fast Response Card</label>
                          <input
                            type="text"
                            value={v('section.contact.fastBadge')}
                            onChange={e => update('section.contact.fastBadge', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded mb-1"
                            placeholder="Fast Response"
                          />
                          <input
                            type="text"
                            value={v('section.contact.fastTitle')}
                            onChange={e => update('section.contact.fastTitle', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded mb-1"
                            placeholder="Under 15 minutes."
                          />
                          <textarea
                            rows={2}
                            value={v('section.contact.fastDesc')}
                            onChange={e => update('section.contact.fastDesc', e.target.value)}
                            className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-medium rounded"
                            placeholder="Response description"
                          />
                        </div>
                      </div>
                    )}

                    {/* SECTION: ABOUT */}
                    {selectedSection === 'about' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">About Badge</label>
                          <input
                            type="text"
                            value={v('section.about.badge')}
                            onChange={e => update('section.about.badge', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent uppercase"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 1</label>
                            <input
                              type="text"
                              value={v('section.about.title1')}
                              onChange={e => update('section.about.title1', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 2 (Accent)</label>
                            <input
                              type="text"
                              value={v('section.about.title2')}
                              onChange={e => update('section.about.title2', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Subtitle Copy</label>
                          <textarea
                            rows={3}
                            value={v('section.about.subtitle')}
                            onChange={e => update('section.about.subtitle', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    )}

                    {/* SECTION: BLOG / JOURNAL */}
                    {selectedSection === 'blog' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Journal Badge</label>
                          <input
                            type="text"
                            value={v('section.blog.badge')}
                            onChange={e => update('section.blog.badge', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent uppercase"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 1</label>
                            <input
                              type="text"
                              value={v('section.blog.title1')}
                              onChange={e => update('section.blog.title1', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 2 (Accent)</label>
                            <input
                              type="text"
                              value={v('section.blog.title2')}
                              onChange={e => update('section.blog.title2', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Journal Subtitle</label>
                          <textarea
                            rows={3}
                            value={v('section.blog.subtitle')}
                            onChange={e => update('section.blog.subtitle', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">Section Colors</span>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">Background</label>
                              <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded border border-primary/5">
                                <input
                                  type="color"
                                  value={v('section.blog.bg')}
                                  onChange={e => update('section.blog.bg', e.target.value)}
                                  className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                                />
                                <span className="text-[10px] font-mono text-text-muted">{v('section.blog.bg')}</span>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-primary uppercase tracking-wider block">Text Color</label>
                              <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded border border-primary/5">
                                <input
                                  type="color"
                                  value={v('section.blog.text')}
                                  onChange={e => update('section.blog.text', e.target.value)}
                                  className="w-6 h-6 border-0 bg-transparent cursor-pointer"
                                />
                                <span className="text-[10px] font-mono text-text-muted">{v('section.blog.text')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION: FAQS */}
                    {selectedSection === 'faqs' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">FAQs Badge</label>
                          <input
                            type="text"
                            value={v('section.faqs.badge')}
                            onChange={e => update('section.faqs.badge', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent uppercase"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 1</label>
                            <input
                              type="text"
                              value={v('section.faqs.title1')}
                              onChange={e => update('section.faqs.title1', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 2 (Accent)</label>
                            <input
                              type="text"
                              value={v('section.faqs.title2')}
                              onChange={e => update('section.faqs.title2', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Subtitle</label>
                          <textarea
                            rows={3}
                            value={v('section.faqs.subtitle')}
                            onChange={e => update('section.faqs.subtitle', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    )}

                    {/* SECTION: PRIVACY */}
                    {selectedSection === 'privacy' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Badge</label>
                          <input
                            type="text"
                            value={v('section.privacy.badge')}
                            onChange={e => update('section.privacy.badge', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent uppercase"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 1</label>
                            <input
                              type="text"
                              value={v('section.privacy.title1')}
                              onChange={e => update('section.privacy.title1', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 2</label>
                            <input
                              type="text"
                              value={v('section.privacy.title2')}
                              onChange={e => update('section.privacy.title2', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Policy Lead Intro</label>
                          <textarea
                            rows={3}
                            value={v('section.privacy.subtitle')}
                            onChange={e => update('section.privacy.subtitle', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>

                        {/* Clauses */}
                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider block">Policy Articles (1 to 4)</span>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={v('section.privacy.sec1Title')}
                              onChange={e => update('section.privacy.sec1Title', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              placeholder="Article 1 Title"
                            />
                            <textarea
                              rows={2}
                              value={v('section.privacy.sec1Body')}
                              onChange={e => update('section.privacy.sec1Body', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs rounded"
                              placeholder="Article 1 Body"
                            />
                          </div>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={v('section.privacy.sec2Title')}
                              onChange={e => update('section.privacy.sec2Title', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              placeholder="Article 2 Title"
                            />
                            <textarea
                              rows={2}
                              value={v('section.privacy.sec2Body')}
                              onChange={e => update('section.privacy.sec2Body', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs rounded"
                              placeholder="Article 2 Body"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION: TERMS */}
                    {selectedSection === 'terms' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Badge</label>
                          <input
                            type="text"
                            value={v('section.terms.badge')}
                            onChange={e => update('section.terms.badge', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent uppercase"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 1</label>
                            <input
                              type="text"
                              value={v('section.terms.title1')}
                              onChange={e => update('section.terms.title1', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 2</label>
                            <input
                              type="text"
                              value={v('section.terms.title2')}
                              onChange={e => update('section.terms.title2', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Terms Lead Intro</label>
                          <textarea
                            rows={3}
                            value={v('section.terms.subtitle')}
                            onChange={e => update('section.terms.subtitle', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider block">Terms Articles (1 to 3)</span>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={v('section.terms.sec1Title')}
                              onChange={e => update('section.terms.sec1Title', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              placeholder="Section 1 Title"
                            />
                            <textarea
                              rows={2}
                              value={v('section.terms.sec1Body')}
                              onChange={e => update('section.terms.sec1Body', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs rounded"
                              placeholder="Section 1 Body"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION: REFUND */}
                    {selectedSection === 'refund' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Badge</label>
                          <input
                            type="text"
                            value={v('section.refund.badge')}
                            onChange={e => update('section.refund.badge', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent uppercase"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 1</label>
                            <input
                              type="text"
                              value={v('section.refund.title1')}
                              onChange={e => update('section.refund.title1', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-primary uppercase tracking-wider block">Title 2</label>
                            <input
                              type="text"
                              value={v('section.refund.title2')}
                              onChange={e => update('section.refund.title2', e.target.value)}
                              className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-accent rounded focus:outline-none focus:border-accent"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-primary uppercase tracking-wider block">Refund Policy Intro</label>
                          <textarea
                            rows={3}
                            value={v('section.refund.subtitle')}
                            onChange={e => update('section.refund.subtitle', e.target.value)}
                            className="w-full p-2.5 bg-secondary/30 border border-primary/10 text-xs font-medium text-primary rounded focus:outline-none focus:border-accent"
                          />
                        </div>

                        <div className="pt-2 border-t border-primary/5 space-y-3">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider block">Refund Articles (1 to 3)</span>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={v('section.refund.sec1Title')}
                              onChange={e => update('section.refund.sec1Title', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs font-bold rounded"
                              placeholder="Clause 1 Title"
                            />
                            <textarea
                              rows={2}
                              value={v('section.refund.sec1Body')}
                              onChange={e => update('section.refund.sec1Body', e.target.value)}
                              className="w-full p-2 bg-secondary/30 border border-primary/10 text-xs rounded"
                              placeholder="Clause 1 Body"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>
          )}

          {/* ═══════════ MODE 2: GLOBAL THEME TOKENS & BRAND LOGO ═══════════ */}
          {activeMainTab === 'global' && (
            <div className="flex-1 flex flex-col">
              
              {/* Subtabs */}
              <div className="grid grid-cols-4 p-2 bg-secondary/20 border-b border-primary/5 gap-1 text-[10px] font-bold uppercase">
                {[
                  { id: 'fonts', label: 'Fonts', icon: Type },
                  { id: 'colors', label: 'Colors', icon: Palette },
                  { id: 'shape', label: 'Buttons', icon: Square },
                  { id: 'presets', label: 'Presets', icon: Sparkles },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveGlobalTab(tab.id as any)}
                    className={`py-1.5 px-1 rounded flex flex-col items-center gap-1 transition-all ${
                      activeGlobalTab === tab.id
                        ? 'bg-white text-primary shadow-xs font-bold border border-primary/5'
                        : 'text-text-muted hover:text-primary'
                    }`}
                  >
                    <tab.icon className="w-3 h-3" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* GLOBAL SUBTAB: FONTS */}
              {activeGlobalTab === 'fonts' && (
                <div className="p-5 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider block">Heading Font</label>
                    <select
                      value={v('theme.font.heading')}
                      onChange={e => update('theme.font.heading', e.target.value)}
                      className="w-full bg-secondary/30 border border-primary/10 text-primary text-xs font-bold px-3 py-2.5 rounded focus:outline-none focus:border-accent"
                    >
                      {FONTS_HEADING.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider block">Body Font</label>
                    <select
                      value={v('theme.font.body')}
                      onChange={e => update('theme.font.body', e.target.value)}
                      className="w-full bg-secondary/30 border border-primary/10 text-primary text-xs font-bold px-3 py-2.5 rounded focus:outline-none focus:border-accent"
                    >
                      {FONTS_BODY.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider block">Heading Letter Spacing</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['-0.04em', '-0.02em', '0em', '0.05em'].map(val => (
                        <button
                          key={val}
                          onClick={() => update('theme.tracking.heading', val)}
                          className={`py-2 text-[11px] font-bold rounded border transition-all ${
                            v('theme.tracking.heading') === val
                              ? 'bg-primary text-white border-primary shadow-xs'
                              : 'bg-secondary/40 text-text-muted border-primary/5 hover:text-primary hover:bg-secondary'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* GLOBAL SUBTAB: COLORS */}
              {activeGlobalTab === 'colors' && (
                <div className="p-5 space-y-4">
                  {[
                    { key: 'theme.color.primary', label: 'Primary Brand Color', defaultVal: THEME_DEFAULTS['theme.color.primary'] },
                    { key: 'theme.color.accent', label: 'Accent Highlight', defaultVal: THEME_DEFAULTS['theme.color.accent'] },
                    { key: 'theme.color.secondary', label: 'Secondary Surface', defaultVal: THEME_DEFAULTS['theme.color.secondary'] },
                    { key: 'theme.color.placeholder', label: 'Placeholder / Muted', defaultVal: THEME_DEFAULTS['theme.color.placeholder'] },
                  ].map(item => (
                    <ColorPickerField
                      key={item.key}
                      label={item.label}
                      value={v(item.key)}
                      defaultValue={item.defaultVal}
                      onChange={val => update(item.key, val)}
                      onReset={() => update(item.key, item.defaultVal)}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      const updated = {
                        ...theme,
                        'theme.color.primary': THEME_DEFAULTS['theme.color.primary'],
                        'theme.color.accent': THEME_DEFAULTS['theme.color.accent'],
                        'theme.color.secondary': THEME_DEFAULTS['theme.color.secondary'],
                        'theme.color.placeholder': THEME_DEFAULTS['theme.color.placeholder'],
                      }
                      setTheme(updated)
                      syncIframe(updated)
                      showToast('Reset all colors to brand defaults', 'info')
                    }}
                    className="w-full py-2.5 bg-secondary/40 hover:bg-secondary text-primary border border-primary/10 rounded text-xs font-bold uppercase tracking-wider transition-colors mt-2"
                  >
                    Reset All Colors To Default
                  </button>
                </div>
              )}

              {/* GLOBAL SUBTAB: BUTTONS & SHAPE STUDIO */}
              {activeGlobalTab === 'shape' && (
                <div className="p-5 space-y-5">
                  
                  {/* Live Interactive Button Preview */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">Live Button Style Preview</span>
                    <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 flex flex-col gap-3 items-center justify-center shadow-inner">
                      <button
                        type="button"
                        className="w-full py-3 px-6 text-white text-xs font-black uppercase tracking-[0.2em] shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: v('theme.color.primary'),
                          borderRadius: v('theme.radius.brand', '0px'),
                          border: `1px solid ${v('theme.color.accent')}`
                        }}
                      >
                        <span>ADD TO BAG</span>
                        <span className="text-[10px] opacity-70">₦45,000</span>
                      </button>

                      <button
                        type="button"
                        className="w-full py-2.5 px-6 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                        style={{
                          color: v('theme.color.accent'),
                          borderRadius: v('theme.radius.brand', '0px'),
                          border: `1px solid ${v('theme.color.accent')}`
                        }}
                      >
                        <span>EXPLORE MEMBERSHIPS →</span>
                      </button>
                    </div>
                  </div>

                  {/* Corner Shape Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider">Button Corner Shape</label>
                      <span className="text-[10px] font-mono text-accent font-bold">{v('theme.radius.brand', '0px')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Sharp 90°', desc: 'Luxury Editorial', val: '0px' },
                        { label: 'Soft Curved', desc: 'Clean Modern (6px)', val: '6px' },
                        { label: 'Modern Rounded', desc: 'Contemporary (12px)', val: '12px' },
                        { label: 'Full Stadium Pill', desc: 'Athletic Badge', val: '9999px' },
                      ].map(r => {
                        const isSelected = v('theme.radius.brand', '0px') === r.val
                        return (
                          <button
                            key={r.val}
                            type="button"
                            onClick={() => update('theme.radius.brand', r.val)}
                            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between gap-2 ${
                              isSelected
                                ? 'bg-primary text-white border-primary shadow-sm ring-1 ring-primary'
                                : 'bg-secondary/30 border-primary/10 text-primary hover:bg-secondary hover:border-primary/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold">{r.label}</span>
                              <span 
                                className={`w-3.5 h-3.5 border inline-block ${isSelected ? 'bg-accent border-white' : 'bg-primary/20 border-primary/40'}`} 
                                style={{ borderRadius: r.val }}
                              />
                            </div>
                            <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-text-muted'}`}>
                              {r.desc}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Brand Header Logo */}
                  <div className="pt-4 border-t border-primary/5 space-y-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider block">Global Header Logo</span>
                    <MediaCustomizerField
                      label="Storefront Logo"
                      value={v('theme.media.logo')}
                      type="image"
                      onChange={url => update('theme.media.logo', url)}
                      onReset={() => update('theme.media.logo', THEME_DEFAULTS['theme.media.logo'])}
                    />
                  </div>
                </div>
              )}

              {/* GLOBAL SUBTAB: PRESETS */}
              {activeGlobalTab === 'presets' && (
                <div className="p-5 space-y-6">
                  
                  {/* Custom Presets Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                        Your Custom Presets ({customPresets.length})
                      </span>
                      {!isAddingPreset && (
                        <button
                          type="button"
                          onClick={openAddPreset}
                          className="px-2.5 py-1 bg-primary hover:bg-accent text-white text-[10px] font-black uppercase tracking-wider rounded flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3 h-3" /> + Create Preset
                        </button>
                      )}
                    </div>

                    {/* Full Interactive Create Preset Studio Form */}
                    {isAddingPreset && (
                      <form onSubmit={handleSaveCustomPreset} className="p-4 bg-secondary/50 border border-primary/15 rounded-xl space-y-4 shadow-sm">
                        <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                          <span className="text-xs font-black uppercase tracking-wider text-primary">Create New Theme Preset</span>
                          <button
                            type="button"
                            onClick={() => setIsAddingPreset(false)}
                            className="text-[10px] font-bold text-text-muted hover:text-primary uppercase"
                          >
                            Close
                          </button>
                        </div>

                        {/* Preset Name */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-primary uppercase tracking-wider block">
                            Preset Name
                          </label>
                          <input
                            type="text"
                            value={presetForm.name}
                            onChange={e => setPresetForm({ ...presetForm, name: e.target.value })}
                            placeholder="e.g. Minimalist Grey, Obsidian Gold, Cyber Cyan..."
                            className="w-full p-2.5 bg-white border border-primary/15 text-xs font-bold text-primary rounded-md focus:outline-none focus:border-accent"
                            autoFocus
                          />
                        </div>

                        {/* Color Customizers for Preset */}
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-widest text-text-muted block">Preset Colors</span>
                            <button
                              type="button"
                              onClick={() => {
                                setPresetForm({
                                  ...presetForm,
                                  extraColors: [
                                    ...presetForm.extraColors,
                                    { id: Date.now().toString(), name: `Color ${presetForm.extraColors.length + 1}`, value: '#6366f1' }
                                  ]
                                })
                              }}
                              className="px-2 py-0.5 bg-primary hover:bg-accent text-white text-[9px] font-black uppercase tracking-wider rounded transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-2.5 h-2.5" /> + Add Color
                            </button>
                          </div>

                          <ColorPickerField
                            label="Primary Color"
                            value={presetForm.primary}
                            onChange={c => setPresetForm({ ...presetForm, primary: c })}
                          />
                          <ColorPickerField
                            label="Accent Highlight Color"
                            value={presetForm.accent}
                            onChange={c => setPresetForm({ ...presetForm, accent: c })}
                          />
                          <ColorPickerField
                            label="Secondary Surface Color"
                            value={presetForm.secondary}
                            onChange={c => setPresetForm({ ...presetForm, secondary: c })}
                          />

                          {/* Dynamic Extra Custom Colors */}
                          {presetForm.extraColors.map((col, idx) => (
                            <div key={col.id} className="p-2.5 bg-white border border-primary/10 rounded-lg space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  value={col.name}
                                  onChange={e => {
                                    const updated = [...presetForm.extraColors]
                                    updated[idx].name = e.target.value
                                    setPresetForm({ ...presetForm, extraColors: updated })
                                  }}
                                  placeholder="Color Role (e.g. Badge, Glow, Border)"
                                  className="p-1.5 bg-secondary/30 border border-primary/10 text-xs font-bold text-primary rounded flex-1 focus:outline-none focus:border-accent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = presetForm.extraColors.filter(c => c.id !== col.id)
                                    setPresetForm({ ...presetForm, extraColors: updated })
                                  }}
                                  className="text-text-muted hover:text-red-500 p-1"
                                  title="Remove color"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <ColorPickerField
                                label={col.name || `Custom Color ${idx + 1}`}
                                value={col.value}
                                onChange={val => {
                                  const updated = [...presetForm.extraColors]
                                  updated[idx].value = val
                                  setPresetForm({ ...presetForm, extraColors: updated })
                                }}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Fonts for Preset */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/10">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-primary uppercase tracking-wider block">Heading Font</label>
                            <select
                              value={presetForm.heading}
                              onChange={e => setPresetForm({ ...presetForm, heading: e.target.value })}
                              className="w-full bg-white border border-primary/10 text-primary text-[11px] font-bold p-2 rounded focus:outline-none focus:border-accent"
                            >
                              {FONTS_HEADING.map(f => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-primary uppercase tracking-wider block">Body Font</label>
                            <select
                              value={presetForm.body}
                              onChange={e => setPresetForm({ ...presetForm, body: e.target.value })}
                              className="w-full bg-white border border-primary/10 text-primary text-[11px] font-bold p-2 rounded focus:outline-none focus:border-accent"
                            >
                              {FONTS_BODY.map(f => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Shape Corner Radius */}
                        <div className="space-y-1.5 pt-2 border-t border-primary/10">
                          <label className="text-[9px] font-black text-primary uppercase tracking-wider block">Button Corner Shape</label>
                          <div className="grid grid-cols-4 gap-1">
                            {[
                              { label: 'Sharp', val: '0px' },
                              { label: 'Soft 6px', val: '6px' },
                              { label: 'Round 12px', val: '12px' },
                              { label: 'Pill', val: '9999px' },
                            ].map(r => (
                              <button
                                key={r.val}
                                type="button"
                                onClick={() => setPresetForm({ ...presetForm, radius: r.val })}
                                className={`py-1.5 px-1 text-[10px] font-bold rounded border transition-all ${
                                  presetForm.radius === r.val
                                    ? 'bg-primary text-white border-primary shadow-xs'
                                    : 'bg-white text-text-muted border-primary/10 hover:text-primary'
                                }`}
                              >
                                {r.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-primary/10">
                          <button
                            type="submit"
                            className="flex-1 py-2.5 bg-primary hover:bg-accent text-white text-xs font-black uppercase tracking-wider rounded-md transition-all shadow-xs"
                          >
                            Save & Apply Preset
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingPreset(false)}
                            className="px-3 py-2.5 border border-primary/15 text-text-muted hover:text-primary text-xs font-bold uppercase rounded-md transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Custom Presets List */}
                    {customPresets.length === 0 && !isAddingPreset ? (
                      <div className="p-4 border border-dashed border-primary/10 rounded-lg text-center">
                        <p className="text-[11px] text-text-muted font-medium">No custom presets saved yet.</p>
                        <button
                          type="button"
                          onClick={openAddPreset}
                          className="mt-2 text-[10px] font-black text-accent uppercase tracking-wider hover:underline"
                        >
                          + Create Custom Preset
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {customPresets.map(p => (
                          <div
                            key={p.id}
                            onClick={() => applyPreset(p)}
                            className="w-full p-3 bg-white hover:bg-secondary/40 border border-primary/10 hover:border-accent rounded text-left transition-all flex items-center justify-between group shadow-xs cursor-pointer"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full border border-primary/20" style={{ backgroundColor: p.primary }} />
                                <span className="w-3 h-3 rounded-full border border-primary/20" style={{ backgroundColor: p.accent }} />
                                <span className="text-xs font-black text-primary group-hover:text-accent transition-colors">{p.name}</span>
                                <span className="text-[8px] font-black uppercase px-1.5 py-0.2 bg-accent/10 text-accent rounded">Custom</span>
                              </div>
                              <span className="text-[10px] text-text-muted mt-0.5 block font-medium">
                                {p.heading} + {p.body}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => handleDeleteCustomPreset(p.id, p.name, e)}
                                className="p-1.5 text-text-muted/40 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                                title="Delete preset"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <Sparkles className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Studio Presets Section */}
                  <div className="space-y-3 pt-4 border-t border-primary/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block">
                      Atelier Studio Presets
                    </span>
                    <div className="space-y-2">
                      {PRESETS.map(p => (
                        <button
                          key={p.name}
                          onClick={() => applyPreset(p)}
                          className="w-full p-3 bg-white hover:bg-secondary/40 border border-primary/10 hover:border-accent rounded text-left transition-all flex items-center justify-between group shadow-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full border border-primary/20" style={{ backgroundColor: p.primary }} />
                              <span className="w-3 h-3 rounded-full border border-primary/20" style={{ backgroundColor: p.accent }} />
                              <span className="text-xs font-black text-primary group-hover:text-accent transition-colors">{p.name}</span>
                            </div>
                            <span className="text-[10px] text-text-muted mt-0.5 block font-medium">
                              {p.heading} + {p.body}
                            </span>
                          </div>
                          <Sparkles className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* Footer Link */}
          <div className="mt-auto p-3 border-t border-primary/5 text-center bg-secondary/10">
            <a
              href={currentPath}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-text-muted hover:text-accent flex items-center justify-center gap-1 transition-colors"
            >
              Open Current Page in New Tab <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </aside>

        {/* RIGHT LIVE STOREFRONT IFRAME (ACTUAL PREVIEW) */}
        <main className={`flex-1 bg-secondary/30 p-2 sm:p-6 flex items-center justify-center overflow-hidden h-full ${
          mobileView === 'preview' ? 'flex' : 'hidden md:flex'
        }`}>
          <div 
            className={`h-full bg-white shadow-xl transition-all duration-300 rounded overflow-hidden border border-primary/10 flex flex-col ${
              device === 'mobile'
                ? 'w-[375px] max-h-[750px] rounded-2xl border-4 border-primary/80'
                : device === 'tablet'
                ? 'w-[768px] max-h-[900px] rounded-xl'
                : 'w-full'
            }`}
          >
            {/* Real Storefront iframe */}
            <iframe
              ref={iframeRef}
              src={currentPath}
              title="Real Storefront Live Preview"
              className="w-full flex-1 border-0"
              onLoad={() => syncIframe(theme)}
            />
          </div>
        </main>

      </div>
    </div>
  )
}
