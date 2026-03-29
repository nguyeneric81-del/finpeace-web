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
        <div className="absolute inset-0 [backface-visibility:hidden] w-full h-full bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-3xl shadow-xl border border-amber-200/60 p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 to-amber-500 opacity-80" />
          
          <div className="flex justify-between items-center text-amber-700/60 text-xs sm:text-sm font-bold tracking-widest uppercase">
            <span className="flex items-center gap-2">
              <span className="text-xl">🤔</span> Concept / Câu hỏi
            </span>
            <span>Card {index} of {total}</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center text-center z-10">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-800 leading-tight">
              {front}
            </h3>
          </div>
          
          <div className="text-center text-amber-600/80 text-sm font-medium animate-pulse">
            Chạm để lật thẻ ➔
          </div>
        </div>

        {/* Back Face: A */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100/50 rounded-3xl shadow-xl border border-emerald-200/60 p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-80" />
          
          <div className="flex justify-between items-center text-emerald-700/60 text-xs sm:text-sm font-bold tracking-widest uppercase">
            <span className="flex items-center gap-2">
              <span className="text-xl">💡</span> Giải mã / Lời giải
            </span>
            <span>Card {index} of {total}</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center text-center z-10 mt-4 overflow-y-auto custom-scrollbar">
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 leading-relaxed font-medium">
              {back}
            </p>
          </div>
          
          <div className="text-center text-emerald-600/80 text-sm font-medium mt-4">
            Chạm để quay lại ↺
          </div>
        </div>
      </div>
    </div>
  )
}
