'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Leaf, Sprout, Heart, Target, ChevronDown, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function AdvisorPresentation({ initialEmail }: { initialEmail?: string }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [pyfCommitted, setPyfCommitted] = useState(false);
    const [extraInvestment, setExtraInvestment] = useState(0);
    const [lettersOpened, setLettersOpened] = useState(false);
    const [refreshTick, setRefreshTick] = useState(0);

    const supabase = createClient();

    // 1. Data States
    const [clientData, setClientData] = useState({
        name: "Khách hàng",
        discProfile: "Nhóm S (Nuôi Dưỡng)",
        coreValues: ["Gia đình", "An toàn", "Sức khỏe"],
        emergencyFund: 0,
        debt: 0,
        id: ''
    });

    const [scenario, setScenario] = useState({
        id: '',
        targetAmount: 10000000000,
        targetYears: 15,
        monthlyCashflow: 0,
        initialCapital: 0
    });

    const [actionPlans, setActionPlans] = useState<any[]>([]);

    // 2. Data Fetcher (Aggregate từ 3 bảng mới)
    const fetchData = useCallback(async () => {
        if (!initialEmail) return;
        const { data: profile } = await supabase.from('profiles').select('*').eq('email', initialEmail).single();
        if (!profile) return;

        // Fetch Assets => Aggregate Debt and Liquidity
        const { data: assets } = await supabase.from('client_assets').select('*').eq('user_id', profile.id);
        let totalDebt = 0;
        let totalLiquidity = 0;
        if (assets) {
            assets.forEach((a: any) => {
                if (a.asset_group === 'Nợ') totalDebt += Number(a.amount || 0);
                if (a.asset_group === 'Thanh khoản') totalLiquidity += Number(a.amount || 0);
            });
        }

        setClientData({
            name: profile.full_name || "Khách hàng",
            discProfile: "Nhóm S (Nuôi Dưỡng)",
            coreValues: ["Gia đình", "An toàn", "Sức khỏe"],
            emergencyFund: totalLiquidity,
            debt: totalDebt,
            id: profile.id
        });

        // Fetch Selected Scenario
        const { data: scenarios } = await supabase.from('wealth_scenarios')
            .select('*')
            .eq('user_id', profile.id)
            .eq('is_selected', true)
            .limit(1)
            .single();

        if (scenarios) {
            setScenario({
                id: scenarios.id,
                targetAmount: Number(scenarios.target_amount || 0),
                targetYears: Number(scenarios.target_years || 15),
                monthlyCashflow: Number(scenarios.monthly_cashflow || 0),
                initialCapital: Number(scenarios.initial_capital || 0)
            });
        }

        // Fetch Action Plans
        const { data: plans } = await supabase.from('action_plans')
            .select('*')
            .eq('user_id', profile.id)
            .order('created_at', { ascending: true });

        if (plans) {
            setActionPlans(plans);
        }
    }, [initialEmail, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshTick]);

    // 3. Real-time Listeners trên 3 Bảng
    useEffect(() => {
        if (!clientData.id) return;

        const triggerRefresh = () => setRefreshTick(t => t + 1);

        const channel = supabase.channel('wealth_realtime_linkage')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'client_assets', filter: `user_id=eq.${clientData.id}` }, triggerRefresh)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'wealth_scenarios', filter: `user_id=eq.${clientData.id}` }, triggerRefresh)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'action_plans', filter: `user_id=eq.${clientData.id}` }, triggerRefresh)
            .subscribe()

        return () => {
            supabase.removeChannel(channel);
        }
    }, [clientData.id, supabase]);


    const formatCurrency = (amount: number) => {
        return (amount / 1000000).toLocaleString('vi-VN') + 'Tr';
    }

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(prev => prev + 1);
    };

    const screens = [
        // Màn hình 1: Lời chào Bản Ngã
        <div key="step1" className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <Leaf className="w-12 h-12 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-light text-neutral-800 mb-4">
                    Chào {clientData.name}. Chào mừng đến với Vùng Đất Bình An.
                </h1>
                <p className="text-xl text-neutral-500 font-light mb-12">
                    Chúng tôi biết, đối với {clientData.name}, điều quan trọng nhất là:
                </p>
                <div className="flex justify-center gap-6">
                    {clientData.coreValues.map((val, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.2 + 0.5 }}
                            className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-3"
                        >
                            <Heart className="w-5 h-5 text-emerald-500" />
                            <span className="text-lg font-medium text-neutral-700">{val}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>,

        // Màn hình 2: Dọn dẹp Hoang Vu & PYF (Dữ liệu từ client_assets)
        <div key="step2" className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full text-center"
            >
                <h2 className="text-3xl font-light text-neutral-800 mb-12">Những viên sỏi cần nhặt đi</h2>
                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
                        <p className="text-red-800 text-lg mb-2">Đầm lầy Nợ Cần Xử Lý</p>
                        <h3 className="text-5xl font-semibold text-red-600">{formatCurrency(clientData.debt)}</h3>
                    </div>
                    <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
                        <p className="text-emerald-800 text-lg mb-2">Quỹ phòng thủ Bão tố</p>
                        <h3 className="text-5xl font-semibold text-emerald-600">{formatCurrency(clientData.emergencyFund)}</h3>
                    </div>
                </div>

                {!pyfCommitted ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPyfCommitted(true)}
                        className="bg-neutral-900 text-white px-8 py-4 rounded-full text-lg font-medium flex items-center gap-3 mx-auto shadow-lg hover:bg-neutral-800"
                    >
                        <Shield className="w-6 h-6" />
                        Cam kết Tự vệ Sinh tồn (PYF)
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-600 text-white px-8 py-6 rounded-3xl inline-flex items-center gap-4 shadow-xl"
                    >
                        <CheckCircle2 className="w-8 h-8" />
                        <div className="text-left">
                            <p className="font-semibold text-lg">Đã kích hoạt Lá chắn!</p>
                            <p className="text-emerald-100">Ưu tiên trích lập bảo vệ quỹ phòng thủ trước mọi quyết định.</p>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>,

        // Màn hình 3: Tháp Tài Sản (Cây)
        <div key="step3" className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full text-center"
            >
                <h2 className="text-3xl font-light text-neutral-800 mb-16">Cấu trúc Vùng đất mới</h2>
                <div className="space-y-4">
                    {/* Cành Lá (Đầu tư) */}
                    <motion.div
                        initial={{ width: '60%' }}
                        animate={{ width: pyfCommitted ? '80%' : '60%' }}
                        className="mx-auto bg-green-100 border-2 border-green-200 rounded-t-full h-32 flex items-center justify-center relative overflow-hidden"
                    >
                        {pyfCommitted && (
                            <motion.div
                                initial={{ top: '100%' }}
                                animate={{ top: '-20%' }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute w-full h-[200%] bg-gradient-to-t from-transparent via-green-300 to-transparent opacity-30"
                            />
                        )}
                        <span className="text-green-800 font-medium text-lg z-10">Tầng 3: Trái Ngọt Tăng trưởng</span>
                    </motion.div>

                    {/* Thân cây (Thu nhập) */}
                    <div className="mx-auto w-1/3 bg-amber-100 border-x-2 border-amber-200 h-24 flex items-center justify-center relative">
                        <span className="text-amber-800 font-medium z-10">Tầng 2: Vốn con người</span>
                    </div>

                    {/* Rễ cây (Phòng thủ) */}
                    <div className="mx-auto w-3/4 bg-neutral-200 border-t-2 border-neutral-300 h-20 rounded-b-3xl flex items-center justify-center">
                        <span className="text-neutral-600 font-medium">Tầng 1: Rễ Phòng thủ vững chắc</span>
                    </div>
                </div>
            </motion.div>
        </div>,

        // Màn hình 4: Điều khiển tương lai (Dữ liệu từ wealth_scenarios)
        <div key="step4" className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-light text-neutral-800 mb-8">Kiểm soát {scenario.targetYears} năm Tương lai</h2>
            <div className="bg-white p-8 rounded-3xl w-full border border-neutral-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0"></div>

                <p className="text-lg text-neutral-600 mb-6 text-center relative z-10">
                    Mục tiêu Tài chính: <strong className="text-emerald-600 text-2xl ml-2">{formatCurrency(scenario.targetAmount)}</strong>
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8 text-center relative z-10">
                    <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                        <p className="text-sm text-neutral-500 mb-2">Vốn đầu tư ban đầu</p>
                        <p className="font-bold text-2xl text-neutral-700">{formatCurrency(scenario.initialCapital)}</p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <p className="text-sm text-emerald-700 mb-2">Tích luỹ đều đặn</p>
                        <p className="font-bold text-2xl text-emerald-600">+{formatCurrency(scenario.monthlyCashflow)}/tháng</p>
                    </div>
                </div>

                <div className="border-t pt-8 mt-4">
                    <p className="text-lg text-neutral-600 mb-6 text-center">Nếu bạn nín thở gieo thêm hạt giống mỗi tháng:</p>
                    <div className="flex items-center gap-6 mb-12">
                        <span className="text-xl font-medium text-neutral-400">0đ</span>
                        <input
                            type="range"
                            min="0" max="50" step="5"
                            value={extraInvestment}
                            onChange={(e) => setExtraInvestment(parseInt(e.target.value))}
                            className="w-full h-3 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                        <span className="text-xl font-medium text-emerald-600">+{extraInvestment}Tr</span>
                    </div>

                    <div className="bg-emerald-600 text-white rounded-2xl p-6 text-center shadow-lg transform transition-all">
                        <p className="text-emerald-100 mb-2">Thời gian đạt Tự Do Tài Chính sẽ rút ngắn còn:</p>
                        <h3 className="text-6xl font-light">
                            {Math.max(3, scenario.targetYears - Math.floor(extraInvestment / 5))} <span className="text-2xl">Năm</span>
                        </h3>
                    </div>
                </div>
            </div>
        </div>,

        // Màn hình 5: Thư từ tương lai & Action Plans
        <div key="step5" className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto px-6 pb-20 mt-10">
            {!lettersOpened ? (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setLettersOpened(true)}
                    className="bg-amber-50 border border-amber-200 px-12 py-16 rounded-3xl shadow-md cursor-pointer text-center relative w-full h-64 flex flex-col justify-center items-center"
                >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-4 py-1.5 rounded-full font-medium tracking-wide shadow-sm">BÍ MẬT - ĐỪNG MỞ</div>
                    <Target className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-serif text-amber-900">Một lá thư gửi từ Tương Lai</h3>
                    <p className="text-amber-700 mt-2 italic">Chạm để mở niêm phong</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full space-y-8"
                >
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-neutral-100 relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-t-3xl"></div>
                        <h3 className="text-2xl font-serif text-neutral-800 mb-6 border-b pb-4 mt-2">Ngày 01 Tháng 03 Năm {new Date().getFullYear() + scenario.targetYears}</h3>
                        <p className="text-lg text-neutral-600 leading-relaxed mb-6 font-serif italic">
                            "Chào {clientData.name} của {scenario.targetYears} năm trước,<br /><br />
                            Hôm nay, những mục tiêu tài chính của mình đã thực sự thành hiện thực. Số tiền {formatCurrency(scenario.targetAmount)} mà ta từng ước mơ nay đã nằm ngoan ngoãn trong tài khoản.<br /><br />
                            Cảm ơn cậu đã dũng cảm ưu tiên trả cho bản thân mình trước, và dũng cảm đặt bút bắt đầu hành trình Bình An này.<br /><br />
                            Cậu đã vất vả rồi. Hãy nghỉ ngơi nhẹ nhàng nhé."
                        </p>
                    </div>

                    {/* Dữ liệu Action Plans Checklist */}
                    {actionPlans.length > 0 && (
                        <div className="bg-amber-50/80 p-8 rounded-3xl shadow-sm border border-amber-200/60">
                            <h4 className="text-xl font-medium text-amber-900 mb-6 flex items-center gap-2">
                                <Target className="w-6 h-6 text-amber-600" /> Để bức thư này trở thành hiện thực, bạn cần:
                            </h4>
                            <ul className="space-y-4">
                                {actionPlans.map((plan: any) => (
                                    <li key={plan.id} className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm border border-amber-100">
                                        <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                            ${plan.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300'}`}
                                        >
                                            {plan.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                                        </div>
                                        <div className={plan.status === 'completed' ? 'opacity-50 line-through transition-all' : 'transition-all'}>
                                            <p className="font-medium text-amber-950 text-lg">{plan.task_name}</p>
                                            <div className="flex gap-2 mt-2 items-center text-sm">
                                                <span className="bg-amber-100 px-2 py-0.5 rounded text-amber-800">{plan.category}</span>
                                                {plan.amount_required > 0 && <span className="font-medium text-emerald-700 ml-1">Chuẩn bị: {formatCurrency(plan.amount_required)}</span>}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex justify-center mt-12 pb-10">
                        <button className="bg-emerald-600 text-white px-10 py-5 rounded-full text-xl font-medium shadow-xl hover:bg-emerald-700 hover:shadow-2xl hover:-translate-y-1 transition-all">
                            Ký Xác Nhận Hành Trình Bình An
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    ];

    return (
        <div className="w-full relative pb-32 pt-20">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                >
                    {screens[currentStep]}
                </motion.div>
            </AnimatePresence>

            {/* Điều hướng Next */}
            <div className="fixed bottom-10 left-0 w-full flex justify-center z-50">
                <div className="flex gap-2 bg-white/90 backdrop-blur-md px-6 py-4 rounded-full shadow-lg border border-neutral-100">
                    {screens.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentStep(i)}
                            className={`w-3 h-3 rounded-full transition-all ${currentStep === i ? 'bg-emerald-500 scale-125' : 'bg-neutral-300 hover:bg-neutral-400'}`}
                        />
                    ))}
                    {currentStep < screens.length - 1 && (
                        <button onClick={nextStep} className="ml-6 text-emerald-600 font-medium flex items-center text-sm hover:text-emerald-800 transition-colors">
                            Kế Tiếp <ChevronDown className="w-5 h-5 ml-1 -rotate-90" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
