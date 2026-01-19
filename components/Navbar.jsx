"use client";

import Link from "next/link";
import { ShieldCheck, Plus, Search, Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ModeToggle } from "./ModeToggle";
import { accessSnippet } from "@/utils/action";

// Shadcn imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Container from "./Container";

function SearchButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="ghost"
      className="h-10 w-10 flex items-center justify-center border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:bg-primary transition-all bg-card"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Search className="h-4 w-4" />
      )}
      <span className="sr-only">Search</span>
    </Button>
  );
}

export default function Navbar() {
  // ✅ Connected the server action
  const [state, action] = useActionState(accessSnippet, null);

  useEffect(() => {
    if (state && !state.success) toast.error(state.message);
  }, [state]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-black dark:border-white bg-background/95 backdrop-blur-sm">
      <Container>
        <div className="h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* --- Logo --- */}
          <Link
            href="/"
            className="group flex items-center gap-2 transition-transform active:scale-95 shrink-0"
          >
            <div className="p-1.5 bg-primary border-2 border-black dark:border-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] group-hover:shadow-none group-hover:dark:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            {/* Hidden on very small phones to make room for search */}
            <span className="font-black hover:text-primary hover:drop-shadow-[2px_3px_0_var(--shadow-color)]  dark:hover:drop-shadow-[2px_3px_0_var(--shadow-dark-color)]  text-4xl tracking-tight hidden sm:block">
              Sh...TEXT
            </span>
          </Link>

          {/* --- Search Bar --- */}
          <div className="flex-1 max-w-sm mx-2 sm:mx-4">
            <form action={action} className="flex w-full relative group">
              <Input
                type="text"
                name="accessCode"
                placeholder="Enter PIN..."
className="h-10  flex items-center justify-center border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)]  transition-all bg-card"                required
              />
              <SearchButton />
            </form>
          </div>

          {/* --- Right Actions (Responsive) --- */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* New Snippet Button */}
            <Link href="/">
              <Button
                variant="default"
                size="default"
                className="h-10 px-3 sm:px-4 rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none hover:dark:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2 font-bold bg-primary text-primary-foreground"
              >
                <Plus className="h-5 w-5 sm:h-4 sm:w-4" />
                <span className="hidden md:inline">New Snippet</span>
              </Button>
            </Link>

            {/* Theme Toggle Wrapper */}
            <div className="h-10 w-10 flex items-center justify-center border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none hover:dark:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-primary transition-all bg-card">
              <ModeToggle />
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}
