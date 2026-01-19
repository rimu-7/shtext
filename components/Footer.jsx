import Link from "next/link";
import Container from "./Container";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "mailto:rimu_mutasim@yahoo.com" },
    { label: "Privacy", href: "/privacy-policy" },
    {
      label: "GitHub",
      href: "https://github.com/rimu-7/snippet-share",
      external: true,
    },
  ];

  return (
    <Container>
      <div className="py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          {/* LEFT: BRAND TEXT */}
          <div className="space-y-2">
            <Link
            href="/"
            className="group flex items-center gap-2 transition-transform active:scale-95 shrink-0"
          >
            <div className="p-1.5 bg-primary border-2 border-black dark:border-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] group-hover:shadow-none group-hover:dark:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            {/* Hidden on very small phones to make room for search */}
            <span className="font-black text-4xl hover:text-primary tracking-tight hidden hover:drop-shadow-[2px_3px_0_var(--shadow-color)] dark:hover:drop-shadow-[2px_3px_0_var(--shadow-dark-color)]  sm:block">
              Sh...TEXT
            </span>
          </Link>
            <p className="font-mono text-sm font-bold text-muted-foreground max-w-xs">
              Secure. Encrypted. Transient.
              <br />
              The open-source pastebin for secrets.
            </p>
          </div>

          {/* RIGHT: TEXT LINKS (Neo-Brutalist Chips) */}
          <div className="flex flex-wrap gap-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="group font-mono relative inline-block hover:text-primary duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* BOTTOM: COPYRIGHT */}
        <div className="mt-12 pt-6 border-t-2 border-dashed border-black/20 dark:border-white/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
            &copy; {currentYear} Sh...Text
          </p>
          <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
            Zero Knowledge Architecture
          </p>
        </div>
      </div>
    </Container>
  );
}
