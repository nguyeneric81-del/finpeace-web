export default function AdvisorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Layout bọc toàn bộ màn hình Advisor (iPad/Mobile)
    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased overflow-x-hidden">
            {children}
        </div>
    )
}
