'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Leaf, LogOut, Plus, Pencil, Trash2, Loader2, X, Save,
  ChevronDown, ChevronUp, Eye, EyeOff, ArrowLeft, Globe
} from 'lucide-react'

// ── Types ───────────────────────────────────────────────────────
type BehindStory = { point: string; quote: string; source: string }
type KeyStat = { label: string; value: string; positive?: boolean }
type Company = { ticker: string; name: string; plan?: string }
type ChartPoint = { name: string; value: number }

type Insight = {
  id?: string
  title: string; category: string; date_label: string
  accent_color: string; data_point: string; narrow_industry: string
  impact_value: string; impact_positive: boolean; analyst_view: string
  analyst_sources: string[]
  behind_story: BehindStory[]; key_stats: KeyStat[]
  companies: Company[]; chart_data: ChartPoint[]
  chart_label: string; chart_color: string
  cycle_lagging: string; cycle_leading: string
  published: boolean
}

const EMPTY: Insight = {
  title: '', category: 'Chuỗi Cung Ứng', date_label: 'Tháng 3, 2026',
  accent_color: '#10b981', data_point: '', narrow_industry: '',
  impact_value: '', impact_positive: true, analyst_view: '',
  analyst_sources: [],
  behind_story: [{ point: '', quote: '', source: '' }],
  key_stats: [{ label: '', value: '', positive: true }],
  companies: [{ ticker: '', name: '' }],
  chart_data: [],
  chart_label: '', chart_color: '#34d399',
  cycle_lagging: '', cycle_leading: '',
  published: false,
}

const CATEGORIES = [
  'Chuỗi Cung Ứng', 'Chính sách Tiền tệ', 'Đầu tư Nước ngoài',
  'Hạ tầng & Tăng trưởng', 'Ngành Hàng Tiêu dùng', 'Bất động sản',
  'Năng lượng', 'Tài chính - Ngân hàng', 'Công nghệ & Bán dẫn',
]

// ── Small helpers ───────────────────────────────────────────────
const inp = "w-full border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
const ta  = inp + " resize-none"
const lbl = "text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wide"

function Sec({ title, children, color = 'emerald' }: { title: string; children: React.ReactNode; color?: string }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left">
        <span className={`text-[10px] font-black uppercase tracking-widest text-${color}-600`}>{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="p-5 space-y-4">{children}</div>}
    </div>
  )
}

// ── Main Form ───────────────────────────────────────────────────
function InsightForm({ initial, onSave, onCancel }: {
  initial: Partial<Insight>; onSave: (d: Insight) => void; onCancel: () => void
}) {
  const [f, setF] = useState<Insight>({ ...EMPTY, ...initial })
  const [saving, setSaving] = useState(false)
  const set = (k: keyof Insight, v: any) => setF(p => ({ ...p, [k]: v }))

  // Dynamic array helpers
  function addBehind() { set('behind_story', [...f.behind_story, { point: '', quote: '', source: '' }]) }
  function removeBehind(i: number) { set('behind_story', f.behind_story.filter((_, j) => j !== i)) }
  function setBehind(i: number, k: keyof BehindStory, v: string) {
    set('behind_story', f.behind_story.map((r, j) => j === i ? { ...r, [k]: v } : r))
  }

  function addStat() { set('key_stats', [...f.key_stats, { label: '', value: '', positive: true }]) }
  function removeStat(i: number) { set('key_stats', f.key_stats.filter((_, j) => j !== i)) }
  function setStat(i: number, k: keyof KeyStat, v: any) {
    set('key_stats', f.key_stats.map((r, j) => j === i ? { ...r, [k]: v } : r))
  }

  function addCompany() { set('companies', [...f.companies, { ticker: '', name: '' }]) }
  function removeCompany(i: number) { set('companies', f.companies.filter((_, j) => j !== i)) }
  function setCompany(i: number, k: keyof Company, v: string) {
    set('companies', f.companies.map((r, j) => j === i ? { ...r, [k]: v } : r))
  }

  function addChart() { set('chart_data', [...f.chart_data, { name: '', value: 0 }]) }
  function removeChart(i: number) { set('chart_data', f.chart_data.filter((_, j) => j !== i)) }
  function setChart(i: number, k: keyof ChartPoint, v: any) {
    set('chart_data', f.chart_data.map((r, j) => j === i ? { ...r, [k]: v } : r))
  }

  async function handleSave() {
    if (!f.title) return alert('Cần nhập tiêu đề insight')
    setSaving(true)
    await onSave(f)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
          <h3 className="font-bold text-slate-800">
            {initial.id ? `Chỉnh sửa Insight` : 'Thêm Macro Insight Mới'}
          </h3>
          <button onClick={onCancel}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
        </div>

        <div className="p-6 space-y-4 max-h-[76vh] overflow-y-auto">

          {/* ── 1. Cơ bản ── */}
          <Sec title="Thông tin cơ bản">
            <div>
              <label className={lbl}>Tiêu đề *</label>
              <input value={f.title} onChange={e => set('title', e.target.value)}
                placeholder="VD: Chi phí logistics toàn cầu leo thang..." className={inp} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Ngành / Danh mục</label>
                <select value={f.category} onChange={e => set('category', e.target.value)} className={inp}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Tháng (hiển thị)</label>
                <input value={f.date_label} onChange={e => set('date_label', e.target.value)}
                  placeholder="Tháng 3, 2026" className={inp} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Màu accent (hex)</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={f.accent_color} onChange={e => set('accent_color', e.target.value)}
                    className="w-10 h-9 rounded-lg border border-slate-200 cursor-pointer p-1" />
                  <input value={f.accent_color} onChange={e => set('accent_color', e.target.value)} className={inp} />
                </div>
              </div>
              <div>
                <label className={lbl}>Tác động</label>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => set('impact_positive', true)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${f.impact_positive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    ↑ Tích cực
                  </button>
                  <button onClick={() => set('impact_positive', false)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${!f.impact_positive ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    ↓ Tiêu cực
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className={lbl}>Mô tả tác động (1 câu)</label>
              <textarea value={f.impact_value} onChange={e => set('impact_value', e.target.value)} rows={2}
                placeholder="VD: Biên lợi nhuận ròng tăng +8–12% trong Q2/2026..." className={ta} />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <input type="checkbox" id="pub" checked={f.published} onChange={e => set('published', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded" />
              <label htmlFor="pub" className="text-sm font-bold text-emerald-900 cursor-pointer">
                Publish (hiện trên trang Macro Insights)
              </label>
            </div>
          </Sec>

          {/* ── 2. Dữ liệu & Ngành hẹp ── */}
          <Sec title="Dữ liệu & Phân tích" color="sky">
            <div>
              <label className={lbl}>Data Point chính (số liệu thực tế)</label>
              <textarea value={f.data_point} onChange={e => set('data_point', e.target.value)} rows={2}
                placeholder="VD: SCFI tăng +35% YTD, chạm 2,800 điểm — cao nhất 18 tháng." className={ta} />
            </div>
            <div>
              <label className={lbl}>Nhóm ngành hẹp</label>
              <input value={f.narrow_industry} onChange={e => set('narrow_industry', e.target.value)}
                placeholder="VD: Vận tải biển Quốc tế & Cho thuê tàu bãi" className={inp} />
            </div>
            <div>
              <label className={lbl}>Góc nhìn phân tích (Analyst View)</label>
              <textarea value={f.analyst_view} onChange={e => set('analyst_view', e.target.value)} rows={3}
                placeholder="Nhận định tổng quan về cơ hội đầu tư từ câu chuyện này..." className={ta} />
            </div>
            <div>
              <label className={lbl}>Nguồn phân tích (phân cách bằng dấu phẩy)</label>
              <input
                value={(f.analyst_sources || []).join(', ')}
                onChange={e => set('analyst_sources', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="VCBS, SSI Research, VDSC"
                className={inp} />
            </div>
          </Sec>

          {/* ── 3. Key Stats ── */}
          <Sec title="Số liệu nổi bật (Key Stats - 4 ô)" color="amber">
            {f.key_stats.map((s, i) => (
              <div key={i} className="flex gap-2 items-start border border-slate-100 rounded-xl p-3">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <label className={lbl}>Giá trị (VD: +28%)</label>
                    <input value={s.value} onChange={e => setStat(i, 'value', e.target.value)} className={inp} placeholder="+28%" />
                  </div>
                  <div>
                    <label className={lbl}>Nhãn</label>
                    <input value={s.label} onChange={e => setStat(i, 'label', e.target.value)} className={inp} placeholder="Tăng trưởng nhu cầu thép" />
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setStat(i, 'positive', true)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${s.positive !== false ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>↑ Xanh</button>
                      <button onClick={() => setStat(i, 'positive', false)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${s.positive === false ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>↓ Đỏ</button>
                      <button onClick={() => setStat(i, 'positive', undefined)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${s.positive === undefined ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-500'}`}>Trung tính</button>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeStat(i)} className="text-rose-400 hover:text-rose-600 mt-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={addStat}
              className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-bold">
              <Plus className="w-4 h-4" /> Thêm số liệu
            </button>
          </Sec>

          {/* ── 4. Behind Story ── */}
          <Sec title="Câu chuyện đằng sau (Timeline)" color="violet">
            {f.behind_story.map((b, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-violet-600 uppercase">Sự kiện {i + 1}</span>
                  <button onClick={() => removeBehind(i)}><Trash2 className="w-4 h-4 text-rose-400 hover:text-rose-600" /></button>
                </div>
                <div>
                  <label className={lbl}>Nội dung chính</label>
                  <textarea value={b.point} onChange={e => setBehind(i, 'point', e.target.value)} rows={2}
                    placeholder="Điều gì đã xảy ra? Tại sao quan trọng?" className={ta} />
                </div>
                <div>
                  <label className={lbl}>Quote minh chứng</label>
                  <textarea value={b.quote} onChange={e => setBehind(i, 'quote', e.target.value)} rows={2}
                    placeholder="Câu trích dẫn từ báo cáo, phát biểu chính thức..." className={ta} />
                </div>
                <div>
                  <label className={lbl}>Nguồn</label>
                  <input value={b.source} onChange={e => setBehind(i, 'source', e.target.value)}
                    placeholder="VD: Bộ GTVT · Q1/2026" className={inp} />
                </div>
              </div>
            ))}
            <button onClick={addBehind}
              className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-bold">
              <Plus className="w-4 h-4" /> Thêm sự kiện
            </button>
          </Sec>

          {/* ── 5. Cycle ── */}
          <Sec title="Chu kỳ: Lagging → Leading" color="emerald">
            <div>
              <label className={lbl}>🔘 Lagging (Độ trễ vĩ mô — nguyên nhân quá khứ)</label>
              <textarea value={f.cycle_lagging} onChange={e => set('cycle_lagging', e.target.value)} rows={3}
                placeholder="Giải thích độ trễ từ sự kiện vĩ mô đến tác động lên DN..." className={ta} />
            </div>
            <div>
              <label className={lbl}>🟢 Leading (Dẫn dắt doanh thu — tác động sắp tới)</label>
              <textarea value={f.cycle_leading} onChange={e => set('cycle_leading', e.target.value)} rows={3}
                placeholder="Cơ chế chuyển hóa thành doanh thu/lợi nhuận cụ thể..." className={ta} />
            </div>
          </Sec>

          {/* ── 6. Companies ── */}
          <Sec title="Cổ phiếu trọng điểm" color="rose">
            {f.companies.map((c, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="w-28">
                  <label className={lbl}>Ticker</label>
                  <input value={c.ticker} onChange={e => setCompany(i, 'ticker', e.target.value.toUpperCase())}
                    placeholder="HPG" className={inp} />
                </div>
                <div className="flex-1">
                  <label className={lbl}>Tên công ty</label>
                  <input value={c.name} onChange={e => setCompany(i, 'name', e.target.value)}
                    placeholder="Hòa Phát Group" className={inp} />
                </div>
                <button onClick={() => removeCompany(i)} className="pb-2">
                  <Trash2 className="w-4 h-4 text-rose-400 hover:text-rose-600" />
                </button>
              </div>
            ))}
            <button onClick={addCompany}
              className="flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 font-bold">
              <Plus className="w-4 h-4" /> Thêm cổ phiếu
            </button>
          </Sec>

          {/* ── 7. Chart ── */}
          <Sec title="Biểu đồ xu hướng" color="sky">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={lbl}>Tiêu đề biểu đồ</label>
                <input value={f.chart_label} onChange={e => set('chart_label', e.target.value)}
                  placeholder="VD: Chỉ số SCFI — 8 tháng gần nhất" className={inp} />
              </div>
              <div>
                <label className={lbl}>Màu đường biểu đồ</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={f.chart_color} onChange={e => set('chart_color', e.target.value)}
                    className="w-10 h-9 rounded-lg border border-slate-200 cursor-pointer p-1" />
                  <input value={f.chart_color} onChange={e => set('chart_color', e.target.value)} className={inp} />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={lbl}>Điểm dữ liệu</label>
                <button onClick={addChart} className="text-xs text-sky-600 font-bold flex items-center gap-1">
                  <Plus className="w-3 h-3" />Thêm điểm
                </button>
              </div>
              <div className="space-y-2">
                {f.chart_data.map((p, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={p.name} onChange={e => setChart(i, 'name', e.target.value)}
                      placeholder="T3/26" className={`${inp} w-24`} />
                    <input type="number" value={p.value} onChange={e => setChart(i, 'value', parseFloat(e.target.value) || 0)}
                      placeholder="2800" className={`${inp} flex-1`} />
                    <button onClick={() => removeChart(i)}>
                      <X className="w-4 h-4 text-slate-400 hover:text-rose-500" />
                    </button>
                  </div>
                ))}
                {f.chart_data.length === 0 && (
                  <p className="text-xs text-slate-400 italic">Chưa có điểm dữ liệu. Nhấn Thêm điểm để bắt đầu.</p>
                )}
              </div>
            </div>
          </Sec>

        </div>

        {/* ── Footer ── */}
        <div className="p-6 border-t flex gap-3 justify-between items-center sticky bottom-0 bg-white rounded-b-2xl">
          <a href={f.id ? `/advisor/macro-insights/${f.id}` : '#'} target="_blank"
            className="text-xs text-slate-400 hover:text-emerald-600 flex items-center gap-1">
            <Eye className="w-3 h-3" /> Preview
          </a>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Huỷ</button>
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {f.published ? 'Lưu & Publish' : 'Lưu nháp'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────
export default function MacroInsightsAdminPage() {
  const [user, setUser] = useState<any>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Insight> | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('advisor_user')
    if (!stored) { router.push('/advisor/login'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'admin') { router.push('/advisor/dashboard'); return }
    setUser(u)
    load()
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/advisor/macro-insights')
    const data = await res.json()
    if (Array.isArray(data)) setInsights(data)
    setLoading(false)
  }, [])

  async function handleSave(form: Insight) {
    await fetch('/api/advisor/macro-insights', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setEditing(null)
    load()
  }

  async function handleDelete(ins: Insight) {
    if (!confirm(`Xoá insight "${ins.title}"?`)) return
    await fetch('/api/advisor/macro-insights', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id: ins.id })
    })
    load()
  }

  async function togglePublish(ins: Insight) {
    await fetch('/api/advisor/macro-insights', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...ins, published: !ins.published })
    })
    load()
  }

  async function handleLogout() {
    sessionStorage.removeItem('advisor_user')
    await fetch('/api/advisor/logout', { method: 'POST' })
    router.push('/advisor/login')
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-8 h-8" /></div>

  return (
    <div className="min-h-screen bg-slate-50">
      {editing !== null && (
        <InsightForm initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
      )}

      <nav className="bg-emerald-800 text-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/advisor/admin')}
              className="text-emerald-300 hover:text-white flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <Leaf className="w-5 h-5" />
            <span className="font-bold">Macro Insights Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/advisor/macro-insights" target="_blank"
              className="flex items-center gap-1.5 text-sm text-emerald-300 hover:text-white">
              <Globe className="w-4 h-4" /> Xem trang
            </a>
            <button onClick={handleLogout}
              className="text-emerald-200 hover:text-white flex items-center gap-1.5 text-sm">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Quản lý Macro Insights</h1>
            <p className="text-sm text-slate-500 mt-1">
              {insights.filter(i => i.published).length}/{insights.length} đang publish
            </p>
          </div>
          <button onClick={() => setEditing({})}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Thêm Insight Mới
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map(ins => (
              <div key={ins.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: ins.accent_color }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-800 truncate">{ins.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${ins.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {ins.published ? '✓ Live' : 'Nháp'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {ins.category} · {ins.date_label} · {(ins.companies || []).map(c => c.ticker).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePublish(ins)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                    title={ins.published ? 'Unpublish' : 'Publish'}>
                    {ins.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setEditing(ins)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(ins)}
                    className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {insights.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                <p className="text-4xl mb-3">📊</p>
                <p className="font-semibold text-slate-600">Chưa có insight nào</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
