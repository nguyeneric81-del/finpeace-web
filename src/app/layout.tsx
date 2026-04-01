import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { SalesRefCapture } from "@/components/SalesRefCapture";
import "./globals.css";

const svnPoppins = localFont({
  src: [
    {
      path: "../../public/fonts/svn-poppins/Poppins VH/SVN-Poppins-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/svn-poppins/Poppins VH/SVN-Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/svn-poppins/Poppins VH/SVN-Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/svn-poppins/Poppins VH/SVN-Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/svn-poppins/Poppins VH/SVN-Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-svn-poppins",
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
      <body className={`${svnPoppins.variable} font-sans antialiased`}>
        <Suspense fallback={null}><SalesRefCapture /></Suspense>
        {children}
      </body>
    </html>
  );
}
