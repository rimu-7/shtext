import Link from "next/link";
import { ShieldCheck, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          
          {/* Brand / Logo Area */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-50 rounded-md border border-gray-200">
               <ShieldCheck className="h-5 w-5 text-gray-700" />
            </div>
            <span className="font-semibold text-gray-900 tracking-tight text-sm">
              SHTEXT
            </span>
          </div>

          {/* Copyright Text */}
          <div className="text-xs sm:text-sm text-gray-500 order-3 md:order-2">
            &copy; {new Date().getFullYear()} • Encrypted & Transient
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-sm font-medium order-2 md:order-3">
             <Link 
              href="/privacy-policy" 
              className="text-gray-500 hover:text-gray-900 transition-colors hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            
            <a 
              href="https://github.com/rimu-7/snippet-share" 
              target="_blank" 
              rel="noreferrer"
              className="text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}