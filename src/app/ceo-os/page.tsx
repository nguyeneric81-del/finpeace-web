export default function CeoOsHomePage() {
  const modules = [
    {
      icon: '📡',
      title: 'Tín hiệu thị trường',
      subtitle: 'M1 — Market Signals',
      desc: 'Crawl tin tức RSS, phân tích AI, duyệt và phát hành tín hiệu đến Agents.',
      href: '/ceo-os/signals',
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30',
      badge: 'bg-blue-500/20 text-blue-300',
      status: 'Live',
    },
    {
      icon: '🎯',
      title: 'Chân dung khách hàng',
      subtitle: 'M2 — Customer Personas',
      desc: 'Cấu hình các tệp khách hàng (F0, Sói già...), định nghĩa Pain-Points và tone nhắn tin.',
      href: '/ceo-os/personas',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-300',
      status: 'Live',
    },
    {
      icon: '✍️',
      title: 'Khung nội dung',
      subtitle: 'M3 — Content Frameworks',
      desc: 'Quản lý các cấu trúc viết bài AIDA, Pain-Lesson-Gift, hook templates cho Agents sử dụng.',
      href: '#',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30',
      badge: 'bg-purple-500/20 text-purple-300',
      status: 'Coming Soon',
    },
    {
      icon: '📊',
      title: 'Hiệu suất Agents',
      subtitle: 'M4 — Performance Monitor',
      desc: 'Theo dõi lead inflow, conversion rate, và content performance của từng Agent.',
      href: '#',
      color: 'from-orange-500/20 to-amber-500/10 border-orange-500/30',
      badge: 'bg-orange-500/20 text-orange-300',
      status: 'Coming Soon',
    },
  ]

  return (
    <div className="p-8 space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-amber-400/70 mb-2">
          FinPeace CEO Command Center
        </p>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Xin chào, Chị Yến 👑
        </h1>
        <p className="text-white/40 mt-2 text-base">
          Trung tâm điều hành chiến lược — MarCom Department for 100 Brokers.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Sales Agents', value: '1', sub: 'Đang hoạt động', icon: '🤖' },
          { label: 'Tin tức hôm nay', value: '336', sub: 'Trong hệ thống', icon: '📰' },
          { label: 'Khách hàng tiềm năng', value: '38', sub: 'Agent leads', icon: '👥' },
          { label: 'Modules đang Live', value: '2', sub: 'Trên 7 modules', icon: '⚡' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-2"
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-3xl font-black text-white">{stat.value}</p>
            <div>
              <p className="text-xs font-bold text-white/70">{stat.label}</p>
              <p className="text-[11px] text-white/30">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modules grid */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-white/40 mb-5">
          Các Module Hệ Thống
        </h2>
        <div className="grid grid-cols-2 gap-5">
          {modules.map((mod) => (
            <a
              key={mod.title}
              href={mod.href}
              className={`
                group relative bg-gradient-to-br ${mod.color} border rounded-2xl p-6
                transition-all hover:scale-[1.01] hover:shadow-2xl
                ${mod.status === 'Coming Soon' ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{mod.icon}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${mod.badge}`}>
                  {mod.status}
                </span>
              </div>
              <p className="text-[11px] uppercase tracking-widest text-white/40 font-bold mb-1">{mod.subtitle}</p>
              <h3 className="text-lg font-black text-white mb-2">{mod.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{mod.desc}</p>
              {mod.status === 'Live' && (
                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-white/40 group-hover:text-white/70 transition-colors">
                  <span>Vào module</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
