import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talents — منصة المواهب العربية",
  description: "ربط البراندات بأفضل المواهب والمؤثرين في العالم العربي",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
