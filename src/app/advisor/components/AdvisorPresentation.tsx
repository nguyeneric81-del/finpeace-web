'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Leaf, Sprout, Heart, Target, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function AdvisorPresentation() {
    const [currentStep, setCurrentStep] = useState(0);
    const [pyfCommitted, setPyfCommitted] = useState(false);
    const [extraInvestment, setExtraInvestment] = useState(0);
    const [lettersOpened, setLettersOpened] = useState(false);

    // Dữ liệu mô phỏng Khách hàng (Đáng lẽ lấy từ DB)
    const clientData = {
        name: "Chị Lan",
        discProfile: "Nhóm S (Nuôi Dưỡng)",
        coreValues: ["Gia đình", "An toàn", "Sức khỏe"],
        emergencyFund: 15000000,
        debt: 500000000,
    };

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

        // Màn hình 2: Dọn dẹp Hoang Vu & PYF
        <div key="step2" className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full text-center"
            >
                <h2 className="text-3xl font-light text-neutral-800 mb-12">Những viên sỏi cần nhặt đi</h2>
                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
                        <p className="text-red-800 text-lg mb-2">Đầm lầy Nợ Xấu</p>
                        <h3 className="text-4xl font-semibold text-red-600">500Tr</h3>
                    </div>
                    <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
                        <p className="text-emerald-800 text-lg mb-2">Quỹ phòng thủ Bão tố</p>
                        <h3 className="text-4xl font-semibold text-emerald-600">15Tr</h3>
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
                            <p className="text-emerald-100">10% thu nhập sẽ được ưu tiên bảo vệ bạn trước.</p>
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
                    <div className="mx-auto w-1/3 bg-amber-100 border-x-2 border-amber-200 h-24 flex items-center justify-center">
                        <span className="text-amber-800 font-medium">Tầng 2: Vốn con người</span>
                    </div>

                    {/* Rễ cây (Phòng thủ) */}
                    <div className="mx-auto w-3/4 bg-neutral-200 border-t-2 border-neutral-300 h-20 rounded-b-3xl flex items-center justify-center">
                        <span className="text-neutral-600 font-medium">Tầng 1: Rễ Phòng thủ vững chắc</span>
                    </div>
                </div>
            </motion.div>
        </div>,

        // Màn hình 4: Điều khiển tương lai
        <div key="step4" className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-light text-neutral-800 mb-12">Quyền kiểm soát tương lai</h2>
            <div className="bg-white p-8 rounded-3xl w-full border border-neutral-200 shadow-sm">
                <p className="text-lg text-neutral-600 mb-6 text-center">Nếu mỗi tháng bạn gieo thêm mầm sống:</p>
                <div className="flex items-center gap-6 mb-12">
                    <span className="text-xl font-medium text-neutral-400">0đ</span>
                    <input
                        type="range"
                        min="0" max="10" step="1"
                        value={extraInvestment}
                        onChange={(e) => setExtraInvestment(parseInt(e.target.value))}
                        className="w-full h-3 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <span className="text-xl font-medium text-emerald-600">+{extraInvestment}Tr</span>
                </div>

                <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-neutral-100">
                    <p className="text-neutral-500 mb-2">Đích đến Tự Do Tài Chính sẽ rút ngắn còn:</p>
                    <h3 className="text-5xl font-light text-emerald-600">
                        {Math.max(3, 15 - extraInvestment)} <span className="text-2xl">Năm</span>
                    </h3>
                </div>
            </div>
        </div>,

        // Màn hình 5: Thư từ tương lai
        <div key="step5" className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto px-6">
            {!lettersOpened ? (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setLettersOpened(true)}
                    className="bg-amber-50 border border-amber-200 px-12 py-16 rounded-lg shadow-md cursor-pointer text-center relative"
                >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1 rounded-full">Bí Mật</div>
                    <Target className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-serif text-amber-900">Một lá thư gửi từ Tương Lai</h3>
                    <p className="text-amber-700 mt-2">Chạm để mở</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-10 rounded-2xl shadow-xl border border-neutral-100 w-full"
                >
                    <h3 className="text-2xl font-serif text-neutral-800 mb-6 border-b pb-4">Ngày 01 Tháng 03 Năm 2036</h3>
                    <p className="text-lg text-neutral-600 leading-relaxed mb-6 font-serif italic">
                        "Chào {clientData.name} của 10 năm trước,<br /><br />
                        Hôm nay, gia đình ta đã dọn vào ngôi nhà mới. Các con đều đã khôn lớn và đi học đầy đủ bằng chính quỹ giáo dục mà cậu đã kiên trì gieo hạt từ lúc khó khăn nhất.<br /><br />
                        Cảm ơn cậu đã dũng cảm đối mặt với khoản nợ ngày đó, dũng cảm ưu tiên trả cho bản thân mình trước, và dũng cảm đặt bút bắt đầu hành trình Bình An này.<br /><br />
                        Cậu đã làm rất tốt. Hãy nghỉ ngơi nhẹ nhàng nhé."
                    </p>
                    <div className="pt-6 border-t flex justify-center mt-10">
                        <button className="bg-emerald-600 text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg hover:bg-emerald-700 transition-colors">
                            Ký Xác Nhận Bản Kế Hoạch Này
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
                <div className="flex gap-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow border border-neutral-100">
                    {screens.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentStep(i)}
                            className={`w-3 h-3 rounded-full transition-colors ${currentStep === i ? 'bg-emerald-500' : 'bg-neutral-300'}`}
                        />
                    ))}
                    {currentStep < screens.length - 1 && (
                        <button onClick={nextStep} className="ml-4 text-emerald-600 font-medium flex items-center text-sm">
                            Tiếp <ChevronDown className="w-4 h-4 ml-1 -rotate-90" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
