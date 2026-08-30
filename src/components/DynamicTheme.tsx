import prisma from '@/lib/prisma'
import { THEME_DEFAULTS, THEME_KEYS } from '@/app/api/theme/route'

export async function getDynamicThemeSettings() {
  try {
    const rows = await prisma.storeSetting.findMany({
      where: { key: { in: [...THEME_KEYS, 'banner_enabled', 'banner_message', 'banner_code'] } }
    })
    const theme: Record<string, string> = { ...THEME_DEFAULTS }
    for (const row of rows) {
      theme[row.key] = row.value
    }
    const dbHasSectionMsg = rows.some(r => r.key === 'section.banner.message')
    const bannerMsg = rows.find(r => r.key === 'banner_message')?.value
    if (!dbHasSectionMsg && bannerMsg) {
      theme['section.banner.message'] = bannerMsg
    }
    return theme
  } catch (error) {
    console.error('Failed to load theme settings from DB:', error)
    return THEME_DEFAULTS
  }
}

export default async function DynamicTheme() {
  const theme = await getDynamicThemeSettings()

  const primaryColor = theme['theme.color.primary'] || THEME_DEFAULTS['theme.color.primary']
  const accentColor = theme['theme.color.accent'] || THEME_DEFAULTS['theme.color.accent']
  const secondaryColor = theme['theme.color.secondary'] || THEME_DEFAULTS['theme.color.secondary']
  const placeholderColor = theme['theme.color.placeholder'] || THEME_DEFAULTS['theme.color.placeholder']
  
  const headingFont = theme['theme.font.heading'] || THEME_DEFAULTS['theme.font.heading']
  const bodyFont = theme['theme.font.body'] || THEME_DEFAULTS['theme.font.body']

  const headingTracking = theme['theme.tracking.heading'] || THEME_DEFAULTS['theme.tracking.heading']
  const brandRadius = theme['theme.radius.brand'] || THEME_DEFAULTS['theme.radius.brand']

  const fontsToLoad = Array.from(new Set([headingFont, bodyFont])).filter(f => f && f !== 'system-ui' && f !== 'sans-serif' && f !== 'serif')
  const googleFontsQuery = fontsToLoad
    .map(f => `family=${encodeURIComponent(f.trim())}:ital,wght@0,300..900;1,300..900`)
    .join('&')

  const googleFontsUrl = googleFontsQuery ? `https://fonts.googleapis.com/css2?${googleFontsQuery}&display=swap` : null

  const cssVariables = `
    :root {
      --color-primary: ${primaryColor};
      --color-accent: ${accentColor};
      --color-secondary: ${secondaryColor};
      --color-placeholder: ${placeholderColor};
      --primary: ${primaryColor};
      --secondary: ${secondaryColor};
      --accent: ${accentColor};
      --placeholder: ${placeholderColor};
      --font-cormorant: "${headingFont}", serif;
      --font-outfit: "${bodyFont}", sans-serif;
      --radius-brand-none: ${brandRadius};
    }
    h1, h2, h3, h4, h5, h6, .font-heading, .font-cormorant {
      font-family: "${headingFont}", serif !important;
      letter-spacing: ${headingTracking};
    }
    body, html, .font-body, .font-outfit {
      font-family: "${bodyFont}", sans-serif;
    }
  `

  const livePreviewListenerScript = `
    (function() {
      window.addEventListener('message', function(event) {
        if (!event.data || event.data.type !== 'SHARERS_THEME_PREVIEW') return;
        var t = event.data.theme || {};
        var doc = document.documentElement;
        
        if (t['theme.color.primary']) {
          doc.style.setProperty('--color-primary', t['theme.color.primary']);
          doc.style.setProperty('--primary', t['theme.color.primary']);
        }
        if (t['theme.color.accent']) {
          doc.style.setProperty('--color-accent', t['theme.color.accent']);
          doc.style.setProperty('--accent', t['theme.color.accent']);
          doc.style.setProperty('--color-accent-light', t['theme.color.accent']);
          var colorStyle = document.getElementById('sharers-live-color-override');
          if (!colorStyle) {
            colorStyle = document.createElement('style');
            colorStyle.id = 'sharers-live-color-override';
            document.head.appendChild(colorStyle);
          }
          colorStyle.innerHTML = 
            '.text-accent { color: ' + t['theme.color.accent'] + ' !important; } ' +
            '.bg-accent { background-color: ' + t['theme.color.accent'] + ' !important; } ' +
            '.border-accent { border-color: ' + t['theme.color.accent'] + ' !important; } ' +
            '.hover\\:text-accent:hover { color: ' + t['theme.color.accent'] + ' !important; } ' +
            '.hover\\:bg-accent:hover { background-color: ' + t['theme.color.accent'] + ' !important; }';
        }
        if (t['theme.color.secondary']) {
          doc.style.setProperty('--color-secondary', t['theme.color.secondary']);
          doc.style.setProperty('--secondary', t['theme.color.secondary']);
        }
        if (t['theme.color.placeholder']) {
          doc.style.setProperty('--color-placeholder', t['theme.color.placeholder']);
          doc.style.setProperty('--placeholder', t['theme.color.placeholder']);
        }
        if (t['theme.radius.brand']) {
          doc.style.setProperty('--radius-brand-none', t['theme.radius.brand']);
          var btnStyle = document.getElementById('sharers-live-btn-radius');
          if (!btnStyle) {
            btnStyle = document.createElement('style');
            btnStyle.id = 'sharers-live-btn-radius';
            document.head.appendChild(btnStyle);
          }
          btnStyle.innerHTML = 'button:not([data-static-shape]):not(.admin-nav-item), .btn, .btn-primary, .btn-secondary, .btn-elite, a.btn-primary, a.btn-secondary, a.btn-elite { border-radius: ' + t['theme.radius.brand'] + ' !important; }';
        }

        var hFont = t['theme.font.heading'];
        var bFont = t['theme.font.body'];
        var tracking = t['theme.tracking.heading'];

        if (hFont || bFont) {
          var fonts = [];
          if (hFont) fonts.push(hFont);
          if (bFont && bFont !== hFont) fonts.push(bFont);
          var q = fonts.map(function(f) { return 'family=' + encodeURIComponent(f) + ':ital,wght@0,300..900;1,300..900'; }).join('&');
          
          var link = document.getElementById('sharers-live-preview-fonts');
          if (!link) {
            link = document.createElement('link');
            link.id = 'sharers-live-preview-fonts';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
          }
          link.href = 'https://fonts.googleapis.com/css2?' + q + '&display=swap';

          var styleEl = document.getElementById('sharers-live-font-override');
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'sharers-live-font-override';
            document.head.appendChild(styleEl);
          }
          styleEl.innerHTML = 
            (hFont ? 'h1, h2, h3, h4, h5, h6, .font-heading, .font-cormorant { font-family: "' + hFont + '", serif !important; letter-spacing: ' + (tracking || '-0.04em') + ' !important; }' : '') +
            (bFont ? 'body, html, .font-body, .font-outfit { font-family: "' + bFont + '", sans-serif !important; }' : '');
        }
      });
    })();
  `

  return (
    <>
      {googleFontsUrl && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={googleFontsUrl} />
        </>
      )}
      <style id="sharers-dynamic-theme" dangerouslySetInnerHTML={{ __html: cssVariables }} />
      <script dangerouslySetInnerHTML={{ __html: livePreviewListenerScript }} />
    </>
  )
}
