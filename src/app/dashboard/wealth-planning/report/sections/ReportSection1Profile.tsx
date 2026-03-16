'use client'

import { User, Briefcase, Calendar, Users } from 'lucide-react'
import { MissingDataBanner } from '../WealthReportClient'

const EMPLOYMENT_LABELS: Record<string, string> = {
    salaried: 'Nhân viên / Công chức',
    self_employed: 'Tự do / Freelancer',
    business: 'Chủ doanh nghiệp',
    retired: 'Đã nghỉ hưu',
}

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

function InfoCard({ label, value, icon: Icon, accent = 'emerald' }: any) {
    const colors: Record<string, string> = {
        emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        sky: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
        violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
        amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    }
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${colors[accent]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-white font-bold mt-0.5">{value || '—'}</p>
            </div>
        </div>
    )
}

export function ReportSection1Profile({ profile, scenario }: any) {
    const dob = profile?.date_of_birth
    const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : null

    const missingFields: string[] = []
    if (!dob) missingFields.push('Ngày sinh')
    if (!profile?.occupation) missingFields.push('Nghề nghiệp')
    if (!profile?.risk_profile) missingFields.push('Khẩu vị rủi ro')
    const retirementAge = 65
    const yearsLeft = age ? retirementAge - age : null

    return (
        <div className="space-y-6">
            {missingFields.length > 0 && (
                <MissingDataBanner fields={missingFields} tab="profile" />
            )}
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-sky-400 to-violet-400 rounded-full" />
                <div>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Section 1</p>
                    <h2 className="text-xl font-black text-white">Hồ Sơ Khách Hàng & Mục Tiêu</h2>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InfoCard label="Họ & Tên" value={profile?.full_name} icon={User} accent="sky" />
                <InfoCard label="Ngày Sinh" value={dob ? `${fmtDate(dob)} (${age} tuổi)` : null} icon={Calendar} accent="violet" />
                <InfoCard label="Nghề Nghiệp" value={profile?.occupation} icon={Briefcase} accent="emerald" />
                <InfoCard label="Hình Thức Thu Nhập" value={EMPLOYMENT_LABELS[profile?.employment_type] || profile?.employment_type} icon={Briefcase} accent="amber" />
                <InfoCard label="Người Phụ Thuộc" value={profile?.dependents != null ? `${profile.dependents} người` : null} icon={Users} accent="sky" />
                {age && <InfoCard label="Horizon Tích Lũy" value={`~${yearsLeft} năm`} icon={Calendar} accent="emerald" />}
            </div>

            {/* Goals summary */}
            {scenario && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900/40 to-slate-900/60 border border-emerald-500/20 p-6">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />
                    <div className="relative">
                        <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-3">Mục Tiêu Tài Chính Ưu Tiên</p>
                        <h3 className="text-2xl font-black text-white mb-4">{scenario.plan_name}</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Số Tiền Cần', value: `${(scenario.target_amount / 1_000_000_000).toFixed(1)} Tỷ VNĐ` },
                                { label: 'Thời Hạn', value: `${scenario.target_years} Năm` },
                                { label: 'Lợi Suất Kỳ Vọng', value: `${scenario.expected_return || 10}% / năm` },
                            ].map(item => (
                                <div key={item.label} className="bg-white/5 rounded-xl p-4 text-center">
                                    <p className="text-xs text-white/40 mb-1">{item.label}</p>
                                    <p className="font-black text-white text-lg">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Risk Profile */}
            {profile?.risk_profile && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Khẩu Vị Rủi Ro (Risk Profile)</p>
                        <p className="text-white font-bold capitalize">{profile.risk_profile}</p>
                    </div>
                    {profile.risk_score != null && (
                        <div className="text-right">
                            <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Risk Score</p>
                            <p className="text-2xl font-black text-emerald-400">{profile.risk_score}<span className="text-white/30 text-sm">/100</span></p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
