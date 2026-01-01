import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://beritaae.com"
  ),
  title: {
    default: "BeritaAE - Portal Berita Terkini Indonesia",
    template: "%s | BeritaAE",
  },
  description:
    "BeritaAE adalah portal berita terdepan dengan informasi terkini, akurat, dan terpercaya untuk Indonesia. Baca berita politik, ekonomi, teknologi, olahraga, dan hiburan.",
  keywords: [
    "berita",
    "indonesia",
    "news",
    "politik",
    "ekonomi",
    "teknologi",
    "olahraga",
    "hiburan",
  ],
  authors: [{ name: "BeritaAE" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://beritaae.com",
    siteName: "BeritaAE",
    title: "BeritaAE - Portal Berita Terkini Indonesia",
    description:
      "Portal berita terdepan dengan informasi terkini, akurat, dan terpercaya untuk Indonesia.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BeritaAE - Portal Berita Terkini Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BeritaAE - Portal Berita Terkini Indonesia",
    description:
      "Portal berita terdepan dengan informasi terkini, akurat, dan terpercaya untuk Indonesia.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <MainLayoutWrapper>{children}</MainLayoutWrapper>
          </AuthProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
