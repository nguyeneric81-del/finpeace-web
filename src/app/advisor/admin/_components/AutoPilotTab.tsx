'use client'
export default function AutoPilotTab() {
  return (
    <div className="space-y-6">
      {/* Coming soon banner */}
      <div className="bg-[#111827] border border-[#c4a67a]/30 rounded-2xl p-6 text-center">
        <p className="text-3xl mb-3">🤖</p>
        <h3 className="text-white font-bold text-lg mb-2">AutoPilot — Deal Monitoring</h3>
        <p className="text-slate-400 text-sm mb-1">Theo dõi performance thực tế các deal khách đang hold</p>
        <p className="text-slate-600 text-xs">Phase 1 (CSV-based) đang phát triển · Phase 2: KBSV API Q2/2026</p>
      </div>

      {/* Mockup sections */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon:'🔴', label:'Active Deals', desc:'Ticker · Entry · Giá hiện tại · P&L %', status:'Đang xây dựng' },
          { icon:'⚠️', label:'Cần Can Thiệp', desc:'SL sắp chạm / TP gần tới / Lệch plan > 15%', status:'Đang xây dựng' },
          { icon:'📈', label:'Performance', desc:'Win Rate · Profit Factor · Per ticker/client', status:'Đang xây dựng' },
        ].map(s=>(
          <div key={s.label} className="bg-[#111827] border border-[#1e2535] rounded-2xl p-5">
            <p className="text-2xl mb-2">{s.icon}</p>
            <p className="text-white font-semibold text-sm">{s.label}</p>
            <p className="text-slate-500 text-xs mt-1 mb-3">{s.desc}</p>
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">{s.status}</span>
          </div>
        ))}
      </div>

      <div className="bg-[#111827] border border-[#1e2535] rounded-2xl p-5">
        <p className="text-white font-semibold mb-3 text-sm">🔄 Plan Deviation Log</p>
        <p className="text-slate-500 text-xs">Map lệnh thực vs Blueprint — phát hiện FOMO Buy, Revenge Trading, Chốt lời sớm</p>
        <p className="text-slate-600 text-xs mt-2">Kết nối sau khi upload CSV lịch sử lệnh KBSV</p>
      </div>
    </div>
  )
}
