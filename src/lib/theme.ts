/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  THEME CONSTANTS — Single source of truth for ALL design tokens
 *
 *  ▸ HOW TO USE IN COMPONENTS:
 *      import { t } from '@/lib/theme'
 *      className={`border-[${t.border.width.DEFAULT}] rounded-[${t.radius.lg}]`}
 *
 *  ▸ HOW TO CHANGE THE FONT SITE-WIDE:
 *      1. Import the new font in layout.tsx from "next/font/google"
 *      2. Update fonts.heading / fonts.body CSS variable names here
 *      3. Mirror the variable names in globals.css @theme and :root
 *
 *  ▸ HOW TO CHANGE A COLOR:
 *      Update colors.* here. Also update globals.css @theme if you need
 *      Tailwind utility classes (bg-primary, text-accent, etc.) to reflect it.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─── FONTS ────────────────────────────────────────────────────────────────────
export const fonts = {
  /** Luxury editorial serif — headings, display text, titles */
  heading: 'var(--font-cormorant)',
  /** Modern geometric sans-serif — body copy, UI labels, nav */
  body: 'var(--font-outfit)',
  /** Alias for italic editorial accents (same as heading) */
  accent: 'var(--font-cormorant)',
} as const

/** Tailwind font-family class names */
export const fontClass = {
  heading: 'font-cormorant',
  body: 'font-outfit',
} as const

// ─── FONT SIZES ───────────────────────────────────────────────────────────────
export const fontSize = {
  // Micro — badge text, nav labels, admin labels
  labelXs: '8px',
  labelSm: '9px',
  label: '10px',
  labelLg: '11px',

  // Body
  bodyXs: '12px',  // text-xs
  bodySm: '14px',  // text-sm
  bodyBase: '16px', // text-base
  bodyLg: '18px',  // text-lg
  bodyXl: '20px',  // text-xl

  // UI headings
  uiSm: '24px',   // text-2xl
  uiMd: '30px',   // text-3xl
  uiLg: '36px',   // text-4xl
  uiXl: '48px',   // text-5xl

  // Display / Editorial
  displaySm: '60px',  // text-6xl
  displayMd: '72px',  // text-7xl
  displayLg: '96px',  // text-8xl / hero
  displayXl: '11rem', // xl hero text

  // Giant watermark / background text
  giant: '20vw',
  giantBrand: '25rem', // StorySection brand text
} as const

// ─── COLORS — Brand Palette ────────────────────────────────────────────────────
export const colors = {
  // Core brand
  primary: '#020617',      // Deep navy-black
  secondary: '#f8fafc',    // Off-white
  accent: '#6366f1',       // Indigo
  accentLight: '#818cf8',  // Light indigo
  textMuted: '#64748b',    // Slate-500
  surface: '#ffffff',      // White
  /** ALL input/textarea placeholder text — mirrors --color-placeholder in globals.css */
  placeholder: '#94a3b8',  // slate-400

  // Admin panel dark theme
  admin: {
    bg: '#090d16',           // Sidebar background
    bgDark: '#070a11',       // Sidebar footer (darker)
    border: 'rgba(51,65,85,0.8)',  // slate-800/80
    text: '#e2e8f0',         // slate-200
    textMuted: '#94a3b8',    // slate-400
    textSubtle: '#64748b',   // slate-500
    navActive: 'rgba(99,102,241,0.15)',  // indigo-600/15
    navActiveBorder: 'rgba(99,102,241,0.30)', // indigo-500/30
    navHover: 'rgba(30,41,59,0.5)',     // slate-800/50
    iconActive: '#818cf8',   // indigo-400
    success: '#10b981',      // emerald-500
  },

  // Status
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  errorLight: '#fca5a5',    // red-300
  info: '#3b82f6',

  // Misc
  white: '#ffffff',
  black: '#000000',
  slate400: '#94a3b8',
  slate500: '#64748b',
} as const

// ─── BORDER ───────────────────────────────────────────────────────────────────
export const border = {
  /** Border widths */
  width: {
    DEFAULT: '1px',
    md: '2px',
    lg: '4px',
    xl: '12px',        // Large editorial frame (hero video pip)
    frame: '20px',     // Story section inner video frame
  },
  /** Border colors */
  color: {
    primary: 'rgba(2,6,23,0.1)',        // primary/10
    primaryFaint: 'rgba(2,6,23,0.05)',  // primary/5
    accent: '#6366f1',
    accentFaint: 'rgba(99,102,241,0.2)',
    accentSubtle: 'rgba(99,102,241,0.1)',
    white: 'rgba(255,255,255,0.2)',
    whiteFaint: 'rgba(255,255,255,0.05)',
    whiteThin: 'rgba(255,255,255,0.1)',
    // Admin dark panel borders
    adminBorder: 'rgba(51,65,85,0.8)',  // slate-800/80
    adminMid: 'rgba(71,85,105,0.6)',    // slate-700/60
    transparent: 'transparent',
    gray: '#f3f4f6',    // gray-100
    dashed: 'rgba(2,6,23,0.1)',  // used in dashed placeholder borders
  },
  /** Compound shorthand strings for Tailwind arbitrary values */
  css: {
    faint: '1px solid rgba(2,6,23,0.05)',
    subtle: '1px solid rgba(2,6,23,0.1)',
    accent: '1px solid #6366f1',
    accentFaint: '1px solid rgba(99,102,241,0.2)',
    white: '1px solid rgba(255,255,255,0.2)',
    whiteFaint: '1px solid rgba(255,255,255,0.05)',
    admin: '1px solid rgba(51,65,85,0.8)',
    accentLeft4: 'border-l-4 border-accent',
    accentLeft2: 'border-l-2 border-accent',
  },
} as const

// ─── BORDER RADIUS ────────────────────────────────────────────────────────────
export const radius = {
  none: '0px',       // Brand default — sharp/square corners everywhere
  sm: '0.5rem',      // rounded-lg (8px) — admin nav items, avatars, buttons
  md: '0.75rem',     // rounded-xl (12px) — admin nav items, back button
  full: '9999px',    // rounded-full — dot indicators (active pulse)
} as const

// ─── SHADOWS ──────────────────────────────────────────────────────────────────
export const shadow = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
  md: '0 4px 6px -1px rgba(0,0,0,0.1)',
  lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
  xl: '0 20px 25px -5px rgba(0,0,0,0.1)',
  '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',
  editorial: '0 40px 80px -15px rgba(99,102,241,0.15)',
  story: '0 80px 100px -20px rgba(0,0,0,0.1)',
  stat: '0 20px 40px -15px rgba(0,0,0,0.05)',
  adminNav: '0 1px 2px 0 rgba(99,102,241,0.5)',
} as const

// ─── SPACING ──────────────────────────────────────────────────────────────────
export const spacing = {
  // Page / section rhythm
  pagePadSm: '16px',   // px-4
  pagePadMd: '24px',   // px-6
  pagePadLg: '32px',   // px-8
  sectionPadSm: '64px',
  sectionPadMd: '128px', // py-32
  sectionPadLg: '192px', // py-48

  // Container
  containerMax: '80rem',     // max-w-7xl
  containerUltraWide: '112.5rem', // max-w-[1800px]

  // Admin
  adminSidebarWidth: '18rem',  // w-72
  adminSidebarWidthSm: '16rem', // w-64

  // Cards / Components
  cardPad: '40px',
  cardPadSm: '24px',   // p-6
  cardPadLg: '80px',   // p-20

  // Buttons
  btnPadX: '40px',
  btnPadXSm: '24px',
  btnPadY: '20px',
  btnPadYSm: '10px',

  // Header
  headerHeight: '80px',  // h-20
  adminHeaderHeight: '64px', // h-16

  // Misc
  divider: '1px',    // thin hr lines
} as const

// ─── LETTER SPACING ───────────────────────────────────────────────────────────
export const tracking = {
  tight: '-0.04em',
  tighter: '-0.03em',
  normal: '0em',
  wide: '0.1em',
  wider: '0.2em',   // tracking-wider
  widest: '0.3em',  // tracking-[0.3em]
  ultraWide: '0.4em',
  veryWide: '0.5em',
  extreme: '0.6em',
  superExtreme: '0.8em',
} as const

// ─── Z-INDEX ──────────────────────────────────────────────────────────────────
export const zIndex = {
  base: 0,
  above: 10,
  sticky: 20,
  header: 50,
  dropdown: 50,
  adminMobileBar: 9990,
  adminBackdrop: 9995,
  adminDrawer: 9999,
  dialog: 50,
} as const

// ─── TRANSITIONS ──────────────────────────────────────────────────────────────
export const transition = {
  fast: 'duration-200',
  base: 'duration-300',
  slow: 'duration-500',
  slower: 'duration-700',
  crawl: 'duration-1000',
  ease: {
    spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
    smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const

// ─── ADMIN COMPONENT TOKENS (specific to the dark admin panel) ────────────────
export const admin = {
  /** Sidebar root */
  sidebar: {
    bg: colors.admin.bg,
    borderColor: colors.admin.border,
    width: spacing.adminSidebarWidthSm,
    widthDrawer: spacing.adminSidebarWidth,
  },
  /** Nav item */
  nav: {
    borderRadius: radius.md,
    paddingX: '14px',  // px-3.5
    paddingYSm: '10px', // py-2.5
    paddingYLg: '12px', // py-3
    fontSize: fontSize.bodyXs,
    activeClasses: `bg-indigo-600/15 text-white border border-indigo-500/30`,
    inactiveClasses: `text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent`,
  },
  /** Logo badge */
  logoBadge: {
    bgActive: 'bg-indigo-600/20',
    border: 'border border-indigo-500/30',
    textColor: 'text-indigo-400',
    borderRadius: radius.sm,
  },
  /** Active dot indicator */
  activeDot: {
    size: '6px',  // w-1.5 h-1.5
    borderRadius: radius.full,
    color: colors.admin.iconActive,
  },
  /** Footer / back button */
  footer: {
    bg: 'rgba(7,10,17,0.6)',  // #070a11/60
    backBtnClasses: 'flex items-center justify-center gap-2 w-full py-2.5 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-xl transition-all duration-200 shadow-sm',
  },
} as const

// ─── SHOP / PRODUCT CARD TOKENS ───────────────────────────────────────────────
export const shop = {
  imgPlaceholderBg: '#ececec',      // product image bg
  imgPlaceholderAlt: '#f5f5f5',     // thumbnail lighter bg
  shimmerBg: '#f3f4f6',             // gray-100 loading shimmer
  badgeBg: '#ffffff',               // sale/bestseller badge bg
  badgeText: '#1f2937',             // gray-800
  tagBg: '#f0f0f0',                 // product size/brand tag bg
  featurePanelBg: '#f8f7f5',        // feature info panel bg (warm off-white)
  ratingColor: '#eab308',           // yellow-500 stars
  addToCartBg: '#000000',           // add-to-cart btn bg
  addToCartHoverBg: '#1f2937',      // gray-800 hover
  wishlistHeartActive: '#ef4444',   // red-500
  wishlistHeartInactive: '#9ca3af', // gray-400
  filterInactiveBorder: '#e5e7eb',  // gray-200
  filterInactiveText: '#6b7280',    // gray-500
} as const

// ─── ADMIN PAGE TOKENS ────────────────────────────────────────────────────────
export const adminPage = {
  /** Admin CRUD pages background — slightly off-white, feels airy */
  pageBg: '#fafafa',
} as const

// ─── CHAT WIDGET TOKENS ───────────────────────────────────────────────────────
export const chat = {
  triggerShadow: '0 8px 30px rgba(99,102,241,0.4)',
  windowShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
  windowWidth: '380px',
  windowHeight: '520px',
  userBubbleBg: colors.accent,
  assistantBubbleBg: colors.white,
  typingDotBg: 'rgba(99,102,241,0.3)',
  botIconBg: 'rgba(99,102,241,0.1)',
  humanCtaBorder: 'rgba(99,102,241,0.2)',
} as const

// ─── TOAST TOKENS ─────────────────────────────────────────────────────────────
export const toast = {
  zIndex: 99998,
  successBorderColor: colors.accent,
  errorBorderColor: colors.error,
  infoBorderColor: colors.info,
  minWidth: '300px',
  maxWidth: '380px',
  closeColor: '#d1d5db',  // slate-300
} as const

// ─── MEMBER PASS TOKENS ───────────────────────────────────────────────────────
export const memberPass = {
  cardShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
  qrScanLineBg: 'rgba(99,102,241,0.3)',
  qrBorderWidthSm: '3px',
  qrBorderWidthLg: '4px',
  glowBlobBlur: '100px',
  glowBlobBlurAlt: '120px',
  outerGlowBg: 'rgba(99,102,241,0.25)',
  outerGlowBlur: '60px',
} as const

// ─── FORM INPUT TOKENS ────────────────────────────────────────────────────────
export const form = {
  borderBottomWidth: '2px',
  labelSize: fontSize.bodyXs,
  labelTracking: tracking.widest,
  labelColor: '#94a3b8',   // slate-400
  successBg: '#f0fdf4',    // green-50
  successBorder: '#bbf7d0', // green-200
  successIconColor: '#22c55e', // green-500
} as const

// ─── MODAL / TOPUP TOKENS ─────────────────────────────────────────────────────
export const modalTokens = {
  zIndex: 100,
  backdropBg: 'rgba(2,6,23,0.4)',
  cardShadow: '0 50px 100px rgba(0,0,0,0.2)',
  packActiveBg: 'rgba(99,102,241,0.05)',
  featuredBorderRadius: '2px',
} as const

// ─── CONVENIENCE RE-EXPORT ────────────────────────────────────────────────────
/** Short-hand alias: import { t } from '@/lib/theme' */
export const t = {
  fonts,
  fontClass,
  fontSize,
  colors,
  border,
  radius,
  shadow,
  spacing,
  tracking,
  zIndex,
  transition,
  admin,
  shop,
  chat,
  toast,
  memberPass,
  form,
  modal: modalTokens,
  adminPage,
} as const

export default t
