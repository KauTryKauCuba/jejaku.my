import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Jejaku - Modern Solutions for Customer Engagement",
  description: "Highly customizable components for building modern websites and applications that look and feel the way you mean it.",
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative">
        <ThemeProvider>
          <div className="fixed inset-0 -z-50 size-full bg-dot-grid pointer-events-none" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
