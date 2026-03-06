import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "What's The Buzz Gardens | Dahlia Flowers",
  description: "Beautiful dahlia flowers for sale. Browse our collection and message Dorrie to request your favorites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
        <footer className="border-t border-sage-200/40 py-4">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <Link
              href="/admin"
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground"
            >
              admin
            </Link>
          </div>
        </footer>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
