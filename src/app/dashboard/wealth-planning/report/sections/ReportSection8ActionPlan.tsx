'use client'

import { CheckCircle2, Circle, Trash2 } from 'lucide-react'

const fmtVND = (v: number) => {
    if (!v) return '—'
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} Tỷ`
    if (v >= 1_000_000) return `${Math.round(v / 1_000_000)} Tr`
    return new Intl.NumberFormat('vi-VN').format(v)
}

const MILESTONES = [
    { phase: 'Ngay Bây Giờ', tasks: ['Hoàn tất KYC 4 bước', 'Xem xét và cập nhật bảo hiểm', 'Lập tài khoản chứng khoán (nếu chưa có)'] },
    { phase: 'Tháng 1–3', tasks: ['Thiết lập auto-transfer PYF hàng tháng', 'Quỹ khẩn cấp đạt 3 tháng', 'Dọn dẹp nợ lãi cao (nếu có)'] },
    { phase: 'Tháng 3–6', tasks: ['Review IPS — Tái cân bằng lần 1', 'Check-in tiến độ tháng', 'Quỹ khẩn cấp đạt 6 tháng'] },
    { phase: 'Cuối Năm 1', tasks: ['Net Worth Review', 'So sánh tiến độ vs Target', 'Điều chỉnh kịch bản nếu cần'] },
]

export function ReportSection8ActionPlan({ actionPlans, scenario }: any) {
    const completed = (actionPlans || []).filter((p: any) => p.status === 'completed').length
    const total = (actionPlans || []).length
    const progress = total > 0 ? Math.round(completed / total * 100) : 0

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-teal-400 to-emerald-400 rounded-full" />
                <div>
                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Section 8 — CFP: Action Plan & Implementation</p>
                    <h2 className="text-xl font-black text-white">Kế Hoạch Hành Động & Lộ Trình</h2>
                </div>
            </div>

            {/* Progress overview */}
            {total > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-5">
                    <div className="relative w-16 h-16 shrink-0">
                        <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                            <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="3"
                                strokeDasharray={`${progress} 100`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-black text-emerald-400">{progress}%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-white font-bold">Tiến Độ Checklist</p>
                        <p className="text-white/50 text-sm">{completed}/{total} hành động đã hoàn thành</p>
                    </div>
                </div>
            )}

            {/* Standard milestones */}
            <div className="space-y-4">
                <p className="text-sm font-bold text-white/60 uppercase tracking-wider">Lộ Trình Chuẩn</p>
                {MILESTONES.map(m => (
                    <div key={m.phase} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="px-5 py-3 bg-white/3 border-b border-white/10">
                            <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">{m.phase}</p>
                        </div>
                        <div className="p-4 space-y-2">
                            {m.tasks.map((t, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                                    <Circle className="w-3.5 h-3.5 shrink-0 text-white/20" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Personal tasks */}
            {(actionPlans || []).length > 0 && (
                <div className="space-y-4">
                    <p className="text-sm font-bold text-white/60 uppercase tracking-wider">Phiếu Việc Cá Nhân</p>
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        {actionPlans.map((plan: any, i: number) => (
                            <div key={plan.id} className={`flex items-start gap-3 px-5 py-4 border-b border-white/5 last:border-0 ${plan.status === 'completed' ? 'opacity-50' : ''}`}>
                                {plan.status === 'completed'
                                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    : <Circle className="w-4 h-4 text-white/20 shrink-0 mt-0.5" />}
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${plan.status === 'completed' ? 'line-through text-white/40' : 'text-white/80'}`}>{plan.task_name}</p>
                                    <div className="flex gap-3 mt-1">
                                        <span className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded">{plan.category}</span>
                                        {plan.amount_required > 0 && <span className="text-[10px] text-emerald-400 font-semibold">{fmtVND(plan.amount_required)}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Disclaimer */}
            <div className="bg-white/3 border border-white/5 rounded-xl p-4 text-xs text-white/30 leading-relaxed">
                <p><strong className="text-white/40">Lưu ý:</strong> Báo cáo này được tạo tự động dựa trên thông tin khách hàng cung cấp và mang tính tham khảo. Không thay thế tư vấn tài chính chuyên nghiệp được cấp phép. Khuyến nghị đầu tư có rủi ro. Kết quả thực tế có thể khác với dự phóng.</p>
            </div>
        </div>
    )
}
