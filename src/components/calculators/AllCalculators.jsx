import React, { useState, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

// ─── Shared helpers ───────────────────────────────────────────────────────────
const fmt = (n, d = 2) => isNaN(n) ? '—' : n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtUSD = (n) => isNaN(n) ? '—' : '$' + fmt(n);
const fmtPct = (n, d = 1) => isNaN(n) ? '—' : fmt(n, d) + '%';
const fmtInt = (n) => isNaN(n) ? '—' : Math.round(n).toLocaleString('en-US');

const COLORS = ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4','#ec4899'];

function Field({ label, children, prefix, suffix }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', letterSpacing: '0.03em' }}>{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && <span style={{ position: 'absolute', left: 10, fontSize: 13, color: 'var(--text-3)', pointerEvents: 'none', zIndex: 1 }}>{prefix}</span>}
        {React.cloneElement(children, { className: 'input' + (prefix ? ' input-with-prefix' : '') + (suffix ? ' input-with-suffix' : '') })}
        {suffix && <span style={{ position: 'absolute', right: 10, fontSize: 13, color: 'var(--text-3)', pointerEvents: 'none' }}>{suffix}</span>}
      </div>
    </div>
  );
}

function InputGrid({ children, cols = 3 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))`, gap: 12, marginBottom: 20 }}>
      {children}
    </div>
  );
}

function MetricGrid({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>{children}</div>;
}

function Metric({ label, value, sub, accent, color }) {
  return (
    <div className="metric-card" style={accent ? { background: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.3)' } : {}}>
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={{ color: color || (accent ? 'var(--accent)' : 'var(--text-1)'), fontSize: 20 }}>{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

function DirBtn({ label, icon: Icon, active, activeClass, onClick }) {
  const styles = {
    long: { background: '#0f2d1f', borderColor: '#10b981', color: '#34d399' },
    short: { background: '#2d0f0f', borderColor: '#ef4444', color: '#f87171' },
  };
  return (
    <button onClick={onClick} className="btn" style={{
      flex: 1, height: 38, fontSize: 13,
      ...(active ? styles[activeClass] : { background: 'var(--bg-2)', borderColor: 'var(--border)', color: 'var(--text-2)' }),
      border: '1px solid',
    }}>
      <Icon size={14} /> {label}
    </button>
  );
}

function ChartWrap({ children, height = 200 }) {
  return <div style={{ marginTop: 16, height }}><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>;
}

const TT_STYLE = { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text-1)' };

// ─── 1. Position Size ────────────────────────────────────────────────────────
export function PositionSizeCalc({ onCalcUsed }) {
  const [dir, setDir] = useState('long');
  const [v, setV] = useState({ account: '', risk: '', entry: '', stop: '', target: '', commission: '' });
  const [res, setRes] = useState(null);
  const [clicked, setClicked] = useState(false);
  const s = n => e => setV(p => ({ ...p, [n]: parseFloat(e.target.value) || 0 }));

  const dollarRisk = v.account * (v.risk / 100);
  const stopDist = Math.abs(v.entry - v.stop);
  const tgtDist = Math.abs(v.target - v.entry);
  const units = stopDist > 0 ? Math.floor(dollarRisk / stopDist) : 0;
  const actualRisk = units * stopDist;
  const reward = units * tgtDist;
  const rr = stopDist > 0 ? tgtDist / stopDist : 0;
  const leverage = v.account > 0 ? (units * v.entry) / v.account : 0;
  const breakeven = rr > 0 ? (1 / (1 + rr)) * 100 : 0;
  const valid = dir === 'long' ? v.stop < v.entry && v.target > v.entry : v.stop > v.entry && v.target < v.entry;
  const rrColor = rr >= 2.5 ? 'var(--green)' : rr >= 1.5 ? 'var(--amber)' : 'var(--red)';

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <DirBtn label="Long" icon={TrendingUp} active={dir === 'long'} activeClass="long" onClick={() => setDir('long')} />
        <DirBtn label="Short" icon={TrendingDown} active={dir === 'short'} activeClass="short" onClick={() => setDir('short')} />
      </div>
      <InputGrid>
        <Field label="Account size" prefix="$"><input type="number" placeholder="e.g. 10000" onChange={s('account')} /></Field>
        <Field label="Risk %" suffix="%"><input type="number" placeholder="e.g. 1" step={0.1} onChange={s('risk')} /></Field>
        <Field label="Entry price" prefix="$"><input type="number" placeholder="e.g. 100" step={0.01} onChange={s('entry')} /></Field>
        <Field label="Stop loss" prefix="$"><input type="number" placeholder="e.g. 95" step={0.01} onChange={s('stop')} /></Field>
        <Field label="Target price" prefix="$"><input type="number" placeholder="e.g. 115" step={0.01} onChange={s('target')} /></Field>
        <Field label="Commission" prefix="$"><input type="number" placeholder="e.g. 0" step={0.01} onChange={s('commission')} /></Field>
      </InputGrid>
      {!valid && <div className="alert alert-warning" style={{ marginBottom: 16, fontSize: 13 }}>⚠ For a long: stop &lt; entry &lt; target. For short: stop &gt; entry &gt; target.</div>}
      {valid && <>
        <MetricGrid>
          <Metric label="Units to trade" value={fmtInt(units)} sub="shares / contracts" accent />
          <Metric label="Dollar risk" value={fmtUSD(actualRisk)} sub={fmtPct(actualRisk / v.account * 100) + ' of account'} />
          <Metric label="R:R ratio" value={fmt(rr, 1) + ':1'} sub="reward to risk" color={rrColor} />
          <Metric label="Break-even win%" value={fmtPct(breakeven)} sub="min win rate needed" />
        </MetricGrid>
        <div style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <span>Position value: <strong style={{ color: 'var(--text-1)' }}>{fmtUSD(units * v.entry)}</strong></span>
          <span>Max reward: <strong style={{ color: 'var(--green)' }}>{fmtUSD(reward)}</strong></span>
          <span>Leverage: <strong style={{ color: 'var(--text-1)' }}>{fmt(leverage, 2)}×</strong></span>
        </div>
      </>}
    </div>
  );
}

// ─── 2. Compound Interest ────────────────────────────────────────────────────
export function CompoundInterestCalc({ onCalcUsed }) {
  const [v, setV] = useState({ principal: '', monthly: '', rate: '', years: '' });
  const [calcRes, setCalcRes] = useState(null);
  const s = n => e => setV(p => ({ ...p, [n]: parseFloat(e.target.value) || 0 }));

  const data = [];
  let bal = v.principal;
  for (let yr = 0; yr <= v.years; yr++) {
    data.push({ year: yr, balance: Math.round(bal), contributed: Math.round(v.principal + v.monthly * 12 * yr) });
    bal = bal * (1 + v.rate / 100) + v.monthly * 12;
  }
  const final = data[data.length - 1]?.balance || 0;
  const contributed = v.principal + v.monthly * 12 * v.years;
  const interest = final - contributed;

  return (
    <div>
      <InputGrid>
        <Field label="Starting amount" prefix="$"><input type="number" placeholder="e.g. 10000" step={100} onChange={s('principal')} /></Field>
        <Field label="Monthly addition" prefix="$"><input type="number" placeholder="e.g. 500" step={50} onChange={s('monthly')} /></Field>
        <Field label="Annual return" suffix="%"><input type="number" placeholder="e.g. 7" step={0.1} onChange={s('rate')} /></Field>
        <Field label="Time horizon" suffix="yrs"><input type="number" placeholder="e.g. 20" min={1} max={50} onChange={s('years')} /></Field>
      </InputGrid>
      <MetricGrid>
        <Metric label="Final balance" value={fmtUSD(final)} accent />
        <Metric label="Total contributed" value={fmtUSD(contributed)} />
        <Metric label="Interest earned" value={fmtUSD(interest)} color="var(--green)" />
        <Metric label="Growth multiple" value={fmt(final / (v.principal || 1), 1) + '×'} />
      </MetricGrid>
      <ChartWrap height={220}>
        <AreaChart data={data}>
          <XAxis dataKey="year" stroke="var(--text-3)" tick={{ fontSize: 11 }} />
          <YAxis stroke="var(--text-3)" tick={{ fontSize: 11 }} tickFormatter={n => '$' + (n >= 1000 ? (n/1000).toFixed(0)+'k' : n)} />
          <Tooltip contentStyle={TT_STYLE} formatter={(v, n) => [fmtUSD(v), n === 'balance' ? 'Balance' : 'Contributed']} />
          <Area type="monotone" dataKey="contributed" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth={1.5} />
          <Area type="monotone" dataKey="balance" fill="rgba(16,185,129,0.12)" stroke="#10b981" strokeWidth={2} />
        </AreaChart>
      </ChartWrap>
    </div>
  );
}

// ─── 3. Options P&L ──────────────────────────────────────────────────────────
export function OptionsPLCalc({ onCalcUsed }) {
  const [v, setV] = useState({ type: 'call', strike: 100, premium: 5, qty: 1, current: 110 });
  const s = n => e => setV(p => ({ ...p, [n]: parseFloat(e.target.value) || 0 }));

  const costBasis = v.premium * 100 * v.qty;
  const intrinsic = v.type === 'call' ? Math.max(0, v.current - v.strike) : Math.max(0, v.strike - v.current);
  const currentValue = intrinsic * 100 * v.qty;
  const pl = currentValue - costBasis;
  const plPct = costBasis > 0 ? (pl / costBasis) * 100 : 0;
  const breakeven = v.type === 'call' ? v.strike + v.premium : v.strike - v.premium;

  const priceRange = Array.from({ length: 31 }, (_, i) => {
    const price = v.strike * 0.7 + (v.strike * 0.6 * i / 30);
    const iv = v.type === 'call' ? Math.max(0, price - v.strike) : Math.max(0, v.strike - price);
    return { price: price.toFixed(0), pl: ((iv - v.premium) * 100 * v.qty) };
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['call', 'put'].map(t => (
          <button key={t} onClick={() => setV(p => ({ ...p, type: t }))} className="btn btn-sm" style={{
            flex: 1, background: v.type === t ? (t === 'call' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)') : 'var(--bg-2)',
            borderColor: v.type === t ? (t === 'call' ? 'var(--green)' : 'var(--red)') : 'var(--border)',
            color: v.type === t ? (t === 'call' ? 'var(--green)' : 'var(--red)') : 'var(--text-2)',
            border: '1px solid',
          }}>{t.toUpperCase()}</button>
        ))}
      </div>
      <InputGrid>
        <Field label="Strike price" prefix="$"><input type="number" placeholder="e.g. 100" step={1} onChange={s('strike')} /></Field>
        <Field label="Premium paid" prefix="$"><input type="number" placeholder="e.g. 5" step={0.1} onChange={s('premium')} /></Field>
        <Field label="Contracts" ><input type="number" placeholder="e.g. 1" min={1} onChange={s('qty')} /></Field>
        <Field label="Current price" prefix="$"><input type="number" placeholder="e.g. 110" step={0.5} onChange={s('current')} /></Field>
      </InputGrid>
      <MetricGrid>
        <Metric label="P&L" value={fmtUSD(pl)} color={pl >= 0 ? 'var(--green)' : 'var(--red)'} sub={fmtPct(plPct)} accent />
        <Metric label="Breakeven" value={fmtUSD(breakeven)} sub="at expiry" />
        <Metric label="Cost basis" value={fmtUSD(costBasis)} sub={v.qty + ' contract(s)'} />
        <Metric label="Intrinsic value" value={fmtUSD(currentValue)} />
      </MetricGrid>
      <ChartWrap height={180}>
        <AreaChart data={priceRange}>
          <XAxis dataKey="price" stroke="var(--text-3)" tick={{ fontSize: 11 }} tickFormatter={v => '$' + v} />
          <YAxis stroke="var(--text-3)" tick={{ fontSize: 11 }} tickFormatter={v => '$' + fmtInt(v)} />
          <Tooltip contentStyle={TT_STYLE} formatter={v => [fmtUSD(v), 'P&L']} />
          <ReferenceLine y={0} stroke="var(--text-3)" strokeDasharray="4 2" />
          <Area type="monotone" dataKey="pl" fill="rgba(16,185,129,0.1)" stroke="#10b981" strokeWidth={2} />
        </AreaChart>
      </ChartWrap>
    </div>
  );
}

// ─── 4. DRIP ─────────────────────────────────────────────────────────────────
export function DRIPCalc({ onCalcUsed }) {
  const [v, setV] = useState({ shares: 100, price: 50, yield: 3.5, growth: 5, years: 20 });
  const s = n => e => setV(p => ({ ...p, [n]: parseFloat(e.target.value) || 0 }));

  const data = [];
  let shares = v.shares, price = v.price;
  for (let yr = 0; yr <= v.years; yr++) {
    const div = shares * price * (v.yield / 100);
    const newShares = price > 0 ? div / price : 0;
    data.push({ year: yr, shares: Math.round(shares), value: Math.round(shares * price), income: Math.round(div) });
    shares += newShares;
    price *= (1 + v.growth / 100);
  }
  const last = data[data.length - 1];

  return (
    <div>
      <InputGrid>
        <Field label="Shares owned"><input type="number" placeholder="e.g. 100" onChange={s('shares')} /></Field>
        <Field label="Share price" prefix="$"><input type="number" placeholder="e.g. 50" step={0.5} onChange={s('price')} /></Field>
        <Field label="Dividend yield" suffix="%"><input type="number" placeholder="e.g. 3.5" step={0.1} onChange={s('yield')} /></Field>
        <Field label="Annual growth" suffix="%"><input type="number" placeholder="e.g. 5" step={0.5} onChange={s('growth')} /></Field>
        <Field label="Years" suffix="yrs"><input type="number" placeholder="e.g. 20" min={1} max={50} onChange={s('years')} /></Field>
      </InputGrid>
      <MetricGrid>
        <Metric label="Portfolio value" value={fmtUSD(last?.value)} accent />
        <Metric label="Total shares" value={fmtInt(last?.shares)} sub={'started: ' + fmtInt(v.shares)} />
        <Metric label="Annual income" value={fmtUSD(last?.income)} sub="at year " />
        <Metric label="Growth" value={fmt(last?.value / (v.shares * v.price || 1), 1) + '×'} color="var(--green)" />
      </MetricGrid>
      <ChartWrap height={200}>
        <AreaChart data={data}>
          <XAxis dataKey="year" stroke="var(--text-3)" tick={{ fontSize: 11 }} />
          <YAxis stroke="var(--text-3)" tick={{ fontSize: 11 }} tickFormatter={n => '$' + (n >= 1000 ? (n/1000).toFixed(0)+'k' : n)} />
          <Tooltip contentStyle={TT_STYLE} formatter={(v, n) => [n === 'value' ? fmtUSD(v) : fmtInt(v), n === 'value' ? 'Portfolio value' : 'Shares']} />
          <Area type="monotone" dataKey="value" fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth={2} />
        </AreaChart>
      </ChartWrap>
    </div>
  );
}

// ─── 5. Break-Even Analysis ──────────────────────────────────────────────────
export function BreakEvenCalc({ onCalcUsed }) {
  const [v, setV] = useState({ fixed: 5000, variable: 20, price: 50 });
  const s = n => e => setV(p => ({ ...p, [n]: parseFloat(e.target.value) || 0 }));

  const margin = v.price - v.variable;
  const beUnits = margin > 0 ? Math.ceil(v.fixed / margin) : 0;
  const beRevenue = beUnits * v.price;
  const marginPct = v.price > 0 ? (margin / v.price) * 100 : 0;

  const data = Array.from({ length: 11 }, (_, i) => {
    const units = beUnits * 2 * i / 10;
    return { units: Math.round(units), revenue: Math.round(units * v.price), totalCost: Math.round(v.fixed + units * v.variable) };
  });

  return (
    <div>
      <InputGrid>
        <Field label="Fixed costs / mo" prefix="$"><input type="number" placeholder="e.g. 5000" step={100} onChange={s('fixed')} /></Field>
        <Field label="Variable cost / unit" prefix="$"><input type="number" placeholder="e.g. 20" step={1} onChange={s('variable')} /></Field>
        <Field label="Price per unit" prefix="$"><input type="number" placeholder="e.g. 50" step={1} onChange={s('price')} /></Field>
      </InputGrid>
      {margin <= 0 && <div className="alert alert-error" style={{ marginBottom: 16 }}>Price must be greater than variable cost.</div>}
      {margin > 0 && <>
        <MetricGrid>
          <Metric label="Break-even units" value={fmtInt(beUnits)} accent />
          <Metric label="Break-even revenue" value={fmtUSD(beRevenue)} />
          <Metric label="Contribution margin" value={fmtUSD(margin)} sub={fmtPct(marginPct) + ' margin'} />
        </MetricGrid>
        <ChartWrap height={200}>
          <LineChart data={data}>
            <XAxis dataKey="units" stroke="var(--text-3)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--text-3)" tick={{ fontSize: 11 }} tickFormatter={n => '$' + (n >= 1000 ? (n/1000).toFixed(0)+'k' : n)} />
            <Tooltip contentStyle={TT_STYLE} formatter={v => fmtUSD(v)} />
            <ReferenceLine x={beUnits} stroke="var(--amber)" strokeDasharray="4 2" label={{ value: 'BEP', fill: '#fbbf24', fontSize: 11 }} />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} name="Revenue" />
            <Line type="monotone" dataKey="totalCost" stroke="#ef4444" strokeWidth={2} dot={false} name="Total cost" />
          </LineChart>
        </ChartWrap>
      </>}
    </div>
  );
}

// ─── 6. Net Worth Tracker ────────────────────────────────────────────────────
export function NetWorthCalc({ onCalcUsed }) {
  const [assets, setAssets] = useState([{ label: 'Cash & savings', value: 15000 }, { label: 'Investments', value: 25000 }, { label: 'Property', value: 200000 }]);
  const [liabilities, setLiabilities] = useState([{ label: 'Mortgage', value: 150000 }, { label: 'Car loan', value: 8000 }, { label: 'Credit cards', value: 3000 }]);

  const totalAssets = assets.reduce((s, a) => s + (a.value || 0), 0);
  const totalLiab = liabilities.reduce((s, a) => s + (a.value || 0), 0);
  const netWorth = totalAssets - totalLiab;
  const dta = totalAssets > 0 ? (totalLiab / totalAssets) * 100 : 0;

  const updateRow = (arr, setArr, idx, field, val) => {
    const next = [...arr];
    next[idx] = { ...next[idx], [field]: field === 'value' ? (parseFloat(val) || 0) : val };
    setArr(next);
  };
  const addRow = (arr, setArr) => setArr([...arr, { label: 'New item', value: 0 }]);
  const removeRow = (arr, setArr, idx) => setArr(arr.filter((_, i) => i !== idx));

  const pieData = [...assets.map(a => ({ name: a.label, value: a.value })), ...liabilities.map(l => ({ name: l.label + ' (debt)', value: l.value }))].filter(d => d.value > 0);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {[{ label: 'Assets', rows: assets, setRows: setAssets, color: 'var(--green)' }, { label: 'Liabilities', rows: liabilities, setRows: setLiabilities, color: 'var(--red)' }].map(({ label, rows, setRows, color }) => (
          <div key={label}>
            <p style={{ fontSize: 12, fontWeight: 600, color, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</p>
            {rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <input className="input" style={{ flex: 1, height: 34, fontSize: 12 }} value={r.label} onChange={e => updateRow(rows, setRows, i, 'label', e.target.value)} />
                <input className="input input-with-prefix" style={{ width: 110, height: 34, fontSize: 12, paddingLeft: 20 }} type="number" value={r.value} onChange={e => updateRow(rows, setRows, i, 'value', e.target.value)} />
                <button onClick={() => removeRow(rows, setRows, i)} className="btn btn-ghost btn-sm" style={{ padding: '0 8px', height: 34, fontSize: 16, lineHeight: 1 }}>×</button>
              </div>
            ))}
            <button onClick={() => addRow(rows, setRows)} className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 4 }}>+ Add row</button>
          </div>
        ))}
      </div>
      <MetricGrid>
        <Metric label="Net worth" value={fmtUSD(netWorth)} accent color={netWorth >= 0 ? 'var(--green)' : 'var(--red)'} />
        <Metric label="Total assets" value={fmtUSD(totalAssets)} color="var(--green)" />
        <Metric label="Total liabilities" value={fmtUSD(totalLiab)} color="var(--red)" />
        <Metric label="Debt-to-asset" value={fmtPct(dta)} />
      </MetricGrid>
    </div>
  );
}

// ─── 7. Macro & Calorie ──────────────────────────────────────────────────────
export function MacroCalorieCalc({ onCalcUsed }) {
  const [v, setV] = useState({ weight: 80, height: 175, age: 30, sex: 'male', activity: 1.55, goal: 'maintain' });
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));
  const sn = n => e => setV(p => ({ ...p, [n]: parseFloat(e.target.value) || 0 }));

  const bmr = v.sex === 'male'
    ? 10 * v.weight + 6.25 * v.height - 5 * v.age + 5
    : 10 * v.weight + 6.25 * v.height - 5 * v.age - 161;
  const tdee = bmr * parseFloat(v.activity);
  const adj = v.goal === 'cut' ? -500 : v.goal === 'bulk' ? 300 : 0;
  const calories = tdee + adj;
  const protein = v.weight * 2.2;
  const fat = (calories * 0.25) / 9;
  const carbs = (calories - protein * 4 - fat * 9) / 4;

  const macroData = [
    { name: 'Protein', grams: Math.round(protein), cals: Math.round(protein * 4), color: '#3b82f6' },
    { name: 'Carbs', grams: Math.round(carbs), cals: Math.round(carbs * 4), color: '#10b981' },
    { name: 'Fat', grams: Math.round(fat), cals: Math.round(fat * 9), color: '#f59e0b' },
  ];

  return (
    <div>
      <InputGrid>
        <Field label="Weight (kg)"><input type="number" placeholder="e.g. 80" onChange={sn('weight')} /></Field>
        <Field label="Height (cm)"><input type="number" placeholder="e.g. 175" onChange={sn('height')} /></Field>
        <Field label="Age"><input type="number" placeholder="e.g. 30" onChange={sn('age')} /></Field>
        <Field label="Sex">
          <select className="input" onChange={s('sex')}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
        <Field label="Activity level">
          <select className="input" onChange={s('activity')}>
            <option value="1.2">Sedentary</option>
            <option value="1.375">Light (1-3×/wk)</option>
            <option value="1.55" selected>Moderate (3-5×/wk)</option>
            <option value="1.725">Active (6-7×/wk)</option>
            <option value="1.9">Very active</option>
          </select>
        </Field>
        <Field label="Goal">
          <select className="input" onChange={s('goal')}>
            <option value="cut">Cut (−500 cal)</option>
            <option value="maintain" selected>Maintain</option>
            <option value="bulk">Bulk (+300 cal)</option>
          </select>
        </Field>
      </InputGrid>
      <MetricGrid>
        <Metric label="Daily calories" value={fmtInt(calories)} accent />
        <Metric label="TDEE" value={fmtInt(tdee)} sub="before adjustment" />
        {macroData.map(m => (
          <Metric key={m.name} label={m.name} value={fmtInt(m.grams) + 'g'} sub={fmtInt(m.cals) + ' cal'} color={m.color} />
        ))}
      </MetricGrid>
      <ChartWrap height={180}>
        <PieChart>
          <Pie data={macroData.map(m => ({ name: m.name, value: m.cals }))} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${fmtInt(value)}cal`} labelLine={false}>
            {macroData.map((m, i) => <Cell key={i} fill={m.color} />)}
          </Pie>
          <Tooltip contentStyle={TT_STYLE} formatter={v => [fmtInt(v) + ' cal']} />
        </PieChart>
      </ChartWrap>
    </div>
  );
}

// ─── 8. BMI & Body Fat ───────────────────────────────────────────────────────
export function BMIBodyFatCalc({ onCalcUsed }) {
  const [v, setV] = useState({ weight: 80, height: 175, age: 30, sex: 'male', waist: 85, neck: 38, hip: 0 });
  const sn = n => e => setV(p => ({ ...p, [n]: parseFloat(e.target.value) || 0 }));
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  const bmi = v.height > 0 ? v.weight / ((v.height / 100) ** 2) : 0;
  const bmiCat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
  const bmiColor = bmi < 18.5 ? 'var(--accent)' : bmi < 25 ? 'var(--green)' : bmi < 30 ? 'var(--amber)' : 'var(--red)';

  let bf = 0;
  if (v.sex === 'male' && v.waist > 0 && v.neck > 0 && v.height > 0) {
    bf = 495 / (1.0324 - 0.19077 * Math.log10(v.waist - v.neck) + 0.15456 * Math.log10(v.height)) - 450;
  } else if (v.sex === 'female' && v.waist > 0 && v.neck > 0 && v.hip > 0 && v.height > 0) {
    bf = 495 / (1.29579 - 0.35004 * Math.log10(v.waist + v.hip - v.neck) + 0.22100 * Math.log10(v.height)) - 450;
  }
  bf = Math.max(0, Math.min(bf, 60));

  const categories = v.sex === 'male'
    ? [['Athlete', 6, 13], ['Fitness', 14, 17], ['Average', 18, 24], ['Obese', 25, 40]]
    : [['Athlete', 14, 20], ['Fitness', 21, 24], ['Average', 25, 31], ['Obese', 32, 45]];
  const bfCat = categories.find(([, lo, hi]) => bf >= lo && bf <= hi)?.[0] || (bf < categories[0][1] ? 'Essential fat' : 'Obese');

  return (
    <div>
      <InputGrid>
        <Field label="Weight (kg)"><input type="number" placeholder="e.g. 80" onChange={sn('weight')} /></Field>
        <Field label="Height (cm)"><input type="number" placeholder="e.g. 175" onChange={sn('height')} /></Field>
        <Field label="Age"><input type="number" placeholder="e.g. 30" onChange={sn('age')} /></Field>
        <Field label="Sex">
          <select className="input" onChange={s('sex')}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
        <Field label="Waist (cm)"><input type="number" placeholder="e.g. 85" onChange={sn('waist')} /></Field>
        <Field label="Neck (cm)"><input type="number" placeholder="e.g. 38" onChange={sn('neck')} /></Field>
        {v.sex === 'female' && <Field label="Hip (cm)"><input type="number" placeholder="e.g. 95" onChange={sn('hip')} /></Field>}
      </InputGrid>
      <MetricGrid>
        <Metric label="BMI" value={fmt(bmi, 1)} sub={bmiCat} color={bmiColor} accent />
        <Metric label="Body fat %" value={fmtPct(bf, 1)} sub={bfCat} color={bf < 20 ? 'var(--green)' : bf < 30 ? 'var(--amber)' : 'var(--red)'} />
        <Metric label="Fat mass" value={fmt(v.weight * bf / 100, 1) + 'kg'} />
        <Metric label="Lean mass" value={fmt(v.weight * (1 - bf / 100), 1) + 'kg'} color="var(--green)" />
      </MetricGrid>
    </div>
  );
}

// ─── 9. 1-Rep Max ────────────────────────────────────────────────────────────
export function OneRepMaxCalc({ onCalcUsed }) {
  const [v, setV] = useState({ weight: 100, reps: 5, formula: 'epley' });
  const sn = n => e => setV(p => ({ ...p, [n]: parseFloat(e.target.value) || 0 }));
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  const calc1RM = (w, r, f) => {
    if (r === 1) return w;
    if (f === 'epley') return w * (1 + r / 30);
    if (f === 'brzycki') return w * 36 / (37 - r);
    if (f === 'lander') return (100 * w) / (101.3 - 2.67123 * r);
    return w * (1 + r / 30);
  };

  const orm = calc1RM(v.weight, v.reps, v.formula);
  const pcts = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
  const table = pcts.map(p => ({ pct: p, weight: (orm * p / 100).toFixed(1), reps: p >= 95 ? '1' : p >= 90 ? '2-3' : p >= 85 ? '4-5' : p >= 80 ? '6' : p >= 75 ? '8' : p >= 70 ? '10' : p >= 65 ? '12' : p >= 60 ? '15' : '15+' }));

  return (
    <div>
      <InputGrid>
        <Field label="Weight lifted (kg)"><input type="number" placeholder="e.g. 100" step={2.5} onChange={sn('weight')} /></Field>
        <Field label="Reps completed"><input type="number" placeholder="e.g. 5" min={1} max={20} onChange={sn('reps')} /></Field>
        <Field label="Formula">
          <select className="input" onChange={s('formula')}>
            <option value="epley">Epley</option>
            <option value="brzycki">Brzycki</option>
            <option value="lander">Lander</option>
          </select>
        </Field>
      </InputGrid>
      <Metric label="Estimated 1-Rep Max" value={fmt(orm, 1) + ' kg'} accent />
      <div style={{ marginTop: 16, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['% of 1RM', 'Weight (kg)', 'Rep range'].map(h => <th key={h} style={{ padding: '6px 10px', textAlign: 'left', color: 'var(--text-3)', fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: row.pct === 100 ? 'rgba(59,130,246,0.08)' : 'none' }}>
                <td style={{ padding: '7px 10px', color: row.pct === 100 ? 'var(--accent)' : 'var(--text-1)', fontWeight: row.pct === 100 ? 600 : 400 }}>{row.pct}%</td>
                <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: 'var(--text-1)' }}>{row.weight}</td>
                <td style={{ padding: '7px 10px', color: 'var(--text-2)' }}>{row.reps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 10. Running Pace ────────────────────────────────────────────────────────
export function RunningPaceCalc({ onCalcUsed }) {
  const [v, setV] = useState({ dist: '', min: '', sec: '', unit: 'km' });
  const [res, setRes] = useState(null);
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  function calc() {
    const dist = parseFloat(v.dist), min = parseFloat(v.min) || 0, sec = parseFloat(v.sec) || 0;
    if (!dist || (!min && !sec)) return;
    const total = min * 60 + sec;
    const ppu = total / dist;
    const pm = Math.floor(ppu / 60), ps = Math.round(ppu % 60);
    const speed = (dist / (total / 3600)) * (v.unit === 'miles' ? 1.60934 : 1);
    const races = [{ name: '5K', d: 5 }, { name: '10K', d: 10 }, { name: 'Half Marathon', d: 21.0975 }, { name: 'Marathon', d: 42.195 }];
    const preds = races.map(r => { const t = ppu * r.d * (v.unit === 'miles' ? 0.621371 : 1); return { name: r.name, t: Math.floor(t/3600)+'h '+Math.floor((t%3600)/60)+'m '+Math.round(t%60)+'s' }; });
    setRes({ pm, ps, speed, preds, unit: v.unit });
  }

  return (
    <div>
      <InputGrid>
        <Field label="Distance"><input type="number" placeholder="e.g. 5" onChange={s('dist')} /></Field>
        <Field label="Unit"><select className="input" value={v.unit} onChange={s('unit')}><option value="km">Kilometers</option><option value="miles">Miles</option></select></Field>
        <Field label="Minutes"><input type="number" placeholder="e.g. 25" onChange={s('min')} /></Field>
        <Field label="Seconds"><input type="number" placeholder="e.g. 30" onChange={s('sec')} /></Field>
      </InputGrid>
      <CalcBtn onClick={calc} onCalcUsed={onCalcUsed} />
      {res && <>
        <div style={{ textAlign: 'center', padding: 20, background: 'var(--bg-1)', borderRadius: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 4 }}>Your pace</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{res.pm}:{String(res.ps).padStart(2,'0')}</div>
          <div style={{ fontSize: 14, color: 'var(--text-3)' }}>min/{res.unit} &nbsp;|&nbsp; {res.speed.toFixed(1)} km/h</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {res.preds.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-1)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--accent)' }}>{p.t}</span>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

export function HydrationCalc({ onCalcUsed }) {
  const [v, setV] = useState({ weight: '', unit: 'kg', activity: '0', climate: '0', coffee: '', alcohol: '' });
  const [res, setRes] = useState(null);
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  function calc() {
    let w = parseFloat(v.weight);
    if (!w) return;
    if (v.unit === 'lbs') w *= 0.453592;
    let base = w * 0.033;
    base += parseFloat(v.activity) * 0.35;
    base += parseFloat(v.climate) * 0.5;
    base += (parseFloat(v.coffee) || 0) * 0.15;
    base += (parseFloat(v.alcohol) || 0) * 0.25;
    setRes({ litres: base, oz: base * 33.814, cups: base * 4.227, glasses: Math.ceil(base / 0.25) });
  }

  return (
    <div>
      <InputGrid>
        <Field label="Body weight"><input type="number" placeholder="e.g. 75" onChange={s('weight')} /></Field>
        <Field label="Unit"><select className="input" value={v.unit} onChange={s('unit')}><option value="kg">Kilograms (kg)</option><option value="lbs">Pounds (lbs)</option></select></Field>
        <Field label="Activity level">
          <select className="input" value={v.activity} onChange={s('activity')}>
            <option value="0">Sedentary (desk job)</option>
            <option value="1">Light exercise (1–3×/wk)</option>
            <option value="2">Moderate exercise (3–5×/wk)</option>
            <option value="3">Heavy exercise (daily)</option>
          </select>
        </Field>
        <Field label="Climate">
          <select className="input" value={v.climate} onChange={s('climate')}>
            <option value="0">Temperate / Normal</option>
            <option value="1">Hot / Humid</option>
            <option value="2">Very Hot / Desert</option>
          </select>
        </Field>
        <Field label="Coffees per day"><input type="number" placeholder="e.g. 2" onChange={s('coffee')} /></Field>
        <Field label="Alcoholic drinks / day"><input type="number" placeholder="e.g. 1" onChange={s('alcohol')} /></Field>
      </InputGrid>
      <CalcBtn onClick={calc} onCalcUsed={onCalcUsed} />
      {res && <>
        <div style={{ textAlign: 'center', padding: 20, background: 'var(--bg-1)', borderRadius: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 4 }}>Drink at least</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: '#06b6d4', lineHeight: 1 }}>{res.litres.toFixed(1)}L</div>
          <div style={{ fontSize: 14, color: 'var(--text-3)' }}>of water per day</div>
        </div>
        <MetricGrid>
          <Metric label="Litres" value={res.litres.toFixed(1) + ' L'} color="#06b6d4" />
          <Metric label="Fluid oz" value={Math.round(res.oz) + ' oz'} />
          <Metric label="Cups" value={Math.round(res.cups) + ' cups'} />
          <Metric label="Glasses (250ml)" value={res.glasses + ' glasses'} />
        </MetricGrid>
      </>}
    </div>
  );
}

export function RentVsBuyCalc({ onCalcUsed }) {
  const [v, setV] = useState({ price: '', down: '', rate: '', rent: '', invest: '', years: '' });
  const [res, setRes] = useState(null);
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  function calc() {
    const price = parseFloat(v.price), down = parseFloat(v.down) || 20,
          rate = parseFloat(v.rate) || 6.5, rent = parseFloat(v.rent),
          invest = parseFloat(v.invest) || 7, years = parseFloat(v.years) || 10;
    if (!price || !rent) return;
    const downAmt = price * (down / 100), loan = price - downAmt;
    const r = rate / 100 / 12, n = 30 * 12;
    const monthly = loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalBuyCost = (monthly + price * 0.012 / 12 + price * 0.005 / 12) * years * 12 + downAmt;
    const homeValue = price * Math.pow(1.04, years);
    const equity = homeValue - loan * (1 - years / 30);
    const totalRentCost = rent * 12 * years * 1.03;
    const data = Array.from({ length: years + 1 }, (_, yr) => ({
      year: yr,
      buying: Math.round((monthly + price * 0.017 / 12) * yr * 12 + downAmt - (price * Math.pow(1.04, yr) - price)),
      renting: Math.round(rent * 12 * yr * 1.015),
    }));
    setRes({ monthly, totalBuyCost, homeValue, equity, totalRentCost, data, years });
  }

  return (
    <div>
      <InputGrid>
        <Field label="Home price" prefix="$"><input type="number" placeholder="e.g. 400000" onChange={s('price')} /></Field>
        <Field label="Down payment %" suffix="%"><input type="number" placeholder="e.g. 20" onChange={s('down')} /></Field>
        <Field label="Interest rate %" suffix="%"><input type="number" placeholder="e.g. 6.5" step={0.1} onChange={s('rate')} /></Field>
        <Field label="Monthly rent" prefix="$"><input type="number" placeholder="e.g. 2000" onChange={s('rent')} /></Field>
        <Field label="Investment return %" suffix="%"><input type="number" placeholder="e.g. 7" onChange={s('invest')} /></Field>
        <Field label="Years to compare" suffix="yrs"><input type="number" placeholder="e.g. 10" onChange={s('years')} /></Field>
      </InputGrid>
      <CalcBtn onClick={calc} onCalcUsed={onCalcUsed} />
      {res && <>
        <MetricGrid>
          <Metric label="Monthly mortgage" value={'$' + Math.round(res.monthly).toLocaleString()} accent />
          <Metric label="Home value" value={'$' + Math.round(res.homeValue).toLocaleString()} sub={'in ' + res.years + ' years'} color="var(--green)" />
          <Metric label="Equity built" value={'$' + Math.round(res.equity).toLocaleString()} color="var(--green)" />
          <Metric label="Total rent cost" value={'$' + Math.round(res.totalRentCost).toLocaleString()} color="var(--red)" />
        </MetricGrid>
        <ChartWrap height={200}>
          <LineChart data={res.data}>
            <XAxis dataKey="year" stroke="var(--text-3)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--text-3)" tick={{ fontSize: 11 }} tickFormatter={n => '$' + (n >= 1000 ? (n/1000).toFixed(0)+'k' : n)} />
            <Tooltip contentStyle={TT_STYLE} formatter={v => '$' + Math.abs(v).toLocaleString()} />
            <Line type="monotone" dataKey="buying" stroke="var(--accent)" strokeWidth={2} dot={false} name="Buying cost" />
            <Line type="monotone" dataKey="renting" stroke="var(--amber)" strokeWidth={2} dot={false} name="Renting cost" />
          </LineChart>
        </ChartWrap>
      </>}
    </div>
  );
}

export function MortgageCalc({ onCalcUsed }) {
  const [v, setV] = useState({ loan: '', rate: '', term: '', extra: '' });
  const [res, setRes] = useState(null);
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  function calc() {
    const loan = parseFloat(v.loan), rate = parseFloat(v.rate), term = parseFloat(v.term), extra = parseFloat(v.extra) || 0;
    if (!loan || !rate || !term) return;
    const r = rate / 100 / 12, n = term * 12;
    const monthly = loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n, interest = total - loan;
    let bal = loan;
    const chart = [];
    for (let yr = 1; yr <= Math.min(term, 30); yr++) {
      for (let m = 0; m < 12; m++) { const i = bal * r; bal = Math.max(0, bal - (monthly + extra - i)); if (bal === 0) break; }
      chart.push({ year: 'Y' + yr, balance: Math.round(bal) });
      if (bal === 0) break;
    }
    setRes({ monthly, total, interest, chart });
  }

  return (
    <div>
      <InputGrid>
        <Field label="Loan amount" prefix="$"><input type="number" placeholder="e.g. 320000" onChange={s('loan')} /></Field>
        <Field label="Interest rate" suffix="%"><input type="number" placeholder="e.g. 6.5" step={0.1} onChange={s('rate')} /></Field>
        <Field label="Loan term" suffix="yrs"><input type="number" placeholder="e.g. 30" onChange={s('term')} /></Field>
        <Field label="Extra payment / mo" prefix="$"><input type="number" placeholder="e.g. 200 (optional)" onChange={s('extra')} /></Field>
      </InputGrid>
      <CalcBtn onClick={calc} onCalcUsed={onCalcUsed} />
      {res && <>
        <MetricGrid>
          <Metric label="Monthly payment" value={'$' + Math.round(res.monthly).toLocaleString()} accent />
          <Metric label="Total interest" value={'$' + Math.round(res.interest).toLocaleString()} color="var(--red)" />
          <Metric label="Total cost" value={'$' + Math.round(res.total).toLocaleString()} />
        </MetricGrid>
        <ChartWrap height={180}>
          <AreaChart data={res.chart}>
            <XAxis dataKey="year" stroke="var(--text-3)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--text-3)" tick={{ fontSize: 11 }} tickFormatter={n => '$' + (n >= 1000 ? (n/1000).toFixed(0)+'k' : n)} />
            <Tooltip contentStyle={TT_STYLE} formatter={v => '$' + v.toLocaleString()} />
            <Area type="monotone" dataKey="balance" stroke="var(--accent)" fill="rgba(59,130,246,0.15)" name="Remaining balance" />
          </AreaChart>
        </ChartWrap>
      </>}
    </div>
  );
}

export function RentalROICalc({ onCalcUsed }) {
  const [v, setV] = useState({ price: '', down: '', rate: '', rent: '', vacancy: '', expenses: '' });
  const [res, setRes] = useState(null);
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  function calc() {
    const price = parseFloat(v.price), down = parseFloat(v.down) || price * 0.25,
          rate = parseFloat(v.rate) || 0, rent = parseFloat(v.rent),
          vacancy = parseFloat(v.vacancy) || 5, expenses = parseFloat(v.expenses) || 0;
    if (!price || !rent) return;
    const effRent = rent * (1 - vacancy / 100);
    const noi = effRent * 12 - expenses * 12;
    const capRate = (noi / price) * 100;
    let mortgage = 0;
    if (rate > 0) { const r = rate/100/12, n = 30*12, p = price - down; mortgage = p > 0 ? p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1) : 0; }
    const cashFlow = effRent - expenses - mortgage;
    const coc = down > 0 ? (cashFlow * 12 / down) * 100 : 0;
    setRes({ noi, capRate, cashFlow, coc });
  }

  return (
    <div>
      <InputGrid>
        <Field label="Purchase price" prefix="$"><input type="number" placeholder="e.g. 250000" onChange={s('price')} /></Field>
        <Field label="Down payment" prefix="$"><input type="number" placeholder="e.g. 62500" onChange={s('down')} /></Field>
        <Field label="Mortgage rate %" suffix="%"><input type="number" placeholder="e.g. 6.5 (optional)" step={0.1} onChange={s('rate')} /></Field>
        <Field label="Monthly rent" prefix="$"><input type="number" placeholder="e.g. 2200" onChange={s('rent')} /></Field>
        <Field label="Vacancy %" suffix="%"><input type="number" placeholder="e.g. 5" onChange={s('vacancy')} /></Field>
        <Field label="Monthly expenses" prefix="$"><input type="number" placeholder="e.g. 400" onChange={s('expenses')} /></Field>
      </InputGrid>
      <CalcBtn onClick={calc} onCalcUsed={onCalcUsed} />
      {res && <>
        <MetricGrid>
          <Metric label="Cap rate" value={res.capRate.toFixed(2) + '%'} color={res.capRate >= 6 ? 'var(--green)' : res.capRate >= 4 ? 'var(--amber)' : 'var(--red)'} accent />
          <Metric label="Monthly cash flow" value={'$' + Math.round(res.cashFlow).toLocaleString()} color={res.cashFlow >= 0 ? 'var(--green)' : 'var(--red)'} />
          <Metric label="Annual NOI" value={'$' + Math.round(res.noi).toLocaleString()} />
          <Metric label="Cash-on-cash return" value={res.coc.toFixed(1) + '%'} color={res.coc >= 8 ? 'var(--green)' : 'var(--text-1)'} />
        </MetricGrid>
      </>}
    </div>
  );
}

export function HouseFlipCalc({ onCalcUsed }) {
  const [v, setV] = useState({ purchase: '', rehab: '', holding: '', months: '', arv: '', sellingCost: '' });
  const [res, setRes] = useState(null);
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  function calc() {
    const purchase = parseFloat(v.purchase), rehab = parseFloat(v.rehab) || 0,
          holding = parseFloat(v.holding) || 0, months = parseFloat(v.months) || 6,
          arv = parseFloat(v.arv), sellingCost = parseFloat(v.sellingCost) || 8;
    if (!purchase || !arv) return;
    const totalCost = purchase + rehab + holding * months + arv * (sellingCost / 100);
    const profit = arv - totalCost;
    const roi = (profit / totalCost) * 100;
    const rule70 = arv * 0.7 - rehab;
    setRes({ totalCost, profit, roi, rule70, purchase });
  }

  return (
    <div>
      <InputGrid>
        <Field label="Purchase price" prefix="$"><input type="number" placeholder="e.g. 150000" onChange={s('purchase')} /></Field>
        <Field label="Rehab / renovation" prefix="$"><input type="number" placeholder="e.g. 35000" onChange={s('rehab')} /></Field>
        <Field label="Monthly holding cost" prefix="$"><input type="number" placeholder="e.g. 1500" onChange={s('holding')} /></Field>
        <Field label="Holding period" suffix="mo"><input type="number" placeholder="e.g. 6" onChange={s('months')} /></Field>
        <Field label="After repair value (ARV)" prefix="$"><input type="number" placeholder="e.g. 250000" onChange={s('arv')} /></Field>
        <Field label="Selling costs %" suffix="%"><input type="number" placeholder="e.g. 8" step={0.5} onChange={s('sellingCost')} /></Field>
      </InputGrid>
      <CalcBtn onClick={calc} onCalcUsed={onCalcUsed} />
      {res && <>
        <MetricGrid>
          <Metric label="Net profit" value={'$' + Math.round(res.profit).toLocaleString()} color={res.profit >= 0 ? 'var(--green)' : 'var(--red)'} accent />
          <Metric label="ROI" value={res.roi.toFixed(1) + '%'} color={res.roi >= 20 ? 'var(--green)' : res.roi >= 10 ? 'var(--amber)' : 'var(--red)'} />
          <Metric label="Total investment" value={'$' + Math.round(res.totalCost).toLocaleString()} />
          <Metric label="70% rule max" value={'$' + Math.round(res.rule70).toLocaleString()} color={res.purchase <= res.rule70 ? 'var(--green)' : 'var(--red)'} />
        </MetricGrid>
      </>}
    </div>
  );
}

export function AffordabilityCalc({ onCalcUsed }) {
  const [v, setV] = useState({ income: '', debts: '', down: '', rate: '', term: '' });
  const [res, setRes] = useState(null);
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  function calc() {
    const income = parseFloat(v.income), debts = parseFloat(v.debts) || 0,
          down = parseFloat(v.down) || 0, rate = parseFloat(v.rate) || 6.5, term = parseFloat(v.term) || 30;
    if (!income) return;
    const maxH = income * 0.28, avail = Math.max(0, income * 0.36 - debts);
    const r = rate/100/12, n = term*12, f = (r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
    const maxPrice = Math.min(maxH, avail) / f + down;
    setRes({ maxPrice, maxH, avail });
  }

  return (
    <div>
      <InputGrid>
        <Field label="Gross monthly income" prefix="$"><input type="number" placeholder="e.g. 8000" onChange={s('income')} /></Field>
        <Field label="Monthly debts (loans, cards)" prefix="$"><input type="number" placeholder="e.g. 500" onChange={s('debts')} /></Field>
        <Field label="Down payment saved" prefix="$"><input type="number" placeholder="e.g. 50000" onChange={s('down')} /></Field>
        <Field label="Interest rate %" suffix="%"><input type="number" placeholder="e.g. 6.5" step={0.1} onChange={s('rate')} /></Field>
        <Field label="Loan term" suffix="yrs"><input type="number" placeholder="e.g. 30" onChange={s('term')} /></Field>
      </InputGrid>
      <CalcBtn onClick={calc} onCalcUsed={onCalcUsed} />
      {res && <>
        <div style={{ textAlign: 'center', padding: 20, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 6 }}>You can comfortably afford a home up to</div>
          <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>${Math.round(res.maxPrice).toLocaleString()}</div>
        </div>
        <MetricGrid>
          <Metric label="Max housing (28% rule)" value={'$' + Math.round(res.maxH).toLocaleString()} />
          <Metric label="Available after debts" value={'$' + Math.round(res.avail).toLocaleString()} />
        </MetricGrid>
      </>}
    </div>
  );
}

export function CryptoDCACalc({ onCalcUsed }) {
  const [v, setV] = useState({ weekly: '', weeks: '', startPrice: '', growth: '' });
  const [res, setRes] = useState(null);
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  function calc() {
    const weekly = parseFloat(v.weekly), weeks = parseFloat(v.weeks),
          startPrice = parseFloat(v.startPrice), growth = parseFloat(v.growth) || 0;
    if (!weekly || !weeks || !startPrice) return;
    const data = [];
    let totalCoins = 0, totalInvested = 0;
    for (let w = 0; w <= weeks; w++) {
      const price = startPrice * Math.pow(1 + growth / 100 / 52, w);
      if (w > 0) { totalCoins += weekly / price; totalInvested += weekly; }
      data.push({ week: w, value: Math.round(totalCoins * price), invested: Math.round(totalInvested) });
    }
    const finalPrice = startPrice * Math.pow(1 + growth / 100 / 52, weeks);
    const avgCost = totalCoins > 0 ? totalInvested / totalCoins : 0;
    const currentValue = totalCoins * finalPrice;
    setRes({ totalCoins, totalInvested, avgCost, currentValue, pnl: currentValue - totalInvested, pct: ((currentValue - totalInvested) / totalInvested) * 100, data });
  }

  return (
    <div>
      <InputGrid>
        <Field label="Weekly investment" prefix="$"><input type="number" placeholder="e.g. 50" onChange={s('weekly')} /></Field>
        <Field label="Number of weeks"><input type="number" placeholder="e.g. 52" onChange={s('weeks')} /></Field>
        <Field label="Start price" prefix="$"><input type="number" placeholder="e.g. 30000" onChange={s('startPrice')} /></Field>
        <Field label="Expected annual growth %" suffix="%"><input type="number" placeholder="e.g. 40" onChange={s('growth')} /></Field>
      </InputGrid>
      <CalcBtn onClick={calc} onCalcUsed={onCalcUsed} />
      {res && <>
        <MetricGrid>
          <Metric label="Portfolio value" value={'$' + Math.round(res.currentValue).toLocaleString()} accent />
          <Metric label="Total invested" value={'$' + Math.round(res.totalInvested).toLocaleString()} />
          <Metric label="P&L" value={(res.pnl >= 0 ? '+' : '') + '$' + Math.round(res.pnl).toLocaleString()} color={res.pnl >= 0 ? 'var(--green)' : 'var(--red)'} />
          <Metric label="Return" value={(res.pct >= 0 ? '+' : '') + res.pct.toFixed(1) + '%'} color={res.pct >= 0 ? 'var(--green)' : 'var(--red)'} />
          <Metric label="Coins accumulated" value={res.totalCoins.toFixed(4)} />
          <Metric label="Avg cost basis" value={'$' + Math.round(res.avgCost).toLocaleString()} />
        </MetricGrid>
        <ChartWrap height={200}>
          <AreaChart data={res.data}>
            <XAxis dataKey="week" stroke="var(--text-3)" tick={{ fontSize: 11 }} />
            <YAxis stroke="var(--text-3)" tick={{ fontSize: 11 }} tickFormatter={n => '$' + (n >= 1000 ? (n/1000).toFixed(0)+'k' : n)} />
            <Tooltip contentStyle={TT_STYLE} formatter={v => '$' + v.toLocaleString()} />
            <Area type="monotone" dataKey="value" stroke="var(--accent)" fill="rgba(59,130,246,0.12)" name="Portfolio value" />
            <Area type="monotone" dataKey="invested" stroke="var(--text-3)" fill="rgba(148,163,184,0.08)" name="Invested" />
          </AreaChart>
        </ChartWrap>
      </>}
    </div>
  );
}

export function CryptoProfitCalc({ onCalcUsed }) {
  const [v, setV] = useState({ buyPrice: '', sellPrice: '', qty: '', fee: '', holdMonths: '' });
  const [res, setRes] = useState(null);
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  function calc() {
    const buy = parseFloat(v.buyPrice), sell = parseFloat(v.sellPrice), qty = parseFloat(v.qty),
          fee = parseFloat(v.fee) || 0, hold = parseFloat(v.holdMonths) || 0;
    if (!buy || !sell || !qty) return;
    const invested = buy * qty, proceeds = sell * qty;
    const fees = (invested + proceeds) * fee / 100;
    const gross = proceeds - invested, net = gross - fees;
    const pct = (net / invested) * 100;
    const longTerm = hold >= 12;
    const taxRate = longTerm ? 15 : 30;
    const tax = net > 0 ? net * taxRate / 100 : 0;
    setRes({ invested, proceeds, fees, net, pct, tax, afterTax: net - tax, taxRate, longTerm });
  }

  return (
    <div>
      <InputGrid>
        <Field label="Buy price" prefix="$"><input type="number" placeholder="e.g. 30000" step={0.01} onChange={s('buyPrice')} /></Field>
        <Field label="Sell price" prefix="$"><input type="number" placeholder="e.g. 45000" step={0.01} onChange={s('sellPrice')} /></Field>
        <Field label="Quantity (coins)"><input type="number" placeholder="e.g. 0.5" step={0.0001} onChange={s('qty')} /></Field>
        <Field label="Exchange fee %" suffix="%"><input type="number" placeholder="e.g. 0.1" step={0.01} onChange={s('fee')} /></Field>
        <Field label="Held for (months)"><input type="number" placeholder="e.g. 13" onChange={s('holdMonths')} /></Field>
      </InputGrid>
      <CalcBtn onClick={calc} onCalcUsed={onCalcUsed} />
      {res && <>
        <MetricGrid>
          <Metric label="Net P&L" value={(res.net >= 0 ? '+' : '') + '$' + Math.round(res.net).toLocaleString()} color={res.net >= 0 ? 'var(--green)' : 'var(--red)'} accent />
          <Metric label="Return" value={(res.pct >= 0 ? '+' : '') + res.pct.toFixed(1) + '%'} color={res.pct >= 0 ? 'var(--green)' : 'var(--red)'} />
          <Metric label="Fees paid" value={'$' + res.fees.toFixed(2)} color="var(--text-3)" />
          {res.net > 0 && <Metric label={'Est. tax (~' + res.taxRate + '%)'} value={'$' + Math.round(res.tax).toLocaleString()} color="var(--amber)" />}
          {res.net > 0 && <Metric label="After-tax profit" value={'$' + Math.round(res.afterTax).toLocaleString()} color="var(--green)" />}
        </MetricGrid>
      </>}
    </div>
  );
}

export function CryptoRebalancerCalc({ onCalcUsed }) {
  const [holdings, setHoldings] = useState([
    { coin: 'Bitcoin', price: 45000, qty: 0.5, target: 50 },
    { coin: 'Ethereum', price: 2500, qty: 4, target: 30 },
    { coin: 'Solana', price: 100, qty: 50, target: 20 },
  ]);

  const totalValue = holdings.reduce((s, h) => s + h.price * h.qty, 0);
  const update = (idx, field, val) => {
    const next = [...holdings];
    next[idx] = { ...next[idx], [field]: field === 'coin' ? val : (parseFloat(val) || 0) };
    setHoldings(next);
  };
  const addRow = () => setHoldings(p => [...p, { coin: 'New coin', price: 1000, qty: 1, target: 0 }]);

  return (
    <div>
      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Coin', 'Price ($)', 'Qty', 'Target %', 'Current %', 'Action'].map(h => (
                <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-3)', fontWeight: 500, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, i) => {
              const val = h.price * h.qty;
              const curPct = totalValue > 0 ? (val / totalValue) * 100 : 0;
              const targetVal = totalValue * (h.target / 100);
              const diff = targetVal - val;
              const action = Math.abs(diff) < 1 ? '—' : (diff > 0 ? `Buy $${fmtInt(diff)}` : `Sell $${fmtInt(-diff)}`);
              const actionColor = diff > 1 ? 'var(--green)' : diff < -1 ? 'var(--red)' : 'var(--text-3)';
              return (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '6px 8px' }}><input className="input" style={{ height: 30, fontSize: 12, width: 90 }} value={h.coin} onChange={e => update(i, 'coin', e.target.value)} /></td>
                  <td style={{ padding: '6px 8px' }}><input className="input" style={{ height: 30, fontSize: 12, width: 90 }} type="number" value={h.price} onChange={e => update(i, 'price', e.target.value)} /></td>
                  <td style={{ padding: '6px 8px' }}><input className="input" style={{ height: 30, fontSize: 12, width: 70 }} type="number" value={h.qty} step={0.01} onChange={e => update(i, 'qty', e.target.value)} /></td>
                  <td style={{ padding: '6px 8px' }}><input className="input input-with-suffix" style={{ height: 30, fontSize: 12, width: 70 }} type="number" value={h.target} onChange={e => update(i, 'target', e.target.value)} /></td>
                  <td style={{ padding: '6px 8px', color: 'var(--text-2)' }}>{fmtPct(curPct, 1)}</td>
                  <td style={{ padding: '6px 8px', fontWeight: 500, color: actionColor }}>{action}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={addRow} className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }}>+ Add coin</button>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div className="metric-card" style={{ flex: 1 }}>
          <div className="metric-label">Portfolio value</div>
          <div className="metric-value" style={{ color: 'var(--accent)', fontSize: 20 }}>{fmtUSD(totalValue)}</div>
        </div>
        <div className="metric-card" style={{ flex: 1 }}>
          <div className="metric-label">Target allocation</div>
          <div className="metric-value" style={{ fontSize: 20 }}>{fmtPct(holdings.reduce((s, h) => s + h.target, 0), 0)}</div>
          <div className="metric-sub" style={{ color: holdings.reduce((s, h) => s + h.target, 0) === 100 ? 'var(--green)' : 'var(--red)' }}>
            {holdings.reduce((s, h) => s + h.target, 0) === 100 ? '✓ Adds up to 100%' : 'Must equal 100%'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 20. Mining Profitability ─────────────────────────────────────────────────
export function MiningProfitCalc({ onCalcUsed }) {
  const [v, setV] = useState({ hashrate: '', power: '', electric: '', poolFee: '', blockReward: '', difficulty: '', price: '' });
  const [res, setRes] = useState(null);
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  function calc() {
    const hr = parseFloat(v.hashrate), power = parseFloat(v.power), electric = parseFloat(v.electric),
          poolFee = parseFloat(v.poolFee) || 1, reward = parseFloat(v.blockReward) || 3.125,
          diff = parseFloat(v.difficulty) || 83e12, price = parseFloat(v.price);
    if (!hr || !power || !electric || !price) return;
    const dailyBTC = (hr * 1e12 * 86400) / (diff * Math.pow(2, 32)) * reward * (1 - poolFee / 100);
    const dailyRev = dailyBTC * price;
    const dailyPower = (power / 1000) * 24 * electric;
    const dailyProfit = dailyRev - dailyPower;
    setRes({ dailyBTC, dailyRev, dailyPower, dailyProfit, monthly: dailyProfit * 30, yearly: dailyProfit * 365 });
  }

  return (
    <div>
      <InputGrid>
        <Field label="Hashrate (TH/s)"><input type="number" placeholder="e.g. 110" onChange={s('hashrate')} /></Field>
        <Field label="Power usage (W)"><input type="number" placeholder="e.g. 3250" onChange={s('power')} /></Field>
        <Field label="Electricity ($/kWh)" prefix="$"><input type="number" placeholder="e.g. 0.08" step={0.01} onChange={s('electric')} /></Field>
        <Field label="BTC price" prefix="$"><input type="number" placeholder="e.g. 65000" onChange={s('price')} /></Field>
        <Field label="Pool fee %" suffix="%"><input type="number" placeholder="e.g. 1" step={0.1} onChange={s('poolFee')} /></Field>
        <Field label="Block reward"><input type="number" placeholder="e.g. 3.125" step={0.001} onChange={s('blockReward')} /></Field>
      </InputGrid>
      <CalcBtn onClick={calc} onCalcUsed={onCalcUsed} />
      {res && <>
        <MetricGrid>
          <Metric label="Daily profit" value={'$' + res.dailyProfit.toFixed(2)} color={res.dailyProfit >= 0 ? 'var(--green)' : 'var(--red)'} accent />
          <Metric label="Daily BTC mined" value={res.dailyBTC.toFixed(6) + ' BTC'} />
          <Metric label="Daily revenue" value={'$' + res.dailyRev.toFixed(2)} color="var(--green)" />
          <Metric label="Daily power cost" value={'$' + res.dailyPower.toFixed(2)} color="var(--red)" />
          <Metric label="Monthly profit" value={'$' + Math.round(res.monthly).toLocaleString()} color={res.monthly >= 0 ? 'var(--green)' : 'var(--red)'} />
          <Metric label="Yearly profit" value={'$' + Math.round(res.yearly).toLocaleString()} color={res.yearly >= 0 ? 'var(--green)' : 'var(--red)'} />
        </MetricGrid>
      </>}
    </div>
  );
}

export function LiquidationPriceCalc({ onCalcUsed }) {
  const [v, setV] = useState({ entry: '', leverage: '', size: '', maintenance: '' });
  const [dir, setDir] = useState('long');
  const [res, setRes] = useState(null);
  const s = n => e => setV(p => ({ ...p, [n]: e.target.value }));

  function calc() {
    const entry = parseFloat(v.entry), lev = parseFloat(v.leverage),
          maintenance = parseFloat(v.maintenance) || 0.5;
    if (!entry || !lev) return;
    const mm = maintenance / 100;
    const liqPrice = dir === 'long' ? entry * (1 - 1/lev + mm) : entry * (1 + 1/lev - mm);
    const distPct = Math.abs(liqPrice - entry) / entry * 100;
    setRes({ liqPrice, distPct, entry, lev, dir });
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['long', 'short'].map(d => (
          <button key={d} onClick={() => setDir(d)} className="btn btn-sm"
            style={{ flex: 1, background: dir === d ? (d === 'long' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)') : 'var(--bg-2)', borderColor: dir === d ? (d === 'long' ? 'var(--green)' : 'var(--red)') : 'var(--border)', color: dir === d ? (d === 'long' ? 'var(--green)' : 'var(--red)') : 'var(--text-2)', border: '1px solid' }}>
            {d === 'long' ? '▲ Long' : '▼ Short'}
          </button>
        ))}
      </div>
      <InputGrid>
        <Field label="Entry price" prefix="$"><input type="number" placeholder="e.g. 65000" onChange={s('entry')} /></Field>
        <Field label="Leverage" suffix="x"><input type="number" placeholder="e.g. 10" onChange={s('leverage')} /></Field>
        <Field label="Position size" prefix="$"><input type="number" placeholder="e.g. 1000" onChange={s('size')} /></Field>
        <Field label="Maintenance margin %" suffix="%"><input type="number" placeholder="e.g. 0.5" step={0.1} onChange={s('maintenance')} /></Field>
      </InputGrid>
      <CalcBtn onClick={calc} onCalcUsed={onCalcUsed} />
      {res && <>
        <div style={{ textAlign: 'center', padding: 20, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 6 }}>Your {dir} position gets liquidated at</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--red)', lineHeight: 1 }}>${res.liqPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>{res.distPct.toFixed(1)}% away from your entry of ${res.entry.toLocaleString()}</div>
        </div>
      </>}
    </div>
  );
}

export function TradingPlanCalc({ onCalcUsed }) {
  const [bal, setBal] = useState('');
  const [pr, setPr]   = useState('');
  const [sl, setSl]   = useState('');
  const [dy, setDy]   = useState('');
  const [rows, setRows] = useState([]);
  const [generated, setGenerated] = useState(false);

  const fmtD = (n, d=2) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmtP = n => Number(n).toFixed(2) + '%';

  function generate() {
    const b = parseFloat(bal), p = parseFloat(pr), s = parseFloat(sl), d = parseInt(dy);
    if (!b||b<=0||!p||p<=0||!s||s<=0||!d||d<1) return;
    const newRows = [];
    let balance = b;
    for (let i = 1; i <= d; i++) {
      const start   = balance;
      const profit  = start * (p / 100);
      const stopLoss= start * (s / 100);
      const end     = start + profit;
      newRows.push({ day: i, start, profit, stopLoss, end, target: false, sl_hit: false });
      balance = end;
    }
    setRows(newRows);
    setGenerated(true);
  }

  function toggle(idx, type, val) {
    setRows(prev => prev.map((r, i) => {
      if (i !== idx) return r;
      if (type === 't') return { ...r, target: val, sl_hit: val ? false : r.sl_hit };
      return { ...r, sl_hit: val, target: val ? false : r.target };
    }));
  }

  async function downloadPDF() {
    if (!rows.length) return;
    // Dynamic import of jsPDF + html2canvas via CDN script tags injected once
    if (!window.jspdf) {
      await new Promise((res, rej) => {
        const s1 = document.createElement('script');
        s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s1.onload = () => {
          const s2 = document.createElement('script');
          s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          s2.onload = res; s2.onerror = rej;
          document.head.appendChild(s2);
        };
        s1.onerror = rej;
        document.head.appendChild(s1);
      });
    }

    const finalBal = rows[rows.length - 1].end;
    const b = parseFloat(bal), p = parseFloat(pr), s = parseFloat(sl), d = parseInt(dy);

    let el = document.getElementById('tp-pdf-render');
    if (!el) { el = document.createElement('div'); el.id = 'tp-pdf-render'; document.body.appendChild(el); }
    el.style.cssText = 'position:fixed;left:-9999px;top:0;width:760px;background:#fff;padding:28px 30px;font-family:Arial,Helvetica,sans-serif;';

    el.innerHTML = `
      <div style="text-align:center;font-size:21px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:#000;margin-bottom:5px;">${d}-Day Trading Comprehensive Plan</div>
      <div style="text-align:center;font-size:11px;font-weight:600;color:#333;margin-bottom:16px;">Initial Balance: ${fmtD(b)} → Target: ~${fmtD(finalBal)} | Daily: +${fmtP(p)} | Stop Loss: ${fmtP(s)} | Mastermind Discipline Journal</div>
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <thead>
          <tr style="background:#0f172a;">
            <th style="padding:8px 6px;color:#fff;font-size:10px;border:1px solid #1e293b;text-align:center;line-height:1.4;">DAY<br/><span style="font-size:9px;font-weight:400;color:rgba(255,255,255,.55)">(দিন)</span></th>
            <th style="padding:8px 6px;color:#fff;font-size:10px;border:1px solid #1e293b;text-align:center;line-height:1.4;">STARTING BALANCE<br/><span style="font-size:9px;font-weight:400;color:rgba(255,255,255,.55)">(দিনের শুরু)</span></th>
            <th style="padding:8px 6px;color:#fff;font-size:10px;border:1px solid #1e293b;text-align:center;line-height:1.4;">PROFIT TARGET (${fmtP(p)})<br/><span style="font-size:9px;font-weight:400;color:rgba(255,255,255,.55)">(লাভের লক্ষ্য)</span></th>
            <th style="padding:8px 6px;color:#fff;font-size:10px;border:1px solid #1e293b;text-align:center;line-height:1.4;">STOP LOSS (${fmtP(s)})<br/><span style="font-size:9px;font-weight:400;color:rgba(255,255,255,.55)">(সর্বোচ্চ লস)</span></th>
            <th style="padding:8px 6px;color:#fff;font-size:10px;border:1px solid #1e293b;text-align:center;line-height:1.4;">EXPECTED BALANCE<br/><span style="font-size:9px;font-weight:400;color:rgba(255,255,255,.55)">(দিনের শেষ)</span></th>
            <th style="padding:8px 6px;color:#fff;font-size:10px;border:1px solid #1e293b;text-align:center;line-height:1.4;">DAILY OUTCOME<br/><span style="font-size:9px;font-weight:400;color:rgba(255,255,255,.55)">(কলম দিয়ে মার্ক করুন)</span></th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr style="${i%2===1?'background:#f8fafc;':''}">
              <td style="padding:6px;text-align:center;border:1px solid #e2e8f0;font-weight:700;">${r.day}</td>
              <td style="padding:6px;text-align:center;border:1px solid #e2e8f0;font-weight:600;">${fmtD(r.start)}</td>
              <td style="padding:6px;text-align:center;border:1px solid #e2e8f0;color:#15803d;font-weight:700;">+${fmtD(r.profit)}</td>
              <td style="padding:6px;text-align:center;border:1px solid #e2e8f0;color:#dc2626;font-weight:700;">-${fmtD(r.stopLoss)}</td>
              <td style="padding:6px;text-align:center;border:1px solid #e2e8f0;font-weight:700;">${fmtD(r.end)}</td>
              <td style="padding:6px;text-align:center;border:1px solid #e2e8f0;">
                <div style="display:flex;align-items:center;justify-content:center;gap:10px;">
                  <span style="display:flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:#15803d;">TARGET <span style="width:13px;height:13px;border:1.5px solid #15803d;border-radius:2px;display:inline-block;"></span></span>
                  <span style="display:flex;align-items:center;gap:4px;font-size:10px;font-weight:700;color:#dc2626;">SL <span style="width:13px;height:13px;border:1.5px solid #dc2626;border-radius:2px;display:inline-block;"></span></span>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="text-align:center;margin-top:14px;font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#000;">Stay Disciplined. Follow The Plan Strictly.</div>
    `;

    await new Promise(r => setTimeout(r, 120));

    try {
      const canvas = await window.html2canvas(el, { scale: 2.2, useCORS: true, backgroundColor: '#ffffff', width: 760, windowWidth: 760, logging: false });
      const imgData = canvas.toDataURL('image/jpeg', 0.97);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const PW=210, PH=297, M=8, cW=PW-M*2;
      const ratio = canvas.height / canvas.width;
      const imgH = cW * ratio;
      if (imgH <= PH - M*2) {
        pdf.addImage(imgData, 'JPEG', M, Math.max(M,(PH-imgH)/2), cW, imgH);
      } else {
        const pxPerPage = Math.floor(canvas.width * ((PH-M*2)/cW));
        let yPx=0, pg=0;
        while(yPx < canvas.height){
          const sliceH = Math.min(pxPerPage, canvas.height-yPx);
          const sc = document.createElement('canvas'); sc.width=canvas.width; sc.height=sliceH;
          const ctx=sc.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,sc.width,sc.height); ctx.drawImage(canvas,0,-yPx);
          if(pg>0) pdf.addPage();
          pdf.addImage(sc.toDataURL('image/jpeg',0.97),'JPEG',M,M,cW,(sliceH/canvas.width)*cW);
          yPx+=pxPerPage; pg++;
        }
      }
      pdf.save(`trading-plan-${d}days.pdf`);
    } catch(e) { alert('PDF error: '+e.message); }
  }

  const b = parseFloat(bal), p = parseFloat(pr), s = parseFloat(sl), d = parseInt(dy);
  const finalBal = rows.length ? rows[rows.length-1].end : 0;
  const gain = rows.length ? finalBal - b : 0;
  const ret  = rows.length ? ((finalBal-b)/b)*100 : 0;

  const inputStyle = { width:'100%', height:42, background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', color:'var(--text-1)', fontSize:14, padding:'0 12px', outline:'none', fontFamily:'var(--font-mono)' };
  const labelStyle = { fontSize:12, fontWeight:500, color:'var(--text-2)', letterSpacing:'0.03em', display:'block', marginBottom:6 };
  const fieldWrap  = { position:'relative', display:'flex', alignItems:'center' };
  const pfxStyle   = { position:'absolute', left:10, fontSize:13, color:'var(--text-3)', pointerEvents:'none', zIndex:1 };
  const sfxStyle   = { position:'absolute', right:10, fontSize:13, color:'var(--text-3)', pointerEvents:'none' };

  return (
    <div>
      {/* Inputs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:16 }}>
        {[
          { label:'Initial Balance', id:'tp-bal', pfx:'$', val:bal, set:setBal, ph:'e.g. 10' },
          { label:'Profit Target %', id:'tp-pr',  sfx:'%', val:pr,  set:setPr,  ph:'e.g. 19.37' },
          { label:'Stop Loss %',     id:'tp-sl',  sfx:'%', val:sl,  set:setSl,  ph:'e.g. 10' },
          { label:'Number of Days',  id:'tp-dy',            val:dy,  set:setDy,  ph:'e.g. 30' },
        ].map(f => (
          <div key={f.id}>
            <label style={labelStyle}>{f.label}</label>
            <div style={fieldWrap}>
              {f.pfx && <span style={pfxStyle}>{f.pfx}</span>}
              <input
                type="number" placeholder={f.ph}
                value={f.val}
                onChange={e => f.set(e.target.value)}
                style={{ ...inputStyle, paddingLeft: f.pfx ? 24 : 12, paddingRight: f.sfx ? 32 : 12 }}
              />
              {f.sfx && <span style={sfxStyle}>{f.sfx}</span>}
            </div>
          </div>
        ))}
      </div>

      <button onClick={generate} className="btn btn-primary" style={{ width:'100%', height:44, fontSize:14, fontWeight:600, marginBottom:20 }}>
        ⚡ Generate Plan
      </button>

      {/* Summary */}
      {generated && rows.length > 0 && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:8, marginBottom:16 }}>
            {[
              { label:'Starting',      val:fmtD(b),       color:'var(--accent)' },
              { label:'Target Balance',val:fmtD(finalBal), color:'var(--green)' },
              { label:'Total Gain',    val:'+'+fmtD(gain), color:'var(--green)' },
              { label:'Total Return',  val:'+'+ret.toFixed(0)+'%', color:'var(--green)' },
              { label:'Daily Target',  val:fmtP(p),        color:'var(--text-1)' },
              { label:'Max Loss/Day',  val:fmtP(s),        color:'var(--red)' },
            ].map((m,i) => (
              <div key={i} className="metric-card">
                <div className="metric-label">{m.label}</div>
                <div className="metric-value" style={{ color:m.color, fontSize:16 }}>{m.val}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, flexWrap:'wrap', gap:8 }}>
            <div style={{ fontSize:13, fontWeight:600 }}>{d}-Day Compounding Plan</div>
            <button onClick={downloadPDF} className="btn btn-ghost btn-sm">
              ↓ Download PDF
            </button>
          </div>

          <div style={{ overflowX:'auto', borderRadius:'var(--radius-md)', border:'1px solid var(--border)' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:580 }}>
              <thead>
                <tr style={{ background:'var(--bg-2)' }}>
                  {['Day','Starting Balance',`Profit (+${fmtP(p)})`,`Stop Loss (${fmtP(s)})`,`Expected Balance`,'Outcome'].map(h => (
                    <th key={h} style={{ padding:'9px 10px', fontSize:10, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.05em', textAlign:'center', borderBottom:'1px solid var(--border)', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom:'1px solid var(--border)', background: i%2===1 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td style={{ padding:'9px 10px', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:12, fontWeight:600 }}>{r.day}</td>
                    <td style={{ padding:'9px 10px', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:12 }}>{fmtD(r.start)}</td>
                    <td style={{ padding:'9px 10px', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--green)', fontWeight:700 }}>+{fmtD(r.profit)}</td>
                    <td style={{ padding:'9px 10px', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--red)', fontWeight:700 }}>-{fmtD(r.stopLoss)}</td>
                    <td style={{ padding:'9px 10px', textAlign:'center', fontFamily:'var(--font-mono)', fontSize:12, fontWeight:700 }}>{fmtD(r.end)}</td>
                    <td style={{ padding:'9px 10px', textAlign:'center' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                        <label style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, color:'var(--green)', cursor:'pointer' }}>
                          <input type="checkbox" checked={r.target} onChange={e => toggle(i,'t',e.target.checked)} style={{ accentColor:'var(--green)', width:14, height:14 }} />
                          TARGET
                        </label>
                        <label style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, color:'var(--red)', cursor:'pointer' }}>
                          <input type="checkbox" checked={r.sl_hit} onChange={e => toggle(i,'s',e.target.checked)} style={{ accentColor:'var(--red)', width:14, height:14 }} />
                          SL
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:'var(--radius-md)', fontSize:12, color:'var(--amber)', display:'flex', alignItems:'center', gap:8 }}>
            ⚠ <strong>Tracking tip:</strong> Check TARGET or SL after each session. Progress saves in this browser session.
          </div>
        </>
      )}

      {!generated && (
        <div style={{ textAlign:'center', padding:'2.5rem 1rem', color:'var(--text-3)', fontSize:13 }}>
          Enter your parameters above and click Generate Plan to build your compounding roadmap.
        </div>
      )}
    </div>
  );
}

// ─── Calculator router ───────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════
// NEW CALCULATORS — All 22 missing ones
// ═══════════════════════════════════════════════════════════════

// ─── Shared helpers (added inline for new calcs) ───────────────
const fmt2  = (n,d=2) => isNaN(n)||!isFinite(n)?'—':n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtU2 = (n,d=2) => isNaN(n)||!isFinite(n)?'—':'$'+fmt2(n,d);
const fmtP2 = (n,d=1) => isNaN(n)||!isFinite(n)?'—':fmt2(n,d)+'%';
const fmtI2 = (n)     => isNaN(n)||!isFinite(n)?'—':Math.round(n).toLocaleString('en-US');
const TTS2 = {background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:8,fontSize:12,color:'var(--text-1)'};
const COLORS2 = ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4'];

function F2({label,children,pre,suf}){
  return(
    <div style={{display:'flex',flexDirection:'column',gap:5}}>
      <label style={{fontSize:12,fontWeight:600,color:'var(--text-2)',letterSpacing:'0.04em',textTransform:'uppercase'}}>{label}</label>
      <div style={{position:'relative',display:'flex',alignItems:'center'}}>
        {pre&&<span style={{position:'absolute',left:10,fontSize:13,color:'var(--text-3)',pointerEvents:'none',zIndex:1}}>{pre}</span>}
        {React.cloneElement(children,{className:'input'+(pre?' input-with-prefix':'')})}
        {suf&&<span style={{position:'absolute',right:10,fontSize:13,color:'var(--text-3)',pointerEvents:'none'}}>{suf}</span>}
      </div>
    </div>
  );
}
function Grid2({children}){return <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:12,marginBottom:16}}>{children}</div>;}
function CalcBtn2({onClick,label='Calculate',onCalcUsed}){return<button onClick={()=>{onClick&&onClick();onCalcUsed&&onCalcUsed();}} className="btn btn-primary" style={{width:'100%',height:46,fontSize:14,fontWeight:700,marginBottom:20}}>⚡ {label}</button>;}
function MG2({children}){return <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:10,marginBottom:16}}>{children}</div>;}
function M2({label,value,sub,color,big,accent}){
  return(
    <div className="metric-card" style={accent?{background:'rgba(59,130,246,0.1)',borderColor:'rgba(59,130,246,0.3)'}:{}}>
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={{color:color||(accent?'var(--accent)':'var(--text-1)'),fontSize:big?28:20}}>{value}</div>
      {sub&&<div className="metric-sub">{sub}</div>}
    </div>
  );
}
function Insight2({icon:Icon,color,title,body}){
  return(
    <div style={{display:'flex',gap:12,padding:'14px 16px',background:'var(--bg-1)',border:`1px solid ${color}33`,borderRadius:12,marginBottom:10}}>
      <div style={{width:36,height:36,borderRadius:9,background:color+'22',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
        <Icon size={18} color={color}/>
      </div>
      <div>
        <div style={{fontSize:13,fontWeight:700,color:'var(--text-1)',marginBottom:2}}>{title}</div>
        <div style={{fontSize:12,color:'var(--text-2)',lineHeight:1.6}}>{body}</div>
      </div>
    </div>
  );
}
function ChartWrap2({children,h=200}){return <div style={{marginTop:16,height:h}}><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>;}
function BMIBar2({bmi}){
  const pct=Math.max(0,Math.min(100,((bmi-10)/40)*100));
  const zones=[{label:'Underweight',color:'#3b82f6'},{label:'Healthy',color:'#10b981'},{label:'Overweight',color:'#f59e0b'},{label:'Obese',color:'#ef4444'}];
  return(
    <div style={{marginBottom:20}}>
      <div style={{display:'flex',height:14,borderRadius:7,overflow:'hidden',marginBottom:8}}>
        {zones.map(z=><div key={z.label} style={{flex:1,background:z.color}}/>)}
      </div>
      <div style={{position:'relative',height:28}}>
        <div style={{position:'absolute',left:`${pct}%`,transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div style={{background:'#0f172a',color:'#fff',borderRadius:6,padding:'2px 8px',fontSize:11,fontWeight:700}}>You</div>
          <div style={{width:2,height:8,background:'#0f172a'}}/>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
        {zones.map(z=><span key={z.label} style={{fontSize:11,color:'var(--text-3)',flex:1,textAlign:'center'}}>{z.label}</span>)}
      </div>
    </div>
  );
}

// ════════════════ FINANCE NEW ════════════════

// 1. Pip Value Calculator
export function PipValueCalc(){
  const [v,setV]=useState({pair:'EUR/USD',lots:'',lotType:'standard',price:''});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  const LOTS={standard:100000,mini:10000,micro:1000,nano:100};
  function calc(){
    const lots=parseFloat(v.lots),price=parseFloat(v.price)||1;
    if(!lots) return;
    const lotSize=LOTS[v.lotType]||100000;
    const pipSize=v.pair.includes('JPY')?0.01:0.0001;
    const perLot=(pipSize/price)*lotSize;
    const total=perLot*lots;
    setRes({total,perLot,lots,lotSize,pipSize,pair:v.pair});
  }
  const pairs=['EUR/USD','GBP/USD','USD/JPY','USD/CHF','AUD/USD','USD/CAD','NZD/USD','EUR/GBP','EUR/JPY','GBP/JPY'];
  return(<div>
    <Grid2>
      <F2 label="Currency Pair"><select value={v.pair} onChange={s('pair')} className="input">{pairs.map(p=><option key={p}>{p}</option>)}</select></F2>
      <F2 label="Lot Type"><select value={v.lotType} onChange={s('lotType')} className="input"><option value="standard">Standard (100k)</option><option value="mini">Mini (10k)</option><option value="micro">Micro (1k)</option><option value="nano">Nano (100)</option></select></F2>
      <F2 label="Number of Lots"><input type="number" placeholder="e.g. 1.5" onChange={s('lots')}/></F2>
      <F2 label="Current Price (optional)"><input type="number" placeholder="e.g. 1.0850" onChange={s('price')}/></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="Pip Value" value={fmtU2(res.total)} big accent/>
        <M2 label="Per Lot" value={fmtU2(res.perLot)}/>
        <M2 label="Pip Size" value={res.pipSize===0.01?'0.01 (JPY)':'0.0001'}/>
        <M2 label="Position Size" value={fmtI2(res.lotSize*res.lots)+' units'}/>
      </MG2>
      <Insight2 icon={Info} color="var(--accent)" title="What this means"
        body={`Every 1 pip move on your ${res.pair} position is worth ${fmtU2(res.total)}. A 10-pip move = ${fmtU2(res.total*10)} profit or loss.`}/>
    </div>}
  </div>);
}

// 2. Risk/Reward Ratio
export function RiskRewardCalc(){
  const [v,setV]=useState({entry:'',stop:'',target:'',winRate:''});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const entry=parseFloat(v.entry),stop=parseFloat(v.stop),target=parseFloat(v.target);
    if(!entry||!stop||!target) return;
    const risk=Math.abs(entry-stop),reward=Math.abs(target-entry);
    const rr=reward/risk,minWin=(1/(1+rr))*100;
    const wr=parseFloat(v.winRate)||0;
    const expectancy=wr>0?((wr/100)*reward)-((1-wr/100)*risk):null;
    setRes({risk,reward,rr,minWin,expectancy});
  }
  return(<div>
    <Grid2>
      <F2 label="Entry Price" pre="$"><input type="number" placeholder="e.g. 100.00" onChange={s('entry')}/></F2>
      <F2 label="Stop Loss" pre="$"><input type="number" placeholder="e.g. 95.00" onChange={s('stop')}/></F2>
      <F2 label="Take Profit" pre="$"><input type="number" placeholder="e.g. 115.00" onChange={s('target')}/></F2>
      <F2 label="Win Rate % (optional)" suf="%"><input type="number" placeholder="e.g. 55" onChange={s('winRate')}/></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="Risk/Reward" value={`1 : ${fmt2(res.rr)}`} big accent color={res.rr>=2?'var(--green)':res.rr>=1?'var(--amber)':'var(--red)'}/>
        <M2 label="Risk per Unit" value={fmtU2(res.risk)} color="var(--red)"/>
        <M2 label="Reward per Unit" value={fmtU2(res.reward)} color="var(--green)"/>
        <M2 label="Min Win Rate" value={fmtP2(res.minWin)} sub="to break even"/>
        {res.expectancy!==null&&<M2 label="Expected Profit/Trade" value={fmtU2(res.expectancy)} color={res.expectancy>0?'var(--green)':'var(--red)'}/>}
      </MG2>
      <Insight2 icon={res.rr>=2?CheckCircle:res.rr>=1?Info:XCircle} color={res.rr>=2?'var(--green)':res.rr>=1?'var(--amber)':'var(--red)'}
        title={res.rr>=2?'Excellent setup — take this trade!':res.rr>=1?'Acceptable — proceed carefully':'Poor setup — consider skipping'}
        body={`You risk ${fmtU2(res.risk)} to make ${fmtU2(res.reward)}. Even winning only ${fmtP2(res.minWin)} of your trades keeps you profitable. Professionals target at least 1:2 R:R.`}/>
    </div>}
  </div>);
}

// 3. Profit/Loss Calculator
export function ProfitLossCalc(){
  const [v,setV]=useState({entry:'',exit:'',qty:'',fee:''});
  const [dir,setDir]=useState('long');
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const entry=parseFloat(v.entry),exit=parseFloat(v.exit),qty=parseFloat(v.qty),fee=parseFloat(v.fee)||0;
    if(!entry||!exit||!qty) return;
    const rawPL=dir==='long'?(exit-entry)*qty:(entry-exit)*qty;
    const fees=fee/100*(entry*qty+exit*qty);
    const netPL=rawPL-fees;
    const pct=(netPL/(entry*qty))*100;
    setRes({rawPL,netPL,fees,pct,invested:entry*qty});
  }
  return(<div>
    <div style={{display:'flex',gap:8,marginBottom:16}}>
      {['long','short'].map(d=>(
        <button key={d} onClick={()=>setDir(d)} className="btn btn-sm" style={{flex:1,background:dir===d?(d==='long'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)'):'var(--bg-2)',borderColor:dir===d?(d==='long'?'var(--green)':'var(--red)'):'var(--border)',color:dir===d?(d==='long'?'var(--green)':'var(--red)'):'var(--text-2)',border:'1px solid'}}>
          {d==='long'?'▲ Long (Buy)':'▼ Short (Sell)'}
        </button>
      ))}
    </div>
    <Grid2>
      <F2 label="Entry Price" pre="$"><input type="number" placeholder="e.g. 100.00" onChange={s('entry')}/></F2>
      <F2 label="Exit Price" pre="$"><input type="number" placeholder="e.g. 115.00" onChange={s('exit')}/></F2>
      <F2 label="Quantity / Shares"><input type="number" placeholder="e.g. 100" onChange={s('qty')}/></F2>
      <F2 label="Fee %" suf="%"><input type="number" placeholder="e.g. 0.1" onChange={s('fee')}/></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="Net Profit/Loss" value={(res.netPL>=0?'+':'')+fmtU2(res.netPL)} big accent color={res.netPL>=0?'var(--green)':'var(--red)'}/>
        <M2 label="Return" value={(res.pct>=0?'+':'')+fmtP2(res.pct)} color={res.pct>=0?'var(--green)':'var(--red)'}/>
        <M2 label="Invested" value={fmtU2(res.invested)}/>
        <M2 label="Fees Paid" value={fmtU2(res.fees)} color="var(--text-3)"/>
      </MG2>
      <Insight2 icon={res.netPL>=0?CheckCircle:XCircle} color={res.netPL>=0?'var(--green)':'var(--red)'}
        title={res.netPL>=0?`You made ${fmtU2(res.netPL)} on this trade 🎉`:`You lost ${fmtU2(Math.abs(res.netPL))} on this trade`}
        body={`Invested ${fmtU2(res.invested)}, ${res.netPL>=0?'came out with':'lost'} ${fmtU2(Math.abs(res.netPL))} (${(res.pct>=0?'+':'')+fmtP2(res.pct)}). Fees: ${fmtU2(res.fees)}.`}/>
    </div>}
  </div>);
}

// 4. Margin Calculator
export function MarginCalc(){
  const [v,setV]=useState({price:'',qty:'',leverage:''});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const price=parseFloat(v.price),qty=parseFloat(v.qty),leverage=parseFloat(v.leverage);
    if(!price||!qty||!leverage) return;
    const pos=price*qty,margin=pos/leverage,borrowed=pos-margin;
    setRes({pos,margin,borrowed,leverage});
  }
  return(<div>
    <Grid2>
      <F2 label="Asset Price" pre="$"><input type="number" placeholder="e.g. 50000" onChange={s('price')}/></F2>
      <F2 label="Quantity"><input type="number" placeholder="e.g. 0.5" onChange={s('qty')}/></F2>
      <F2 label="Leverage" suf="x"><input type="number" placeholder="e.g. 10" onChange={s('leverage')}/></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="Required Margin" value={fmtU2(res.margin)} big accent/>
        <M2 label="Full Position" value={fmtU2(res.pos)}/>
        <M2 label="Borrowed Capital" value={fmtU2(res.borrowed)}/>
        <M2 label="Leverage" value={`${fmt2(res.leverage,0)}x`}/>
      </MG2>
      <Insight2 icon={AlertTriangle} color="var(--amber)" title="How margin works"
        body={`You put up ${fmtU2(res.margin)} of your own money to control a ${fmtU2(res.pos)} position. The broker lends you ${fmtU2(res.borrowed)}. This amplifies gains AND losses by ${fmt2(res.leverage,0)}x.`}/>
    </div>}
  </div>);
}

// 5. Currency Converter
export function CurrencyConverterCalc(){
  const [v,setV]=useState({amount:'',from:'USD',to:'EUR'});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  const RATES={USD:1,EUR:0.92,GBP:0.79,JPY:149.5,CAD:1.36,AUD:1.53,CHF:0.90,CNY:7.24,INR:83.1,MXN:17.2,BRL:4.97,SGD:1.34,HKD:7.82,NOK:10.6,SEK:10.4,NZD:1.63,ZAR:18.6,AED:3.67,SAR:3.75,THB:35.1};
  const CURRENCIES=Object.keys(RATES);
  function calc(){
    const amount=parseFloat(v.amount);
    if(!amount) return;
    const converted=amount/RATES[v.from]*RATES[v.to];
    const rate=RATES[v.to]/RATES[v.from];
    setRes({converted,rate,amount,from:v.from,to:v.to});
  }
  return(<div>
    <div style={{background:'rgba(59,130,246,0.08)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:10,padding:'10px 14px',fontSize:12,color:'#60a5fa',marginBottom:16}}>
      ℹ️ Approximate rates — use your broker for live trading
    </div>
    <Grid2>
      <F2 label="Amount"><input type="number" placeholder="e.g. 1000" onChange={s('amount')}/></F2>
      <F2 label="From"><select className="input" value={v.from} onChange={s('from')}>{CURRENCIES.map(c=><option key={c}>{c}</option>)}</select></F2>
      <F2 label="To"><select className="input" value={v.to} onChange={s('to')}>{CURRENCIES.map(c=><option key={c}>{c}</option>)}</select></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div style={{textAlign:'center',padding:'24px',background:'var(--bg-1)',borderRadius:14}}>
      <div style={{fontSize:40,fontWeight:800,fontFamily:'var(--font-display)',color:'var(--text-1)',marginBottom:4}}>
        {fmt2(res.converted,2)} <span style={{color:'var(--accent)'}}>{res.to}</span>
      </div>
      <div style={{fontSize:15,color:'var(--text-2)'}}>= {fmt2(res.amount,2)} {res.from}</div>
      <div style={{fontSize:13,color:'var(--text-3)',marginTop:8}}>1 {res.from} = {fmt2(res.rate,4)} {res.to}</div>
    </div>}
  </div>);
}

// 6. Stock Return Calculator
export function StockReturnCalc(){
  const [v,setV]=useState({buy:'',sell:'',shares:'',dividend:'',years:''});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const buy=parseFloat(v.buy),sell=parseFloat(v.sell),shares=parseFloat(v.shares),dividend=parseFloat(v.dividend)||0,years=parseFloat(v.years)||1;
    if(!buy||!sell||!shares) return;
    const invested=buy*shares,proceeds=sell*shares;
    const divIncome=dividend*shares*years,capitalGain=proceeds-invested;
    const totalReturn=capitalGain+divIncome,pct=(totalReturn/invested)*100;
    const annualized=(Math.pow(1+pct/100,1/years)-1)*100;
    setRes({invested,proceeds,divIncome,capitalGain,totalReturn,pct,annualized,years});
  }
  return(<div>
    <Grid2>
      <F2 label="Buy Price" pre="$"><input type="number" placeholder="e.g. 100.00" onChange={s('buy')}/></F2>
      <F2 label="Sell Price" pre="$"><input type="number" placeholder="e.g. 145.00" onChange={s('sell')}/></F2>
      <F2 label="Shares"><input type="number" placeholder="e.g. 50" onChange={s('shares')}/></F2>
      <F2 label="Annual Dividend/Share" pre="$"><input type="number" placeholder="e.g. 2.50 (optional)" onChange={s('dividend')}/></F2>
      <F2 label="Holding Period (years)"><input type="number" placeholder="e.g. 3" onChange={s('years')}/></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="Total Return" value={(res.pct>=0?'+':'')+fmtP2(res.pct)} big accent color={res.pct>=0?'var(--green)':'var(--red)'}/>
        <M2 label="Net Profit" value={fmtU2(res.totalReturn)} color={res.totalReturn>=0?'var(--green)':'var(--red)'}/>
        <M2 label="Capital Gain" value={fmtU2(res.capitalGain)}/>
        <M2 label="Dividend Income" value={fmtU2(res.divIncome)} color="var(--accent)"/>
        <M2 label="Annualized" value={fmtP2(res.annualized)} sub="per year"/>
      </MG2>
      <Insight2 icon={res.totalReturn>=0?CheckCircle:XCircle} color={res.totalReturn>=0?'var(--green)':'var(--red)'}
        title={res.totalReturn>=0?`Great — ${fmtP2(res.pct)} total return over ${res.years} year${res.years>1?'s':''}`:`Lost ${fmtP2(Math.abs(res.pct))} over ${res.years} year${res.years>1?'s':''}`}
        body={`Invested ${fmtU2(res.invested)}, ${res.totalReturn>=0?'made':'lost'} ${fmtU2(Math.abs(res.totalReturn))} — ${fmtP2(res.annualized)}/year. Dividends added ${fmtU2(res.divIncome)}.`}/>
    </div>}
  </div>);
}

// 7. Drawdown Recovery
export function DrawdownRecoveryCalc(){
  const [loss,setLoss]=useState('');
  const [res,setRes]=useState(null);
  function calc(){
    const l=parseFloat(loss);
    if(!l||l<=0||l>=100) return;
    const recovery=(l/(100-l))*100;
    const data=[10,20,30,40,50,60,70,80,90].map(x=>({loss:x,recovery:Math.round((x/(100-x))*100)}));
    setRes({loss:l,recovery,data});
  }
  return(<div>
    <Grid2><F2 label="Your Loss / Drawdown %" suf="%"><input type="number" placeholder="e.g. 30" min="1" max="99" onChange={e=>setLoss(e.target.value)}/></F2></Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <div style={{textAlign:'center',padding:'24px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:14,marginBottom:16}}>
        <div style={{fontSize:14,color:'var(--text-2)',marginBottom:6}}>To recover from a <strong style={{color:'var(--red)'}}>{fmt2(res.loss,1)}% loss</strong>, you need to gain</div>
        <div style={{fontSize:52,fontWeight:800,fontFamily:'var(--font-display)',color:'var(--red)'}}>{fmtP2(res.recovery)}</div>
      </div>
      <Insight2 icon={AlertTriangle} color="var(--red)" title="Losses are NOT symmetrical"
        body={`A ${fmtP2(res.loss)} loss requires a ${fmtP2(res.recovery)} gain just to break even. Lose 50%, you need 100% to recover. This is why protecting capital is rule #1 in trading.`}/>
      <ChartWrap2 h={180}>
        <BarChart data={res.data}>
          <XAxis dataKey="loss" stroke="var(--text-3)" tick={{fontSize:10}} label={{value:'Loss %',position:'insideBottom',offset:-2,fontSize:10}}/>
          <YAxis stroke="var(--text-3)" tick={{fontSize:10}} width={40}/>
          <Tooltip contentStyle={TTS2} formatter={(v)=>[v+'%','Recovery needed']}/>
          <Bar dataKey="recovery" fill="var(--red)" radius={[4,4,0,0]}/>
        </BarChart>
      </ChartWrap2>
    </div>}
  </div>);
}

// ════════════════ HEALTH NEW ════════════════

// 8. Calorie Deficit
export function CalorieDeficitCalc(){
  const [v,setV]=useState({age:'',weight:'',height:'',activity:'1.55',goal:'',weeks:''});
  const [sex,setSex]=useState('male');
  const [unit,setUnit]=useState('metric');
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  const ACTS=[['1.2','Sedentary (desk job)'],['1.375','Lightly active (1-3x/week)'],['1.55','Moderately active (3-5x/week)'],['1.725','Very active (6-7x/week)'],['1.9','Athlete (twice daily)']];
  function calc(){
    let wKg=parseFloat(v.weight),hCm=parseFloat(v.height);
    const age=parseFloat(v.age),act=parseFloat(v.activity);
    const goalKg=parseFloat(v.goal)||0,weeks=parseFloat(v.weeks)||12;
    if(!wKg||!hCm||!age) return;
    if(unit==='imperial'){wKg*=0.453592;hCm*=2.54;}
    const bmr=sex==='male'?10*wKg+6.25*hCm-5*age+5:10*wKg+6.25*hCm-5*age-161;
    const tdee=bmr*act;
    const dailyDeficit=goalKg>0?(goalKg*7700)/(weeks*7):500;
    const target=tdee-Math.abs(dailyDeficit);
    const projLoss=dailyDeficit*7*weeks/7700;
    setRes({bmr,tdee,target,dailyDeficit:Math.abs(dailyDeficit),projLoss,goalKg,weeks});
  }
  return(<div>
    <div style={{display:'flex',gap:8,marginBottom:12}}>
      {[['male','♂ Male'],['female','♀ Female']].map(([val,lbl])=>(
        <button key={val} onClick={()=>setSex(val)} className="btn btn-sm" style={{flex:1,background:sex===val?'rgba(139,92,246,0.15)':'var(--bg-2)',borderColor:sex===val?'var(--purple)':'var(--border)',color:sex===val?'var(--purple)':'var(--text-2)',border:'1px solid'}}>{lbl}</button>
      ))}
    </div>
    <div style={{display:'flex',gap:8,marginBottom:12}}>
      {[['metric','Metric (kg/cm)'],['imperial','Imperial (lbs/in)']].map(([val,lbl])=>(
        <button key={val} onClick={()=>setUnit(val)} className="btn btn-sm" style={{flex:1,background:unit===val?'rgba(59,130,246,0.15)':'var(--bg-2)',borderColor:unit===val?'var(--accent)':'var(--border)',color:unit===val?'var(--accent)':'var(--text-2)',border:'1px solid'}}>{lbl}</button>
      ))}
    </div>
    <Grid2>
      <F2 label="Age"><input type="number" placeholder="e.g. 28" onChange={s('age')}/></F2>
      <F2 label={`Weight (${unit==='metric'?'kg':'lbs'})`}><input type="number" placeholder={unit==='metric'?'e.g. 80':'e.g. 176'} onChange={s('weight')}/></F2>
      <F2 label={`Height (${unit==='metric'?'cm':'in'})`}><input type="number" placeholder={unit==='metric'?'e.g. 175':'e.g. 69'} onChange={s('height')}/></F2>
      <F2 label="Weight to Lose (kg)"><input type="number" placeholder="e.g. 5 (optional)" onChange={s('goal')}/></F2>
      <F2 label="Timeframe (weeks)"><input type="number" placeholder="e.g. 12" onChange={s('weeks')}/></F2>
    </Grid2>
    <F2 label="Activity Level"><select className="input" value={v.activity} onChange={s('activity')} style={{marginBottom:16}}>{ACTS.map(([val,lbl])=><option key={val} value={val}>{lbl}</option>)}</select></F2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <div style={{textAlign:'center',padding:'20px',background:'var(--bg-1)',borderRadius:14,marginBottom:16}}>
        <div style={{fontSize:13,color:'var(--text-2)',marginBottom:4}}>Your daily calorie target</div>
        <div style={{fontSize:52,fontWeight:800,fontFamily:'var(--font-display)',color:'var(--accent)'}}>{fmtI2(res.target)}</div>
        <div style={{fontSize:13,color:'var(--text-3)'}}>calories per day</div>
      </div>
      <MG2>
        <M2 label="Your TDEE (maintenance)" value={`${fmtI2(res.tdee)} cal`}/>
        <M2 label="Daily Deficit" value={`${fmtI2(res.dailyDeficit)} cal`} color="var(--red)"/>
        {res.goalKg>0&&<M2 label="Projected Loss" value={`${fmt2(res.projLoss,1)} kg`} sub={`in ${res.weeks} weeks`}/>}
      </MG2>
      <Insight2 icon={CheckCircle} color="var(--green)" title={`Eat ${fmtI2(res.target)} calories/day to lose weight`}
        body={`Your body burns ${fmtI2(res.tdee)} calories daily. By eating ${fmtI2(res.target)} cal instead, you create a ${fmtI2(res.dailyDeficit)} calorie gap every day that burns fat over time. Safe pace: 0.5–1 kg per week.`}/>
    </div>}
  </div>);
}

// 9. TDEE Calculator
export function TDEECalc(){
  const [v,setV]=useState({age:'',weight:'',height:'',activity:'1.55'});
  const [sex,setSex]=useState('male');
  const [unit,setUnit]=useState('metric');
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  const ACTS=[['1.2','Sedentary (desk job)'],['1.375','Light exercise (1-3x/week)'],['1.55','Moderate exercise (3-5x/week)'],['1.725','Heavy exercise (6-7x/week)'],['1.9','Athlete (twice daily)']];
  function calc(){
    let wKg=parseFloat(v.weight),hCm=parseFloat(v.height);
    const age=parseFloat(v.age),act=parseFloat(v.activity);
    if(!wKg||!hCm||!age) return;
    if(unit==='imperial'){wKg*=0.453592;hCm*=2.54;}
    const bmr=sex==='male'?10*wKg+6.25*hCm-5*age+5:10*wKg+6.25*hCm-5*age-161;
    const tdee=bmr*act;
    const levels=[{label:'Weight Loss',cal:tdee-500,desc:'500 cal deficit/day'},{label:'Mild Loss',cal:tdee-250,desc:'250 cal deficit/day'},{label:'Maintain',cal:tdee,desc:'Your exact TDEE'},{label:'Mild Gain',cal:tdee+250,desc:'250 cal surplus/day'},{label:'Muscle Gain',cal:tdee+500,desc:'500 cal surplus/day'}];
    setRes({bmr,tdee,levels});
  }
  return(<div>
    <div style={{display:'flex',gap:8,marginBottom:12}}>
      {[['metric','Metric'],['imperial','Imperial']].map(([val,lbl])=>(
        <button key={val} onClick={()=>setUnit(val)} className="btn btn-sm" style={{flex:1,background:unit===val?'rgba(59,130,246,0.15)':'var(--bg-2)',borderColor:unit===val?'var(--accent)':'var(--border)',color:unit===val?'var(--accent)':'var(--text-2)',border:'1px solid'}}>{lbl}</button>
      ))}
    </div>
    <div style={{display:'flex',gap:8,marginBottom:12}}>
      {[['male','♂ Male'],['female','♀ Female']].map(([val,lbl])=>(
        <button key={val} onClick={()=>setSex(val)} className="btn btn-sm" style={{flex:1,background:sex===val?'rgba(139,92,246,0.15)':'var(--bg-2)',borderColor:sex===val?'var(--purple)':'var(--border)',color:sex===val?'var(--purple)':'var(--text-2)',border:'1px solid'}}>{lbl}</button>
      ))}
    </div>
    <Grid2>
      <F2 label="Age"><input type="number" placeholder="e.g. 28" onChange={s('age')}/></F2>
      <F2 label={`Weight (${unit==='metric'?'kg':'lbs'})`}><input type="number" placeholder={unit==='metric'?'e.g. 75':'e.g. 165'} onChange={s('weight')}/></F2>
      <F2 label={`Height (${unit==='metric'?'cm':'in'})`}><input type="number" placeholder={unit==='metric'?'e.g. 175':'e.g. 69'} onChange={s('height')}/></F2>
    </Grid2>
    <F2 label="Activity Level"><select className="input" value={v.activity} onChange={s('activity')} style={{marginBottom:16}}>{ACTS.map(([val,lbl])=><option key={val} value={val}>{lbl}</option>)}</select></F2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <div style={{textAlign:'center',padding:'20px',background:'var(--bg-1)',borderRadius:14,marginBottom:16}}>
        <div style={{fontSize:14,color:'var(--text-2)',marginBottom:4}}>Your body burns approximately</div>
        <div style={{fontSize:52,fontWeight:800,fontFamily:'var(--font-display)',color:'var(--accent)'}}>{fmtI2(res.tdee)}</div>
        <div style={{fontSize:14,color:'var(--text-3)'}}>calories every day (TDEE)</div>
        <div style={{fontSize:12,color:'var(--text-3)',marginTop:6}}>BMR (at rest): {fmtI2(res.bmr)} cal</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {res.levels.map((l,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',background:i===2?'rgba(59,130,246,0.1)':'var(--bg-1)',border:`1px solid ${i===2?'var(--accent)':'var(--border)'}`,borderRadius:10}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:i===2?'var(--accent)':'var(--text-1)'}}>{l.label}</div>
              <div style={{fontSize:11,color:'var(--text-3)'}}>{l.desc}</div>
            </div>
            <div style={{fontSize:18,fontWeight:700,fontFamily:'var(--font-mono)',color:i===2?'var(--accent)':'var(--text-1)'}}>{fmtI2(l.cal)} cal</div>
          </div>
        ))}
      </div>
    </div>}
  </div>);
}

// 10. Ideal Weight Calculator
export function IdealWeightCalc(){
  const [v,setV]=useState({height:'',unit:'cm',frame:'medium'});
  const [sex,setSex]=useState('male');
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    let hCm=parseFloat(v.height);
    if(!hCm) return;
    if(v.unit==='in') hCm*=2.54;
    const hIn=hCm/2.54;
    let devine=sex==='male'?50+2.3*(hIn-60):45.5+2.3*(hIn-60);
    const adj={small:-10,medium:0,large:10}[v.frame]||0;
    const idealMin=devine+adj-5,idealMax=devine+adj+5;
    const hM=hCm/100;
    const bmiMin=18.5*hM*hM,bmiMax=24.9*hM*hM;
    setRes({idealMin,idealMax,bmiWeightMin:bmiMin,bmiWeightMax:bmiMax});
  }
  return(<div>
    <div style={{display:'flex',gap:8,marginBottom:12}}>
      {[['male','♂ Male'],['female','♀ Female']].map(([val,lbl])=>(
        <button key={val} onClick={()=>setSex(val)} className="btn btn-sm" style={{flex:1,background:sex===val?'rgba(139,92,246,0.15)':'var(--bg-2)',borderColor:sex===val?'var(--purple)':'var(--border)',color:sex===val?'var(--purple)':'var(--text-2)',border:'1px solid'}}>{lbl}</button>
      ))}
    </div>
    <Grid2>
      <F2 label="Height"><input type="number" placeholder="e.g. 175" onChange={s('height')}/></F2>
      <F2 label="Unit"><select className="input" value={v.unit} onChange={s('unit')}><option value="cm">Centimeters (cm)</option><option value="in">Inches (in)</option></select></F2>
      <F2 label="Frame Size"><select className="input" value={v.frame} onChange={s('frame')}><option value="small">Small frame</option><option value="medium">Medium frame</option><option value="large">Large frame</option></select></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <div style={{textAlign:'center',padding:'20px',background:'var(--bg-1)',borderRadius:14,marginBottom:16}}>
        <div style={{fontSize:14,color:'var(--text-2)',marginBottom:8}}>Your ideal weight range is</div>
        <div style={{fontSize:42,fontWeight:800,fontFamily:'var(--font-display)',color:'var(--green)'}}>{fmt2(res.idealMin,0)} – {fmt2(res.idealMax,0)} <span style={{fontSize:22}}>kg</span></div>
      </div>
      <MG2>
        <M2 label="Devine Formula" value={`${fmt2(res.idealMin,0)}–${fmt2(res.idealMax,0)} kg`} color="var(--green)"/>
        <M2 label="BMI Method (18.5–25)" value={`${fmt2(res.bmiWeightMin,0)}–${fmt2(res.bmiWeightMax,0)} kg`} color="var(--accent)"/>
      </MG2>
      <Insight2 icon={Info} color="var(--accent)" title="Two methods, one goal"
        body="The Devine formula uses your height and sex. The BMI method uses healthy BMI range 18.5–25. Both give similar ranges. Focus on how you feel, not just a number!"/>
    </div>}
  </div>);
}

// 11. Protein Intake Calculator
export function ProteinIntakeCalc(){
  const [v,setV]=useState({weight:'',unit:'kg',goal:'maintain'});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    let wKg=parseFloat(v.weight);
    if(!wKg) return;
    if(v.unit==='lbs') wKg*=0.453592;
    const mult={lose:1.8,maintain:1.6,bulk:2.2,athlete:2.4}[v.goal]||1.6;
    const totalG=wKg*mult;
    const sources=[{food:'Chicken breast (100g)',protein:31},{food:'Greek yogurt (200g)',protein:20},{food:'Eggs (2 large)',protein:12},{food:'Tuna (100g)',protein:29},{food:'Protein shake (1 scoop)',protein:25},{food:'Lentils (100g cooked)',protein:9}];
    setRes({totalG,mult,sources});
  }
  return(<div>
    <Grid2>
      <F2 label="Body Weight"><input type="number" placeholder="e.g. 75" onChange={s('weight')}/></F2>
      <F2 label="Unit"><select className="input" value={v.unit} onChange={s('unit')}><option value="kg">Kilograms</option><option value="lbs">Pounds</option></select></F2>
      <F2 label="Goal"><select className="input" value={v.goal} onChange={s('goal')}><option value="lose">Lose Fat</option><option value="maintain">Maintain</option><option value="bulk">Build Muscle</option><option value="athlete">Athlete/Performance</option></select></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <div style={{textAlign:'center',padding:'20px',background:'var(--bg-1)',borderRadius:14,marginBottom:16}}>
        <div style={{fontSize:14,color:'var(--text-2)',marginBottom:4}}>You need at least</div>
        <div style={{fontSize:52,fontWeight:800,fontFamily:'var(--font-display)',color:'#ef4444'}}>{Math.round(res.totalG)}g</div>
        <div style={{fontSize:14,color:'var(--text-3)'}}>protein per day ({fmt2(res.mult,1)}g per kg)</div>
      </div>
      <MG2>
        <M2 label="Daily Protein" value={`${Math.round(res.totalG)}g`} color="#ef4444"/>
        <M2 label="Protein Calories" value={`${fmtI2(res.totalG*4)} cal`}/>
        <M2 label="Per Meal (4 meals)" value={`${Math.round(res.totalG/4)}g`}/>
      </MG2>
      <div style={{marginTop:12}}>
        <div style={{fontSize:12,fontWeight:600,color:'var(--text-2)',marginBottom:8,letterSpacing:'0.04em',textTransform:'uppercase'}}>Good protein sources</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:8}}>
          {res.sources.map((src,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 12px',background:'var(--bg-1)',border:'1px solid var(--border)',borderRadius:8,fontSize:12}}>
              <span style={{color:'var(--text-2)'}}>{src.food}</span>
              <span style={{fontWeight:700,color:'#ef4444'}}>{src.protein}g</span>
            </div>
          ))}
        </div>
      </div>
    </div>}
  </div>);
}

// ════════════════ REAL ESTATE NEW ════════════════

// 12. Refinance Calculator
export function RefinanceCalc(){
  const [v,setV]=useState({balance:'',curRate:'',curYears:'',newRate:'',newYears:'',closing:''});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const bal=parseFloat(v.balance),curRate=parseFloat(v.curRate),curYrs=parseFloat(v.curYears),newRate=parseFloat(v.newRate),newYrs=parseFloat(v.newYears)||curYrs,closing=parseFloat(v.closing)||0;
    if(!bal||!curRate||!curYrs||!newRate) return;
    const r1=curRate/100/12,n1=curYrs*12;
    const curMonthly=bal*r1*Math.pow(1+r1,n1)/(Math.pow(1+r1,n1)-1);
    const r2=newRate/100/12,n2=newYrs*12;
    const newMonthly=bal*r2*Math.pow(1+r2,n2)/(Math.pow(1+r2,n2)-1);
    const savings=curMonthly-newMonthly;
    const breakEven=closing>0&&savings>0?Math.ceil(closing/savings):0;
    const totalSavings=savings*n2-closing;
    setRes({curMonthly,newMonthly,savings,breakEven,totalSavings,closing});
  }
  return(<div>
    <Grid2>
      <F2 label="Current Balance" pre="$"><input type="number" placeholder="e.g. 280000" onChange={s('balance')}/></F2>
      <F2 label="Current Rate %" suf="%"><input type="number" placeholder="e.g. 7.5" onChange={s('curRate')}/></F2>
      <F2 label="Years Left on Loan"><input type="number" placeholder="e.g. 22" onChange={s('curYears')}/></F2>
      <F2 label="New Rate %" suf="%"><input type="number" placeholder="e.g. 6.0" onChange={s('newRate')}/></F2>
      <F2 label="New Loan Term (years)"><input type="number" placeholder="e.g. 30" onChange={s('newYears')}/></F2>
      <F2 label="Closing Costs" pre="$"><input type="number" placeholder="e.g. 4000" onChange={s('closing')}/></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="Monthly Savings" value={fmtU2(res.savings)} big accent color={res.savings>=0?'var(--green)':'var(--red)'}/>
        <M2 label="Current Payment" value={fmtU2(res.curMonthly)} color="var(--red)"/>
        <M2 label="New Payment" value={fmtU2(res.newMonthly)} color="var(--green)"/>
        <M2 label="Break-Even" value={res.breakEven>0?`${res.breakEven} months`:'Immediate'} sub={res.breakEven>0?`~${Math.round(res.breakEven/12)} years`:''}/> 
        <M2 label="Total Savings" value={fmtU2(res.totalSavings)} color={res.totalSavings>=0?'var(--green)':'var(--red)'}/>
      </MG2>
      <Insight2 icon={res.savings>0?CheckCircle:XCircle} color={res.savings>0?'var(--green)':'var(--red)'}
        title={res.savings>0?`Refinancing saves ${fmtU2(res.savings)}/month`:`Refinancing costs more per month`}
        body={res.breakEven>0?`After paying ${fmtU2(res.closing)} in closing costs, you break even in ${res.breakEven} months. Stay longer and save ${fmtU2(res.totalSavings)} total.`:`You save ${fmtU2(res.savings)}/month starting immediately.`}/>
    </div>}
  </div>);
}

// 13. Down Payment Savings
export function DownPaymentCalc(){
  const [v,setV]=useState({homePrice:'',downPct:'',savings:'',monthly:'',rate:''});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const price=parseFloat(v.homePrice),pct=parseFloat(v.downPct)||20,cur=parseFloat(v.savings)||0,monthly=parseFloat(v.monthly),rate=parseFloat(v.rate)||0;
    if(!price||!monthly) return;
    const target=price*pct/100,remaining=Math.max(0,target-cur);
    const r=rate/100/12;
    let months;
    if(r===0) months=Math.ceil(remaining/monthly);
    else months=Math.ceil(Math.log(1+(remaining*r)/monthly)/Math.log(1+r));
    const years=Math.floor(months/12),mo=months%12;
    const interest=Math.max(0,target-cur-monthly*months);
    setRes({target,remaining,months,years,mo,interest,pct});
  }
  return(<div>
    <Grid2>
      <F2 label="Target Home Price" pre="$"><input type="number" placeholder="e.g. 400000" onChange={s('homePrice')}/></F2>
      <F2 label="Down Payment %" suf="%"><input type="number" placeholder="e.g. 20" onChange={s('downPct')}/></F2>
      <F2 label="Current Savings" pre="$"><input type="number" placeholder="e.g. 15000" onChange={s('savings')}/></F2>
      <F2 label="Monthly Savings" pre="$"><input type="number" placeholder="e.g. 1500" onChange={s('monthly')}/></F2>
      <F2 label="Savings Rate (APY) %" suf="%"><input type="number" placeholder="e.g. 4.5 (HYSA)" onChange={s('rate')}/></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <div style={{textAlign:'center',padding:'20px',background:'var(--bg-1)',borderRadius:14,marginBottom:16}}>
        <div style={{fontSize:14,color:'var(--text-2)',marginBottom:4}}>You'll reach your {fmtP2(res.pct,0)} down payment in</div>
        <div style={{fontSize:42,fontWeight:800,fontFamily:'var(--font-display)',color:'var(--accent)'}}>
          {res.years>0?`${res.years}y `:''}{res.mo>0?`${res.mo}m`:''}
        </div>
        <div style={{fontSize:13,color:'var(--text-3)'}}>Target: {fmtU2(res.target)}</div>
      </div>
      <MG2>
        <M2 label="Down Payment Target" value={fmtU2(res.target)}/>
        <M2 label="Still Need" value={fmtU2(res.remaining)} color="var(--amber)"/>
        <M2 label="Total Months" value={`${res.months} months`}/>
        <M2 label="Interest Earned" value={fmtU2(res.interest)} color="var(--green)"/>
      </MG2>
    </div>}
  </div>);
}

// 14. Stamp Duty Calculator
export function StampDutyCalc(){
  const [v,setV]=useState({price:'',country:'UK',firstBuyer:'no'});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const price=parseFloat(v.price);
    if(!price) return;
    let duty=0,breakdown=[];
    if(v.country==='UK'){
      const first=v.firstBuyer==='yes';
      const bands=first?[[0,425000,0],[425000,625000,5],[625000,Infinity,5]]:[[0,250000,0],[250000,925000,5],[925000,1500000,10],[1500000,Infinity,12]];
      for(const [lo,hi,rate] of bands){
        if(price<=lo) break;
        const taxable=Math.min(price,hi)-lo;
        const tax=taxable*rate/100;
        duty+=tax;
        if(taxable>0) breakdown.push({band:`£${lo.toLocaleString()}–£${Math.min(price,hi).toLocaleString()}`,rate:`${rate}%`,tax});
      }
    } else if(v.country==='AU'){
      if(price<=14000) duty=price*0.01;
      else if(price<=30000) duty=140+(price-14000)*0.035;
      else if(price<=80000) duty=700+(price-30000)*0.045;
      else if(price<=300000) duty=2950+(price-80000)*0.015;
      else if(price<=1000000) duty=6250+(price-300000)*0.045;
      else duty=37750+(price-1000000)*0.055;
      breakdown=[{band:'NSW Scale',rate:'Varies',tax:duty}];
    } else {
      duty=price*0.01;
      breakdown=[{band:'Approx 1% (varies by state)',rate:'~1%',tax:duty}];
    }
    const effective=(duty/price)*100;
    setRes({duty,effective,breakdown,price,country:v.country});
  }
  return(<div>
    <Grid2>
      <F2 label="Property Price" pre="$"><input type="number" placeholder="e.g. 350000" onChange={s('price')}/></F2>
      <F2 label="Country"><select className="input" value={v.country} onChange={s('country')}><option value="UK">United Kingdom (SDLT)</option><option value="AU">Australia (NSW)</option><option value="US">United States (approx)</option></select></F2>
      <F2 label="First-Time Buyer?"><select className="input" value={v.firstBuyer} onChange={s('firstBuyer')}><option value="yes">Yes</option><option value="no">No</option></select></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="Stamp Duty / Tax" value={fmtU2(res.duty)} big accent/>
        <M2 label="Effective Rate" value={fmtP2(res.effective,2)}/>
        <M2 label="Total Cost" value={fmtU2(res.price+res.duty)}/>
      </MG2>
      <div style={{marginTop:12}}>
        <div style={{fontSize:12,fontWeight:600,color:'var(--text-3)',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.04em'}}>Tax Breakdown</div>
        {res.breakdown.map((b,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 12px',background:'var(--bg-1)',border:'1px solid var(--border)',borderRadius:8,marginBottom:6,fontSize:13}}>
            <span style={{color:'var(--text-2)'}}>{b.band} @ {b.rate}</span>
            <span style={{fontWeight:700,color:'var(--accent)'}}>{fmtU2(b.tax)}</span>
          </div>
        ))}
      </div>
    </div>}
  </div>);
}

// 15. Amortization Schedule
export function AmortizationCalc(){
  const [v,setV]=useState({loan:'',rate:'',years:'',extra:''});
  const [res,setRes]=useState(null);
  const [showFull,setShowFull]=useState(false);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const loan=parseFloat(v.loan),rate=parseFloat(v.rate),years=parseFloat(v.years),extra=parseFloat(v.extra)||0;
    if(!loan||!rate||!years) return;
    const r=rate/100/12,n=years*12;
    const base=loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
    const monthly=base+extra;
    let bal=loan,rows=[],totalInterest=0;
    for(let m=1;m<=n&&bal>0;m++){
      const interest=bal*r;
      const principal=Math.min(monthly-interest,bal);
      totalInterest+=interest;
      bal=Math.max(0,bal-principal);
      rows.push({month:m,payment:monthly,principal:Math.round(principal),interest:Math.round(interest),balance:Math.round(bal)});
      if(bal===0) break;
    }
    const chartData=rows.filter((_,i)=>i%12===0).map(r=>({year:`Y${Math.ceil(r.month/12)}`,balance:r.balance}));
    setRes({rows,totalInterest,monthly,loan,chartData,months:rows.length});
  }
  return(<div>
    <Grid2>
      <F2 label="Loan Amount" pre="$"><input type="number" placeholder="e.g. 300000" onChange={s('loan')}/></F2>
      <F2 label="Interest Rate %" suf="%"><input type="number" placeholder="e.g. 6.5" onChange={s('rate')}/></F2>
      <F2 label="Loan Term (years)"><input type="number" placeholder="e.g. 30" onChange={s('years')}/></F2>
      <F2 label="Extra Monthly Payment" pre="$"><input type="number" placeholder="e.g. 200 (optional)" onChange={s('extra')}/></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="Monthly Payment" value={fmtU2(res.monthly)} big accent/>
        <M2 label="Total Interest" value={fmtU2(res.totalInterest)} color="var(--red)"/>
        <M2 label="Payoff" value={`${Math.ceil(res.months/12)} years`} sub={`${res.months} months`}/>
      </MG2>
      <ChartWrap2 h={160}>
        <AreaChart data={res.chartData}>
          <XAxis dataKey="year" stroke="var(--text-3)" tick={{fontSize:10}}/>
          <YAxis stroke="var(--text-3)" tick={{fontSize:10}} width={60} tickFormatter={v=>'$'+Math.round(v/1000)+'k'}/>
          <Tooltip contentStyle={TTS2} formatter={v=>fmtU2(v)}/>
          <Area type="monotone" dataKey="balance" stroke="var(--accent)" fill="rgba(59,130,246,0.15)" name="Balance"/>
        </AreaChart>
      </ChartWrap2>
      <button onClick={()=>setShowFull(f=>!f)} className="btn btn-ghost btn-sm" style={{marginTop:12,width:'100%'}}>
        {showFull?'Hide':'Show'} full schedule ({res.rows.length} months)
      </button>
      {showFull&&<div style={{maxHeight:300,overflowY:'auto',marginTop:8}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead><tr style={{background:'var(--bg-2)',position:'sticky',top:0}}>
            {['Month','Payment','Principal','Interest','Balance'].map(h=><th key={h} style={{padding:'6px 8px',textAlign:'right',fontWeight:600,color:'var(--text-3)'}}>{h}</th>)}
          </tr></thead>
          <tbody>{res.rows.map((r,i)=>(
            <tr key={i} style={{borderBottom:'1px solid var(--border)'}}>
              <td style={{padding:'5px 8px',textAlign:'right',color:'var(--text-3)'}}>{r.month}</td>
              <td style={{padding:'5px 8px',textAlign:'right'}}>{fmtU2(r.payment)}</td>
              <td style={{padding:'5px 8px',textAlign:'right',color:'var(--green)'}}>{fmtU2(r.principal)}</td>
              <td style={{padding:'5px 8px',textAlign:'right',color:'var(--red)'}}>{fmtU2(r.interest)}</td>
              <td style={{padding:'5px 8px',textAlign:'right',fontWeight:600}}>{fmtU2(r.balance)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>}
    </div>}
  </div>);
}

// 16. Gross Rental Yield
export function GrossRentalYieldCalc(){
  const [v,setV]=useState({price:'',rent:'',expenses:''});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const price=parseFloat(v.price),rent=parseFloat(v.rent),expenses=parseFloat(v.expenses)||0;
    if(!price||!rent) return;
    const annual=rent*12;
    const gross=(annual/price)*100;
    const net=((annual-expenses*12)/price)*100;
    setRes({gross,net,annual,price});
  }
  return(<div>
    <Grid2>
      <F2 label="Property Value" pre="$"><input type="number" placeholder="e.g. 300000" onChange={s('price')}/></F2>
      <F2 label="Monthly Rent" pre="$"><input type="number" placeholder="e.g. 1800" onChange={s('rent')}/></F2>
      <F2 label="Monthly Expenses" pre="$"><input type="number" placeholder="e.g. 400 (optional)" onChange={s('expenses')}/></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="Gross Yield" value={fmtP2(res.gross,2)} big accent color={res.gross>=6?'var(--green)':res.gross>=4?'var(--amber)':'var(--red)'}/>
        {parseFloat(v.expenses)>0&&<M2 label="Net Yield" value={fmtP2(res.net,2)} color={res.net>=5?'var(--green)':'var(--amber)'}/>}
        <M2 label="Annual Rent" value={fmtU2(res.annual)}/>
      </MG2>
      <Insight2 icon={res.gross>=6?CheckCircle:res.gross>=4?Info:XCircle} color={res.gross>=6?'var(--green)':res.gross>=4?'var(--amber)':'var(--red)'}
        title={`${fmtP2(res.gross,2)} gross rental yield — ${res.gross>=6?'Strong':'Below average'}`}
        body={`Your property earns ${fmtU2(res.annual)}/year in rent on a ${fmtU2(res.price)} investment. Gross yield above 6% is generally considered strong. Net yield (after expenses) gives a more accurate picture.`}/>
    </div>}
  </div>);
}

// ════════════════ CRYPTO NEW ════════════════

// 17. Crypto Tax Calculator
export function CryptoTaxCalc(){
  const [v,setV]=useState({gains:'',income:'',held:'',country:'US'});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const gains=parseFloat(v.gains),income=parseFloat(v.income)||50000,held=parseFloat(v.held)||0;
    if(isNaN(gains)) return;
    let taxRate,type;
    if(v.country==='US'){
      if(held>=12){type='Long-term';taxRate=income>492300?20:income>44625?15:0;}
      else{type='Short-term';taxRate=income>578125?37:income>231250?35:income>89075?32:income>41775?22:income>10275?12:10;}
    } else if(v.country==='UK'){
      type='Capital gains';taxRate=income>50270?20:10;
    } else {
      taxRate=gains>0?25:0;type='Standard rate';
    }
    const tax=Math.max(0,gains*taxRate/100);
    const afterTax=gains-tax;
    setRes({gains,tax,afterTax,taxRate,type,held});
  }
  return(<div>
    <Grid2>
      <F2 label="Crypto Gains / Profit" pre="$"><input type="number" placeholder="e.g. 15000" onChange={s('gains')}/></F2>
      <F2 label="Other Annual Income" pre="$"><input type="number" placeholder="e.g. 60000" onChange={s('income')}/></F2>
      <F2 label="Held for (months)"><input type="number" placeholder="e.g. 14" onChange={s('held')}/></F2>
      <F2 label="Country"><select className="input" value={v.country} onChange={s('country')}><option value="US">United States</option><option value="UK">United Kingdom</option><option value="EU">Europe (approx)</option></select></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="Estimated Tax" value={fmtU2(res.tax)} big accent color="var(--amber)"/>
        <M2 label="Tax Rate" value={fmtP2(res.taxRate,0)} color="var(--amber)"/>
        <M2 label="Tax Type" value={res.type}/>
        <M2 label="After-Tax Profit" value={fmtU2(res.afterTax)} color="var(--green)"/>
      </MG2>
      <Insight2 icon={AlertTriangle} color="var(--amber)" title="Estimate only — consult a tax professional"
        body={`Based on ${res.held} months holding, your gains are taxed as ${res.type} at ~${fmtP2(res.taxRate,0)}. In the US, holding 12+ months can significantly lower your rate. Always verify with a tax professional.`}/>
    </div>}
  </div>);
}

// 18. Crypto Position Size
export function CryptoPositionSizeCalc(){
  const [v,setV]=useState({portfolio:'',riskPct:'',entry:'',stop:''});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const port=parseFloat(v.portfolio),risk=parseFloat(v.riskPct),entry=parseFloat(v.entry),stop=parseFloat(v.stop);
    if(!port||!risk||!entry||!stop) return;
    const dollarRisk=port*(risk/100);
    const stopDist=Math.abs(entry-stop);
    const stopPct=(stopDist/entry)*100;
    const qty=dollarRisk/stopDist;
    const posValue=qty*entry;
    const portPct=(posValue/port)*100;
    setRes({dollarRisk,qty,posValue,portPct,stopPct,entry,stop});
  }
  return(<div>
    <Grid2>
      <F2 label="Portfolio Size" pre="$"><input type="number" placeholder="e.g. 10000" onChange={s('portfolio')}/></F2>
      <F2 label="Risk per Trade %" suf="%"><input type="number" placeholder="e.g. 2" onChange={s('riskPct')}/></F2>
      <F2 label="Entry Price" pre="$"><input type="number" placeholder="e.g. 65000" onChange={s('entry')}/></F2>
      <F2 label="Stop Loss Price" pre="$"><input type="number" placeholder="e.g. 60000" onChange={s('stop')}/></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="Coins to Buy" value={fmt2(res.qty,4)} big accent/>
        <M2 label="Position Value" value={fmtU2(res.posValue)}/>
        <M2 label="$ at Risk" value={fmtU2(res.dollarRisk)} color="var(--red)"/>
        <M2 label="Stop Distance" value={fmtP2(res.stopPct,1)+' away'}/>
        <M2 label="% of Portfolio" value={fmtP2(res.portPct,1)}/>
      </MG2>
      <Insight2 icon={res.portPct<=25?CheckCircle:AlertTriangle} color={res.portPct<=25?'var(--green)':'var(--amber)'}
        title={`Buy ${fmt2(res.qty,4)} coins — risk ${fmtU2(res.dollarRisk)} of your portfolio`}
        body={`This puts ${fmtP2(res.portPct,1)} of your portfolio into one trade. If stop loss hits, you lose only ${fmtU2(res.dollarRisk)} (${v.riskPct}% of portfolio). Never risk more than 2–5% per trade.`}/>
    </div>}
  </div>);
}

// 19. Staking Rewards
export function StakingRewardsCalc(){
  const [v,setV]=useState({amount:'',apy:'',price:'',compound:'monthly'});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const amount=parseFloat(v.amount),apy=parseFloat(v.apy),price=parseFloat(v.price)||1;
    if(!amount||!apy) return;
    const n={daily:365,weekly:52,monthly:12,yearly:1}[v.compound]||12;
    const r=apy/100;
    const daily=amount*(Math.pow(1+r/365,1)-1);
    const weekly=amount*(Math.pow(1+r/365,7)-1);
    const monthly=amount*(Math.pow(1+r/n,n/12)-1);
    const yearly=amount*(Math.pow(1+r/n,n)-1);
    const data=[{period:'Daily',tokens:fmt2(daily,4),usd:fmtU2(daily*price)},{period:'Weekly',tokens:fmt2(weekly,4),usd:fmtU2(weekly*price)},{period:'Monthly',tokens:fmt2(monthly,4),usd:fmtU2(monthly*price)},{period:'Yearly',tokens:fmt2(yearly,4),usd:fmtU2(yearly*price)}];
    setRes({data});
  }
  return(<div>
    <Grid2>
      <F2 label="Amount Staked (tokens)"><input type="number" placeholder="e.g. 1000" onChange={s('amount')}/></F2>
      <F2 label="APY %" suf="%"><input type="number" placeholder="e.g. 12" onChange={s('apy')}/></F2>
      <F2 label="Token Price (optional)" pre="$"><input type="number" placeholder="e.g. 2.50" onChange={s('price')}/></F2>
      <F2 label="Compounding"><select className="input" value={v.compound} onChange={s('compound')}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div style={{display:'flex',flexDirection:'column',gap:8}}>
      {res.data.map((d,i)=>(
        <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px',background:i===3?'rgba(59,130,246,0.1)':'var(--bg-1)',border:`1px solid ${i===3?'var(--accent)':'var(--border)'}`,borderRadius:12}}>
          <span style={{fontWeight:600,fontSize:14,color:i===3?'var(--accent)':'var(--text-1)'}}>{d.period}</span>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:16,fontWeight:700,fontFamily:'var(--font-mono)',color:i===3?'var(--accent)':'var(--text-1)'}}>{d.tokens} tokens</div>
            <div style={{fontSize:12,color:'var(--text-3)'}}>{d.usd}</div>
          </div>
        </div>
      ))}
    </div>}
  </div>);
}

// 20. ATH Return Calculator
export function ATHReturnCalc(){
  const [v,setV]=useState({current:'',ath:'',atl:''});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const cur=parseFloat(v.current),ath=parseFloat(v.ath),atl=parseFloat(v.atl)||0;
    if(!cur||!ath) return;
    const fromATH=((cur-ath)/ath)*100;
    const toATH=((ath-cur)/cur)*100;
    const fromATL=atl>0?((cur-atl)/atl)*100:null;
    setRes({fromATH,toATH,fromATL,cur,ath,atl});
  }
  return(<div>
    <Grid2>
      <F2 label="Current Price" pre="$"><input type="number" placeholder="e.g. 45000" onChange={s('current')}/></F2>
      <F2 label="All-Time High (ATH)" pre="$"><input type="number" placeholder="e.g. 73000" onChange={s('ath')}/></F2>
      <F2 label="All-Time Low (ATL)" pre="$"><input type="number" placeholder="e.g. 3000 (optional)" onChange={s('atl')}/></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="From ATH" value={fmtP2(res.fromATH,1)} big accent color="var(--red)"/>
        <M2 label="To Reach ATH" value={`+${fmtP2(res.toATH,1)}`} color="var(--green)"/>
        {res.fromATL!==null&&<M2 label="Gain From ATL" value={`+${fmtP2(res.fromATL,1)}`} color="var(--accent)"/>}
      </MG2>
      <div style={{padding:'16px',background:'var(--bg-1)',borderRadius:12,marginTop:8}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <span style={{fontSize:12,color:'var(--text-3)'}}>{res.atl>0?`ATL ${fmtU2(res.atl)}`:''}</span>
          <span style={{fontSize:12,color:'var(--text-3)'}}>Current {fmtU2(res.cur)}</span>
          <span style={{fontSize:12,color:'var(--text-3)'}}>ATH {fmtU2(res.ath)}</span>
        </div>
        <div style={{height:8,background:'var(--bg-3)',borderRadius:4,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${Math.max(1,Math.min(100,(res.cur/res.ath)*100))}%`,background:'linear-gradient(90deg,var(--accent),var(--green))',borderRadius:4}}/>
        </div>
      </div>
      <Insight2 icon={Info} color="var(--accent)" title={`${fmtP2(Math.abs(res.fromATH),1)} below all-time high`}
        body={`Current price is ${fmtP2(Math.abs(res.fromATH),1)} below ATH of ${fmtU2(res.ath)}. To reach ATH again, it needs to gain ${fmtP2(res.toATH,1)} from here. ${res.fromATH>-20?'Close to ATH — watch for resistance.':'Deep discount from ATH — potential opportunity or continued decline.'}`}/>
    </div>}
  </div>);
}

// 21. Funding Rate Calculator
export function FundingRateCalc(){
  const [v,setV]=useState({size:'',rate:'',frequency:'8h'});
  const [dir,setDir]=useState('long');
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const size=parseFloat(v.size),rate=parseFloat(v.rate);
    if(!size||!rate) return;
    const ppd={'8h':3,'4h':6,'1h':24}[v.frequency]||3;
    const perPayment=size*rate/100;
    const daily=perPayment*ppd;
    const monthly=daily*30,yearly=daily*365;
    const positive=rate>0;
    const paying=(dir==='long'&&positive)||(dir==='short'&&!positive);
    setRes({perPayment,daily,monthly,yearly,paying,ppd,rate});
  }
  return(<div>
    <div style={{display:'flex',gap:8,marginBottom:16}}>
      {['long','short'].map(d=>(
        <button key={d} onClick={()=>setDir(d)} className="btn btn-sm" style={{flex:1,background:dir===d?(d==='long'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)'):'var(--bg-2)',borderColor:dir===d?(d==='long'?'var(--green)':'var(--red)'):'var(--border)',color:dir===d?(d==='long'?'var(--green)':'var(--red)'):'var(--text-2)',border:'1px solid'}}>
          {d==='long'?'▲ Long':'▼ Short'}
        </button>
      ))}
    </div>
    <Grid2>
      <F2 label="Position Size" pre="$"><input type="number" placeholder="e.g. 10000" onChange={s('size')}/></F2>
      <F2 label="Funding Rate %" suf="%"><input type="number" placeholder="e.g. 0.01" onChange={s('rate')}/></F2>
      <F2 label="Frequency"><select className="input" value={v.frequency} onChange={s('frequency')}><option value="8h">Every 8 hours</option><option value="4h">Every 4 hours</option><option value="1h">Every hour</option></select></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label={`Per Payment (${v.frequency})`} value={(res.paying?'-':'+')+fmtU2(Math.abs(res.perPayment))} big accent color={res.paying?'var(--red)':'var(--green)'}/>
        <M2 label="Daily" value={(res.paying?'-':'+')+fmtU2(Math.abs(res.daily))} color={res.paying?'var(--red)':'var(--green)'}/>
        <M2 label="Monthly" value={(res.paying?'-':'+')+fmtU2(Math.abs(res.monthly))} color={res.paying?'var(--red)':'var(--green)'}/>
        <M2 label="Yearly" value={(res.paying?'-':'+')+fmtU2(Math.abs(res.yearly))} color={res.paying?'var(--red)':'var(--green)'}/>
      </MG2>
      <Insight2 icon={res.paying?AlertTriangle:CheckCircle} color={res.paying?'var(--amber)':'var(--green)'}
        title={res.paying?`You PAY ${fmtU2(Math.abs(res.daily))}/day in funding`:`You RECEIVE ${fmtU2(Math.abs(res.daily))}/day in funding`}
        body={`Funding rate is ${res.rate}% every ${v.frequency}. As a ${dir}, you ${res.paying?'pay':'collect'} funding ${res.ppd}x/day. Positive funding = longs pay shorts. Negative = shorts pay longs.`}/>
    </div>}
  </div>);
}

// 22. BTC Savings Plan
export function BTCSavingsPlanCalc(){
  const [v,setV]=useState({monthly:'',curPrice:'',targetPrice:'',years:''});
  const [res,setRes]=useState(null);
  const s=k=>e=>setV(p=>({...p,[k]:e.target.value}));
  function calc(){
    const monthly=parseFloat(v.monthly),curPrice=parseFloat(v.curPrice),target=parseFloat(v.targetPrice)||curPrice*2,years=parseFloat(v.years)||5;
    if(!monthly||!curPrice) return;
    const months=years*12;
    let btc=0,invested=0;
    const data=[];
    for(let m=1;m<=months;m++){
      const price=curPrice+(target-curPrice)*(m/months);
      btc+=monthly/price;
      invested+=monthly;
      if(m%Math.max(1,Math.floor(months/12))===0||m===months){
        data.push({month:`M${m}`,btc:parseFloat(btc.toFixed(4)),value:Math.round(btc*target)});
      }
    }
    const finalValue=btc*target,profit=finalValue-invested;
    setRes({btc,finalValue,invested,profit,data,years,target,curPrice});
  }
  return(<div>
    <Grid2>
      <F2 label="Monthly Investment" pre="$"><input type="number" placeholder="e.g. 500" onChange={s('monthly')}/></F2>
      <F2 label="Current BTC Price" pre="$"><input type="number" placeholder="e.g. 65000" onChange={s('curPrice')}/></F2>
      <F2 label="Target BTC Price" pre="$"><input type="number" placeholder="e.g. 150000" onChange={s('targetPrice')}/></F2>
      <F2 label="Investment Period (years)"><input type="number" placeholder="e.g. 5" onChange={s('years')}/></F2>
    </Grid2>
    <CalcBtn2 onClick={calc} onCalcUsed={onCalcUsed} />
    {res&&<div>
      <MG2>
        <M2 label="BTC Accumulated" value={fmt2(res.btc,4)+' BTC'} big accent/>
        <M2 label="Value at Target" value={fmtU2(res.finalValue)} color="var(--green)"/>
        <M2 label="Total Invested" value={fmtU2(res.invested)}/>
        <M2 label="Potential Profit" value={fmtU2(res.profit)} color="var(--green)"/>
      </MG2>
      <Insight2 icon={CheckCircle} color="var(--green)" title={`You'd accumulate ${fmt2(res.btc,4)} BTC over ${res.years} years`}
        body={`Saving ${fmtU2(parseFloat(v.monthly))}/month in BTC between ${fmtU2(res.curPrice)} and ${fmtU2(res.target)} gives you ${fmt2(res.btc,4)} BTC. If BTC reaches ${fmtU2(res.target)}, your stack is worth ${fmtU2(res.finalValue)}.`}/>
      <ChartWrap2 h={180}>
        <AreaChart data={res.data}>
          <XAxis dataKey="month" stroke="var(--text-3)" tick={{fontSize:10}}/>
          <YAxis stroke="var(--text-3)" tick={{fontSize:10}} width={60} tickFormatter={v=>'$'+Math.round(v/1000)+'k'}/>
          <Tooltip contentStyle={TTS2} formatter={v=>fmtU2(v)}/>
          <Area type="monotone" dataKey="value" stroke="var(--amber)" fill="rgba(245,158,11,0.15)" name="Portfolio Value"/>
        </AreaChart>
      </ChartWrap2>
    </div>}
  </div>);
}

export const CALC_COMPONENTS = {
  'position-size': PositionSizeCalc,
  'compound-interest': CompoundInterestCalc,
  'options-pl': OptionsPLCalc,
  'drip': DRIPCalc,
  'break-even': BreakEvenCalc,
  'net-worth': NetWorthCalc,
  'macro-calorie': MacroCalorieCalc,
  'bmi-body-fat': BMIBodyFatCalc,
  'one-rep-max': OneRepMaxCalc,
  'running-pace': RunningPaceCalc,
  'hydration': HydrationCalc,
  'rent-vs-buy': RentVsBuyCalc,
  'mortgage': MortgageCalc,
  'rental-roi': RentalROICalc,
  'house-flip': HouseFlipCalc,
  'affordability': AffordabilityCalc,
  'crypto-dca': CryptoDCACalc,
  'crypto-profit': CryptoProfitCalc,
  'crypto-rebalance': CryptoRebalancerCalc,
  'mining-profit': MiningProfitCalc,
  'liquidation-price': LiquidationPriceCalc,
  'trading-plan': TradingPlanCalc,
  // New Finance calculators
  'pip-value':           PipValueCalc,
  'risk-reward':         RiskRewardCalc,
  'profit-loss':         ProfitLossCalc,
  'margin':              MarginCalc,
  'currency-converter':  CurrencyConverterCalc,
  'stock-return':        StockReturnCalc,
  'drawdown-recovery':   DrawdownRecoveryCalc,
  // New Health calculators
  'calorie-deficit':     CalorieDeficitCalc,
  'tdee':                TDEECalc,
  'ideal-weight':        IdealWeightCalc,
  'protein-intake':      ProteinIntakeCalc,
  // New Real Estate calculators
  'refinance':           RefinanceCalc,
  'down-payment':        DownPaymentCalc,
  'stamp-duty':          StampDutyCalc,
  'amortization':        AmortizationCalc,
  'gross-rental-yield':  GrossRentalYieldCalc,
  // New Crypto calculators
  'crypto-tax':          CryptoTaxCalc,
  'crypto-position-size': CryptoPositionSizeCalc,
  'staking-rewards':     StakingRewardsCalc,
  'ath-return':          ATHReturnCalc,
  'funding-rate':        FundingRateCalc,
  'btc-savings-plan':    BTCSavingsPlanCalc,
};
