'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { ArrowLeft, Printer, FileText, Shield, TrendingUp, Target, BarChart3, Compass, ClipboardList, User, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

// ── Section components
import { ReportSection1Profile } from './sections/ReportSection1Profile'
import { ReportSection2NetWorth } from './sections/ReportSection2NetWorth'
import { ReportSection3CashFlow } from './sections/ReportSection3CashFlow'
import { ReportSection4HealthRatios } from './sections/ReportSection4HealthRatios'
import { ReportSection5Goals } from './sections/ReportSection5Goals'
import { ReportSection6Risk } from './sections/ReportSection6Risk'
import { ReportSection7IPS } from './sections/ReportSection7IPS'
import { ReportSection8ActionPlan } from './sections/ReportSection8ActionPlan'
import { ReportCoverPage } from './sections/ReportCoverPage'

/** Inline banner shown in a report section when required data is missing */
export function MissingDataBanner({ fields, tab }: { fields: string[], tab: 'profile' | 'cashflow' | 'insurance' }) {
    const tabLabels: Record<string, string> = { profile: 'Cá Nhân', cashflow: 'Dòng Tiền', insurance: 'Bảo Hiểm & Rủi Ro' }
    return (
        <div className="flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 shadow-sm rounded-2xl px-5 py-4 mb-4">
            <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-sm text-amber-700">
                    Thiếu dữ liệu: <span className="font-bold">{fields.join(', ')}</span>
                </p>
            </div>
            <Link href={`/dashboard/wealth-planning/profile?tab=${tab}`}
                className="shrink-0 text-xs font-bold text-amber-600 hover:text-amber-700 border border-amber-300 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap">
                Cập nhật → Tab "{tabLabels[tab]}"
            </Link>
        </div>
    )
}

const SECTIONS = [
    { id: 'cover', label: 'Bìa', icon: FileText },
    { id: 's1', label: 'S1: Hồ Sơ', icon: User },
    { id: 's2', label: 'S2: Net Worth', icon: BarChart3 },
    { id: 's3', label: 'S3: Dòng Tiền', icon: TrendingUp },
    { id: 's4', label: 'S4: Sức Khoẻ', icon: Compass },
    { id: 's5', label: 'S5: Mục Tiêu', icon: Target },
    { id: 's6', label: 'S6: Rủi Ro', icon: Shield },
    { id: 's7', label: 'S7: IPS', icon: ClipboardList },
    { id: 's8', label: 'S8: Hành Động', icon: Target },
]

export function WealthReportClient({ user, profile }: { user: any; profile: any }) {
    const supabase = createClient()
    const printRef = useRef<HTMLDivElement>(null)

    const [assets, setAssets] = useState<any[]>([])
    const [cashflow, setCashflow] = useState<any>(null)
    const [scenario, setScenario] = useState<any>(null)
    const [snapshots, setSnapshots] = useState<any[]>([])
    const [insurance, setInsurance] = useState<any[]>([])
    const [actionPlans, setActionPlans] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeSection, setActiveSection] = useState('cover')
    const generatedDate = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

    useEffect(() => { fetchAllData() }, [])

    async function fetchAllData() {
        setLoading(true)
        const [a, c, sc, sn, ins, ap] = await Promise.all([
            supabase.from('client_assets').select('*').eq('user_id', user.id),
            supabase.from('client_cashflow').select('*').eq('user_id', user.id).single(),
            supabase.from('wealth_scenarios').select('*').eq('user_id', user.id).eq('is_selected', true).order('created_at', { ascending: false }).limit(1).single(),
            supabase.from('financial_snapshots').select('*').eq('user_id', user.id).order('snapshot_date', { ascending: true }).limit(12),
            supabase.from('client_insurance').select('*').eq('user_id', user.id),
            supabase.from('action_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
        ])
        setAssets(a.data || [])
        setCashflow(c.data)
        setScenario(sc.data)
        setSnapshots(sn.data || [])
        setInsurance(ins.data || [])
        setActionPlans(ap.data || [])
        setLoading(false)
    }

    const handlePrint = () => window.print()

    const sharedProps = { profile, assets, cashflow, scenario, snapshots, insurance, actionPlans, generatedDate }

    if (loading) return (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
            <div className="flex items-center gap-3 text-slate-500 font-medium">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
                Đang tải báo cáo CFP...
            </div>
        </div>
    )

    const renderSection = () => {
        switch (activeSection) {
            case 'cover': return <ReportCoverPage {...sharedProps} />
            case 's1': return <ReportSection1Profile {...sharedProps} />
            case 's2': return <ReportSection2NetWorth {...sharedProps} />
            case 's3': return <ReportSection3CashFlow {...sharedProps} />
            case 's4': return <ReportSection4HealthRatios {...sharedProps} />
            case 's5': return <ReportSection5Goals {...sharedProps} />
            case 's6': return <ReportSection6Risk {...sharedProps} />
            case 's7': return <ReportSection7IPS {...sharedProps} />
            case 's8': return <ReportSection8ActionPlan {...sharedProps} />
            default: return null
        }
    }

    return (
        <div className="min-h-screen bg-transparent">
            {/* Top nav */}
            <div className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-slate-200 print:hidden">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/wealth-planning" className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 text-sm font-bold transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Kế hoạch tài chính
                        </Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-800 font-bold text-sm">Báo Cáo Tổng Thể</span>
                    </div>
                    <button onClick={handlePrint}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
                        <Printer className="w-4 h-4" /> In / Xuất PDF
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
                {/* Sidebar nav */}
                <aside className="w-44 shrink-0 print:hidden">
                    <div className="sticky top-20 space-y-1">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 px-2">Mục Lục Report</p>
                        {SECTIONS.map(s => {
                            const Icon = s.icon
                            return (
                                <button key={s.id} onClick={() => setActiveSection(s.id)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${activeSection === s.id ? 'bg-white text-emerald-600 border border-slate-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent hover:border-slate-300'}`}>
                                    <Icon className="w-3.5 h-3.5 shrink-0" /> {s.label}
                                </button>
                            )
                        })}
                    </div>
                </aside>

                {/* Main report content */}
                <main className="flex-1 min-w-0" ref={printRef}>
                    <motion.div key={activeSection} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                        {renderSection()}
                    </motion.div>

                    {/* Navigation arrows */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 print:hidden">
                        {SECTIONS.findIndex(s => s.id === activeSection) > 0 && (
                            <button onClick={() => setActiveSection(SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) - 1].id)}
                                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-black text-sm transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                {SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) - 1].label}
                            </button>
                        )}
                        {SECTIONS.findIndex(s => s.id === activeSection) < SECTIONS.length - 1 && (
                            <button onClick={() => setActiveSection(SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) + 1].id)}
                                className="ml-auto flex items-center gap-2 text-emerald-600 hover:text-emerald-500 text-sm font-black transition-colors">
                                {SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) + 1].label}
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </button>
                        )}
                    </div>
                </main>
            </div>

            {/* Print styles */}
            <style jsx global>{`
                @media print {
                    body { background: white !important; color: black !important; }
                    .print\\:hidden { display: none !important; }
                    @page { margin: 1.5cm; size: A4; }
                }
            `}</style>
        </div>
    )
}
