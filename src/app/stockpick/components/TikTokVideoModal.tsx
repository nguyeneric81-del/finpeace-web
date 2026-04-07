'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play } from 'lucide-react'

export const LEARNING_VIDEOS = [
  { id: 1, url: '/videos/entry_zone.mp4', title: 'Entry Zone là gì?', desc: 'Tại sao lại là Vùng Mua mà không phải Giá Mua?' },
  { id: 2, url: '/videos/stop_loss.mp4', title: 'Stop Loss & R:R', desc: 'Bảo hiểm cháy tài khoản và bài toán Xác Suất' },
  { id: 3, url: '/videos/entry_zone.mp4', title: 'Follow deal đúng cách', desc: 'Sự kiên nhẫn làm nên Kỷ luật (Sắp ra mắt)' },
]

interface TikTokVideoModalProps {
  initialIndex: number
  onClose: () => void
}

export default function TikTokVideoModal({ initialIndex, onClose }: TikTokVideoModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track which videos are playing to show/hide the center play button icon when paused
  const [playingState, setPlayingState] = useState<Record<number, boolean>>({})

  useEffect(() => {
    // Scroll correctly to initial index
    if (containerRef.current) {
      containerRef.current.scrollTo(0, initialIndex * window.innerHeight)
    }
  }, [initialIndex])

  useEffect(() => {
    const options = { root: containerRef.current, threshold: 0.6 }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement
        const idx = Number(video.dataset.index)

        if (entry.isIntersecting) {
          video.play().then(() => {
             setPlayingState(prev => ({ ...prev, [idx]: true }))
          }).catch((err) => console.log('Autoplay blocked', err))
        } else {
          video.pause()
          video.currentTime = 0
          setPlayingState(prev => ({ ...prev, [idx]: false }))
        }
      })
    }, options)

    const vids = document.querySelectorAll('.tiktok-video')
    vids.forEach(v => observer.observe(v))

    return () => observer.disconnect()
  }, [])

  const togglePlay = (videoEl: HTMLVideoElement, idx: number) => {
    if (videoEl.paused) {
      videoEl.play();
      setPlayingState(prev => ({ ...prev, [idx]: true }))
    } else {
      videoEl.pause();
      setPlayingState(prev => ({ ...prev, [idx]: false }))
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-black text-white"
        style={{ height: '100dvh' }} // Support for iOS Safari toolbar jump
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-safe-top left-4 z-50 p-2.5 bg-black/40 backdrop-blur-md rounded-full mt-4"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Video Scroller Container */}
        <div 
          ref={containerRef}
          className="w-full h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
        >
          {LEARNING_VIDEOS.map((item, index) => (
            <div 
              key={item.id}
              className="relative w-full h-full snap-start snap-always flex items-center justify-center bg-[#0D0D18]"
              style={{ height: '100dvh' }}
              onClick={(e) => {
                const vid = e.currentTarget.querySelector('video')
                if (vid) togglePlay(vid, index)
              }}
            >
              <video
                data-index={index}
                className="tiktok-video w-full h-full object-cover"
                src={item.url}
                playsInline
                loop
                // preload="metadata"
              />

              {/* Play Pause Overlay indicator */}
              {!playingState[index] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                  <Play className="w-16 h-16 text-white/50 animate-pulse fill-white/30" />
                </div>
              )}
              
              {/* Overlay Metadata */}
              <div 
                className="absolute bottom-0 left-0 right-0 p-6 pt-24 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm">LESSON {index + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-1 text-white shadow-sm">{item.title}</h3>
                <p className="text-sm font-medium text-white/80 line-clamp-2">{item.desc}</p>
                <div className="mt-6 flex flex-col gap-1 items-center justify-center animate-bounce opacity-40">
                  <span className="text-[10px]">Vuốt lên/xuống</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
