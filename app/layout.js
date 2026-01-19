import { Domine, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";

// Serif Font
const domine = Domine({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-domine",
});

// Sans Font
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

// Mono Font
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

// 1. Separate Viewport (Next.js 14+ Best Practice)
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// 2. The SEO Metadata
export const metadata = {
  metadataBase: new URL("https://sh.rimubhai.com"),
  title: {
    default: "Sh...Text | Secure Self-Destructing Notes",
    template: "%s | Sh...Text",
  },
  description:
    "Share passwords, API keys, and sensitive text securely. Zero-knowledge encryption. Links expire automatically. No logs. The best Privnote alternative.",
  keywords: [
    "secure pastebin",
    "self-destructing notes",
    "encrypted text share",
    "password share",
    "temporary notes",
    "privnote alternative",
    "zero knowledge encryption",
    "secure note",
  ],
  authors: [{ name: "Rimu", url: "https://github.com/rimu-7" }],
  creator: "Rimu",
  publisher: "Sh...Text",

  // Instructions for Google Bots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Social Media Previews
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sh.rimubhai.com",
    siteName: "Sh...Text",
    title: "Sh...Text | Share Secrets Securely",
    description:
      "Encrypt and share text that self-destructs. 100% secure, open-source, and transient.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sh...Text Secure Notes",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Sh...Text | Secure Self-Destructing Notes",
    description:
      "Share passwords and secrets securely. They vanish automatically.",
    images: ["/og-image.png"],
    creator: "@your_twitter_handle",
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // Verification (Optional: Get code from Google Search Console)
  verification: {
    google: "zRjKUl7AelX-3eGrv-UUFVBRGxoO_CWU9QJNTsi1yl4",
  },
};

export default function RootLayout({ children }) {
  // 3. Structured Data (JSON-LD)
  // This helps Google understand your site is a Software Application
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Sh...Text",
    url: "https://sh.rimubhai.com",
    description: "A secure, encrypted, self-destructing pastebin application.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList:
      "AES-256 Encryption, Self-Destructing Links, Password Protection",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${domine.variable} ${dmSans.variable} ${spaceMono.variable} font-sans h-full antialiased`}
      >
        {/* Inject JSON-LD */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Toaster
              position="top-center"
              richColors
              closeButton
              className="font-sans"
              toastOptions={{
                className: "border-2 border-black shadow-sm",
              }}
            />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
