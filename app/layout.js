import { Domine } from 'next/font/google';
import "./globals.css";
import { Toaster } from 'sonner';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const domine = Domine({
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-domine',
});

export const metadata = {
  title: "Sh.. Text",
  description: "Share text securely with temporary links.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${domine.className} h-full`}>
      <Navbar/>
        {children}
        <Toaster position="top-center" richColors closeButton />
        <Footer/>
      </body>
    </html>
  );
}