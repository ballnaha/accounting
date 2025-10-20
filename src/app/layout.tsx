import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import ClientThemeProvider from "../theme/ClientThemeProvider";
import AuthProvider from "../components/providers/AuthProvider";
import "./globals.css";
import "../theme/isometric.css";

const sarabun = Sarabun({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'thai'],
  variable: '--font-sarabun',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ระบบจัดการตำแหน่ง",
  description: "ระบบจัดการข้อมูลสำหรับตำแหน่งงาน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={sarabun.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={sarabun.className} style={{ 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowX: 'hidden'
      }}>
        <AuthProvider>
          <ClientThemeProvider>
            <div style={{
              minHeight: '100vh',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'translateZ(0)',
            }}>
              {children}
            </div>
          </ClientThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
