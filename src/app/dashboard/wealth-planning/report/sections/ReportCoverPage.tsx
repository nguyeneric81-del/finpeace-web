'use client'

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

export function ReportCoverPage({ profile, cashflow, scenario, generatedDate }: any) {
    const fullName = profile?.full_name || 'Khách Hàng'
    const age = profile?.date_of_birth
        ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
        : null

    return (
        <div className="relative overflow-hidden rounded-3xl min-h-[560px] bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 border border-slate-200 shadow-sm flex flex-col justify-between p-10 print:bg-white print:border-gray-200">
            {/* Background orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-sky-500/10 blur-3xl" />

            {/* Logo area */}
            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                        <span className="text-emerald-600 font-black text-xl">F</span>
                    </div>
                    <div>
                        <p className="text-slate-800 font-black text-lg tracking-tight">FinPeace</p>
                        <p className="text-slate-500 text-xs">Personal Financial Planning</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-slate-400 text-xs">Ngày lập</p>
                    <p className="text-slate-700 text-sm font-bold">{generatedDate}</p>
                </div>
            </div>

            {/* Main content */}
            <div className="relative text-center py-12">
                <p className="text-emerald-700 text-sm font-black uppercase tracking-[0.2em] mb-4">Kế Hoạch Tài Chính Cá Nhân Toàn Diện</p>
                <h1 className="text-5xl font-black text-slate-800 mb-3">{fullName}</h1>
                {age && <p className="text-slate-600 text-lg">{age} tuổi · {profile?.occupation || 'Chuyên gia tài chính'}</p>}

                <div className="mt-10 inline-flex items-center gap-8 bg-white border border-slate-200 shadow-sm rounded-2xl px-10 py-5">
                    {scenario && (
                        <div className="text-center">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Mục Tiêu Chính</p>
                            <p className="text-slate-800 font-bold">{scenario.plan_name}</p>
                        </div>
                    )}
                    {scenario && <div className="w-px h-10 bg-slate-200" />}
                    {scenario && (
                        <div className="text-center">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Horizon</p>
                            <p className="text-slate-800 font-bold">{scenario.target_years} Năm</p>
                        </div>
                    )}
                    {age && <div className="w-px h-10 bg-slate-200" />}
                    {age && (
                        <div className="text-center">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Tuổi Hưu Dự Kiến</p>
                            <p className="text-slate-800 font-bold">{scenario ? age + scenario.target_years : 65} tuổi</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="relative flex items-center justify-between border-t border-slate-200 pt-6">
                <p className="text-slate-400 font-medium text-xs">
                    Chuẩn: CFP Board · ISO 22222:2005 · FPSB Global
                </p>
                <p className="text-slate-400 font-medium text-xs">Bảo mật · Chỉ dành cho khách hàng</p>
            </div>
        </div>
    )
}

