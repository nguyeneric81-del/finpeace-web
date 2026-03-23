'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, LogOut, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const ClarityTab   = dynamic(() => import('./_components/ClarityTab'),   { loading: () => <Loading/> })
const BlueprintTab = dynamic(() => import('./_components/BlueprintTab'), { loading: () => <Loading/> })
const AutoPilotTab = dynamic(() => import('./_components/AutoPilotTab'), { loading: () => <Loading/> })
const ThongTinTab  = dynamic(() => import('./_components/ThongTinTab'),  { loading: () => <Loading/> })

function Loading() {
  return <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-[#c4a67a] w-6 h-6"/></div>
}

const MAIN_TABS = [
  { id: 'trading',  label: '💹 Trading Plan' },
  { id: 'finance',  label: '🌿 Tài chính cá nhân' },
  { id: 'thongtin', label: '📚 Thông tin' },
]

const TRADING_SUBTABS = [
  { id: 'clarity',   label: 'Clarity',   desc: 'Funnel: News → LP → Leads' },
  { id: 'blueprint', label: 'Blueprint',  desc: 'Trading Plans & Signals' },
  { id: 'autopilot', label: 'AutoPilot',  desc: 'Deal Monitoring' },
]

export default function AdminConsolidatedPage() {
  const [user, setUser] = useState<any>(null)
  const [mainTab, setMainTab] = useState('trading')
  const [tradingSubTab, setTradingSubTab] = useState('clarity')
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('advisor_user')
    if (!stored) { router.push('/advisor/login'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'admin') { router.push('/advisor/dashboard'); return }
    setUser(u)
  }, [router])

  async function handleLogout() {
    sessionStorage.removeItem('advisor_user')
    await fetch('/api/advisor/logout', { method: 'POST' })
    router.push('/advisor/login')
  }

  if (!user) return (
    <div className="min-h-screen bg-[#0d1119] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#c4a67a] w-8 h-8"/>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d1119] text-slate-100" style={{fontFamily:"'Be Vietnam Pro',system-ui,sans-serif"}}>

      {/* Navbar */}
      <nav className="sticky top-0 z-10 bg-[#0a0f1c]/90 backdrop-blur-md border-b border-[#1e2535]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-emerald-400"/>
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">FinPeace Admin</p>
              <p className="text-[10px] text-slate-500 leading-tight">{user.email}</p>
            </div>
          </div>

          {/* Main tab navigation */}
          <div className="hidden md:flex gap-1 bg-[#111827] border border-[#1e2535] rounded-xl p-1">
            {MAIN_TABS.map(tab => (
              <button key={tab.id} onClick={() => setMainTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mainTab === tab.id ? 'bg-[#c4a67a] text-[#0d1119]' : 'text-slate-400 hover:text-white hover:bg-[#1e2535]'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <button onClick={handleLogout} className="text-slate-500 hover:text-white flex items-center gap-1.5 text-sm">
            <LogOut className="w-4 h-4"/>
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>

        {/* Mobile main tabs */}
        <div className="md:hidden flex gap-1 bg-[#111827] border-t border-[#1e2535] p-2">
          {MAIN_TABS.map(tab => (
            <button key={tab.id} onClick={() => setMainTab(tab.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${mainTab === tab.id ? 'bg-[#c4a67a] text-[#0d1119]' : 'text-slate-400'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── TAB: TRADING PLAN ── */}
        {mainTab === 'trading' && (
          <div>
            {/* Sub-tab bar */}
            <div className="flex gap-2 mb-6">
              {TRADING_SUBTABS.map(sub => (
                <button key={sub.id} onClick={() => setTradingSubTab(sub.id)}
                  className={`flex flex-col items-start px-5 py-3 rounded-xl border transition-all text-left ${tradingSubTab === sub.id ? 'border-[#c4a67a]/60 bg-[#c4a67a]/10' : 'border-[#1e2535] bg-[#111827] hover:border-[#2a3548]'}`}>
                  <span className={`font-bold text-sm ${tradingSubTab === sub.id ? 'text-[#c4a67a]' : 'text-white'}`}>{sub.label}</span>
                  <span className="text-slate-500 text-xs mt-0.5">{sub.desc}</span>
                </button>
              ))}
            </div>

            {tradingSubTab === 'clarity'   && <ClarityTab/>}
            {tradingSubTab === 'blueprint' && <BlueprintTab/>}
            {tradingSubTab === 'autopilot' && <AutoPilotTab/>}
          </div>
        )}

        {/* ── TAB: TÀI CHÍNH CÁ NHÂN ── */}
        {mainTab === 'finance' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-[#1e2535] rounded-2xl p-6 text-center">
              <p className="text-3xl mb-3">🌿</p>
              <h3 className="text-white font-bold text-lg mb-2">Tài chính cá nhân</h3>
              <p className="text-slate-400 text-sm">Quản trị các tham số giao diện Financial Planning</p>
              <p className="text-slate-600 text-xs mt-2">Anh sẽ bổ sung chi tiết sau — đang chờ spec</p>
            </div>
          </div>
        )}

        {/* ── TAB: THÔNG TIN ── */}
        {mainTab === 'thongtin' && <ThongTinTab/>}
      </div>
    </div>
  )
}
