'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Play, CheckCircle } from 'lucide-react'

const LESSONS = [
  {
    id: 1,
    title: 'Entry Zone là gì?',
    desc: 'Vùng giá AI xác định an toàn để vào lệnh theo xác suất cao nhất.',
    duration: '2 phút',
  },
  {
    id: 2,
    title: 'Stop Loss & R:R',
    desc: 'Cách đặt cắt lỗ để bảo vệ danh mục, tỷ lệ Rủi ro:Lợi nhuận tối thiểu.',
    duration: '3 phút',
  },
  {
    id: 3,
    title: 'Follow deal đúng cách',
    desc: 'Khi nào nên follow, khi nào chờ pullback, khi nào bỏ qua deal.',
    duration: '2 phút',
  },
]

interface OnboardingBannerProps {
  completedCount?: number
}

export default function OnboardingBanner({ completedCount = 0 }: OnboardingBannerProps) {
  const allDone = completedCount >= LESSONS.length

  if (allDone) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          Bắt đầu đúng cách
        </h2>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.15)' }}>
          {completedCount}/{LESSONS.length} hoàn thành
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full mb-4 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / LESSONS.length) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #34d399, #10b981)' }}
        />
      </div>

      <div className="space-y-2.5">
        {LESSONS.map((lesson, i) => {
          const isDone = i < completedCount
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-3.5 flex items-start gap-3"
              style={{
                background: isDone ? 'rgba(52,211,153,0.05)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isDone ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.06)'}`,
                opacity: isDone ? 0.6 : 1,
              }}
            >
              {/* Step indicator */}
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: isDone
                    ? 'rgba(52,211,153,0.15)'
                    : i === completedCount
                      ? 'rgba(245,158,11,0.15)'
                      : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isDone ? 'rgba(52,211,153,0.2)' : i === completedCount ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                {isDone
                  ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                  : i === completedCount
                    ? <Play className="w-4 h-4 text-amber-400" />
                    : <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>{lesson.id}</span>
                }
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold mb-0.5 ${isDone ? 'line-through' : 'text-white'}`}
                  style={{ color: isDone ? '#34d399' : 'white' }}>
                  {lesson.title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {lesson.desc}
                </p>
              </div>

              <span className="text-[10px] shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {lesson.duration}
              </span>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
