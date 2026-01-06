import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { CartProvider } from "@/lib/cart";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pondok Kopi Potorono - Warisan Cita Rasa Nusantara",
  description: "Marketplace kopi premium Indonesia dengan berbagai pilihan kopi Arabica, Robusta, dan Blend terbaik dari seluruh Nusantara",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="id">
        <body
          className={`${geistSans.variable} ${geistMono.variable}`}
        >
          <CartProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
