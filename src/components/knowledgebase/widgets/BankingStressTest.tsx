'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Info, CheckCircle2, Skull } from 'lucide-react'

interface BankingStressTestProps {
    ticker: string
    coreProfit: number      // Lợi nhuận HĐKD trước dự phòng (Tỷ VNĐ) VD: 38000
    totalLoan: number       // Tổng dư nợ tính bằng Tỷ VNĐ VD: 600000
    baseCASA: number        // Tỷ lệ CASA gốc (VD: 38.0)
    baseNPL: number         // Tỷ lệ nợ xấu gốc (VD: 2.0)
    baseLLR: number         // Tỉ lệ bao phủ gốc (VD: 95.0)
    costOfFundsGap: number  // Mỗi 1% CASA giảm, chi phí vốn tăng thêm (Quy ra Tỷ VNĐ cho mỗi 1% huy động).
                             // VD: Với huy động 600k tỷ, chênh lệch giữa lãi CASA & Tiết kiệm là ~4% => 1% CASA giảm tốn 600k * 1% * 4% = 240 tỷ.
}

export default function BankingStressTest({
    ticker = 'MBB',
    coreProfit = 38000,
    totalLoan = 600000,
    baseCASA = 38.0,
    baseNPL = 2.0,
    baseLLR = 95.0,
    costOfFundsGap = 240
}: BankingStressTestProps) {
    const [casaChange, setCasaChange] = useState<number>(0) // Từ -20 đến 10
    const [nplChange, setNplChange] = useState<number>(0)   // Từ 0 đến 5

    const [finalProfit, setFinalProfit] = useState<number>(coreProfit)
    const [animateValue, setAnimateValue] = useState<number>(coreProfit)

    const [costIncrease, setCostIncrease] = useState<number>(0)
    const [provisionCost, setProvisionCost] = useState<number>(0)

    useEffect(() => {
        // CASA giảm làm chi phí đội lên (số âm vì giảm CASA là dấu âm)
        const costToSubstitute = (casaChange < 0 ? Math.abs(casaChange) : 0) * costOfFundsGap
        
        // CASA tăng làm giảm chi phí huy động
        const costSaving = (casaChange > 0 ? casaChange : 0) * costOfFundsGap

        // Nợ Xấu tăng đòi hỏi trích lập bù đắp
        // Công thức: Mỗi 1% nợ xấu mới (1% * totalLoan) phải lập dự phòng đúng bằng LLR (baseLLR / 100)
        const newNPLAmount = (nplChange / 100) * totalLoan
        const requiredProvision = newNPLAmount * (baseLLR / 100)

        const netCostIncrease = costToSubstitute - costSaving
        
        setCostIncrease(costToSubstitute > 0 ? costToSubstitute : -costSaving)
        setProvisionCost(requiredProvision)

        // Lợi nhuận Nòng cốt sẽ trừ đi sự thất thoát CASA và Trích lập dự phòng thêm
        const pbt = coreProfit - netCostIncrease - requiredProvision
        setFinalProfit(pbt)
    }, [casaChange, nplChange, coreProfit, totalLoan, baseLLR, costOfFundsGap])

    // Smooth counter animation
    useEffect(() => {
        const step = (finalProfit - animateValue) / 10
        if (Math.abs(finalProfit - animateValue) > 50) {
            const timer = setTimeout(() => {
                setAnimateValue(prev => prev + step)
            }, 16)
            return () => clearTimeout(timer)
        } else {
            setAnimateValue(finalProfit)
        }
    }, [finalProfit, animateValue])

    const formatVND = (val: number) => {
        return Math.round(val).toLocaleString('vi-VN') + ' Tỷ'
    }

    const currentCASA = baseCASA + casaChange
    const currentNPL = baseNPL + nplChange

    const isBankrupt = finalProfit <= 0

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
                        <span className="text-2xl">🏦</span>
                        Banking Stress Test ({ticker})
                    </h3>
                    <p className="text-slate-400 text-sm">
                        Đẩy Nợ Xấu lên kịch bản tồi tệ nhất và xem "Bộ đệm" của ngân hàng chịu đựng được bao lâu.
                    </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-2 shrink-0">
                    <p className="text-slate-400 text-xs font-medium mb-0.5">Lợi Nhuận HĐKD (Chưa Dự Phòng)</p>
                    <p className="text-slate-200 font-bold text-lg tracking-wide">{formatVND(coreProfit)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Sliders Control Panel */}
                <div className="flex flex-col gap-5 bg-black/20 rounded-xl p-5 border border-white/5">
                    
                    {/* CASA Slider */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-slate-300 font-semibold text-sm">
                                Điều chỉnh tỷ lệ CASA gốc ({baseCASA}%)
                            </label>
                            <span 
                                className="text-xl font-bold tabular-nums"
                                style={{ color: casaChange >= 0 ? '#10B981' : '#F59E0B' }}
                            >
                                {currentCASA.toFixed(1)}% <span className="text-xs">({casaChange > 0 ? '+' : ''}{casaChange}%)</span>
                            </span>
                        </div>
                        <p className="text-slate-500 text-xs mb-3">Khách hàng rút tiền =&gt; Phải trả lãi huy động đắt đỏ.</p>
                        <input 
                            type="range" min="-20" max="10" step="1"
                            value={casaChange}
                            onChange={(e) => setCasaChange(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1 mt-1">
                            <span>Sụt -20%</span>
                            <span>{baseCASA}%</span>
                            <span>Tăng +10%</span>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-700/50 my-2"></div>

                    {/* NPL Slider */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-slate-300 font-semibold text-sm">
                                Sốc Nợ Xấu (NPL) ({baseNPL}%)
                            </label>
                            <span 
                                className="text-xl font-bold tabular-nums"
                                style={{ color: nplChange === 0 ? '#10B981' : '#EF4444' }}
                            >
                                {currentNPL.toFixed(1)}% <span className="text-xs">(+{nplChange}%)</span>
                            </span>
                        </div>
                        <p className="text-slate-500 text-xs mb-3">BĐS đóng băng, DN phá sản =&gt; Trích lập quỹ LLR dồn dập.</p>
                        <input 
                            type="range" min="0" max="10" step="0.5"
                            value={nplChange}
                            onChange={(e) => setNplChange(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1 mt-1">
                            <span>{baseNPL}% (Chưa nợ mới)</span>
                            <span>Bóng bóng kịch trần (+10%)</span>
                        </div>
                    </div>
                </div>

                {/* Impact Results Panel */}
                <div 
                    className="rounded-xl p-5 border flex flex-col justify-center transition-colors duration-500 relative overflow-hidden"
                    style={{
                        borderColor: isBankrupt ? 'rgba(239, 68, 68, 0.4)' : finalProfit < coreProfit/2 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.2)',
                        background: isBankrupt ? 'rgba(239, 68, 68, 0.1)' : finalProfit < coreProfit/2 ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                    }}
                >
                    <div className="absolute top-4 right-4">
                        {isBankrupt ? <Skull className="w-8 h-8 text-red-500 opacity-60" /> : finalProfit < coreProfit/2 ? <AlertTriangle className="w-6 h-6 text-amber-500 opacity-60" /> : <CheckCircle2 className="w-6 h-6 text-emerald-500 opacity-60" />}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">Chi Phí Đội Lên (CASA)</p>
                            <p className="text-amber-400/80 font-mono text-lg">{costIncrease > 0 ? `-${formatVND(costIncrease)}` : costIncrease < 0 ? `+${formatVND(Math.abs(costIncrease))}` : '0 Tỷ'}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">Thiệt Hại Trích Lập Nợ Xấu</p>
                            <p className="text-red-400/80 font-mono text-lg">{provisionCost > 0 ? `-${formatVND(provisionCost)}` : '0 Tỷ'}</p>
                        </div>
                        
                        <div className="w-full h-px border-b border-dashed border-slate-600/50 my-1"></div>
                        
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: isBankrupt ? '#FCA5A5' : '#94A3B8' }}>LỢI NHUẬN RÒNG CUỐI CÙNG</p>
                            <motion.p 
                                className="text-4xl font-black tabular-nums tracking-tight"
                                style={{ color: isBankrupt ? '#EF4444' : finalProfit < coreProfit/2 ? '#F59E0B' : '#10B981' }}
                            >
                                {isBankrupt ? '-' : ''}{formatVND(Math.abs(animateValue))}
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Insight Insight */}
            <div className={`border rounded-xl p-4 flex gap-3 ${isBankrupt ? 'bg-red-500/10 border-red-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                <Info className={`w-5 h-5 shrink-0 mt-0.5 ${isBankrupt ? 'text-red-400' : 'text-indigo-400'}`} />
                <p className={`text-sm leading-relaxed ${isBankrupt ? 'text-red-200/90' : 'text-indigo-200/80'}`}>
                    {isBankrupt 
                        ? <strong>🚨 BÁO ĐỘNG ĐỎ: Lợi nhuận HĐKD đã bị thiêu rụi hoàn toàn! Cổ đông đã mất trắng lợi nhuận trong kịch bản này.</strong>
                        : finalProfit < coreProfit/2 
                            ? <strong>Lợi nhuận đã sụt giảm nghiêm trọng. Ngân hàng đang phải gồng mình dùng lãi suất ăn mòn quỹ LLR. Rủi ro chia cổ tức sụp đổ.</strong>
                            : "Cấu trúc vốn của ngân hàng vẫn chống chịu được biến động này. Đây là cái giá của Chỉ số Chất lượng Tài sản tốt."}
                </p>
            </div>
        </div>
    )
}
