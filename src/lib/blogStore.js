const STORAGE_KEY = 'cp_blogs';

const SEED_POSTS = [
  {
    id: '1',
    title: 'How to Calculate Position Size Like a Professional Trader',
    slug: 'how-to-calculate-position-size',
    excerpt: 'Position sizing is the single most important skill in trading. Learn how professionals use the 1% rule to protect their accounts and compound gains.',
    content: `## Why Position Sizing Changes Everything

Most traders focus on finding the "perfect entry." But professionals know that consistent position sizing is what separates those who last from those who blow up.

The core principle is simple: **never risk more than 1-2% of your account on any single trade.** This means that even a losing streak of 10 trades only costs you 10-20% — recoverable. But traders who risk 10% per trade can lose 65% of their account in just 10 consecutive losses.

## The Formula

\`\`\`
Position Size = (Account × Risk %) / Stop Loss Distance
\`\`\`

Example: $10,000 account, 1% risk, $5 stop distance = 20 shares.

## R:R Ratio

Your reward-to-risk ratio tells you how much you earn per dollar risked. Aim for at least 2:1. This means you only need to be right 34% of the time to be profitable.

Use our [Position Size Calculator](/calculators/position-size) to run these numbers instantly.

## The Kelly Criterion

For more advanced sizing, the Kelly Criterion optimizes bet size based on your win rate and average R:R. But most pros use a "fractional Kelly" (25-50% of Kelly) to reduce variance.

## Bottom Line

1% risk per trade. 2:1 minimum R:R. These two rules alone put you ahead of 90% of retail traders.`,
    category: 'Trading',
    tags: ['trading', 'risk management', 'position sizing'],
    author: 'CalPro Team',
    published: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    coverImage: '',
    readTime: 5,
  },
  {
    id: '2',
    title: 'BMI vs Body Fat Percentage: Which Actually Matters?',
    slug: 'bmi-vs-body-fat-percentage',
    excerpt: "BMI is the most widely used health metric — but is it the most useful? We break down what BMI misses and why body fat percentage tells a more complete story.",
    content: `## The Problem with BMI

Body Mass Index was invented in the 1830s by a mathematician — not a doctor. It was designed as a population-level statistical tool, not an individual health assessment.

The formula: **BMI = weight(kg) / height(m)²**

It ignores muscle mass entirely. A 200lb bodybuilder and a 200lb sedentary person have the same BMI but wildly different health profiles.

## When BMI Still Works

For most sedentary adults, BMI correlates reasonably well with body fat. It's a useful quick screen — especially at population scale.

## Body Fat % is More Precise

Body fat percentage directly measures what BMI tries to approximate. Ideal ranges:

| Category | Men | Women |
|----------|-----|-------|
| Athlete | 6-13% | 14-20% |
| Fitness | 14-17% | 21-24% |
| Average | 18-24% | 25-31% |
| Obese | 25%+ | 32%+ |

## The Best Approach

Use both together. BMI for a quick initial screen, body fat % for a more accurate picture. Try our [BMI & Body Fat Calculator](/calculators/bmi-body-fat) to see both metrics instantly.`,
    category: 'Health',
    tags: ['health', 'BMI', 'fitness', 'body composition'],
    author: 'CalPro Team',
    published: true,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    coverImage: '',
    readTime: 4,
  },
  {
    id: '3',
    title: 'DCA vs Lump Sum: The Data on Crypto Investing',
    slug: 'dca-vs-lump-sum-crypto',
    excerpt: 'Dollar-cost averaging feels safer than lump-sum investing — but does the data back that up? We analyze the numbers for crypto markets specifically.',
    content: `## The Emotional Case for DCA

Dollar-cost averaging (DCA) — investing a fixed amount at regular intervals — is popular because it *feels* safer. You're not trying to time the market. You buy more when prices are low, less when they're high.

## What the Data Says

In traditional markets, lump-sum investing outperforms DCA about 2/3 of the time over long periods. The reasoning is simple: markets trend up over time, so time in the market beats timing the market.

**But crypto is different.** The extreme volatility of crypto assets actually makes DCA more effective relative to traditional assets, because:

1. Drawdowns are deeper (60-80% crashes are common)
2. Recovery periods are longer
3. The psychological pressure to sell at bottoms is enormous

## DCA Smooths Volatility

If you invested $500/month in Bitcoin from 2020-2023, your average cost basis would be roughly $32,000. Anyone who lump-summed at the 2021 peak at $65,000 is still underwater.

## The Hybrid Approach

Many experienced crypto investors use DCA as a base strategy, then deploy additional lump sums during obvious market crashes (>50% drawdowns from ATH).

Run your own numbers with our [Crypto DCA Calculator](/calculators/crypto-dca).`,
    category: 'Crypto',
    tags: ['crypto', 'DCA', 'investing', 'bitcoin'],
    author: 'CalPro Team',
    published: true,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
    coverImage: '',
    readTime: 5,
  },
];

export function getPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_POSTS));
      return SEED_POSTS;
    }
    return JSON.parse(raw);
  } catch { return SEED_POSTS; }
}

export function getPublishedPosts() {
  return getPosts().filter(p => p.published).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getPostBySlug(slug) {
  return getPosts().find(p => p.slug === slug);
}

export function getPostById(id) {
  return getPosts().find(p => p.id === id);
}

export function savePost(post) {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === post.id);
  if (idx >= 0) {
    posts[idx] = { ...post, updatedAt: new Date().toISOString() };
  } else {
    posts.unshift({ ...post, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return posts;
}

export function deletePost(id) {
  const posts = getPosts().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return posts;
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
