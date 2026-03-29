'use client'
import { useState } from 'react'

interface FlashcardProps {
  front: string
  back: string
  index: number
  total: number
}

export default function Flashcard({ front, back, index, total }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className="relative w-full aspect-[4/3] sm:aspect-video max-w-2xl mx-auto cursor-pointer group [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`w-full h-full transition-transform duration-700 [transform-style:preserve-3d] relative ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front Face: Q */}
        <div className="absolute inset-0 [backface-visibility:hidden] w-full h-full bg-[#0D0D18] rounded-3xl shadow-2xl border border-emerald-500/30 p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
          {/* Subtle Glow Overlay */}
          <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full opacity-20 bg-emerald-500 blur-3xl pointer-events-none" />
          
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500/50 to-teal-400/50" />
          
          <div className="flex justify-between items-center text-emerald-400/80 text-xs sm:text-sm font-bold tracking-widest uppercase z-10">
            <span className="flex items-center gap-2">
              <span className="text-xl opacity-80">🤔</span> Concept / Tư duy
            </span>
            <span className="opacity-70">Thẻ {index}/{total}</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center text-center z-10">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              {front}
            </h3>
          </div>
          
          <div className="text-center text-emerald-500/70 text-xs font-semibold animate-pulse z-10 uppercase tracking-widest">
            Chạm để lật thẻ ➔
          </div>
        </div>

        {/* Back Face: A */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] w-full h-full bg-[#0D0D18] rounded-3xl shadow-2xl border border-teal-500/30 p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
          {/* Subtle Glow Overlay */}
          <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full opacity-15 bg-teal-400 blur-3xl pointer-events-none" />
          
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400/50 to-emerald-500/50" />
          
          <div className="flex justify-between items-center text-teal-400/80 text-xs sm:text-sm font-bold tracking-widest uppercase z-10">
            <span className="flex items-center gap-2">
              <span className="text-xl opacity-80">💡</span> Giải mã / Trọng tâm
            </span>
            <span className="opacity-70">Thẻ {index}/{total}</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center text-center z-10 mt-4 overflow-y-auto custom-scrollbar">
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-200 leading-relaxed font-medium">
              {back}
            </p>
          </div>
          
          <div className="text-center text-teal-500/70 text-xs font-semibold mt-4 z-10 uppercase tracking-widest">
            Chạm để quay lại ↺
          </div>
        </div>
      </div>
    </div>
  )
}
