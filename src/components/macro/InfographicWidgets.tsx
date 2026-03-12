'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ── Stat Card (số to, màu gradient) ──────────────────────────────────────────
export function StatCard({
  value, label, sub, positive = true, unit = ''
}: {
  value: string; label: string; sub?: string; positive?: boolean; unit?: string;
}) {
  const color = positive ? 'emerald' : 'red';
  return (
    <div className={`bg-${color}-900/10 border border-${color}-500/20 rounded-2xl p-5 flex flex-col gap-1`}>
      <span className={`text-4xl font-black text-${color}-400 leading-none`}>
        {value}<span className="text-xl font-semibold ml-1 opacity-70">{unit}</span>
      </span>
      <span className="text-sm font-bold text-white/80 mt-1">{label}</span>
      {sub && <span className="text-xs text-slate-400">{sub}</span>}
    </div>
  );
}

// ── Mini Trend Chart (Recharts) ───────────────────────────────────────────────
export function MiniTrendChart({
  data, dataKey, color = '#34d399', label
}: {
  data: { name: string; value: number }[];
  dataKey?: string;
  color?: string;
  label: string;
}) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{label}</p>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8', fontSize: 11 }}
            itemStyle={{ color: color, fontWeight: 700 }}
          />
          <Area type="monotone" dataKey={dataKey ?? 'value'} stroke={color} fill={`url(#grad-${color})`} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
