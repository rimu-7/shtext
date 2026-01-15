"use client";

import Link from "next/link";
import { ShieldCheck, Plus, Search, Loader2 } from "lucide-react";
import { accessSnippet } from "@/utils/action";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ModeToggle } from "./ModeToggle";

// Shadcn imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SearchButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="ghost"
      className="h-10 rounded-none border-2 border-l-0 border-black dark:border-white bg-accent text-accent-foreground px-3 hover:bg-accent/80 transition-colors"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Search className="h-4 w-4" />
      )}
    </Button>
  );
}

export default function Navbar() {
  const [state, action] = useActionState(accessSnippet, null);

  useEffect(() => {
    if (state && !state.success) toast.error(state.message);
  }, [state]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-black dark:border-white bg-background/95 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* --- Logo --- */}
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

        {/* --- Search Bar --- */}
        <div className="flex-1 max-w-sm mx-4">
          <form action={action} className="flex w-full relative group">
            <Input
              type="text"
              name="accessCode"
              placeholder="Enter PIN..."
              // Fixed: Focus shadow is now white in dark mode
              className="h-10 rounded-none border-2 border-black dark:border-white bg-background focus-visible:ring-0 focus-visible:shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:focus-visible:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-all font-mono placeholder:text-muted-foreground/70"
              required
            />
            <SearchButton />
          </form>
        </div>

        {/* --- Right actions --- */}
        <div className="hidden md:flex items-center gap-4">
          {/* New Snippet Button */}
          <Link href="/">
            <Button
              variant="default"
              // Fixed: Added dark mode white shadow
              className="h-10 rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none hover:dark:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2 font-bold bg-primary text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Snippet</span>
            </Button>
          </Link>

          {/* Dark/Light Toggle */}
          {/* Fixed: Wrapper now has correct dark mode shadow (white) instead of accent color */}
          <div className="border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none hover:dark:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all bg-card">
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
