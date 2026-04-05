'use client'

import { useEffect, useState } from 'react'

type Persona = {
  id: string
  name: string
  avatar_slug: string
  pain_points: string[]
  content_triggers: string[]
  tone_of_voice: string
  updated_by: string | null
  updated_at: string
}

const DEFAULT_PERSONAS: Omit<Persona, 'id' | 'updated_by' | 'updated_at'>[] = [
  {
    name: 'F0 Hoang Mang',
    avatar_slug: 'f0-confused',
    pain_points: [
      'Không biết bắt đầu từ đâu',
      'Sợ mất tiền, không tin tưởng vào hệ thống',
      'Bị thông tin nhiễu loạn từ mạng xã hội',
    ],
    content_triggers: [
      'Câu chuyện thành công của newbie thực tế',
      'Giải thích đơn giản, không dùng thuật ngữ',
      'Cam kết rõ ràng về risk management',
    ],
    tone_of_voice: 'Ấm áp, kiên nhẫn, không phán xét. Dùng ngôn ngữ đời thường.',
  },
  {
    name: 'Sói Già Cắt Lỗ',
    avatar_slug: 'veteran-returner',
    pain_points: [
      'Từng thua lỗ nặng, mất niềm tin vào thị trường',
      'Cảm giác bị lừa bởi các tư vấn trước đây',
      'Muốn "gỡ vốn" nhưng sợ rủi ro tiếp theo',
    ],
    content_triggers: [
      'Minh bạch hoàn toàn về cả rủi ro lẫn cơ hội',
      'Hệ thống quản trị rủi ro rõ ràng, có stop-loss cụ thể',
      'Bằng chứng track record thực tế, không hứa hẹn viển vông',
    ],
    tone_of_voice: 'Tôn trọng, thẳng thắn, đồng cảm. Không hứa quá. Chứng minh bằng data.',
  },
  {
    name: 'Nhà Đầu Tư Giá Trị',
    avatar_slug: 'value-investor',
    pain_points: [
      'Thiếu thời gian để nghiên cứu doanh nghiệp sâu',
      'Không biết phân tích báo cáo tài chính',
      'Muốn đầu tư dài hạn nhưng cần guidance',
    ],
    content_triggers: [
      'Phân tích cơ bản chuyên sâu theo phương pháp Buffett/Graham',
      'Định giá cổ phiếu với Margin of Safety rõ ràng',
      'Portfolio review định kỳ với logic đầu tư minh bạch',
    ],
    tone_of_voice: 'Chuyên nghiệp, logic, có chiều sâu. Trích dẫn dữ liệu và nguyên tắc đầu tư.',
  },
]

const AVATAR_EMOJI: Record<string, string> = {
  'f0-confused': '🌱',
  'veteran-returner': '🐺',
  'value-investor': '📚',
}

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Persona | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [seeding, setSeeding] = useState(false)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadPersonas = async () => {
    try {
      const res = await fetch('/api/admin/personas')
      const data = await res.json()
      if (data.success) setPersonas(data.personas)
    } catch (e) {
      showToast('Lỗi tải personas!', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPersonas()
  }, [])

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const res = await fetch('/api/admin/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personas: DEFAULT_PERSONAS }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('✅ Đã seed 3 personas mặc định!')
        loadPersonas()
      } else {
        showToast(`❌ ${data.error}`, 'error')
      }
    } catch (e) {
      showToast('Lỗi kết nối!', 'error')
    } finally {
      setSeeding(false)
    }
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/personas/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editing.name,
          pain_points: editing.pain_points,
          content_triggers: editing.content_triggers,
          tone_of_voice: editing.tone_of_voice,
        }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('✅ Đã lưu persona!')
        setEditing(null)
        loadPersonas()
      } else {
        showToast(`❌ ${data.error}`, 'error')
      }
    } catch (e) {
      showToast('Lỗi lưu!', 'error')
    } finally {
      setSaving(false)
    }
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
          <p className="text-xs font-black uppercase tracking-widest text-emerald-400/70 mb-1">Module 2</p>
          <h1 className="text-3xl font-black text-white">🎯 Chân Dung Khách Hàng</h1>
          <p className="text-white/40 mt-1 text-sm">Định nghĩa các Avatar KH để Agents biết cách nói chuyện đúng cách</p>
        </div>
        {personas.length === 0 && !loading && (
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold hover:bg-emerald-500/30 transition-all disabled:opacity-50"
          >
            {seeding ? '⏳ Đang tạo...' : '🌱 Seed 3 personas mẫu'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="text-white/30 text-sm animate-pulse">Đang tải...</div>
        </div>
      ) : personas.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 gap-4">
          <span className="text-5xl opacity-20">🎭</span>
          <p className="text-white/30 text-sm">Chưa có persona nào.</p>
          <p className="text-white/20 text-xs">Bấm "Seed 3 personas mẫu" để bắt đầu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
            >
              {editing?.id === persona.id ? (
                /* Edit mode */
                <div className="space-y-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{AVATAR_EMOJI[persona.avatar_slug] || '🎯'}</span>
                    <div>
                      <input
                        value={editing.name}
                        onChange={e => setEditing({ ...editing, name: e.target.value })}
                        className="text-lg font-black text-white bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-amber-400"
                      />
                      <p className="text-xs text-white/30 mt-1">{persona.avatar_slug}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-red-400/70 mb-2 block">
                      😤 Pain Points (mỗi dòng 1 nỗi đau)
                    </label>
                    <textarea
                      value={editing.pain_points.join('\n')}
                      onChange={e => setEditing({ ...editing, pain_points: e.target.value.split('\n').filter(Boolean) })}
                      rows={4}
                      className="w-full text-sm text-white/80 bg-white/5 border border-white/15 rounded-xl p-3 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-blue-400/70 mb-2 block">
                      ⚡ Content Triggers (mỗi dòng 1 trigger)
                    </label>
                    <textarea
                      value={editing.content_triggers.join('\n')}
                      onChange={e => setEditing({ ...editing, content_triggers: e.target.value.split('\n').filter(Boolean) })}
                      rows={4}
                      className="w-full text-sm text-white/80 bg-white/5 border border-white/15 rounded-xl p-3 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-purple-400/70 mb-2 block">
                      💬 Tone of Voice
                    </label>
                    <textarea
                      value={editing.tone_of_voice}
                      onChange={e => setEditing({ ...editing, tone_of_voice: e.target.value })}
                      rows={2}
                      className="w-full text-sm text-white/80 bg-white/5 border border-white/15 rounded-xl p-3 focus:outline-none focus:border-amber-400 resize-none"
                    />
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
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{AVATAR_EMOJI[persona.avatar_slug] || '🎯'}</span>
                      <div>
                        <h3 className="text-lg font-black text-white">{persona.name}</h3>
                        <p className="text-xs text-white/30">{persona.avatar_slug}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditing(persona)}
                      className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white/40 text-xs font-bold hover:bg-white/10 hover:text-white/70 transition-all"
                    >
                      ✏️ Chỉnh sửa
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-red-400/70 mb-3">😤 Pain Points</p>
                      <ul className="space-y-2">
                        {persona.pain_points?.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                            <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-blue-400/70 mb-3">⚡ Content Triggers</p>
                      <ul className="space-y-2">
                        {persona.content_triggers?.map((t, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                            <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-purple-400/70 mb-3">💬 Tone of Voice</p>
                      <p className="text-xs text-white/60 leading-relaxed">{persona.tone_of_voice}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
