import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PILLARS } from '../../../data'
import { flashcardsRegistry } from '../../../content/phan-tich-doanh-nghiep/flashcards'
import Flashcard from '@/components/ui/Flashcard'

interface PageProps {
  params: { pillar: string; article: string }
}

export default function ArticleFlashcardPage({ params }: PageProps) {
  // Find pillar & article
  const pillar = PILLARS.find(p => p.slug === params.pillar)
  if (!pillar) return notFound()

  const article = pillar.articles.find(a => a.slug === params.article)
  if (!article) return notFound()

  // Find flashcard data for this article
  const flashcardsData = flashcardsRegistry[article.slug]
  if (!flashcardsData || flashcardsData.length === 0) return notFound()

  return (
    <div className="min-h-screen font-sans" style={{ background: '#090912' }}>
      
      {/* ── TOP BAR breadcrumb ── */}
      <div 
          className="sticky top-0 z-30 backdrop-blur-md"
          style={{ 
              background: 'rgba(9,9,18,0.85)',
              borderBottom: '1px solid rgba(255,255,255,0.07)'
          }}
      >
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-2 text-sm">
              <Link 
                href={`/knowledgebase/${pillar.slug}/${article.slug}`} 
                className="text-white/50 hover:text-white transition-colors flex items-center gap-2"
              >
                  <ArrowLeft className="w-4 h-4" /> 
                  <span>Quay lại Bài phân tích</span>
              </Link>
          </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 py-12 px-6">
        <header className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
             Flashcards: {article.title.replace('Đánh giá ', '')}
          </h1>
          <p className="text-emerald-400 font-medium">
             Tóm tắt siêu tốc các luận điểm đầu tư cốt lõi
          </p>
        </header>

        <section className="mt-16 space-y-16">
          {flashcardsData.map((card, index) => (
            <Flashcard 
              key={index} 
              front={card.front} 
              back={card.back} 
              index={index + 1} 
              total={flashcardsData.length} 
            />
          ))}
        </section>
        
        <footer className="text-center mt-24 text-xs font-semibold tracking-wider text-emerald-500/30 uppercase">
           [ FinPeace Subagent: Tự động tổng hợp từ Knowledgebase qua AI NotebookLM ]
        </footer>
      </div>
    </div>
  )
}
