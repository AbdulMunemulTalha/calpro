export const NICHES = [
  { id: 'finance', label: 'Trading & Finance', color: '#3b82f6', icon: 'TrendingUp' },
  { id: 'health', label: 'Health & Fitness', color: '#10b981', icon: 'Heart' },
  { id: 'realestate', label: 'Real Estate', color: '#f59e0b', icon: 'Home' },
  { id: 'crypto', label: 'Crypto', color: '#8b5cf6', icon: 'Bitcoin' },
];

export const CALCULATORS = [
  // FINANCE
  {
    id: 'position-size',
    slug: 'position-size',
    title: 'Position Size & Risk',
    description: 'Calculate exact position size, dollar risk, and R:R ratio for any trade.',
    niche: 'finance',
    tags: ['trading', 'risk', 'stocks'],
    popular: true,
    affiliates: [
      { name: 'Interactive Brokers', url: 'https://www.interactivebrokers.com', cta: 'Open Account' },
      { name: 'TD Ameritrade', url: 'https://www.tdameritrade.com', cta: 'Trade Free' },
    ],
  },
  {
    id: 'compound-interest',
    slug: 'compound-interest',
    title: 'Compound Interest',
    description: 'See how your money grows with compound interest and regular contributions.',
    niche: 'finance',
    tags: ['savings', 'investing', 'interest'],
    popular: true,
    affiliates: [
      { name: 'Marcus by Goldman Sachs', url: 'https://www.marcus.com', cta: 'High-Yield Savings' },
    ],
  },
  {
    id: 'options-pl',
    slug: 'options-pl',
    title: 'Options P&L',
    description: 'Calculate options profit/loss, breakeven, and payoff at expiry.',
    niche: 'finance',
    tags: ['options', 'derivatives', 'trading'],
    affiliates: [
      { name: 'Tastytrade', url: 'https://tastytrade.com', cta: 'Trade Options' },
    ],
  },
  {
    id: 'drip',
    slug: 'drip',
    title: 'DRIP Calculator',
    description: 'Project dividend reinvestment growth and share accumulation over time.',
    niche: 'finance',
    tags: ['dividends', 'investing', 'passive income'],
    affiliates: [
      { name: 'M1 Finance', url: 'https://m1.com', cta: 'Auto-Invest Free' },
    ],
  },
  {
    id: 'break-even',
    slug: 'break-even',
    title: 'Break-Even Analysis',
    description: 'Find the break-even point for your business with cost and revenue modeling.',
    niche: 'finance',
    tags: ['business', 'revenue', 'costs'],
    affiliates: [],
  },
  {
    id: 'net-worth',
    slug: 'net-worth',
    title: 'Net Worth Tracker',
    description: 'Calculate your net worth from assets and liabilities with visual breakdown.',
    niche: 'finance',
    tags: ['personal finance', 'wealth', 'assets'],
    affiliates: [],
  },
  // HEALTH
  {
    id: 'macro-calorie',
    slug: 'macro-calorie',
    title: 'Macro & Calorie Planner',
    description: 'Get your TDEE, daily calories, and macro split based on your goals.',
    niche: 'health',
    tags: ['nutrition', 'diet', 'macros'],
    popular: true,
    affiliates: [
      { name: 'MyFitnessPal', url: 'https://www.myfitnesspal.com', cta: 'Track Macros Free' },
      { name: 'Whoop', url: 'https://www.whoop.com', cta: 'Track Recovery' },
    ],
  },
  {
    id: 'bmi-body-fat',
    slug: 'bmi-body-fat',
    title: 'BMI & Body Fat %',
    description: 'Calculate BMI and estimate body fat percentage using the Navy Method.',
    niche: 'health',
    tags: ['BMI', 'body composition', 'fitness'],
    popular: true,
    affiliates: [
      { name: 'Withings', url: 'https://www.withings.com', cta: 'Smart Scale' },
    ],
  },
  {
    id: 'one-rep-max',
    slug: 'one-rep-max',
    title: '1-Rep Max (1RM)',
    description: 'Calculate your one-rep max and generate a full percentage training table.',
    niche: 'health',
    tags: ['strength', 'gym', 'powerlifting'],
    affiliates: [
      { name: 'Barbell Medicine', url: 'https://www.barbellmedicine.com', cta: 'Programming' },
    ],
  },
  {
    id: 'running-pace',
    slug: 'running-pace',
    title: 'Running Pace Predictor',
    description: 'Predict your race finish times from 5K to marathon using the Riegel formula.',
    niche: 'health',
    tags: ['running', 'marathon', 'cardio'],
    affiliates: [
      { name: 'Garmin', url: 'https://www.garmin.com', cta: 'GPS Watch' },
    ],
  },
  {
    id: 'hydration',
    slug: 'hydration',
    title: 'Hydration Calculator',
    description: 'Find your optimal daily water intake based on weight, activity, and climate.',
    niche: 'health',
    tags: ['hydration', 'water', 'wellness'],
    affiliates: [],
  },
  // REAL ESTATE
  {
    id: 'rent-vs-buy',
    slug: 'rent-vs-buy',
    title: 'Rent vs Buy',
    description: 'Compare the true long-term cost of renting vs buying with a crossover chart.',
    niche: 'realestate',
    tags: ['mortgage', 'rent', 'home buying'],
    popular: true,
    affiliates: [
      { name: 'Rocket Mortgage', url: 'https://www.rocketmortgage.com', cta: 'Get Rate' },
      { name: 'LendingTree', url: 'https://www.lendingtree.com', cta: 'Compare Rates' },
    ],
  },
  {
    id: 'mortgage',
    slug: 'mortgage',
    title: 'Mortgage Amortization',
    description: 'Calculate monthly payments, total interest, and full amortization schedule.',
    niche: 'realestate',
    tags: ['mortgage', 'loan', 'amortization'],
    popular: true,
    affiliates: [
      { name: 'Better.com', url: 'https://better.com', cta: 'Pre-Qualify Now' },
    ],
  },
  {
    id: 'rental-roi',
    slug: 'rental-roi',
    title: 'Rental Property ROI',
    description: 'Calculate cap rate, cash-on-cash return, NOI, and monthly cash flow.',
    niche: 'realestate',
    tags: ['investment', 'rental', 'ROI'],
    affiliates: [
      { name: 'Roofstock', url: 'https://www.roofstock.com', cta: 'Browse Rentals' },
    ],
  },
  {
    id: 'house-flip',
    slug: 'house-flip',
    title: 'House Flip Profit',
    description: 'Calculate net profit, ROI, and annualized return on a house flip.',
    niche: 'realestate',
    tags: ['flipping', 'profit', 'real estate investing'],
    affiliates: [],
  },
  {
    id: 'affordability',
    slug: 'affordability',
    title: 'Home Affordability',
    description: 'Find your max home price using income, debts, and 28/36 DTI rules.',
    niche: 'realestate',
    tags: ['affordability', 'home buying', 'DTI'],
    affiliates: [
      { name: 'Zillow', url: 'https://www.zillow.com', cta: 'Search Homes' },
    ],
  },
  // CRYPTO
  {
    id: 'crypto-dca',
    slug: 'crypto-dca',
    title: 'Crypto DCA Simulator',
    description: 'Simulate dollar-cost averaging into crypto with cost basis and growth chart.',
    niche: 'crypto',
    tags: ['DCA', 'bitcoin', 'investing'],
    popular: true,
    affiliates: [
      { name: 'Coinbase', url: 'https://www.coinbase.com', cta: 'Start DCA Free' },
      { name: 'Kraken', url: 'https://www.kraken.com', cta: 'Trade Crypto' },
    ],
  },
  {
    id: 'crypto-profit',
    slug: 'crypto-profit',
    title: 'Crypto Profit/Loss',
    description: 'Calculate your crypto gains, losses, fees, and tax estimate.',
    niche: 'crypto',
    tags: ['profit', 'loss', 'tax', 'crypto'],
    affiliates: [
      { name: 'Koinly', url: 'https://koinly.io', cta: 'Crypto Tax Report' },
    ],
  },
  {
    id: 'crypto-rebalance',
    slug: 'crypto-rebalance',
    title: 'Portfolio Rebalancer',
    description: 'See current vs target allocation and exact buy/sell amounts to rebalance.',
    niche: 'crypto',
    tags: ['portfolio', 'rebalancing', 'allocation'],
    affiliates: [],
  },
  {
    id: 'mining-profit',
    slug: 'mining-profit',
    title: 'Mining Profitability',
    description: 'Calculate daily and monthly mining profit from hashrate and power costs.',
    niche: 'crypto',
    tags: ['mining', 'GPU', 'profitability'],
    affiliates: [
      { name: 'NiceHash', url: 'https://www.nicehash.com', cta: 'Start Mining' },
    ],
  },
  {
    id: 'liquidation-price',
    slug: 'liquidation-price',
    title: 'Liquidation Price',
    description: 'Find your exact liquidation price for leveraged crypto positions.',
    niche: 'crypto',
    tags: ['leverage', 'futures', 'liquidation'],
    affiliates: [
      { name: 'Bybit', url: 'https://www.bybit.com', cta: 'Trade with Leverage' },
    ],
  },
  {
    id: 'trading-plan',
    slug: 'trading-plan',
    title: 'Trading Compounding Plan',
    description: 'Generate a day-by-day compounding plan, track outcomes, and download a printable PDF.',
    niche: 'finance',
    popular: true,
    tags: ['compounding', 'trading plan', 'discipline', 'daily tracker'],
    affiliates: [
      { name: 'Interactive Brokers', url: 'https://www.interactivebrokers.com', cta: 'Start Trading' },
    ],
  },

  // ── Finance (new) ──────────────────────────────────────────────
  {id:'pip-value',slug:'pip-value',title:'Pip Value Calculator',description:'Calculate pip value for any forex pair and lot size.',niche:'finance',tags:['forex','pip','trading'],popular:true,affiliates:[{name:'OANDA',url:'https://www.oanda.com',cta:'Trade Forex'}]},
  {id:'risk-reward',slug:'risk-reward',title:'Risk/Reward Ratio',description:'Entry, stop loss & target → R:R ratio + minimum win rate needed.',niche:'finance',tags:['risk','reward','trading'],popular:true,affiliates:[]},
  {id:'profit-loss',slug:'profit-loss',title:'Profit/Loss Calculator',description:'Entry/exit price → P&L in dollars and percentage.',niche:'finance',tags:['profit','loss','trading'],popular:true,affiliates:[]},
  {id:'margin',slug:'margin',title:'Margin Calculator',description:'Leverage + position size → required margin from your account.',niche:'finance',tags:['margin','leverage','trading'],affiliates:[]},
  {id:'currency-converter',slug:'currency-converter',title:'Currency Converter',description:'Convert between 20+ major currencies with approximate rates.',niche:'finance',tags:['forex','currency','conversion'],affiliates:[{name:'Wise',url:'https://wise.com',cta:'Transfer Money'}]},
  {id:'stock-return',slug:'stock-return',title:'Stock Return Calculator',description:'Buy/sell price + dividends → total and annualized return.',niche:'finance',tags:['stocks','return','investing'],affiliates:[]},
  {id:'drawdown-recovery',slug:'drawdown-recovery',title:'Drawdown Recovery Calc',description:'% lost → % gain needed to recover. Visualize the asymmetry.',niche:'finance',tags:['drawdown','loss','recovery'],affiliates:[]},

  // ── Health (new) ────────────────────────────────────────────────
  {id:'calorie-deficit',slug:'calorie-deficit',title:'Calorie Deficit Calculator',description:'TDEE → daily calorie target and deficit to hit your goal weight.',niche:'health',tags:['calories','deficit','weight loss'],popular:true,affiliates:[]},
  {id:'tdee',slug:'tdee',title:'TDEE Calculator',description:'Age, weight, activity → daily calorie needs at every goal level.',niche:'health',tags:['TDEE','calories','metabolism'],popular:true,affiliates:[]},
  {id:'ideal-weight',slug:'ideal-weight',title:'Ideal Weight Calculator',description:'Height + frame size → healthy weight range using Devine formula.',niche:'health',tags:['weight','health','BMI'],affiliates:[]},
  {id:'protein-intake',slug:'protein-intake',title:'Protein Intake Calculator',description:'Goal (bulk/cut/maintain) → daily protein grams + food sources.',niche:'health',tags:['protein','nutrition','muscle'],affiliates:[]},

  // ── Real Estate (new) ───────────────────────────────────────────
  {id:'refinance',slug:'refinance',title:'Refinance Calculator',description:'Old vs new rate → monthly savings, break-even point & total savings.',niche:'realestate',tags:['refinance','mortgage','savings'],affiliates:[{name:'LendingTree',url:'https://www.lendingtree.com',cta:'Compare Rates'}]},
  {id:'down-payment',slug:'down-payment',title:'Down Payment Savings',description:'Target home price + monthly savings → months to reach your goal.',niche:'realestate',tags:['down payment','savings','home buying'],affiliates:[]},
  {id:'stamp-duty',slug:'stamp-duty',title:'Stamp Duty Calculator',description:'Property price → stamp duty / transfer tax owed by country.',niche:'realestate',tags:['stamp duty','tax','property'],affiliates:[]},
  {id:'amortization',slug:'amortization',title:'Amortization Schedule',description:'Full month-by-month breakdown of principal, interest, and balance.',niche:'realestate',tags:['amortization','mortgage','schedule'],affiliates:[]},
  {id:'gross-rental-yield',slug:'gross-rental-yield',title:'Gross Rental Yield',description:'Annual rent ÷ property value → yield % to compare investments.',niche:'realestate',tags:['rental yield','property','investment'],affiliates:[]},

  // ── Crypto (new) ────────────────────────────────────────────────
  {id:'crypto-tax',slug:'crypto-tax',title:'Crypto Tax Calculator',description:'Gains + tax bracket + holding period → estimated crypto tax bill.',niche:'crypto',tags:['tax','crypto','capital gains'],popular:true,affiliates:[{name:'Koinly',url:'https://koinly.io',cta:'Crypto Tax Report'}]},
  {id:'crypto-position-size',slug:'crypto-position-size',title:'Crypto Position Size',description:'Portfolio % risk → exact dollar and coin amount to invest.',niche:'crypto',tags:['position size','risk','crypto'],popular:true,affiliates:[]},
  {id:'staking-rewards',slug:'staking-rewards',title:'Staking Rewards Calc',description:'Amount + APY → daily, weekly, monthly and yearly rewards.',niche:'crypto',tags:['staking','APY','rewards'],affiliates:[]},
  {id:'ath-return',slug:'ath-return',title:'ATH Return Calculator',description:'Current price vs ATH → % from high/low and recovery needed.',niche:'crypto',tags:['ATH','price','return'],affiliates:[]},
  {id:'funding-rate',slug:'funding-rate',title:'Funding Rate Calculator',description:'Position size + rate → funding cost or gain per payment period.',niche:'crypto',tags:['funding rate','futures','perpetual'],affiliates:[]},
  {id:'btc-savings-plan',slug:'btc-savings-plan',title:'BTC Savings Plan',description:'Monthly $ + price target → BTC accumulated and portfolio value.',niche:'crypto',tags:['bitcoin','savings','DCA'],affiliates:[]},
];

export function getCalcBySlug(slug) {
  return CALCULATORS.find(c => c.slug === slug);
}

export function getCalcsByNiche(niche) {
  return CALCULATORS.filter(c => c.niche === niche);
}

export function getPopularCalcs() {
  return CALCULATORS.filter(c => c.popular);
}

// ── Internal linking clusters — topic-based cross-linking ──────────────────
export const RELATED_CLUSTERS = {
  // Finance clusters
  'position-size':    ['risk-reward','pip-value','margin','drawdown-recovery','trading-plan'],
  'pip-value':        ['position-size','risk-reward','profit-loss','margin'],
  'risk-reward':      ['position-size','profit-loss','drawdown-recovery','trading-plan'],
  'profit-loss':      ['risk-reward','position-size','stock-return','crypto-profit'],
  'margin':           ['position-size','liquidation-price','risk-reward'],
  'drawdown-recovery':['position-size','risk-reward','trading-plan','compound-interest'],
  'compound-interest':['drip','net-worth','break-even','stock-return'],
  'currency-converter':['pip-value','profit-loss','position-size'],
  'stock-return':     ['drip','compound-interest','net-worth','profit-loss'],
  'trading-plan':     ['position-size','risk-reward','drawdown-recovery','compound-interest'],
  'break-even':       ['net-worth','compound-interest','rental-roi'],
  'net-worth':        ['compound-interest','drip','stock-return'],
  'drip':             ['compound-interest','stock-return','net-worth'],
  'options-pl':       ['profit-loss','risk-reward','position-size'],
  // Health clusters
  'bmi-body-fat':     ['tdee','calorie-deficit','macro-calorie','ideal-weight'],
  'calorie-deficit':  ['tdee','macro-calorie','bmi-body-fat','protein-intake'],
  'macro-calorie':    ['tdee','calorie-deficit','protein-intake','bmi-body-fat'],
  'tdee':             ['calorie-deficit','macro-calorie','bmi-body-fat'],
  'one-rep-max':      ['protein-intake','macro-calorie','running-pace'],
  'running-pace':     ['hydration','one-rep-max','tdee'],
  'hydration':        ['running-pace','tdee','bmi-body-fat'],
  'ideal-weight':     ['bmi-body-fat','calorie-deficit','tdee'],
  'protein-intake':   ['macro-calorie','calorie-deficit','one-rep-max'],
  // Real estate clusters
  'mortgage':         ['rent-vs-buy','affordability','amortization','refinance'],
  'rent-vs-buy':      ['mortgage','affordability','rental-roi','down-payment'],
  'rental-roi':       ['gross-rental-yield','house-flip','mortgage','rent-vs-buy'],
  'affordability':    ['mortgage','rent-vs-buy','down-payment'],
  'refinance':        ['mortgage','amortization','down-payment'],
  'down-payment':     ['mortgage','affordability','refinance'],
  'stamp-duty':       ['mortgage','affordability','house-flip'],
  'house-flip':       ['rental-roi','gross-rental-yield','mortgage','stamp-duty'],
  'amortization':     ['mortgage','refinance','rent-vs-buy'],
  'gross-rental-yield':['rental-roi','house-flip','mortgage'],
  // Crypto clusters
  'crypto-profit':    ['crypto-tax','crypto-position-size','crypto-dca','profit-loss'],
  'crypto-dca':       ['btc-savings-plan','crypto-profit','staking-rewards'],
  'crypto-tax':       ['crypto-profit','crypto-dca','ath-return'],
  'mining-profit':    ['crypto-profit','crypto-dca','btc-savings-plan'],
  'crypto-position-size':['liquidation-price','funding-rate','crypto-profit'],
  'liquidation-price':['crypto-position-size','funding-rate','margin'],
  'staking-rewards':  ['crypto-dca','btc-savings-plan','crypto-profit'],
  'ath-return':       ['crypto-profit','crypto-dca','crypto-tax'],
  'funding-rate':     ['liquidation-price','crypto-position-size','crypto-profit'],
  'btc-savings-plan': ['crypto-dca','staking-rewards','compound-interest'],
  'crypto-rebalance': ['crypto-dca','crypto-profit','btc-savings-plan'],
};
