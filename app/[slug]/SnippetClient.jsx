"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock, Copy, Check, Clock, Unlock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SnippetClient({ initialData, slug }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLocked, setIsLocked] = useState(initialData.isProtected);
  const [content, setContent] = useState(initialData.content || "");
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-copy link after create
  useEffect(() => {
    const isNew = searchParams?.get("new") === "1";
    if (!isNew) return;

    const cleanUrl = `${window.location.origin}/${slug}`;

    (async () => {
      try {
        await navigator.clipboard.writeText(cleanUrl);
        toast.success("Link copied");
      } catch {
        toast.message("Link ready", {
          description: "If it didn’t copy automatically, press “Copy Link”.",
        });
      } finally {
        router.replace(`/${slug}`, { scroll: false });
      }
    })();
  }, [searchParams, slug, router]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/snippet/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          slug,
          password: passwordInput.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        toast.error(data?.message || "Incorrect password.");
        return;
      }

      setContent(data.content || "");
      setIsLocked(false);
      setPasswordInput("");
      toast.success("Snippet unlocked");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    const cleanUrl = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(cleanUrl);
    toast.success("Link copied");
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  if (isLocked) {
    return (
      <div className="w-full max-w-md bg-card border-2 border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-accent border-2 border-black dark:border-white flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)]">
          <Lock className="h-8 w-8 text-foreground" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-foreground">
            Password Required
          </h2>
          <p className="text-sm font-mono text-muted-foreground mt-2">
            This snippet is locked behind a wall.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <Input
            type="password"
            required
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter password"
            className="h-12 border-2 border-black dark:border-white focus-visible:ring-0 focus-visible:shadow-[4px_4px_0_0_var(--primary)] transition-all"
          />
          <Button
            type="submit"
            disabled={loading}
            // FIX: Added dark:hover:shadow-[...white] to ensure the shrinking shadow is white in dark mode
            className="w-full h-12 text-base font-bold bg-primary text-primary-foreground border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:dark:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <span className="flex items-center gap-2">
                Unlock Snippet <Unlock className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <Button
          onClick={copyLink}
          variant="outline"
              className="h-10 rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none hover:dark:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2 font-bold bg-primary text-primary-foreground"
        >
          Copy Link
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Meta Bar */}
      <div className="bg-card p-4 border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center text-foreground font-mono font-bold text-sm bg-accent/30 px-3 py-1 border-2 border-black/10 dark:border-white/10 rounded-none">
          <Clock className="h-4 w-4 mr-2" />
          <span>
            Expires: {new Date(initialData.expireAt).toLocaleString()}
          </span>
        </div>

        <div className="flex gap-4 w-full sm:w-auto">
          {/* These buttons use hover:shadow-none, which correctly hides either the black or white shadow */}
          <Button
            onClick={copyLink}
            variant="outline"
            className="w-fit h-10 text-base font-bold   border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:dark:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
          >
            Copy Link
          </Button>

          <Button
            onClick={copyText}
            className="h-10 rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none hover:dark:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2 font-bold bg-primary text-primary-foreground"
            >
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? "Copied" : "Copy Text"}
          </Button>
        </div>
      </div>

      {/* Content Window */}
      <div className="bg-card border-2 border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] overflow-hidden relative">
        {/* Window Chrome */}
        <div className="bg-muted border-b-2 border-black dark:border-white px-4 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 border-2 border-black dark:border-white bg-background rounded-full hover:bg-red-400 transition-colors" />
            <div className="w-3 h-3 border-2 border-black dark:border-white bg-background rounded-full hover:bg-yellow-400 transition-colors" />
            <div className="w-3 h-3 border-2 border-black dark:border-white bg-background rounded-full hover:bg-green-400 transition-colors" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Raw Content
          </span>
        </div>

        {/* Text Area */}
        <pre className="p-6 sm:p-8 font-mono text-sm sm:text-base text-foreground bg-background whitespace-pre-wrap leading-relaxed overflow-auto max-h-[70vh] custom-scrollbar selection:bg-accent selection:text-accent-foreground">
          {content}
        </pre>
      </div>

      <div className="text-center pt-8">
        <Link
          href="/"
          className="inline-block text-sm font-bold text-muted-foreground hover:text-primary dark:hover:shadow-none transition-colors hover:underline decoration-2 underline-offset-4"
        >
          ← Create a new snippet
        </Link>
      </div>
    </div>
  );
}