"use client";

import Link from "next/link";
import { ShieldCheck, Plus, Search, Loader2 } from "lucide-react";
import { accessSnippet } from "@/utils/action";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

// 1. Local definition of the button to avoid importing from Hero
function SearchButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-2 bg-gray-100 text-gray-600 hover:text-gray-900 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 disabled:opacity-70 transition-colors flex items-center justify-center min-w-[40px]"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Search className="h-4 w-4" />
      )}
    </button>
  );
}

export default function Navbar() {
  const [state, action] = useActionState(accessSnippet, null);

  // 2. Handle Search Errors (e.g., "Snippet not found")
  useEffect(() => {
    if (state && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* --- LEFT: Logo --- */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <div className="p-1.5 bg-gray-900 rounded-lg shadow-sm">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold hidden md:block text-gray-900 tracking-tight text-lg hidden sm:block">
            SecureSnippet
          </span>
        </Link>

        {/* --- MIDDLE: Search Bar (Hidden on Mobile) --- */}
       <div className="flex-1 max-w-sm ">
          <form action={action} className="w-full">
            <div className="flex rounded-md">
              <input
                type="text"
                name="accessCode"
                placeholder="Enter PIN..."
                className="block w-full rounded-l-lg rounded-r-xs border focus:outline-blue-500 border-gray-400 sm:text-sm py-2 px-3 placeholder:text-gray-400"
                required
              />
              <SearchButton />
            </div>
          </form>
        </div>

        {/* --- RIGHT: Actions --- */}
        <div className=" hidden md:block items-center gap-2 sm:gap-4">
          {/* Create New Button */}
          <Link
            href="/"
            className="inline-flex  items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all shadow-sm ring-1 ring-gray-900"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Snippet</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
