// ─── Google Analytics 4 — Real Analytics ─────────────────────────────────────
// Replace GA4_MEASUREMENT_ID with your actual GA4 ID (format: G-XXXXXXXXXX)
// Get it free at: analytics.google.com → Admin → Create Property → Data Streams
const GA4_ID = 'G-XXXXXXXXXX'; // ← Replace this with your real GA4 ID

// Load GA4 script once
export function initGA4() {
  if (typeof window === 'undefined') return;
  if (window.__ga4loaded) return;
  window.__ga4loaded = true;

  // Inject gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA4_ID, {
    send_page_view: true,           // auto track page views
    anonymize_ip: true,             // GDPR compliance
    cookie_flags: 'SameSite=None;Secure',
  });
}

// Track a page view (call on route change)
export function trackPageView(path, title) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

// Track calculator actually used (fire on Calculate button click)
export function trackCalcUse(calcId, calcTitle) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'calculator_used', {
    event_category: 'Calculator',
    event_label: calcTitle || calcId,
    calculator_id: calcId,
    value: 1,
  });
}

// Track blog post view
export function trackBlogView(slug, title) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'blog_view', {
    event_category: 'Blog',
    event_label: title || slug,
    blog_slug: slug,
  });
}
