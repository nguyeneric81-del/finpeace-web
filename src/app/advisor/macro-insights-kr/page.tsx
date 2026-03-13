"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck, Search, Flame, CalendarDays } from 'lucide-react';

const mockStories = [
  {
    id: 1,
    title: "지정학적 긴장 속 글로벌 물류비용 급등",
    date: "2026년 3월",
    category: "공급망",
    dataPoint: "컨테이너 해상 운임 지수(SCFI) YTD +35% 상승, 2,800포인트 돌파.",
    narrowIndustry: "국제 해운 & 선박 임대업",
    quantifiedImpact: {
      positive: true,
      value: "고운임 계약 재체결 사이클에 힘입어 2026년 Q2 업종 순이익률 +8%~12% 상승 전망."
    },
    companies: [
      { ticker: "HAH", name: "HAI AN", impact: "새 선박 3척 아시아 내 항로 투입으로 직접 수혜.", matchScore: 92, positive: true },
      { ticker: "VOS", name: "VOSCO", impact: "벌크 선단이 단기 운임 상승 혜택 수혜.", matchScore: 78, positive: true }
    ]
  },
  {
    id: 2,
    title: "Fed 금리 인하 지연 — 달러 강세 지속",
    date: "2026년 3월",
    category: "통화 정책",
    dataPoint: "DXY 104.5 지지. USD/VND 환율 25,500 돌파. 미국 10년물 국채 수익률 4.3% 회복.",
    narrowIndustry: "수출 제조업 (섬유·수산) & 테크 리테일",
    quantifiedImpact: {
      positive: false,
      value: "달러 부채 비중 높은 기업 환손실 순이익 –3% 예상. 반면 달러 수출 기업은 순이익률 +1.5~2.5% 개선."
    },
    companies: [
      { ticker: "VHC", name: "VINH HOAN", impact: "이중 환율 수혜 — 수출 단가 상승 & 달러 수취.", matchScore: 88, positive: true },
      { ticker: "MWG", name: "THE GIOI DI DONG", impact: "Apple 부품 환율 부담으로 ICT 부문 순이익률 소폭 압박.", matchScore: 65, positive: false }
    ]
  },
  {
    id: 3,
    title: "차세대 FDI 물결 & 반도체 산업 자금 유입",
    date: "2026년 3월",
    category: "외국인 직접투자",
    dataPoint: "2026년 2개월 누적 신규 FDI 등록액 42.9억 달러 (+38% YoY). 60%가 첨단 제조·인프라 부문 집중.",
    narrowIndustry: "도심 외곽 산업단지 부동산 (박닌·붕따우) & 화학·소재",
    quantifiedImpact: {
      positive: true,
      value: "산업용지 임대료 연 +6~8% 상승 예상. 북부 산업단지 입주율 90% 육박."
    },
    companies: [
      { ticker: "KBC", name: "KINH BAC", impact: "Trang Due 3 산단 100ha 인도, Q3/2026 일회성 이익 실현 예정.", matchScore: 95, positive: true },
      { ticker: "DGC", name: "DUC GIANG CHEMICALS", impact: "반도체 화학물질(인) 글로벌 수요 급증으로 중기 판가 지지.", matchScore: 89, positive: true }
    ]
  }
];

export default function MacroInsightsKrPage() {
  const availableMonths = Array.from(new Set(mockStories.map(s => s.date))).sort((a, b) => b.localeCompare(a));
  const [activeMonth, setActiveMonth] = useState(availableMonths[0]);
  const filteredStories = mockStories.filter(story => story.date === activeMonth);

  return (
    <div className="min-h-screen bg-[#0E1117] text-slate-200 overflow-x-hidden p-6 md:p-12 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
          <Flame className="w-4 h-4" />
          <span>월간 거시경제 인사이트</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          실전 투자 시각 <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            리서치 인사이트
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
          거시경제 지표의 영향을 세부 업종까지 정량화하고, 기업의 트레이딩 플랜에 직접 연결합니다.
        </p>
      </div>

      {/* Month Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-1 border-b border-slate-800 pb-px overflow-x-auto no-scrollbar mask-gradient-right">
          <div className="flex px-2 py-1 items-center gap-2 text-slate-500 font-semibold mr-4">
            <CalendarDays className="w-5 h-5" />
            <span className="uppercase tracking-wider text-xs">기간</span>
          </div>
          {availableMonths.map((month) => (
            <button
              key={month}
              onClick={() => setActiveMonth(month)}
              className={`
                relative px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-300
                ${activeMonth === month
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 rounded-t-lg'
                }
              `}
            >
              {month}
              {activeMonth === month && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-400 to-teal-400 shadow-[0_-2px_10px_rgba(56,189,248,0.5)]"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {filteredStories.map((story) => (
          <div key={story.id} className="relative p-1 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/50 hover:from-blue-500/20 hover:to-teal-500/10 transition-colors duration-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-[#12161E] rounded-[22px] p-6 md:p-10 flex flex-col xl:flex-row gap-10">

              {/* Left Column: Macro */}
              <div className="xl:w-5/12 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-400 bg-slate-800/80 px-4 py-1.5 rounded-full ring-1 ring-slate-700/50">
                    {story.date}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    {story.category}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {story.title}
                </h2>

                <div>
                  <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> 실제 데이터 적용
                  </p>
                  <p className="text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 inline-block px-4 py-2 rounded-xl">
                    {story.dataPoint}
                  </p>
                </div>
              </div>

              {/* Right Column: 2-Layer Translation */}
              <div className="xl:w-7/12 flex flex-col space-y-6"
                   style={{ backgroundImage: 'radial-gradient(ellipse at top right, rgba(30,58,138,0.1), transparent 50%)' }}>

                {/* Layer 1: Narrow Industry */}
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-white">1</span>
                    세부 업종 레이어 (Sector Layer)
                  </h3>
                  <p className="text-xl font-semibold text-white mb-3">{story.narrowIndustry}</p>
                  <p className={`text-sm ${story.quantifiedImpact.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span className="font-bold uppercase">영향: </span> {story.quantifiedImpact.value}
                  </p>

                  <div className="mt-5">
                    <Link href={`/advisor/macro-insights/${story.id}`}>
                      <button className="px-4 py-2 bg-slate-700/40 hover:bg-blue-600/30 text-blue-300 rounded-lg text-sm font-medium border border-blue-500/30 transition-colors flex items-center gap-2">
                        <Search className="w-4 h-4" /> 인사이트 상세 보기
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Layer 2: Specific Companies */}
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 flex-grow">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-white">2</span>
                    핵심 기업 레이어 (Company Layer)
                  </h3>

                  <div className="space-y-4">
                    {story.companies.map(company => (
                      <div key={company.ticker} className="group flex items-start justify-between bg-slate-900/50 hover:bg-slate-800 transition-colors p-4 rounded-xl border border-slate-700/30">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-lg font-bold text-white">{company.ticker}</span>
                            <span className="text-sm text-slate-400">{company.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 ml-2">
                              적합도: {company.matchScore}%
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm">
                            {company.impact}
                          </p>
                        </div>

                        <Link href={`/advisor/trading-plan/${company.ticker.toLowerCase()}`}>
                          <button className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all group-hover:scale-110">
                            <ArrowRight className="w-5 h-4" />
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}

        {filteredStories.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-500 text-lg">이번 달 거시경제 리포트가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
