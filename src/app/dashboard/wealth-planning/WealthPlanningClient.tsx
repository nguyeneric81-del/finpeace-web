'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { KYCGate } from '@/components/wealth-planning/KYCGate'
import { PortfolioReview } from '@/components/wealth-planning/PortfolioReview'
import { ScenarioManager } from '@/components/wealth-planning/ScenarioManager'
import { ActionPlanManager } from '@/components/wealth-planning/ActionPlanManager'
import { CheckInModal } from '@/components/wealth-planning/CheckInModal'
import { motion } from 'framer-motion'
import { LayoutDashboard, Sparkles, Map, Rocket, CalendarCheck, ArrowLeft, Settings, FileText, Zap } from 'lucide-react'
import Link from 'next/link'

type Screen = 'loading' | 'kyc' | 'dashboard' | 'future' | 'action'

const SCREENS = [
    { id: 'dashboard', label: 'Nhận Diện Tài Chính', icon: LayoutDashboard, step: 1 },
    { id: 'future', label: 'Thiết Kế Tương Lai', icon: Map, step: 2 },
    { id: 'action', label: 'Kế Hoạch Hành Động', icon: Rocket, step: 3 },
]

// Type for financial plan state passed between screens
export type FinancialPlan = {
    goalName: string
    targetAmount: number
    timelineYears: number
    initialCapital: number
    expectedReturn: number
    requiredMonthlySaving: number
    scenarioType: 'safe' | 'balanced' | 'growth'
}

export function WealthPlanningClient({ user, profile }: { user: any; profile: any }) {
    const supabase = createClient()
    const [screen, setScreen] = useState<Screen>('loading')
    const [showCheckIn, setShowCheckIn] = useState(false)
    const [financialPlan, setFinancialPlan] = useState<FinancialPlan | null>(null)

    useEffect(() => {
        checkKYCStatus()
    }, [])

    async function checkKYCStatus() {
        const { data } = await supabase
            .from('advisor_users')
            .select('kyc_completed')
            .eq('auth_user_id', user.id)
            .maybeSingle()

        if (data?.kyc_completed) {
            setScreen('dashboard')
        } else {
            // Fallback: check if they have cashflow data (for existing users before KYC flag)
            const { data: cashflow } = await supabase
                .from('client_cashflow')
                .select('annual_income')
                .eq('user_id', user.id)
                .maybeSingle()

            if (cashflow?.annual_income > 0) {
                // Mark existing users as KYC completed
                await supabase.from('advisor_users').update({ kyc_completed: true }).eq('auth_user_id', user.id)
                setScreen('dashboard')
            } else {
                setScreen('kyc')
            }
        }
    }

    async function loadFinancialPlan() {
        const res = await fetch(`/api/wealth/plan?user_id=${user.id}`)
        const { plan } = await res.json()
        if (plan) {
            setFinancialPlan({
                goalName: plan.goal_name,
                targetAmount: plan.target_amount,
                timelineYears: plan.timeline_years,
                initialCapital: plan.initial_capital,
                expectedReturn: plan.expected_return,
                requiredMonthlySaving: plan.required_monthly_saving,
                scenarioType: plan.scenario_type || 'balanced'
            })
        }
    }

    const handleKYCComplete = () => {
        setScreen('dashboard')
    }

    const handlePlanCommit = async (plan: FinancialPlan) => {
        setFinancialPlan(plan)
        // Save to Supabase
        await fetch('/api/wealth/plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                goal_name: plan.goalName,
                target_amount: plan.targetAmount,
                timeline_years: plan.timelineYears,
                initial_capital: plan.initialCapital,
                expected_return: plan.expectedReturn,
                required_monthly_saving: plan.requiredMonthlySaving,
                scenario_type: plan.scenarioType
            })
        })
        setScreen('action')
    }

    // KYC screen — full page takeover
    if (screen === 'kyc') {
        return <KYCGate userId={user.id} onComplete={handleKYCComplete} />
    }

    // Loading
    if (screen === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 text-sm">Đang tải kế hoạch...</p>
                </div>
            </div>
        )
    }

    const currentStep = SCREENS.find(s => s.id === screen)?.step || 1

    return (
        <div className="flex-1 min-h-screen bg-transparent">
            {/* Top Nav */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        {/* Left: Back + Title */}
                        <div className="flex items-center gap-3">
                            <a href="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <ArrowLeft className="w-4 h-4 text-slate-600" />
                            </a>
                            <div>
                                <h1 className="text-sm font-bold text-slate-800">Kế Hoạch Tài Chính</h1>
                                <p className="text-xs font-medium text-slate-500">{profile?.full_name || user.email?.split('@')[0]}</p>
                            </div>
                        </div>

                        {/* Center: Progress Steps */}
                        <div className="hidden md:flex items-center gap-1">
                            {SCREENS.map((s, idx) => {
                                const Icon = s.icon
                                const isActive = screen === s.id
                                const isDone = currentStep > s.step
                                return (
                                    <div key={s.id} className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                if (isDone || isActive) setScreen(s.id as Screen)
                                                if (s.id === 'action') loadFinancialPlan()
                                            }}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-emerald-100 text-emerald-800 shadow-sm' : isDone ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 cursor-default'}`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            {s.label}
                                        </button>
                                        {idx < SCREENS.length - 1 && (
                                            <div className={`w-4 h-px ${isDone ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Right: buttons */}
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard/wealth-planning/simulator"
                                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-all shadow-sm">
                                <Zap className="w-3.5 h-3.5" />
                                Simulator
                            </Link>
                            <Link href="/dashboard/wealth-planning/report"
                                className="flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-800 border border-violet-200 hover:border-violet-300 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-all shadow-sm">
                                <FileText className="w-3.5 h-3.5" />
                                Báo Cáo CFP
                            </Link>
                            <button
                                onClick={() => setShowCheckIn(true)}
                                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 bg-white hover:border-emerald-200 px-3 py-1.5 rounded-lg transition-all shadow-sm"
                            >
                                <CalendarCheck className="w-3.5 h-3.5" />
                                Check-in
                            </button>
                            <Link href="/dashboard/wealth-planning/profile" className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-transparent shadow-sm" title="Cập nhật hồ sơ CFP">
                                <Settings className="w-4 h-4 text-slate-500" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    key={screen}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {screen === 'dashboard' && (
                        <PortfolioReview
                            userId={user.id}
                            onNavigateToScenarios={() => setScreen('future')}
                        />
                    )}

                    {screen === 'future' && (
                        <ScenarioManager
                            userId={user.id}
                            onNavigateToActionPlan={() => setScreen('action')}
                            onPlanCommit={handlePlanCommit}
                        />
                    )}

                    {screen === 'action' && (
                        <ActionPlanManager
                            userId={user.id}
                            financialPlan={financialPlan}
                        />
                    )}
                </motion.div>
            </div>

            {/* Check-in Modal */}
            {showCheckIn && (
                <CheckInModal
                    userId={user.id}
                    onClose={() => setShowCheckIn(false)}
                    onSaved={() => {
                        setShowCheckIn(false)
                        // Refresh dashboard if on dashboard
                        if (screen === 'dashboard') window.location.reload()
                    }}
                />
            )}
        </div>
    )
}
