import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import ClientThemeProvider from "../theme/ClientThemeProvider";
import AuthProvider from "../components/providers/AuthProvider";
import "./globals.css";

const sarabun = Sarabun({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'thai'],
  variable: '--font-sarabun',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ระบบจัดการบัญชี",
  description: "ระบบจัดการข้อมูลสำหรับหน่วยงานบัญชี",
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
      <body className={sarabun.className}>
        <AuthProvider>
          <ClientThemeProvider>
            {children}
          </ClientThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
