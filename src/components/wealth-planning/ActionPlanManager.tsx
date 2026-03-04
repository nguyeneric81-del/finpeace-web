'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Target, TrendingUp, AlertCircle, CheckCircle2, Compass, ShieldAlert, ArrowRight, Wallet, Percent, PiggyBank, Maximize2 } from 'lucide-react'

// Các Type định dạng dữ liệu
type ActionPlan = {
    id: string; category: string; task_name: string; amount_required: number; status: string;
}

type Scenario = {
    id: string; plan_name: string; initial_capital: number; monthly_cashflow: number; target_amount: number; target_years: number; expected_return: number; is_selected: boolean;
}

type Asset = {
    id: string; asset_name: string; asset_group: string; amount: number; is_liquid: boolean; risk_level: number;
}

type Cashflow = {
    annual_income: number; annual_expense: number; annual_saving: number; surplus_ratio: number;
}

export function ActionPlanManager({ userId }: { userId: string }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)

    // Data State
    const [scenario, setScenario] = useState<Scenario | null>(null)
    const [assets, setAssets] = useState<Asset[]>([])
    const [cashflow, setCashflow] = useState<Cashflow | null>(null)
    const [plans, setPlans] = useState<ActionPlan[]>([])

    // Form State (To-do list cũ)
    const [category, setCategory] = useState('Tái cấu trúc rủi ro')
    const [task, setTask] = useState('')
    const [amount, setAmount] = useState('')

    // 4. Lấy Trading Plans từ API mới cập nhật
    const [tradingPlans, setTradingPlans] = useState<any[]>([])

    useEffect(() => {
        async function fetchTradingPlans() {
            const res = await fetch(`/api/advisor/portfolio?user_id=${userId}`)
            if (!res.ok) return
            const data = await res.json()
            if (data.result?.matched_plans) {
                setTradingPlans(data.result.matched_plans)
            }
        }
        fetchTradingPlans()
    }, [userId])

    useEffect(() => {
        fetchAllData()
    }, [userId])

    async function fetchAllData() {
        setLoading(true)
        const [scenRes, assetRes, cashRes, planRes] = await Promise.all([
            // Lấy kịch bản đã chốt (is_selected = true) mới nhất
            supabase.from('wealth_scenarios').select('*').eq('user_id', userId).eq('is_selected', true).order('created_at', { ascending: false }).limit(1).single(),
            supabase.from('client_assets').select('*').eq('user_id', userId),
            supabase.from('client_cashflow').select('*').eq('user_id', userId).single(),
            supabase.from('action_plans').select('*').eq('user_id', userId).order('created_at', { ascending: true })
        ])

        if (scenRes.data) setScenario(scenRes.data)
        if (assetRes.data) setAssets(assetRes.data)
        if (cashRes.data) setCashflow(cashRes.data)
        if (planRes.data) setPlans(planRes.data)

        setLoading(false)
    }

    // --- Xử lý To-do List (Giữ lại chức năng cũ bổ trợ) ---
    async function handleAddPlan(e: React.FormEvent) {
        e.preventDefault()
        const { error } = await supabase.from('action_plans').insert({
            user_id: userId, category: category, task_name: task, amount_required: Number(amount) || 0, status: 'pending'
        })
        if (!error) { setTask(''); setAmount(''); fetchAllData(); }
    }

    async function handleToggleStatus(id: string, currentStatus: string) {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
        await supabase.from('action_plans').update({ status: newStatus }).eq('id', id)
        fetchAllData()
    }
    async function handleDelete(id: string) {
        await supabase.from('action_plans').delete().eq('id', id)
        fetchAllData()
    }

    if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 bg-slate-100 rounded-xl" /><div className="h-64 bg-slate-100 rounded-xl" /></div>

    if (!scenario) {
        return (
            <Card className="border-dashed border-2 border-slate-200 bg-slate-50">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <Compass className="w-12 h-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">Chưa có Kịch bản nào được chốt</h3>
                    <p className="text-slate-500 mt-2 max-w-sm">Hãy quay lại Tab "Thiết Kế Tương Lai", thiết lập Ước mơ và chọn "Chốt Kịch Bản Này" để xem Kế Hoạch Hành Động.</p>
                </CardContent>
            </Card>
        )
    }

    // --- Tính toán Logic Phân tích ---

    // 1. Phân tích Vốn
    const liquidAssets = assets.filter(a => a.asset_group === 'Thanh khoản' || a.asset_group === 'Tích lũy & Đầu tư').reduce((sum, a) => sum + Number(a.amount || 0), 0)
    const capitalShortfall = scenario.initial_capital > liquidAssets ? scenario.initial_capital - liquidAssets : 0

    // 2. Phân tích Dòng tiền
    const currentMonthlySaving = cashflow ? cashflow.annual_saving / 12 : 0
    const monthlyShortfall = scenario.monthly_cashflow > currentMonthlySaving ? scenario.monthly_cashflow - currentMonthlySaving : 0

    // 3. La bàn Đầu tư (Khuyến nghị Danh mục)
    let riskProfile = ''
    let recommendedAssets: string[] = []

    if (scenario.expected_return < 8) {
        riskProfile = 'Thận Trọng (An Toàn Lên Ngôi)'
        recommendedAssets = ['Tiền gửi Tiết kiệm kỳ hạn dài', 'Trái phiếu Doanh nghiệp top đầu', 'Chứng chỉ quỹ Trái phiếu']
    } else if (scenario.expected_return <= 12) {
        riskProfile = 'Cân Bằng (Tăng Trưởng Bền Vững)'
        recommendedAssets = ['50% Tiền gửi & Trái phiếu', '50% Chứng chỉ quỹ Cổ phiếu hoặc Cổ phiếu Bluechip (VN30)', 'Có thể tích sản Vàng']
    } else {
        riskProfile = 'Bứt Phá (Đầu Tư Mạo Hiểm)'
        recommendedAssets = ['Khởi nghiệp kinh doanh', 'Cổ phiếu Vốn hóa Vừa/Nhỏ (Midcap/Penny) tiềm năng', 'Bất động sản dòng tiền/lãi vốn vùng ven']
    }

    const fmtVND = (val: number) => new Intl.NumberFormat('vi-VN').format(val || 0) + ' ₫'

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* PHẦN 1: NGỌN HẢI ĐĂNG (MỤC TIÊU) */}
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                <CardHeader>
                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                        <Target className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-wider">Ngọn Hải Đăng Của Bạn</span>
                    </div>
                    <CardTitle className="text-2xl text-emerald-900">{scenario.plan_name || 'Mục tiêu Tài chính Chưa Đặt Tên'}</CardTitle>
                    <CardDescription className="text-emerald-700/80 text-base">
                        Hành trình vạn dặm bắt đầu từ mục tiêu đạt <strong>{fmtVND(scenario.target_amount)}</strong> trong vòng <strong>{scenario.target_years} năm</strong> tới.
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* PHẦN 1.1: CHIẾN LƯỢC GIAO DỊCH CỔ PHIẾU (Premium Design) */}
            {tradingPlans.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 tracking-tight">Kế hoạch Giao dịch Cổ phiếu</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {tradingPlans.map((plan: any, idx) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="overflow-hidden border-emerald-100 shadow-xl shadow-emerald-900/5 hover:shadow-emerald-900/10 transition-all duration-300">
                                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 flex justify-between items-center text-white">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/20 backdrop-blur-md text-white font-black text-xl px-4 py-1.5 rounded-xl border border-white/30 shadow-inner">
                                                {plan.ticker}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-lg leading-tight">{plan.company_name || plan.ticker}</span>
                                                <div className="flex gap-2 mt-1">
                                                    {plan.wave_index && (
                                                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider backdrop-blur-md border ${plan.wave_index.toLowerCase().includes('trending')
                                                            ? 'bg-amber-400/20 border-amber-400 text-amber-100'
                                                            : 'bg-white/10 border-white/20 text-white/80'
                                                            }`}>
                                                            {plan.wave_index}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] text-white/60 uppercase font-black tracking-widest mb-0.5">Chiến lược</p>
                                            <p className="text-sm font-bold bg-white/15 px-3 py-1 rounded-lg border border-white/10">{plan.strategy_name}</p>
                                        </div>
                                    </div>

                                    <CardContent className="p-0">
                                        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                                            {/* Left: Key Metrics (2 cols) */}
                                            <div className="lg:col-span-2 p-6 bg-slate-50/50 border-r border-slate-100 space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="group relative">
                                                        <p className="text-[10px] text-slate-400 font-black uppercase mb-1.5 tracking-tighter">Vùng mua</p>
                                                        <p className="text-xl font-black text-slate-800 tracking-tight">{plan.entry_zone}</p>
                                                        <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-emerald-500 rounded-full"></div>
                                                    </div>
                                                    <div className="group relative">
                                                        <p className="text-[10px] text-rose-400 font-black uppercase mb-1.5 tracking-tighter">Cắt lỗ (SL)</p>
                                                        <p className="text-xl font-black text-rose-700 tracking-tight">{plan.stop_loss}</p>
                                                        <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-rose-500 rounded-full"></div>
                                                    </div>
                                                    <div className="group relative">
                                                        <p className="text-[10px] text-emerald-400 font-black uppercase mb-1.5 tracking-tighter">Chốt lời (TP)</p>
                                                        <p className="text-xl font-black text-emerald-700 tracking-tight">{plan.take_profit}</p>
                                                        <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-emerald-500 rounded-full"></div>
                                                    </div>
                                                    <div className="group relative">
                                                        <p className="text-[10px] text-slate-400 font-black uppercase mb-1.5 tracking-tighter">Tỉ lệ R:R</p>
                                                        <p className="text-xl font-black text-slate-800 tracking-tight">{plan.risk_reward}</p>
                                                        <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-slate-800 rounded-full"></div>
                                                    </div>
                                                </div>

                                                {plan.area_symmetry_note && (
                                                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                                                            <Compass className="w-12 h-12 text-amber-900" />
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-2 relative z-10">
                                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                                                            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Logic Area Symmetry</span>
                                                        </div>
                                                        <p className="text-sm text-amber-900 leading-relaxed font-medium relative z-10">{plan.area_symmetry_note}</p>
                                                    </div>
                                                )}

                                                {plan.analyst_note && (
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Luận điểm của Advisor</p>
                                                        <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-4">{plan.analyst_note}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right: Chart Image (3 cols) */}
                                            <div className="lg:col-span-3 p-6 flex flex-col justify-center">
                                                {plan.chart_image_url ? (
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Đồ thị phân tích kỹ thuật</p>
                                                            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                                                                <Maximize2 className="w-3 h-3" /> Nhấn để xem chi tiết
                                                            </span>
                                                        </div>
                                                        <div className="rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/10 border border-slate-100 group cursor-zoom-in relative">
                                                            <img
                                                                src={plan.chart_image_url}
                                                                alt={`Analysis for ${plan.ticker}`}
                                                                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-full min-h-[200px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50">
                                                        <p className="text-slate-400 text-sm italic">Đang cập nhật đồ thị...</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* PHẦN 2: CHIẾN LƯỢC HUY ĐỘNG VỐN (HÀNH ĐỘNG) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                    <CardHeader className="bg-blue-50/30 pb-4 border-b">
                        <div className="flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-blue-600" />
                            <CardTitle className="text-lg">Chiến Lược Vốn Ban Đầu</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-end border-b pb-3 border-dashed">
                            <div>
                                <p className="text-sm text-slate-500">Kịch bản yêu cầu</p>
                                <p className="text-xl font-bold text-blue-900">{fmtVND(scenario.initial_capital)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500">Tài sản hiện có</p>
                                <p className="text-lg font-semibold text-slate-700">{fmtVND(liquidAssets)}</p>
                            </div>
                        </div>

                        {capitalShortfall > 0 ? (
                            <div className="bg-amber-50 text-amber-900 p-4 rounded-lg flex gap-3 text-sm">
                                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                                <div>
                                    <p className="font-semibold mb-1">Thiếu hụt {fmtVND(capitalShortfall)}</p>
                                    <p className="text-amber-800/80">Bạn cần bán bớt tài sản Tiêu dùng hoặc vay mượn thêm để đủ số vốn ban đầu theo như Kịch bản đã chọn, nếu không hãy tính toán lại thời gian.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-50 text-emerald-900 p-4 rounded-lg flex gap-3 text-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <div>
                                    <p className="font-semibold mb-1">Vốn mồi đã sẵn sàng!</p>
                                    <p className="text-emerald-800/80">Quỹ tài sản hiện hữu của bạn hoàn toàn đủ để khởi động Kịch bản này. Bước tiếp theo là dịch chuyển tiền vào đúng Danh mục.</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="bg-indigo-50/30 pb-4 border-b">
                        <div className="flex items-center gap-2">
                            <PiggyBank className="w-5 h-5 text-indigo-600" />
                            <CardTitle className="text-lg">Kỷ Luật Góp Hàng Tháng</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-end border-b pb-3 border-dashed">
                            <div>
                                <p className="text-sm text-slate-500">Kịch bản yêu cầu</p>
                                <p className="text-xl font-bold text-indigo-900">{fmtVND(scenario.monthly_cashflow)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500">Thặng dư hiện tại</p>
                                <p className="text-lg font-semibold text-slate-700">{fmtVND(currentMonthlySaving)}</p>
                            </div>
                        </div>

                        {monthlyShortfall > 0 ? (
                            <div className="bg-rose-50 text-rose-900 p-4 rounded-lg flex gap-3 text-sm">
                                <TrendingUp className="w-5 h-5 text-rose-600 shrink-0" />
                                <div>
                                    <p className="font-semibold mb-1">Cần gia tăng {fmtVND(monthlyShortfall)} /tháng</p>
                                    <p className="text-rose-800/80">Kịch bản này đòi hỏi mức Kỷ luật cao hơn thói quen hiện tại. Lời khuyên: Cắt giảm ngân sách ở Nhóm Tiêu Dùng, hoặc tìm cách tăng Thu Nhập ngay lập tức.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-50 text-emerald-900 p-4 rounded-lg flex gap-3 text-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <div>
                                    <p className="font-semibold mb-1">Kỷ luật rất tốt!</p>
                                    <p className="text-emerald-800/80">Mức thặng dư hàng tháng của bạn hoàn toàn đáp ứng được Kịch bản này mà không phải hi sinh chất lượng cuộc sống hiện tại.</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* PHẦN 3: LA BÀN ĐẦU TƯ (LIÊN KẾT RỦI RO) */}
            <Card className="shadow-sm border-blue-200">
                <CardHeader className="bg-blue-50/50">
                    <div className="flex items-center gap-2 text-blue-800 mb-1">
                        <Compass className="w-5 h-5" />
                        <span className="font-bold text-sm uppercase tracking-wider">La Bàn Đầu Tư</span>
                    </div>
                    <CardTitle>Khuyến nghị thiết lập Danh mục Tư Duy</CardTitle>
                    <CardDescription>
                        Để đạt được mức lãi suất <strong>{scenario.expected_return}%/năm</strong>, bạn phải chấp nhận khẩu vị rủi ro: <strong className="text-blue-700">{riskProfile}</strong>.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="bg-slate-50 p-6 rounded-xl border space-y-4">
                        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Percent className="w-4 h-4 text-emerald-600" />
                            Các kênh tài sản phù hợp để rót vốn:
                        </h4>
                        <ul className="space-y-3">
                            {recommendedAssets.map((asset, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-700">
                                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">{idx + 1}</span>
                                    {asset}
                                </li>
                            ))}
                        </ul>

                        {scenario.expected_return > 12 && (
                            <div className="mt-6 bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3 text-sm text-amber-900 items-start">
                                <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
                                <p><strong>Lưu ý Bình An Tài Chính:</strong> Kịch bản này có biên độ dao động rất mạnh! Hãy kiểm tra lại ở Tab 2 xem bạn đã có đủ <strong>Quỹ Khẩn Cấp (ít nhất 6 tháng)</strong> và <strong>Bảo hiểm Y tế</strong> chưa trước khi dồn tiền vào đây.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* PHẦN 4: TO-DO LIST BỔ TRỢ CŨ */}
            <div className="relative pt-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white/50 px-4 text-xs font-semibold uppercase text-slate-400">Ghi chú Hành động Cụ thể</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-90">
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-4 border-b bg-slate-50/50">
                        <CardTitle className="text-base text-slate-700">Thêm Phiếu Việc Làm</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleAddPlan} className="space-y-4">
                            <div className="space-y-2">
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm" value={category} onChange={e => setCategory(e.target.value)}>
                                    <option value="Tái cấu trúc nợ">Cắt Nợ Tiêu Dùng / Trả Vay</option>
                                    <option value="Lập quỹ">Xây Quỹ Khẩn Cấp</option>
                                    <option value="Đầu tư">Đầu tư vào Danh Mục Đề Xuất</option>
                                    <option value="Khác">Hành động Khác</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Input required value={task} onChange={e => setTask(e.target.value)} placeholder="Tên việc cần làm, VD: Bán vàng mua CCQ..." className="h-10" />
                            </div>
                            <div className="space-y-2">
                                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Số tiền tương ứng (nếu có)" className="h-10" />
                            </div>
                            <Button type="submit" variant="outline" className="w-full text-slate-700 h-10">Lưu Việc Này</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-4 border-b bg-slate-50/50">
                        <CardTitle className="text-base text-slate-700">Checklist Thực Thi</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 max-h-[250px] overflow-y-auto">
                        {plans.length === 0 ? <p className="text-slate-400 text-sm italic text-center py-8">Chưa có nhiệm vụ nào được ghi chú.</p> : (
                            <div className="space-y-2">
                                {plans.map(p => (
                                    <div key={p.id} className={`flex items-start gap-3 p-3 rounded-md border text-sm ${p.status === 'completed' ? 'bg-slate-50 opacity-60' : 'bg-white'}`}>
                                        <button onClick={() => handleToggleStatus(p.id, p.status)} className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${p.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                                            {p.status === 'completed' && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium ${p.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-700'}`}>{p.task_name}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 bg-slate-100 rounded">{p.category}</span>
                                                {p.amount_required > 0 && <span className="text-[11px] font-semibold text-emerald-600">{fmtVND(p.amount_required)}</span>}
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 leading-none p-1 shrink-0">✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
