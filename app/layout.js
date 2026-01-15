import { Domine, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

// Serif Font
const domine = Domine({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-domine",
});

// Sans Font (Requested by Theme)
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

// Mono Font (Requested by Theme)
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata = {
  title: "Sh.. Text",
  description: "Share text securely with temporary links.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${domine.variable} ${dmSans.variable} ${spaceMono.variable} font-sans h-full antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Toaster 
            position="top-center" 
            richColors 
            closeButton 
            className="font-sans" 
            toastOptions={{
              className: "border-2 border-black shadow-sm" // Force toaster to match theme
            }}
          />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}