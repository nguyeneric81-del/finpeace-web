import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { Suspense } from "react";
import { SalesRefCapture } from "@/components/SalesRefCapture";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinPeace — Bình An Tài Chính",
  description: "Nền tảng tư vấn tài chính cá nhân nhẹ nhàng, bình an.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        <Suspense fallback={null}><SalesRefCapture /></Suspense>
        {children}
      </body>
    </html>
  );
}
