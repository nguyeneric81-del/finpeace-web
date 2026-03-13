'use client'
import { useState, useEffect } from 'react'
import { Lock, Mail, Phone, User, CheckCircle, ArrowRight, TrendingUp, ShieldAlert, CheckCircle2, Activity } from 'lucide-react'
import { getSalesCode } from '@/components/SalesRefCapture'

const STORAGE_KEY = 'fp_tp_unlocked'

export function isTpUnlocked(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(STORAGE_KEY)
}

interface Plan {
  ticker: string
  strategy_name: string
  timeframe: string
  entry_zone: string
  stop_loss: string
  take_profit: string
  risk_reward: string
  entry_criteria?: string
  exit_criteria?: string
  analyst_note?: string
  catalyst_note?: string
  indicators?: string[]
  chart_image_url?: string
}

interface Props {
  plan: Plan
  lang?: 'vi' | 'kr'
  // Korean overrides
  strategy_name?: string
  timeframe?: string
  entry_criteria?: string
  exit_criteria?: string
  analyst_note?: string
  catalyst_note?: string
  indicators?: string[]
}

const LABELS = {
  vi: {
    strategy: 'Chiến lược',
    unlock_title: 'Đăng ký để xem Kế hoạch Giao dịch',
    unlock_sub: 'Nhập thông tin để nhận kế hoạch giao dịch chi tiết từ đội ngũ FinPeace Advisor',
    name: 'Họ và tên',
    email: 'Email *',
    phone: 'Số điện thoại *',
    btn: 'Xem Kế hoạch Ngay',
    success: 'Mở khóa thành công!',
    success_sub: 'Đang tải kế hoạch...',
    disclaimer: 'Thông tin chỉ dùng để liên hệ tư vấn. Không spam.',
    entry_zone: '📥 Vùng Mua',
    stop_loss: '🛑 Cắt Lỗ',
    take_profit: '🎯 Chốt Lời',
    rr: '⚡ Tỷ lệ R:R',
    chart_label: '📊 Biểu đồ Phân tích Kỹ thuật',
    entry_title: 'Điều kiện vào lệnh',
    exit_title: 'Kế hoạch thoát lệnh',
    analyst_title: 'Nhận định từ chuyên gia',
    catalyst_prefix: '💡 Catalyst Tác động:',
    indicators_label: 'Tín hiệu Technical sử dụng',
    footer: 'Kế hoạch được lập bởi đội ngũ FinPeace Advisor. Vui lòng tuân thủ kỷ luật quản lý rủi ro khi vào lệnh.',
    err_email: 'Vui lòng nhập email hợp lệ',
    err_phone: 'Vui lòng nhập số điện thoại',
    err_server: 'Có lỗi xảy ra, vui lòng thử lại',
    loading: 'Đang xử lý...',
  },
  kr: {
    strategy: '전략',
    unlock_title: '트레이딩 플랜을 보려면 등록하세요',
    unlock_sub: 'FinPeace Advisor 팀의 상세 트레이딩 플랜을 받으려면 정보를 입력하세요',
    name: '성함',
    email: '이메일 *',
    phone: '전화번호 *',
    btn: '지금 플랜 보기',
    success: '인증 완료!',
    success_sub: '플랜을 불러오는 중...',
    disclaimer: '정보는 상담 연락 목적으로만 사용됩니다. 스팸 없음.',
    entry_zone: '📥 매수 구간',
    stop_loss: '🛑 손절',
    take_profit: '🎯 익절',
    rr: '⚡ R:R 비율',
    chart_label: '📊 기술적 분석 차트',
    entry_title: '진입 조건',
    exit_title: '청산 계획',
    analyst_title: '전문가 의견',
    catalyst_prefix: '💡 촉매 요인:',
    indicators_label: '사용된 기술적 신호',
    footer: '본 트레이딩 플랜은 FinPeace Advisor 팀이 작성했습니다. 포지션 진입 시 리스크 관리 원칙을 반드시 준수하시기 바랍니다.',
    err_email: '유효한 이메일을 입력하세요',
    err_phone: '전화번호를 입력하세요',
    err_server: '오류가 발생했습니다. 다시 시도해 주세요',
    loading: '처리 중...',
  }
}

export default function TradingPlanGate({
  plan, lang = 'vi',
  strategy_name, timeframe,
  entry_criteria, exit_criteria,
  analyst_note, catalyst_note, indicators
}: Props) {
  const t = LABELS[lang]
  const [unlocked, setUnlocked] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isTpUnlocked()) setUnlocked(true)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) { setError(t.err_email); return }
    if (!phone) { setError(t.err_phone); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/knowledgebase/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone,
          sales_code: getSalesCode(),
          source: `trading-plan-${plan.ticker}`,
          pillar: 'trading-plan',
          article_slug: plan.ticker,
        }),
      })
      if (!res.ok) { setError(t.err_server); return }
      localStorage.setItem(STORAGE_KEY, email)
      setSuccess(true)
      setTimeout(() => setUnlocked(true), 1200)
    } catch {
      setError(t.err_server)
    } finally {
      setLoading(false)
    }
  }

  const strategyName = strategy_name || plan.strategy_name
  const tf = timeframe || plan.timeframe
  const entryCriteria = entry_criteria || plan.entry_criteria
  const exitCriteria = exit_criteria || plan.exit_criteria
  const analystNote = analyst_note || plan.analyst_note
  const catalystNote = catalyst_note || plan.catalyst_note
  const inds = indicators || plan.indicators || []

  return (
    <>
      {/* Strategy header — always visible */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-1">{t.strategy}</p>
          <p className="text-xl font-bold text-slate-800">{strategyName}</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-slate-700">{tf}</span>
        </div>
      </div>

      {/* Metrics Grid — always visible */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-blue-600/80 uppercase tracking-wider mb-2">{t.entry_zone}</p>
          <p className="text-lg font-bold text-blue-900">{plan.entry_zone}</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-rose-600/80 uppercase tracking-wider mb-2">{t.stop_loss}</p>
          <p className="text-lg font-bold text-rose-900">{plan.stop_loss}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <p className="text-xs font-bold text-emerald-600/80 uppercase tracking-wider mb-2">{t.take_profit}</p>
          <p className="text-lg font-bold text-emerald-900">{plan.take_profit}</p>
        </div>
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-600/80 uppercase tracking-wider mb-2">{t.rr}</p>
          <p className="text-lg font-bold text-slate-800">{plan.risk_reward}</p>
        </div>
      </div>

      {/* Chart — always visible */}
      {plan.chart_image_url && (
        <div className="mb-8">
          <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3">{t.chart_label}</p>
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
            <img src={plan.chart_image_url} alt={`${plan.ticker} chart`} className="w-full object-contain max-h-[600px]" />
          </div>
        </div>
      )}

      {/* Gate: form OR full content */}
      {unlocked ? (
        <div className="space-y-6">
          {entryCriteria && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{t.entry_title}</h3>
                <p className="text-slate-600 leading-relaxed">{entryCriteria}</p>
              </div>
            </div>
          )}
          {exitCriteria && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-1">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{t.exit_title}</h3>
                <p className="text-slate-600 leading-relaxed">{exitCriteria}</p>
              </div>
            </div>
          )}
          {analystNote && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{t.analyst_title}</h3>
                <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
                  <p className="text-slate-700 leading-relaxed italic">{analystNote}</p>
                  {catalystNote && (
                    <p className="mt-4 pt-4 border-t border-amber-200/50 text-sm text-amber-800">
                      <strong>{t.catalyst_prefix}</strong> {catalystNote}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {inds.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">{t.indicators_label}</p>
              <div className="flex flex-wrap gap-2">
                {inds.map((ind, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">{ind}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Blurred preview */}
          <div className="pointer-events-none select-none" aria-hidden>
            <div className="space-y-6 blur-[6px] opacity-40">
              {[1,2,3].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-200 rounded-full w-1/3" />
                    <div className="h-4 bg-slate-200 rounded-full w-full" />
                    <div className="h-4 bg-slate-200 rounded-full w-4/5" />
                    <div className="h-4 bg-slate-200 rounded-full w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gate Overlay */}
          <div className="absolute inset-0 flex items-start justify-center pt-4">
            <div className="bg-gradient-to-b from-white/0 via-white to-white absolute inset-0" />
            <div className="relative z-10 w-full max-w-sm mx-auto">
              {success ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center shadow-xl">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <p className="text-emerald-800 font-bold text-lg">{t.success}</p>
                  <p className="text-emerald-600 text-sm mt-1">{t.success_sub}</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl shadow-slate-200/60">
                  <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-2xl mb-3">
                      <Lock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-slate-800 font-black text-lg leading-tight">{t.unlock_title}</h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">{t.unlock_sub}</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" placeholder={t.name} value={name} onChange={e => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} required
                        className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="tel" placeholder={t.phone} value={phone} onChange={e => setPhone(e.target.value)} required
                        className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
                    </div>
                    {error && <p className="text-rose-600 text-xs text-center">{error}</p>}
                    <button type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl transition-colors">
                      {loading ? <span className="animate-pulse">{t.loading}</span> : <>{t.btn}<ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </form>
                  <p className="text-slate-400 text-[10px] text-center mt-3 leading-relaxed">{t.disclaimer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
