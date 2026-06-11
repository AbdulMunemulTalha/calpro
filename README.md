# CalcPro — Full-Stack Calculator SaaS

21 professional calculators across Finance, Health, Real Estate, and Crypto.
Built with React 18 · Recharts · React Router v6 · React Markdown

---

## 🚀 Deploy to Vercel (5 minutes)

### Option A — Vercel CLI (recommended)
```bash
npm install -g vercel
cd calcpro
vercel
```
Follow prompts → framework: **Create React App** → deploy.

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Framework: **Create React App** (auto-detected)
4. Click Deploy

### Connect your custom domain
Vercel Dashboard → your project → Settings → Domains → Add domain

---

## 💰 Monetization Setup

### 1. Google AdSense
1. Apply at [adsense.google.com](https://adsense.google.com) — site must be live first
2. Once approved, get your Publisher ID (ca-pub-XXXXXXXXXXXXXXXXXX)
3. Open `src/components/ui/AdSlot.jsx`
4. Replace `ca-pub-XXXXXXXXXXXXXXXX` with your real ID
5. Replace slot numbers (e.g. `1234567890`) with your real ad slot IDs
6. Redeploy

### 2. Affiliate Links
Open `src/data/calculators.js` — each calculator has an `affiliates` array.
Replace placeholder URLs with your real affiliate links:
- **Finance calcs** → Interactive Brokers, Tastytrade, ThinkorSwim referrals
- **Crypto calcs** → Coinbase, Binance, Bybit affiliate programs
- **Real estate** → Rocket Mortgage, LendingTree referrals
- **Health calcs** → Whoop, MyFitnessPal, Cronometer affiliate programs

### 3. Stripe Subscription (Pro tier — $9/mo)
1. Create account at [stripe.com](https://stripe.com)
2. Create a product "CalcPro Pro" with monthly ($9) and yearly ($84) prices
3. Get your payment link URLs
4. Open `src/pages/PricingPage.jsx`
5. Replace the `#` href on "Get started" buttons with your Stripe payment links

---

## 🔐 Admin Panel

URL: `yourcalcpro.com/admin`

**Default credentials:**
- Username: `admin`
- Password: `calcpro2024!`

**⚠️ Change before going live:**
Open `src/lib/AdminContext.jsx` → update USERNAME and PASSWORD constants.

### Admin features:
- Dashboard with page views, calculator usage charts, blog stats
- Blog post manager (publish/unpublish/delete)
- Markdown blog editor with live preview

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Routing
├── index.css                  # Design system (dark theme)
├── components/
│   ├── admin/AdminLayout.jsx  # Protected admin wrapper
│   ├── calculators/
│   │   └── AllCalculators.jsx # All 21 calculator components
│   ├── layout/Layout.jsx      # Header + Footer
│   └── ui/AdSlot.jsx          # AdSense + affiliate components
├── data/
│   └── calculators.js         # Calculator registry + metadata
├── lib/
│   ├── AdminContext.jsx        # Auth state
│   ├── StatsContext.jsx        # Page view + usage tracking
│   └── blogStore.js            # Blog CRUD (localStorage)
└── pages/
    ├── HomePage.jsx
    ├── CalculatorPage.jsx      # Dynamic /calculators/:slug
    ├── CalculatorsListPage.jsx
    ├── BlogPage.jsx
    ├── BlogPostPage.jsx
    ├── PricingPage.jsx
    ├── AboutPage.jsx
    ├── PrivacyPage.jsx
    ├── TermsPage.jsx
    ├── ContactPage.jsx
    └── admin/
        ├── AdminLogin.jsx
        ├── AdminDashboard.jsx
        ├── AdminBlogList.jsx
        └── AdminBlogEditor.jsx
```

---

## 🧮 All 21 Calculators

**Finance (6)**
- Position Size Calculator
- Compound Interest Calculator
- Options P&L Calculator
- DRIP Calculator
- Break-Even Calculator
- Net Worth Calculator

**Health (5)**
- Macro & Calorie Calculator
- BMI & Body Fat Calculator
- One Rep Max Calculator
- Running Pace Predictor
- Hydration Calculator

**Real Estate (5)**
- Rent vs Buy Calculator
- Mortgage Calculator
- Rental ROI Calculator
- House Flip Calculator
- Home Affordability Calculator

**Crypto (5)**
- Crypto DCA Calculator
- Crypto Profit/Loss Calculator
- Portfolio Rebalancer
- Mining Profit Calculator
- Liquidation Price Calculator

---

## 🛠 Local Development

```bash
npm install
npm start       # http://localhost:3000
npm run build   # Production build → /build folder
```

---

## 📈 SEO Tips
- Each calculator page has unique `<title>` and `<meta description>` via react-helmet-async
- Add a sitemap once live (use `react-router-sitemap` or generate manually)
- Blog posts auto-generate slugs — write keyword-rich titles

---

## 📝 Notes
- All data (blog posts, stats) stored in **localStorage** — no backend required
- Stats reset if user clears browser data — for persistent analytics, integrate Plausible or Google Analytics
- Blog posts are stored per-browser — to share posts across devices, migrate to a CMS (Contentful, Sanity, or a simple JSON file on GitHub)
