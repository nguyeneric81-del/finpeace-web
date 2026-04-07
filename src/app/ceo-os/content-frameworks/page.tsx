'use client'

import { useEffect, useState } from 'react'

type Step = {
  label: string
  description: string
  example: string
}

type Framework = {
  id: string
  name: string
  slug: string
  framework_type: string
  description: string
  steps: Step[]
  example: string
  tone_guide: string
  use_cases: string[]
  is_active: boolean
  updated_at: string
}

const DEFAULT_FRAMEWORKS = [
  {
    name: 'AIDA',
    slug: 'aida',
    framework_type: 'AIDA',
    description: 'Framework kinh điển nhất trong tiếp thị — dẫn dắt người đọc từ chú ý đến hành động.',
    steps: [
      {
        label: 'A — Attention (Gây chú ý)',
        description: 'Mở đầu với con số, câu hỏi, hoặc nghịch lý gây sốc nhẹ trong 1-2 câu.',
        example: 'Bạn kiếm 30 triệu/tháng. Tại sao vẫn không đủ tiền?',
      },
      {
        label: 'I — Interest (Tạo hứng thú)',
        description: 'Kể câu chuyện hoặc đặt vấn đề mà người đọc đồng cảm. Dùng "bạn" nhiều hơn "tôi".',
        example: 'Nhiều người kiếm tốt nhưng sống thiếu bình an vì không có kế hoạch. Tiền đến rồi đi, nhưng lo lắng thì ở lại.',
      },
      {
        label: 'D — Desire (Khơi gợi mong muốn)',
        description: 'Vẽ ra bức tranh tương lai họ muốn — sau khi có giải pháp. Dùng cảm xúc và lợi ích cụ thể.',
        example: 'Hãy tưởng tượng 6 tháng nữa: quỹ khẩn cấp đủ, kế hoạch đầu tư rõ ràng, và bạn không còn thức đêm lo về tiền nữa.',
      },
      {
        label: 'A — Action (Kêu gọi hành động)',
        description: 'Một CTA rõ ràng, đơn giản, không áp lực. Tặng giá trị đi kèm nếu có thể.',
        example: 'Nhắn "BẮT ĐẦU" để nhận miễn phí bảng phân tích sức khỏe tài chính cá nhân.',
      },
    ],
    example: 'Dùng cho: Post Facebook, caption Instagram, mở đầu LP, email marketing.',
    tone_guide: 'Ấm áp, gần gũi, ít thuật ngữ. Tỷ lệ Bạn:Tôi = 3:1. Câu ngắn, đọc nhanh.',
    use_cases: ['Facebook post organic', 'Instagram caption', 'Landing page hero section', 'Email subject + body'],
  },
  {
    name: 'Pain - Lesson - Gift',
    slug: 'pain-lesson-gift',
    framework_type: 'Pain-Lesson-Gift',
    description: 'Framework xây dựng trust bằng cách chia sẻ hành trình thật — pain → học được gì → tặng lại cho cộng đồng.',
    steps: [
      {
        label: 'Pain (Nỗi đau thực tế)',
        description: 'Kể một khoảnh khắc thật, cụ thể, có cảm xúc mà bạn hoặc khách hàng đã trải qua. Không tô vẽ, không hoàn hảo.',
        example: 'Năm 2022, tôi cầm 500 triệu đi mua cổ phiếu theo hội nhóm Facebook. 3 tháng sau còn 180 triệu. Tôi không ngủ được tuần đó.',
      },
      {
        label: 'Lesson (Bài học rút ra)',
        description: 'Bạn đã hiểu ra điều gì từ trải nghiệm đó? Phải là insight thật sự hữu ích — không phải lý thuyết chung chung.',
        example: 'Tôi nhận ra: thị trường không sai. Tôi sai vì thiếu hệ thống. Mua mà không có exit plan = cờ bạc, không phải đầu tư.',
      },
      {
        label: 'Gift (Quà tặng kiến thức)',
        description: 'Tặng ngay một tool, checklist, hoặc insight cụ thể mà người đọc có thể áp dụng ngay hôm nay.',
        example: 'Từ đó tôi dùng 3 câu hỏi trước mỗi lần mua: Tôi mua vì lý do gì? Stop-loss ở đâu? Mục tiêu giá là bao nhiêu? — Bình luận "CHECKLIST" để tôi gửi bạn bảng đầy đủ.',
      },
    ],
    example: 'Dùng cho: Personal brand post, Reels storytelling, Email newsletter, chia sẻ case study.',
    tone_guide: 'Thật, dễ tổn thương, không hoàn hảo. Người kể = người bạn đồng hành, không phải chuyên gia trên cao.',
    use_cases: ['Personal brand Facebook post', 'Instagram Reels script', 'Email newsletter', 'YouTube Shorts intro'],
  },
  {
    name: 'Hook - Story - Offer',
    slug: 'hook-story-offer',
    framework_type: 'Hook-Story-Offer',
    description: 'Framework bán hàng tự nhiên — dẫn dắt từ mobile scroll-stop hook → câu chuyện liên quan → offer tự nhiên.',
    steps: [
      {
        label: 'Hook (Móc câu chú ý)',
        description: 'Câu đầu tiên phải dừng ngón tay người scroll. Dùng số, phủ định, câu hỏi, hoặc statement gây tò mò.',
        example: '"Tôi đã từ chối 200 triệu vì một lý do rất đơn giản." / "98% người đầu tư mắc sai lầm này ở bước đầu tiên."',
      },
      {
        label: 'Story (Câu chuyện liên quan)',
        description: 'Kể chuyện ngắn (3-5 câu) liên quan trực tiếp đến hook. Cuối story phải dẫn tự nhiên đến offer.',
        example: 'Khách hàng của tôi — anh Minh, 35 tuổi — đã đầu tư 5 năm mà không có kế hoạch rút. Khi cần tiền cho con học, anh phải bán lỗ. Một tờ giấy A4 lên kế hoạch trước có thể đã cứu anh khỏi điều đó.',
      },
      {
        label: 'Offer (Đề nghị hành động)',
        description: 'Offer phải tự nhiên từ story, không đột ngột. Thấp rào cản: "comment", "nhắn tin", "xem thêm" — không yêu cầu mua ngay.',
        example: 'Tôi có bộ template kế hoạch tài chính 1 trang mà tôi dùng với tất cả khách. Nhắn "PLAN" nếu bạn muốn 1 bản.',
      },
    ],
    example: 'Dùng cho: Sales post Facebook, Reels/Shorts có CTA, tin nhắn tư vấn đầu tiên.',
    tone_guide: 'Conversational, tự tin nhưng không áp lực. Offer phải cảm giác như "bạn cho" không phải "bạn bán".',
    use_cases: ['Facebook sales post', 'Reels/TikTok script', 'Tin nhắn cold outreach', 'Story Instagram'],
  },
  {
    name: 'Problem - Agitate - Solution',
    slug: 'problem-agitate-solution',
    framework_type: 'Problem-Agitate-Solution',
    description: 'PAS — Framework chuyên chạy quảng cáo và thuyết phục nhanh. Khuếch đại nỗi đau trước khi đưa ra giải pháp.',
    steps: [
      {
        label: 'Problem (Vấn đề)',
        description: 'Nêu thẳng vấn đề trong 1 câu. Phải là vấn đề họ đang gặp ngay hôm nay, không phải lý thuyết.',
        example: 'Bạn đang tiết kiệm đều đặn nhưng không thấy tiền mình đang đi đâu, đúng không?',
      },
      {
        label: 'Agitate (Khuếch đại)',
        description: 'Đào sâu vào hệ quả — nếu không giải quyết vấn đề này, điều gì sẽ xảy ra? Tạo cảm giác cấp bách.',
        example: 'Và nếu tiếp tục như vậy: 5 năm nữa vẫn ở điểm xuất phát. Lạm phát ăn mòn dần số tiền bạn tích cóp. Cơ hội đầu tư bỏ lỡ. Tuổi tác tăng dần.',
      },
      {
        label: 'Solution (Giải pháp)',
        description: 'Giới thiệu giải pháp của bạn như câu trả lời tự nhiên cho vấn đề đó. Đừng nói quá nhiều tính năng — nói lợi ích.',
        example: 'FinPeace Advisory giúp bạn có bức tranh tài chính rõ ràng trong 90 phút — từ dòng tiền, tài sản, đến kế hoạch đầu tư cụ thể theo mục tiêu của bạn.',
      },
    ],
    example: 'Dùng cho: Quảng cáo Facebook Ads, cold message, email chào hàng lần đầu.',
    tone_guide: 'Mạnh, rõ ràng, không vòng vo. Phần Agitate cần cụ thể và liên quan đến sợ hãi thực tế của họ.',
    use_cases: ['Facebook Ads copy', 'Cold message sales', 'Email chào hàng', 'Landing page body'],
  },
]

const TYPE_CONFIG: Record<string, { color: string; bg: string; border: string; icon: string }> = {
  'AIDA': { color: 'text-blue-300', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: '🔵' },
  'Pain-Lesson-Gift': { color: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: '💚' },
  'Hook-Story-Offer': { color: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: '🟡' },
  'Problem-Agitate-Solution': { color: 'text-red-300', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: '🔴' },
  'Before-After-Bridge': { color: 'text-purple-300', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: '🟣' },
  'Custom': { color: 'text-white/60', bg: 'bg-white/5', border: 'border-white/20', icon: '⚪' },
}

export default function ContentFrameworksPage() {
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editing, setEditing] = useState<Framework | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadFrameworks = async () => {
    try {
      const res = await fetch('/api/admin/frameworks')
      const data = await res.json()
      if (data.success) setFrameworks(data.frameworks)
    } catch { showToast('Lỗi tải frameworks!', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadFrameworks() }, [])

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const res = await fetch('/api/admin/frameworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frameworks: DEFAULT_FRAMEWORKS }),
      })
      const data = await res.json()
      if (data.success) {
        showToast(`✅ Đã seed ${data.frameworks?.length} frameworks!`)
        loadFrameworks()
      } else {
        showToast(`❌ ${data.error}`, 'error')
      }
    } catch { showToast('Lỗi!', 'error') }
    finally { setSeeding(false) }
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/frameworks/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editing.name,
          description: editing.description,
          steps: editing.steps,
          example: editing.example,
          tone_guide: editing.tone_guide,
          use_cases: editing.use_cases,
          is_active: editing.is_active,
        }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('✅ Đã lưu framework!')
        setEditing(null)
        loadFrameworks()
      } else {
        showToast(`❌ ${data.error}`, 'error')
      }
    } catch { showToast('Lỗi!', 'error') }
    finally { setSaving(false) }
  }

  return (
    <div className="p-8 space-y-6 relative">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-bold shadow-2xl
          ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-purple-400/70 mb-1">Module 3</p>
          <h1 className="text-3xl font-black text-white">✍️ Khung Nội Dung</h1>
          <p className="text-white/40 mt-1 text-sm">Các cấu trúc viết bài chuẩn cho 100 Brokers — CEO cấu hình, Agents kế thừa</p>
        </div>
        {frameworks.length === 0 && !loading && (
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-5 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm font-bold hover:bg-purple-500/30 transition-all disabled:opacity-50"
          >
            {seeding ? '⏳ Đang tạo...' : '✍️ Seed 4 frameworks mẫu'}
          </button>
        )}
      </div>

      {/* Info banner */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-5 py-3 flex items-start gap-3">
        <span className="text-lg flex-shrink-0">💡</span>
        <p className="text-xs text-white/50 leading-relaxed">
          Các framework này được Agents dùng làm <strong className="text-white/70">hướng dẫn viết bài</strong> tự động. 
          CEO có thể chỉnh sửa ví dụ, tone, và các bước để phù hợp với định vị thương hiệu FinPeace.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-white/30 text-sm animate-pulse">Đang tải...</div>
        </div>
      ) : frameworks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 gap-4">
          <span className="text-5xl opacity-20">📄</span>
          <p className="text-white/30 text-sm">Chưa có framework nào.</p>
          <p className="text-white/20 text-xs">Bấm "Seed 4 frameworks mẫu" để bắt đầu.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {frameworks.map((fw) => {
            const cfg = TYPE_CONFIG[fw.framework_type] || TYPE_CONFIG['Custom']
            const isOpen = expanded === fw.id
            const isEditing = editing?.id === fw.id

            return (
              <div
                key={fw.id}
                className={`border rounded-2xl overflow-hidden transition-all ${cfg.border} ${isOpen ? cfg.bg : 'bg-white/5 hover:bg-white/8'}`}
              >
                {/* Header row */}
                <div
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer"
                  onClick={() => {
                    if (!isEditing) setExpanded(isOpen ? null : fw.id)
                  }}
                >
                  <span className="text-2xl">{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-black text-white">{fw.name}</h3>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                        {fw.framework_type}
                      </span>
                      {!fw.is_active && (
                        <span className="text-[10px] font-bold text-white/30 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                          Tắt
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{fw.description}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-white/30">{fw.steps?.length} bước</span>
                    <span className={`text-white/30 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div className="border-t border-white/10 px-6 py-5">
                    {isEditing ? (
                      /* Edit mode */
                      <div className="space-y-6">
                        {/* Name + Description */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-2 block">Tên Framework</label>
                            <input
                              value={editing.name}
                              onChange={e => setEditing({ ...editing, name: e.target.value })}
                              className="w-full text-sm text-white bg-white/5 border border-white/15 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-2 block">Mô tả ngắn</label>
                            <input
                              value={editing.description}
                              onChange={e => setEditing({ ...editing, description: e.target.value })}
                              className="w-full text-sm text-white bg-white/5 border border-white/15 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        {/* Steps */}
                        <div>
                          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-3 block">
                            📋 Các Bước ({editing.steps?.length})
                          </label>
                          <div className="space-y-4">
                            {editing.steps?.map((step, i) => (
                              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-black flex items-center justify-center flex-shrink-0">
                                    {i + 1}
                                  </span>
                                  <input
                                    value={step.label}
                                    onChange={e => {
                                      const newSteps = [...editing.steps]
                                      newSteps[i] = { ...step, label: e.target.value }
                                      setEditing({ ...editing, steps: newSteps })
                                    }}
                                    className="flex-1 text-sm font-bold text-white bg-transparent border-b border-white/20 focus:outline-none focus:border-amber-400 pb-1"
                                  />
                                </div>
                                <textarea
                                  value={step.description}
                                  onChange={e => {
                                    const newSteps = [...editing.steps]
                                    newSteps[i] = { ...step, description: e.target.value }
                                    setEditing({ ...editing, steps: newSteps })
                                  }}
                                  rows={2}
                                  placeholder="Hướng dẫn viết bước này..."
                                  className="w-full text-xs text-white/70 bg-transparent border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 resize-none"
                                />
                                <textarea
                                  value={step.example}
                                  onChange={e => {
                                    const newSteps = [...editing.steps]
                                    newSteps[i] = { ...step, example: e.target.value }
                                    setEditing({ ...editing, steps: newSteps })
                                  }}
                                  rows={2}
                                  placeholder="Ví dụ mẫu cho bước này..."
                                  className="w-full text-xs text-emerald-300/70 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-400 resize-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tone guide & Use cases */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] font-black uppercase tracking-widest text-purple-400/70 mb-2 block">💬 Tone of Voice</label>
                            <textarea
                              value={editing.tone_guide}
                              onChange={e => setEditing({ ...editing, tone_guide: e.target.value })}
                              rows={3}
                              className="w-full text-sm text-white/80 bg-white/5 border border-white/15 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-black uppercase tracking-widest text-blue-400/70 mb-2 block">🎯 Use Cases (mỗi dòng 1)</label>
                            <textarea
                              value={editing.use_cases?.join('\n')}
                              onChange={e => setEditing({ ...editing, use_cases: e.target.value.split('\n').filter(Boolean) })}
                              rows={3}
                              className="w-full text-sm text-white/80 bg-white/5 border border-white/15 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 resize-none"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-bold hover:bg-amber-500/30 transition-all disabled:opacity-50"
                          >
                            {saving ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            className="px-5 py-2 rounded-xl bg-white/5 border border-white/15 text-white/40 text-sm font-bold hover:bg-white/10 transition-all"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View mode */
                      <div className="space-y-6">
                        {/* Steps */}
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-4">📋 Các Bước Thực Hiện</p>
                          <div className="space-y-3">
                            {fw.steps?.map((step, i) => (
                              <div key={i} className="flex gap-4">
                                <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 text-white/60 text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {i + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-white mb-1">{step.label}</p>
                                  <p className="text-xs text-white/50 mb-2 leading-relaxed">{step.description}</p>
                                  {step.example && (
                                    <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 mb-1">📝 Ví dụ mẫu</p>
                                      <p className="text-xs text-emerald-300/80 italic leading-relaxed">"{step.example}"</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Meta info */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-purple-400/60 mb-2">💬 Tone of Voice</p>
                            <p className="text-xs text-white/50 leading-relaxed">{fw.tone_guide}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-blue-400/60 mb-2">🎯 Dùng cho</p>
                            <ul className="space-y-1">
                              {fw.use_cases?.map((uc, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs text-white/50">
                                  <span className="text-blue-400 text-[8px]">▸</span>
                                  {uc}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-amber-400/60 mb-2">📌 Ghi chú</p>
                            <p className="text-xs text-white/50 leading-relaxed">{fw.example}</p>
                          </div>
                        </div>

                        {/* Edit button */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => setEditing(fw)}
                            className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white/40 text-xs font-bold hover:bg-white/10 hover:text-white/70 transition-all"
                          >
                            ✏️ Chỉnh sửa framework này
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
