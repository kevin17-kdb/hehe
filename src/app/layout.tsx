import type { Metadata } from "next";
import { Cormorant_Garamond, Dancing_Script, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-heading",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-handwriting",
});

export const metadata: Metadata = {
  title: "Our Little Journey | For My Bubuuuuu",
  description: "An interactive cinematic journey through our sweetest memories, puzzles, and dreams.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorantGaramond.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full h-full bg-[#030712] text-neutral-100 overflow-x-hidden overflow-y-auto select-none font-sans">
        {children}
      </body>
    </html>
  );
}
