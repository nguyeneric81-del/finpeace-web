'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Info, CheckCircle2, Skull } from 'lucide-react'

interface RealEstateStressTestProps {
    ticker: string
    inventoryValue: number  // Giá trị hàng tồn kho (Tỷ VNĐ) VD: 130000
    cashAndEquiv: number    // Tiền mặt (Tỷ VNĐ) VD: 5000
    shortTermDebt: number   // Nợ ngắn hạn (Tỷ VNĐ) VD: 30000
    totalDebt: number       // Tổng nợ vay (Tỷ VNĐ) VD: 60000
    totalEquity: number     // Vốn chủ sở hữu sổ sách (Tỷ VNĐ) VD: 40000
    sharesOutstanding: number // Số lượng CP lưu hành (Triệu) VD: 1950
    currentPrice: number    // Giá hiện hành (VNĐ) VD: 16500
}

export default function RealEstateStressTest({
    ticker = 'NVL',
    inventoryValue = 130000,
    cashAndEquiv = 5000,
    shortTermDebt = 30000,
    totalDebt = 60000,
    totalEquity = 40000,
    sharesOutstanding = 1950,
    currentPrice = 16500
}: RealEstateStressTestProps) {
    const [legalFreeze, setLegalFreeze] = useState<number>(0)       // 0 - 100%
    const [priceDiscount, setPriceDiscount] = useState<number>(0)   // 0 - 50%
    const [interestShock, setInterestShock] = useState<number>(0)   // 0 - 10%
    const [targetPB, setTargetPB] = useState<number>(1.2)           // P/B target 0.5 - 3.0

    const [adjustedEquity, setAdjustedEquity] = useState<number>(totalEquity)
    const [animateValue, setAnimateValue] = useState<number>(totalEquity)
    const [remainingCash, setRemainingCash] = useState<number>(cashAndEquiv)

    const [lossLegal, setLossLegal] = useState<number>(0)
    const [lossDiscount, setLossDiscount] = useState<number>(0)
    const [lossInterest, setLossInterest] = useState<number>(0)

    useEffect(() => {
        // Tồn kho kẹt pháp lý coi như bị "đóng băng" không tạo tiền, triết khấu 1 phần rủi ro vào Vốn chủ.
        // Trong Stress test này, phần tồn kho kẹt pháp lý bị chiết khấu thẳng 70% giá trị do bán giải chấp khó khăn.
        const frozenAmount = inventoryValue * (legalFreeze / 100)
        const illiquidPenalty = frozenAmount * 0.7 
        
        // Phần tồn kho còn lại có thể bán được thì bị cắt máu giảm giá
        const usableInventory = inventoryValue - frozenAmount
        const discountPenalty = usableInventory * (priceDiscount / 100)

        // Lãi suất vay tăng bào mòn thẳng vào tiền mặt và vốn chủ
        const interestPenalty = totalDebt * (interestShock / 100)

        setLossLegal(illiquidPenalty)
        setLossDiscount(discountPenalty)
        setLossInterest(interestPenalty)

        setAdjustedEquity(totalEquity - illiquidPenalty - discountPenalty - interestPenalty)
        setRemainingCash(cashAndEquiv - interestPenalty)
    }, [legalFreeze, priceDiscount, interestShock, inventoryValue, totalDebt, totalEquity, cashAndEquiv])

    // Smooth counter animation
    useEffect(() => {
        const step = (adjustedEquity - animateValue) / 10
        if (Math.abs(adjustedEquity - animateValue) > 50) {
            const timer = setTimeout(() => {
                setAnimateValue(prev => prev + step)
            }, 16)
            return () => clearTimeout(timer)
        } else {
            setAnimateValue(adjustedEquity)
        }
    }, [adjustedEquity, animateValue])

    const formatVND = (val: number) => {
        return Math.round(val).toLocaleString('vi-VN') + ' Tỷ'
    }

    const formatPrice = (val: number) => {
        return Math.round(val).toLocaleString('vi-VN') + ' đ'
    }

    const isBankrupt = adjustedEquity <= 0
    const isIlliquid = remainingCash <= 0

    // Liquidity Ratio (Thanh khoản sinh tồn)
    const liquidityRatio = shortTermDebt > 0 ? (remainingCash / shortTermDebt) : 999 

    // P/B Valuation Logic
    const projectedBVPS = Math.max((adjustedEquity * 1000000000) / (sharesOutstanding * 1000000), 0)
    const fairPrice = projectedBVPS * targetPB
    
    // Smooth fair price animation
    const [animateFairPrice, setAnimateFairPrice] = useState<number>(fairPrice)
    useEffect(() => {
        const step = (fairPrice - animateFairPrice) / 10
        if (Math.abs(fairPrice - animateFairPrice) > 50) {
            const timer = setTimeout(() => {
                setAnimateFairPrice(prev => prev + step)
            }, 16)
            return () => clearTimeout(timer)
        } else {
            setAnimateFairPrice(fairPrice)
        }
    }, [fairPrice, animateFairPrice])

    const upside = currentPrice > 0 ? ((animateFairPrice - currentPrice) / currentPrice) * 100 : 0

    return (
        <div 
            className="rounded-2xl p-6 my-6 relative overflow-hidden flex flex-col gap-6"
            style={{ 
                background: 'linear-gradient(145deg, rgba(30,41,59,0.4), rgba(15,23,42,0.8))',
                border: '1.5px solid rgba(148,163,184,0.15)',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
            }}
        >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                        <span className="text-2xl">🏢</span>
                        Real Estate Stress Test ({ticker})
                    </h3>
                    <p className="text-slate-400 text-sm">
                        Đóng băng quỹ đất và giả định viễn cảnh giảm giá xả hàng trả nợ Trái phiếu.
                    </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-2 shrink-0">
                    <p className="text-slate-400 text-xs font-medium mb-0.5">Vốn Chủ (Book Value) Ban đầu</p>
                    <p className="text-slate-200 font-bold text-lg tracking-wide">{formatVND(totalEquity)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Sliders Control Panel */}
                <div className="flex flex-col gap-5 bg-black/20 rounded-xl p-5 border border-white/5">
                    
                    {/* Pháp lý Slider */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-slate-300 font-semibold text-sm">
                                Kẹt Pháp Lý / Đóng băng dự án
                            </label>
                            <span 
                                className="text-xl font-bold tabular-nums"
                                style={{ color: legalFreeze === 0 ? '#10B981' : '#F59E0B' }}
                            >
                                {legalFreeze}%
                            </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mb-3">Dự án không ra sổ, đình chỉ thi công vô thời hạn.</p>
                        <input 
                            type="range" min="0" max="100" step="5"
                            value={legalFreeze}
                            onChange={(e) => setLegalFreeze(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                    </div>

                    <div className="w-full h-px bg-slate-700/50 mt-1"></div>

                    {/* Price Discount Slider */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-slate-300 font-semibold text-sm">
                                Khuyến mãi / Cắt máu giải tồn kho
                            </label>
                            <span 
                                className="text-xl font-bold tabular-nums"
                                style={{ color: priceDiscount === 0 ? '#10B981' : '#EF4444' }}
                            >
                                -{priceDiscount}%
                            </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mb-3">Đại hạ giá để bán được hàng trên công trường còn sống.</p>
                        <input 
                            type="range" min="0" max="50" step="5"
                            value={priceDiscount}
                            onChange={(e) => setPriceDiscount(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                    </div>

                    <div className="w-full h-px bg-slate-700/50 mt-1"></div>

                    {/* Interest Shock Slider */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-slate-300 font-semibold text-sm">
                                Cú Sốc Lãi Suất (Nợ vay)
                            </label>
                            <span 
                                className="text-xl font-bold tabular-nums"
                                style={{ color: interestShock === 0 ? '#10B981' : '#8B5CF6' }}
                            >
                                +{interestShock}%
                            </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mb-3">Lãi suất huy động tăng vọt đè lên ngực các khoản vay cũ.</p>
                        <input 
                            type="range" min="0" max="10" step="1"
                            value={interestShock}
                            onChange={(e) => setInterestShock(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>
                </div>

                {/* Impact Results Panel */}
                <div 
                    className="rounded-xl p-5 border flex flex-col transition-colors duration-500 relative overflow-hidden"
                    style={{
                        borderColor: isBankrupt ? 'rgba(239, 68, 68, 0.4)' : adjustedEquity < totalEquity*0.5 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.2)',
                        background: isBankrupt ? 'rgba(239, 68, 68, 0.1)' : adjustedEquity < totalEquity*0.5 ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                    }}
                >
                    <div className="absolute top-4 right-4">
                        {isBankrupt ? <Skull className="w-8 h-8 text-red-500 opacity-60" /> : adjustedEquity < totalEquity*0.5 ? <AlertTriangle className="w-6 h-6 text-amber-500 opacity-60" /> : <CheckCircle2 className="w-6 h-6 text-emerald-500 opacity-60" />}
                    </div>

                    <div className="space-y-3 mb-4 flex-1">
                         <div className="flex justify-between items-center bg-black/20 p-2 rounded border border-white/5">
                            <span className="text-amber-400/80 text-xs font-semibold uppercase">Tổn thất Kẹt Pháp lý</span>
                            <span className="text-white font-mono text-sm">{lossLegal > 0 ? `-${formatVND(lossLegal)}` : '0 Tỷ'}</span>
                        </div>
                         <div className="flex justify-between items-center bg-black/20 p-2 rounded border border-white/5">
                            <span className="text-red-400/80 text-xs font-semibold uppercase">Mất mát Hạ giá</span>
                            <span className="text-white font-mono text-sm">{lossDiscount > 0 ? `-${formatVND(lossDiscount)}` : '0 Tỷ'}</span>
                        </div>
                         <div className="flex justify-between items-center bg-black/20 p-2 rounded border border-white/5">
                            <span className="text-purple-400/80 text-xs font-semibold uppercase">Lãi phạt bồi thêm</span>
                            <span className="text-white font-mono text-sm">{lossInterest > 0 ? `-${formatVND(lossInterest)}` : '0 Tỷ'}</span>
                        </div>
                    </div>
                    
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: isBankrupt ? '#FCA5A5' : '#94A3B8' }}>RNAV HIỆU CHỈNH SAU SỐC</p>
                        <motion.p 
                            className="text-4xl font-black tabular-nums tracking-tight"
                            style={{ color: isBankrupt ? '#EF4444' : '#10B981' }}
                        >
                            {isBankrupt ? '-' : ''}{formatVND(Math.abs(animateValue))}
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* P/B Valuation Panel & Survival Gauge */}
            <div className="bg-black/30 border border-indigo-500/20 rounded-xl p-5 mt-2">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* PB / Liquidity Display */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-indigo-300 font-semibold text-sm">
                                    Định Giá Thanh Lý Bắt Buộc (P/B {targetPB.toFixed(2)}x)
                                </label>
                                <span className="text-sm font-bold text-indigo-400">
                                    BVPS Mới: <span className="text-md text-white tabular-nums">{formatPrice(projectedBVPS)}</span>
                                </span>
                            </div>
                            <input 
                                type="range" min="0.5" max="3" step="0.1"
                                value={targetPB}
                                onChange={(e) => setTargetPB(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>
                        
                        <div className="mt-4 flex items-center gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                            <div className="flex-1">
                                <p className="text-xs text-slate-400 mb-1">Thanh Khoản Sinh Tồn (Tiền / Nợ ngắn):</p>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full" 
                                        style={{ 
                                            width: `${Math.min(liquidityRatio * 100, 100)}%`,
                                            backgroundColor: liquidityRatio < 0.2 ? '#ef4444' : liquidityRatio < 0.5 ? '#f59e0b' : '#10b981'
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-white w-12 text-right">
                                {liquidityRatio.toFixed(2)}x
                            </span>
                        </div>
                    </div>

                    {/* Fair Price Display */}
                    <div className="w-full md:w-1/3 shrink-0 flex flex-col justify-center items-end bg-indigo-950/30 p-4 rounded-lg border border-indigo-500/20">
                        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">Mức Giá Mua Thâu Tóm</p>
                        <div className="flex items-baseline gap-2">
                            <motion.span 
                                className="text-3xl font-black tabular-nums tracking-tight text-white mb-1"
                            >
                                {formatPrice(animateFairPrice)}
                            </motion.span>
                        </div>
                        <div className={`text-sm font-bold flex items-center gap-1 ${upside >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {upside >= 0 ? '▲ Biên An Toàn' : '▼ Hố Boom'} {Math.abs(upside).toFixed(1)}%
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Thị giá gốc: {formatPrice(currentPrice)}</p>
                    </div>
                </div>
            </div>

            {/* AI Insight Insight */}
            <div className={`border rounded-xl p-4 flex gap-3 ${isBankrupt ? 'bg-red-500/10 border-red-500/20' : isIlliquid ? 'bg-amber-500/10 border-amber-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                <Info className={`w-5 h-5 shrink-0 mt-0.5 ${isBankrupt ? 'text-red-400' : isIlliquid ? 'text-amber-400' : 'text-indigo-400'}`} />
                <p className={`text-sm leading-relaxed ${isBankrupt ? 'text-red-200/90' : isIlliquid ? 'text-amber-200' : 'text-indigo-200/80'}`}>
                    {isBankrupt 
                        ? <strong>🚨 Âm Vốn Chủ Sở Hữu! Công ty này về mặt sổ sách đã phá sản. Toàn bộ tiền nằm trong gạch đá kẹt pháp lý.</strong>
                        : isIlliquid 
                            ? <strong>🚨 Khô máu thanh khoản! Tiền mặt đã bốc hơi sạch để trả lãi. Sẽ phải gán nợ dự án hoặc tái cơ cấu.</strong>
                            : "Giá trị sổ sách bị chiết khấu nặng nhưng doanh nghiệp vẫn cầm cự được dư nợ. Biên an toàn dương là cơ hội nhặt xác."}
                </p>
            </div>
        </div>
    )
}
