import Flashcard from '@/components/ui/Flashcard'

// Dữ liệu VCB giả lập (lấy từ Knowledgebase VCB 2026)
const flashcardsData = [
  {
    front: 'Tại sao VCB luôn có P/B (2.5x - 3.0x) vượt trội toàn ngành mà không phải vì tốc độ tăng trưởng?',
    back: 'Sự an toàn tuyệt đối. VCB sở hữu "Tảng băng trôi" LLR khổng lồ chặn trước rủi ro và tập khách hàng FDI/Nhà nước chất lượng, giữ dòng tiền bền vững bất chấp suy thoái.',
  },
  {
    front: 'Theo Graham, "Kháng thể bất diệt" giúp VCB miễn nhiễm nợ xấu là gì?',
    back: 'Bao phủ Nợ Xấu (LLR) duy trì ở mức 200%-300%. Tức là cứ 1 đồng nợ xấu thì VCB khóa ngay 2-3 đồng tiền mặt dự phòng. Nợ xấu vọt lên 5%, ngân hàng vẫn không thủng quỹ lợi nhuận.',
  },
  {
    front: 'Theo Buffett, "Con Hào Kinh Tế" mang lại dòng vốn giá siêu rẻ của VCB là gì?',
    back: 'Dòng tiền CASA vĩ đại. VCB là kho bạc mặc định để giao dịch của Ngân sách Nhà nước và các Tập đoàn mẹ, tạo ra nguồn vốn gần như miễn phí khổng lồ.',
  },
  {
    front: 'Triết lý cầm cổ phiếu Ngân hàng Vietcombank là gì?',
    back: 'Mua "Hầm trú ẩn hạt nhân". Đừng mong X2, X3 nhanh chóng, VCB là chiếc gối cao để ngủ ngon khi thị trường có biến động mạnh. Lợi suất ổn định, rủi ro cực thấp.',
  }
]

export default function FlashcardDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 selection:bg-amber-200">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
            Vietcombank (VCB)
            <span className="block text-2xl sm:text-3xl text-slate-500 mt-2 font-medium">
              Chương trình Đào tạo Kiến thức FinPeace
            </span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Hệ thống thẻ Flashcard giúp Agent và Khách hàng hấp thụ Insights đầu tư nhanh chóng và trực quan nhất.
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
        
        <footer className="text-center mt-24 text-sm text-slate-400">
          * Tính năng này có thể được tự động tạo qua Google NotebookLM (notebooklm-py API) *
        </footer>
      </div>
    </div>
  )
}
