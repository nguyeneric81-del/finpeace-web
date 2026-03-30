'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Info, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react'

interface ValuationSliderProps {
    ticker: string
    basePrice: number     // Giá khi tăng trưởng ở mức cơ bản (VD: 111000)
    baseGrowth: number    // Tăng trưởng cơ bản (VD: 10%)
    multiplier: number    // Mức độ nhạy (VD: 1600 VND cho mỗi 1% tăng trưởng)
    currentPrice: number  // Giá fallback nếu không fetch được
}

export default function ValuationSlider({
    ticker = 'FPT',
    basePrice = 111000,
    baseGrowth = 10,
    multiplier = 1600,
    currentPrice: fallbackPrice = 130000
}: ValuationSliderProps) {
    const [growth, setGrowth] = useState<number>(baseGrowth)
    const [fairValue, setFairValue] = useState<number>(basePrice)
    const [animateValue, setAnimateValue] = useState<number>(basePrice)
    const [livePrice, setLivePrice] = useState<number>(fallbackPrice)
    const [priceDate, setPriceDate] = useState<string | null>(null)
    const [priceLoading, setPriceLoading] = useState(true)

    // Fetch live price on mount
    useEffect(() => {
        async function fetchPrice() {
            setPriceLoading(true)
            try {
                const res = await fetch(`/api/stock-price?ticker=${ticker}`)
                const data = await res.json()
                if (data.price && data.price > 0) {
                    setLivePrice(data.price)
                    setPriceDate(data.date)
                }
            } catch { /* fallback to prop */ }
            setPriceLoading(false)
        }
        fetchPrice()
    }, [ticker])

    const currentPrice = livePrice

    // Calculate Fair Value based on growth
    useEffect(() => {
        const calculated = basePrice + (growth - baseGrowth) * multiplier
        setFairValue(calculated)
    }, [growth, basePrice, baseGrowth, multiplier])

    // Smooth counter animation effect
    useEffect(() => {
        const step = (fairValue - animateValue) / 10
        if (Math.abs(fairValue - animateValue) > 500) {
            const timer = setTimeout(() => {
                setAnimateValue(prev => prev + step)
            }, 16)
            return () => clearTimeout(timer)
        } else {
            setAnimateValue(fairValue)
        }
    }, [fairValue, animateValue])

    const formatVND = (val: number) => {
        return Math.round(val).toLocaleString('vi-VN') + ' đ'
    }

    const marginOfSafety = ((fairValue - currentPrice) / currentPrice) * 100
    const isOvervalued = fairValue < currentPrice

    return (
        <div 
            className="rounded-2xl p-6 my-6 relative overflow-hidden flex flex-col gap-6"
            style={{ 
                background: 'linear-gradient(145deg, rgba(30,41,59,0.4), rgba(15,23,42,0.8))',
                border: '1.5px solid rgba(148,163,184,0.15)',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
            }}
        >
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                        <span className="text-2xl">🎛️</span>
                        Bộ Giả Lập Định Giá DCF ({ticker})
                    </h3>
                    <p className="text-slate-400 text-sm">
                        Kết quả định giá phụ thuộc hoàn toàn vào niềm tin tăng trưởng của bạn.
                    </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-2 shrink-0">
                    <p className="text-slate-400 text-xs font-medium mb-0.5 flex items-center gap-1.5">
                        Giá trị trường hiện tại
                        {priceLoading && <RefreshCw className="w-3 h-3 animate-spin text-slate-500" />}
                        {priceDate && !priceLoading && (
                            <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-full font-semibold">
                                Live · {priceDate}
                            </span>
                        )}
                    </p>
                    <p className="text-slate-200 font-bold text-lg">{formatVND(currentPrice)}</p>
                </div>
            </div>

            {/* Slider Control */}
            <div className="bg-black/20 rounded-xl p-5 border border-white/5 space-y-5">
                <div className="flex justify-between items-end">
                    <label className="text-slate-300 font-semibold text-sm">
                        Tốc độ tăng trưởng doanh thu dự phóng (5 năm tới)
                    </label>
                    <span 
                        className="text-2xl font-black tabular-nums"
                        style={{ color: growth >= 20 ? '#10B981' : growth <= 10 ? '#EF4444' : '#F59E0B' }}
                    >
                        {growth}% / năm
                    </span>
                </div>
                
                <div className="relative pt-2 pb-6">
                    <input 
                        type="range" 
                        min="0" 
                        max="30" 
                        step="1"
                        value={growth}
                        onChange={(e) => setGrowth(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="absolute top-10 left-0 right-0 flex justify-between text-xs text-slate-500 font-medium px-1">
                        <span>0% (Suy thoái)</span>
                        <span>15% (Ổn định)</span>
                        <span>30% (Siêu tốc)</span>
                    </div>
                </div>
            </div>

            {/* Dashboard Results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fair Value Gauge */}
                <div 
                    className="rounded-xl p-5 border flex flex-col items-center justify-center text-center transition-colors duration-500 relative overflow-hidden"
                    style={{
                        borderColor: isOvervalued ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                        background: isOvervalued ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                    }}
                >
                    <div className="absolute top-3 left-3">
                        {isOvervalued ? (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: isOvervalued ? '#FCA5A5' : '#6EE7B7' }}>
                        Giá Trị Nội Tại Tính Toán
                    </p>
                    <motion.p 
                        className="text-4xl font-black tabular-nums tracking-tight"
                        style={{ color: isOvervalued ? '#EF4444' : '#10B981' }}
                    >
                        {formatVND(animateValue)}
                    </motion.p>
                </div>

                {/* Margin of Safety */}
                <div 
                    className="rounded-xl p-5 border bg-slate-800/30 border-slate-700/50 flex flex-col justify-center"
                >
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Biên An Toàn (Margin of Safety)</p>
                    <div className="flex items-baseline gap-2">
                        <span 
                            className="text-3xl font-black tabular-nums"
                            style={{ color: marginOfSafety > 0 ? '#10B981' : '#EF4444' }}
                        >
                            {marginOfSafety > 0 ? '+' : ''}{marginOfSafety.toFixed(1)}%
                        </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-2 italic">
                        {marginOfSafety < -10 
                            ? "Cổ phiếu đang được định giá quá cao so với kịch bản này. Rủi ro sụt giảm mạnh." 
                            : marginOfSafety < 10 
                            ? "Thị trường đang định giá hợp lý với kịch bản tăng trưởng này."
                            : "Biên an toàn tuyệt vời. Cơ hội tích sản hấp dẫn."}
                    </p>
                </div>
            </div>

            {/* AI Insight */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex gap-3 mt-2">
                <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-indigo-200/80 text-sm leading-relaxed">
                    <strong>Góc nhìn VVIA:</strong> Để {ticker} thực sự xứng đáng với thị giá {formatVND(currentPrice)} hiện nay trên sàn, tập đoàn buộc phải duy trì tốc độ tăng trưởng kép (CAGR) chạm mốc <strong>{Math.ceil(baseGrowth + (currentPrice - basePrice)/multiplier)}%</strong> liên tục trong 5 năm tới. Hãy tự hỏi: Với quy mô Vốn hóa hiện tại, tỷ lệ này liệu có khả thi?
                </p>
            </div>
        </div>
    )
}
