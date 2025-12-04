import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "chromaflow",
  description:
    "A visual flow editor for creating parametric color palettes and generating CSS variables",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          crossOrigin="anonymous"
          data-client-id="bGWXubvTBjxhiNaf5qOxZ"
          data-track-attributes="true"
          data-track-outgoing-links="true"
          src="https://cdn.databuddy.cc/databuddy.js"
        />
      </head>
      <body className={`${geistMono.variable} font-mono antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
