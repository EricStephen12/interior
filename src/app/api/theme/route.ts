import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const THEME_KEYS = [
  'theme.color.primary',
  'theme.color.accent',
  'theme.color.secondary',
  'theme.color.placeholder',
  'theme.font.heading',
  'theme.font.body',
  'theme.fontSize.body',
  'theme.fontSize.label',
  'theme.tracking.heading',
  'theme.radius.brand',
  'theme.border.width',

  // Section Content & Custom Colors (Complete coverage of all site text)
  // --- BANNER ---
  'section.banner.enabled',
  'section.banner.message',
  'section.banner.code',
  'section.banner.bg',
  'section.banner.text',
  'section.banner.accent',

  // --- HERO ---
  'section.hero.tagline',
  'section.hero.title1',
  'section.hero.title2',
  'section.hero.btnText',
  'section.hero.btnLink',
  'section.hero.subtitle',
  'section.hero.exclusiveBadge',
  'section.hero.exclusiveText',
  'section.hero.image',
  'section.hero.pipVideo',
  'section.hero.bg',
  'section.hero.text',
  'section.hero.accent',

  // --- STORY ---
  'section.story.badge1',
  'section.story.title1_1',
  'section.story.title1_2',
  'section.story.p1',
  'section.story.p2',
  'section.story.p3',
  'section.story.est',
  'section.story.badge2',
  'section.story.title2_1',
  'section.story.title2_2',
  'section.story.p4',
  'section.story.p5',
  'section.story.stat1Val',
  'section.story.stat1Label',
  'section.story.stat2Val',
  'section.story.stat2Label',
  'section.story.btnText',
  'section.story.excellenceBadge',
  'section.story.excellenceText',
  'section.story.video1',
  'section.story.video2',
  'section.story.bg',
  'section.story.text',
  'section.story.accent',

  // --- SHOP CATALOG ---
  'section.shop.badge',
  'section.shop.title1',
  'section.shop.title2',
  'section.shop.subtitle',
  'section.shop.filterAll',
  'section.shop.bg',
  'section.shop.text',
  'section.shop.accent',

  // --- PRODUCT DETAILS PAGE (PDP) ---
  'section.pdp.badge1',
  'section.pdp.badge2',
  'section.pdp.badge3',
  'section.pdp.btnAddToCart',
  'section.pdp.btnPass',
  'section.pdp.metaTitle',
  'section.pdp.reviewsTitle',
  'section.pdp.recentlyTitle',

  // --- CART ---
  'section.cart.title',
  'section.cart.checkoutBtn',
  'section.cart.continueBtn',
  'section.cart.emptyTitle',
  'section.cart.emptyDesc',
  'section.cart.upsellTitle',

  // --- CHECKOUT ---
  'section.checkout.badge',
  'section.checkout.title1',
  'section.checkout.title2',
  'section.checkout.step1Title',
  'section.checkout.step2Title',
  'section.checkout.deliveryMethodTitle',
  'section.checkout.deliveryMethodSubtitle',
  'section.checkout.deliveryNote',
  'section.checkout.payBtn',
  'section.checkout.summaryTitle',

  // --- FOOTER ---
  'section.footer.est',
  'section.footer.tagline',
  'section.footer.newsletterBadge',
  'section.footer.newsletterTitle',
  'section.footer.hours',
  'section.footer.address',
  'section.footer.phone',
  'section.footer.email',
  'section.footer.copyright',
  'section.footer.bg',
  'section.footer.text',
  'section.footer.accent',

  // --- CONTACT ---
  'section.contact.badge',
  'section.contact.title1',
  'section.contact.title2',
  'section.contact.subtitle',
  'section.contact.formBadge',
  'section.contact.formTitle1',
  'section.contact.formTitle2',
  'section.contact.fastBadge',
  'section.contact.fastTitle',
  'section.contact.fastDesc',
  'section.contact.bg',
  'section.contact.text',

  // --- ABOUT ---
  'section.about.badge',
  'section.about.title1',
  'section.about.title2',
  'section.about.subtitle',
  'section.about.bg',
  'section.about.text',

  // --- BLOG / JOURNAL ---
  'section.blog.badge',
  'section.blog.title1',
  'section.blog.title2',
  'section.blog.subtitle',
  'section.blog.bg',
  'section.blog.text',

  // --- FAQS ---
  'section.faqs.badge',
  'section.faqs.title1',
  'section.faqs.title2',
  'section.faqs.subtitle',
  'section.faqs.bg',
  'section.faqs.text',

  // --- PRIVACY ---
  'section.privacy.badge',
  'section.privacy.title1',
  'section.privacy.title2',
  'section.privacy.subtitle',
  'section.privacy.sec1Title',
  'section.privacy.sec1Body',
  'section.privacy.sec2Title',
  'section.privacy.sec2Body',
  'section.privacy.sec3Title',
  'section.privacy.sec3Body',
  'section.privacy.sec4Title',
  'section.privacy.sec4Body',
  'section.privacy.bg',
  'section.privacy.text',

  // --- TERMS ---
  'section.terms.badge',
  'section.terms.title1',
  'section.terms.title2',
  'section.terms.subtitle',
  'section.terms.sec1Title',
  'section.terms.sec1Body',
  'section.terms.sec2Title',
  'section.terms.sec2Body',
  'section.terms.sec3Title',
  'section.terms.sec3Body',
  'section.terms.bg',
  'section.terms.text',

  // --- REFUND ---
  'section.refund.badge',
  'section.refund.title1',
  'section.refund.title2',
  'section.refund.subtitle',
  'section.refund.sec1Title',
  'section.refund.sec1Body',
  'section.refund.sec2Title',
  'section.refund.sec2Body',
  'section.refund.sec3Title',
  'section.refund.sec3Body',
  'section.refund.bg',
  'section.refund.text',

  // --- GLOBAL MEDIA ---
  'theme.media.logo',
] as const

export type ThemeKey = typeof THEME_KEYS[number]

/** Default values — full content matching every site section */
export const THEME_DEFAULTS: Record<string, string> = {
  // Global Theme Tokens
  'theme.color.primary':      '#020617',
  'theme.color.accent':       '#6366f1',
  'theme.color.secondary':    '#f8fafc',
  'theme.color.placeholder':  '#94a3b8',
  'theme.font.heading':       'Cormorant Garamond',
  'theme.font.body':          'Outfit',
  'theme.fontSize.body':      '16px',
  'theme.fontSize.label':     '10px',
  'theme.tracking.heading':   '-0.04em',
  'theme.radius.brand':       '0px',
  'theme.border.width':       '1px',
  'theme.media.logo':         '/logo.png',

  // --- BANNER ---
  'section.banner.enabled':   'true',
  'section.banner.message':   'Limited Time — Free Delivery on Orders Above ₦50,000',
  'section.banner.code':      'FREESHIP',
  'section.banner.bg':        '#020617',
  'section.banner.text':      '#ffffff',
  'section.banner.accent':    '#6366f1',

  // --- HERO ---
  'section.hero.tagline':     'SHARERS GYM',
  'section.hero.title1':      'TRAIN',
  'section.hero.title2':      'DIFFERENT.',
  'section.hero.btnText':     'GET STARTED',
  'section.hero.btnLink':     '/dashboard',
  'section.hero.subtitle':    "You already know why you're here. Step in.",
  'section.hero.exclusiveBadge': 'Exclusive',
  'section.hero.exclusiveText': 'Experience high performance training in an environment curated for physical excellence.',
  'section.hero.image':       '/images/real-gym-banner.png',
  'section.hero.pipVideo':    '/video/hero-main-v2.mp4',
  'section.hero.bg':          '#f8fafc',
  'section.hero.text':        '#020617',
  'section.hero.accent':      '#6366f1',

  // --- STORY ---
  'section.story.badge1':     'Chapter I',
  'section.story.title1_1':   "Why We're",
  'section.story.title1_2':   'Here.',
  'section.story.p1':         "SHARERS wasn't built around a machine or a program.",
  'section.story.p2':         'It was built around the person walking through the door.',
  'section.story.p3':         'Every piece of equipment, every session, every corner of this space exists because someone decided they were ready to change — and we decided to be ready for them.',
  'section.story.est':        'ESTD. 2024',
  'section.story.badge2':     'Chapter II',
  'section.story.title2_1':   'Built Around',
  'section.story.title2_2':   'You.',
  'section.story.p4':         "Your body is the most complex thing you'll ever work on. We don't take that lightly.",
  'section.story.p5':         'From the way we train to the way we recover, everything here is designed with one person in mind — you. Not a generic version of you. The actual you that shows up, puts in the reps, and goes home better than you came.',
  'section.story.stat1Val':   'REAL',
  'section.story.stat1Label': 'Results Driven',
  'section.story.stat2Val':   'EXPERT',
  'section.story.stat2Label': 'Coaching Team',
  'section.story.btnText':    'SEE THE PLANS',
  'section.story.excellenceBadge': 'Standard Of Excellence',
  'section.story.excellenceText': 'High-caliber strength equipment, engineered biomechanics, and intentional atmosphere.',
  'section.story.video1':     '/video/story-main-v2.mp4',
  'section.story.video2':     '/video/built-v2.mp4',
  'section.story.bg':         '#ffffff',
  'section.story.text':       '#020617',
  'section.story.accent':     '#6366f1',

  // --- SHOP ---
  'section.shop.badge':       'The Arsenal',
  'section.shop.title1':      'The Good',
  'section.shop.title2':      'Stuff.',
  'section.shop.subtitle':    'Nothing here ended up on the shelf by accident. Every product, every session, every membership is chosen because it works. Because the people here deserve that.',
  'section.shop.filterAll':   'All Items',
  'section.shop.bg':          '#ffffff',
  'section.shop.text':        '#020617',
  'section.shop.accent':      '#6366f1',

  // --- PRODUCT DETAILS PAGE (PDP) ---
  'section.pdp.badge1':       'Fast Delivery',
  'section.pdp.badge2':       'Secure Payment',
  'section.pdp.badge3':       'Easy Returns',
  'section.pdp.btnAddToCart': 'Add To Cart',
  'section.pdp.btnPass':      'Get The Pass',
  'section.pdp.metaTitle':    'Product Details',
  'section.pdp.reviewsTitle': 'Customer Reviews',
  'section.pdp.recentlyTitle':'Recently Inspected Gear',

  // --- CART ---
  'section.cart.title':       'Your Cart',
  'section.cart.checkoutBtn': 'Proceed to Checkout',
  'section.cart.continueBtn': 'Continue Shopping',
  'section.cart.emptyTitle':  'Your cart is empty',
  'section.cart.emptyDesc':   'Browse our collection and find what you need to elevate your game.',
  'section.cart.upsellTitle': 'You might also like',

  // --- CHECKOUT ---
  'section.checkout.badge':   'Order Details',
  'section.checkout.title1':  'Secure',
  'section.checkout.title2':  'Checkout.',
  'section.checkout.step1Title': 'Delivery Address',
  'section.checkout.step2Title': 'Payment Method',
  'section.checkout.deliveryMethodTitle': 'Delivery & Dispatch Method',
  'section.checkout.deliveryMethodSubtitle': 'Select your preferred courier service level.',
  'section.checkout.deliveryNote': 'All orders dispatched with express tracking within 24 hours.',
  'section.checkout.payBtn':  'Pay With KingsPay / Card',
  'section.checkout.summaryTitle': 'Order Summary',

  // --- FOOTER ---
  'section.footer.est':       'EST. 2024',
  'section.footer.tagline':   'Show up. Put in the work. Leave better than you came.',
  'section.footer.newsletterBadge': 'Newsletter',
  'section.footer.newsletterTitle': 'Stay updated.',
  'section.footer.hours':     'MON – SAT // 06:00 – 22:00',
  'section.footer.address':   'Lagos, Nigeria',
  'section.footer.phone':     '+234 808 906 2085',
  'section.footer.email':     'sharersmall@gmail.com',
  'section.footer.copyright': '© 2024 - 2026 SHARERS GYM. All Rights Reserved.',
  'section.footer.logo':      '/logo.png',
  'section.footer.bg':        '#020617',
  'section.footer.text':      '#ffffff',
  'section.footer.accent':    '#6366f1',

  // --- CONTACT ---
  'section.contact.badge':    'MEMBER SUPPORT',
  'section.contact.title1':   'Get in',
  'section.contact.title2':   'Touch.',
  'section.contact.subtitle': "Whether you're ready to start training or have a question about your membership, we're here.",
  'section.contact.formBadge':'DIRECT LINE',
  'section.contact.formTitle1': 'Send us a',
  'section.contact.formTitle2': 'Message.',
  'section.contact.fastBadge':'Fast Response',
  'section.contact.fastTitle':'Under 15 minutes.',
  'section.contact.fastDesc': 'Current members get priority response. General questions are answered within a few hours.',
  'section.contact.image':    '/images/real-gym-banner.png',
  'section.contact.bg':       '#ffffff',
  'section.contact.text':     '#020617',

  // --- ABOUT ---
  'section.about.badge':      'OUR ETHOS',
  'section.about.title1':     'The Sharers',
  'section.about.title2':     'Standard.',
  'section.about.subtitle':   'We got tired of gyms that all feel the same. So we built our own.',
  'section.about.bg':         '#ffffff',
  'section.about.text':       '#020617',

  // --- BLOG / JOURNAL ---
  'section.blog.badge':       'OUR JOURNAL',
  'section.blog.title1':      'The SHARERS',
  'section.blog.title2':      'Playbook.',
  'section.blog.subtitle':    "We don't follow a script. We follow progress. Insights, techniques, and exactly what your body needs after putting in the work — nothing it doesn't.",
  'section.blog.bg':          '#ffffff',
  'section.blog.text':        '#020617',

  // --- FAQS ---
  'section.faqs.badge':       'FAQ',
  'section.faqs.title1':      'Common',
  'section.faqs.title2':      'Questions.',
  'section.faqs.subtitle':    'Everything you need to know about our training and memberships.',
  'section.faqs.bg':          '#ffffff',
  'section.faqs.text':        '#020617',

  // --- PRIVACY ---
  'section.privacy.badge':    'Privacy Policy',
  'section.privacy.title1':   'Privacy',
  'section.privacy.title2':   'Policy.',
  'section.privacy.subtitle': 'We respect your privacy. This policy outlines how SHARERS GYM collects, uses, and protects your personal information across our website, mobile applications, and physical facilities.',
  'section.privacy.sec1Title':'1. Information We Collect',
  'section.privacy.sec1Body': 'We collect essential information such as your name, email address, phone number, and physical address when you register for an account, subscribe to our newsletter, or purchase a membership.',
  'section.privacy.sec2Title':'2. How We Use Your Data',
  'section.privacy.sec2Body': 'To provide and maintain our services, including processing transactions and managing your digital access pass.',
  'section.privacy.sec3Title':'3. Data Sharing & Disclosure',
  'section.privacy.sec3Body': 'We do not sell your personal data to third parties. We may share necessary information with trusted service providers solely for operating our platform.',
  'section.privacy.sec4Title':'4. Data Security',
  'section.privacy.sec4Body': 'We implement industry-standard encryption, SSL protocols, and modern authentication via Clerk to protect your personal and payment information.',
  'section.privacy.bg':       '#ffffff',
  'section.privacy.text':     '#020617',

  // --- TERMS ---
  'section.terms.badge':      'Terms & Conditions',
  'section.terms.title1':     'Terms of',
  'section.terms.title2':     'Use.',
  'section.terms.subtitle':   'Welcome to SHARERS GYM. By accessing our website, purchasing our products, or using our facilities, you agree to comply with and be bound by the following terms and conditions of use.',
  'section.terms.sec1Title':  '1. Facility Access & Memberships',
  'section.terms.sec1Body':   'Access to SHARERS GYM is granted exclusively via your digital member pass or active membership subscription. Memberships are strictly personal, non-transferable, and non-refundable.',
  'section.terms.sec2Title':  '2. E-Commerce & Day Passes',
  'section.terms.sec2Body':   'All physical products, day passes, and memberships are billed in Nigerian Naira (₦) through our authorized payment gateways.',
  'section.terms.sec3Title':  '3. Health & Safety Waiver',
  'section.terms.sec3Body':   'By utilizing SHARERS GYM facilities, you acknowledge that physical exercise involves inherent risks. You certify that you are in good physical condition.',
  'section.terms.bg':         '#ffffff',
  'section.terms.text':       '#020617',

  // --- REFUND ---
  'section.refund.badge':     'Refunds & Exchanges',
  'section.refund.title1':    'Refund',
  'section.refund.title2':    'Policy.',
  'section.refund.subtitle':  'We want you to be fully satisfied with your SHARERS GYM experience. Please review our comprehensive return, exchange, and cancellation policies below.',
  'section.refund.sec1Title': '1. Physical Products & Gear',
  'section.refund.sec1Body':  'Unused apparel, gear, and accessories in their original packaging with tags intact can be returned within 14 days of receipt for a full refund or exchange.',
  'section.refund.sec2Title': '2. Memberships & Gym Passes',
  'section.refund.sec2Body':  'All membership plans are billed upfront and are non-refundable once the billing cycle begins. You may cancel your membership at any time via your user dashboard.',
  'section.refund.sec3Title': '3. Digital Access (Day Passes)',
  'section.refund.sec3Body':  'Day passes purchased via the platform are non-refundable and hold no direct fiat cash value.',
  'section.refund.bg':        '#ffffff',
  'section.refund.text':      '#020617',
}

/** GET /api/theme — returns merged defaults + DB overrides */
export async function GET() {
  try {
    const rows = await prisma.storeSetting.findMany({
      where: { key: { in: [...THEME_KEYS, 'banner_enabled', 'banner_message', 'banner_code'] } }
    })

    const result: Record<string, string> = { ...THEME_DEFAULTS }
    for (const row of rows) {
      result[row.key] = row.value
    }

    const dbHasSectionMsg = rows.some(r => r.key === 'section.banner.message')
    const dbHasSectionCode = rows.some(r => r.key === 'section.banner.code')
    const dbHasSectionEn = rows.some(r => r.key === 'section.banner.enabled')

    const bannerMsg = rows.find(r => r.key === 'banner_message')?.value
    const bannerCode = rows.find(r => r.key === 'banner_code')?.value
    const bannerEn = rows.find(r => r.key === 'banner_enabled')?.value

    if (!dbHasSectionMsg && bannerMsg) {
      result['section.banner.message'] = bannerMsg
    }
    if (!dbHasSectionCode && bannerCode) {
      result['section.banner.code'] = bannerCode
    }
    if (!dbHasSectionEn && bannerEn !== undefined) {
      result['section.banner.enabled'] = bannerEn
    }

    return NextResponse.json({ theme: result })
  } catch (error) {
    console.error('[GET /api/theme]', error)
    return NextResponse.json({ theme: THEME_DEFAULTS })
  }
}

/** POST /api/theme — saves theme key/value pairs to StoreSetting and syncs legacy banner keys */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const updates: { key: string; value: string }[] = body.updates

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const safe = updates.filter(u => (THEME_KEYS as readonly string[]).includes(u.key as any))

    // Build batch of operations for a single transaction (reuses 1 connection, solves pool timeout)
    const ops = safe.map(({ key, value }) =>
      prisma.storeSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )

    // Sync legacy banner keys for backwards compatibility with attributes page
    const bannerEnabled = safe.find(u => u.key === 'section.banner.enabled')
    const bannerMsg = safe.find(u => u.key === 'section.banner.message')
    const bannerCode = safe.find(u => u.key === 'section.banner.code')

    if (bannerEnabled) {
      ops.push(
        prisma.storeSetting.upsert({
          where: { key: 'banner_enabled' },
          update: { value: bannerEnabled.value },
          create: { key: 'banner_enabled', value: bannerEnabled.value },
        })
      )
    }
    if (bannerMsg) {
      ops.push(
        prisma.storeSetting.upsert({
          where: { key: 'banner_message' },
          update: { value: bannerMsg.value },
          create: { key: 'banner_message', value: bannerMsg.value },
        })
      )
    }
    if (bannerCode) {
      ops.push(
        prisma.storeSetting.upsert({
          where: { key: 'banner_code' },
          update: { value: bannerCode.value },
          create: { key: 'banner_code', value: bannerCode.value },
        })
      )
    }

    if (ops.length > 0) {
      await prisma.$transaction(ops)
    }

    return NextResponse.json({ success: true, saved: safe.length })
  } catch (error) {
    console.error('[POST /api/theme]', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
