import Link from "next/link";
import { ShieldCheck, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t-2 border-black dark:border-white bg-background mt-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          {/* Brand / Logo Area */}
          <Link
            href="/"
            className="group flex items-center gap-2 transition-transform active:scale-95 shrink-0"
          >
            <div className="p-1.5 bg-primary border-2 border-black dark:border-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] group-hover:shadow-none group-hover:dark:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-black text-xl tracking-tight hidden sm:block">
              Sh...TEXT
            </span>
          </Link>

          {/* Copyright Text */}
          <div className="text-xs font-mono font-bold text-muted-foreground order-3 md:order-2">
            &copy; {new Date().getFullYear()} • Encrypted & Transient
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-sm font-bold order-2 md:order-3">
            <Link
              href="/privacy-policy"
              className="text-foreground hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4"
            >
              Privacy Policy
            </Link>

            <a
              href="https://github.com/rimu-7/snippet-share"
              target="_blank"
              rel="noreferrer"
              className="group p-2 bg-card border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] dark:hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
