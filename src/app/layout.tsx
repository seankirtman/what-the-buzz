import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display, Inter } from "next/font/google";
import { CartLink } from "@/components/cart-link";
import { Providers } from "@/components/providers";
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
        <Providers>
          <nav className="sticky top-0 z-50 border-b border-sage-200/40 bg-background/95 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-center gap-1.5 font-serif text-lg font-semibold text-foreground">
                <span>🐝</span> What&apos;s The Buzz
              </Link>
              <CartLink />
            </div>
          </nav>
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
        </Providers>
      </body>
    </html>
  );
}
