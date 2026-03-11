import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

// Pillar config
const PILLAR_CONFIG: Record<string, { icon: string; label: string; color: string; accent: string }> = {
    'tam-ly-thi-truong':     { icon: '🧠', label: 'Tâm Lý Thị Trường',      color: '#1e1b4b', accent: '#818cf8' },
    'co-che-thi-truong':     { icon: '🏛️', label: 'Cơ Chế Thị Trường',      color: '#1c1917', accent: '#a8a29e' },
    'phan-tich-co-ban':      { icon: '📊', label: 'Phân Tích Cơ Bản',        color: '#052e16', accent: '#4ade80' },
    'dau-tu-gia-tri':        { icon: '🏰', label: 'Đầu Tư Giá Trị',          color: '#1c1917', accent: '#fb923c' },
    'dau-tu-tang-truong':    { icon: '🚀', label: 'Đầu Tư Tăng Trưởng',      color: '#083344', accent: '#22d3ee' },
    'phan-tich-ky-thuat':    { icon: '📈', label: 'Phân Tích Kỹ Thuật',      color: '#1e3a5f', accent: '#60a5fa' },
    'giao-dich-theo-xu-huong': { icon: '🐢', label: 'Giao Dịch Xu Hướng',   color: '#1a2e05', accent: '#a3e635' },
    'quan-ly-danh-muc':      { icon: '🗂️', label: 'Quản Lý Danh Mục',       color: '#0c4a6e', accent: '#38bdf8' },
    'quan-tri-rui-ro':       { icon: '🛡️', label: 'Quản Trị Rủi Ro',        color: '#450a0a', accent: '#f87171' },
    'ke-hoach-thuc-chien':   { icon: '⚔️', label: 'Kế Hoạch Thực Chiến',    color: '#1f2937', accent: '#10b981' },
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const pillar = searchParams.get('pillar') ?? ''
    const title = searchParams.get('title') ?? 'Thư Viện Kiến Thức'
    const description = searchParams.get('description') ?? 'Học đầu tư từ Graham, Buffett, Fisher — áp dụng vào TTCK Việt Nam'

    const cfg = PILLAR_CONFIG[pillar] ?? {
        icon: '📚',
        label: 'Thư Viện Kiến Thức',
        color: '#0f172a',
        accent: '#10b981',
    }

    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: cfg.color,
                    padding: '60px',
                    fontFamily: 'system-ui, sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Subtle radial glow */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '400px',
                    borderRadius: '50%',
                    background: `radial-gradient(ellipse, ${cfg.accent}18 0%, transparent 70%)`,
                    display: 'flex',
                }} />

                {/* Top: Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0px', zIndex: 1 }}>
                    <span style={{ color: '#10b981', fontSize: '36px', fontWeight: 900, letterSpacing: '-1px' }}>Fin</span>
                    <span style={{ color: '#10b981', fontSize: '36px', fontWeight: 900 }}>|</span>
                    <span style={{ color: '#10b981', fontSize: '36px', fontWeight: 900, letterSpacing: '-1px' }}>Peace</span>
                    {pillar && cfg.label !== 'Thư Viện Kiến Thức' && (
                        <span style={{
                            marginLeft: '20px',
                            backgroundColor: `${cfg.accent}22`,
                            color: cfg.accent,
                            fontSize: '14px',
                            fontWeight: 700,
                            padding: '4px 12px',
                            borderRadius: '999px',
                            border: `1px solid ${cfg.accent}44`,
                        }}>
                            {cfg.label}
                        </span>
                    )}
                </div>

                {/* Center: Icon + Title + Description */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: 1, flex: 1, justifyContent: 'center' }}>
                    <div style={{ fontSize: '72px', marginBottom: '24px', lineHeight: 1 }}>
                        {cfg.icon}
                    </div>
                    <div style={{
                        color: 'white',
                        fontSize: '52px',
                        fontWeight: 900,
                        lineHeight: 1.15,
                        marginBottom: '20px',
                        maxWidth: '800px',
                    }}>
                        {title}
                    </div>
                    <div style={{
                        color: '#94a3b8',
                        fontSize: '24px',
                        lineHeight: 1.5,
                        maxWidth: '750px',
                    }}>
                        {description}
                    </div>
                </div>

                {/* Bottom: URL + tag line */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
                    <div style={{
                        color: '#475569',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        <span style={{ color: cfg.accent }}>●</span>
                        <span>Bình An Tài Chính</span>
                    </div>
                    <div style={{ color: cfg.accent, fontSize: '20px', fontWeight: 700 }}>
                        finpeace.cloud
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    )
}
