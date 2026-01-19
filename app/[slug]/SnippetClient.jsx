"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock, Copy, Check, Clock, Unlock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifySnippetPassword } from "@/utils/action";
import Container from "@/components/Container";

export default function SnippetClient({ initialData, slug }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [isLocked, setIsLocked] = useState(initialData.isProtected);
  const [content, setContent] = useState(initialData.content || "");
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-copy link effect
  useEffect(() => {
    const isNew = searchParams?.get("new") === "1";
    if (!isNew) return;

    const cleanUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard
      .writeText(cleanUrl)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.message("Link ready"));

    router.replace(`/${slug}`, { scroll: false });
  }, [searchParams, slug, router]);

  // Unlock Function (Updated to use Server Action)
  const handleUnlock = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 👇 CHANGED: Calling Server Action directly instead of fetch()
      const result = await verifySnippetPassword(slug, passwordInput.trim());

      if (!result.success) {
        toast.error(result.message || "Incorrect password.");
        setLoading(false);
        return;
      }

      // Success: Action returns decrypted content
      setContent(result.content || "");
      setIsLocked(false);
      setPasswordInput("");
      toast.success("Snippet unlocked");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Copy Utilities
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

  // LOCKED STATE UI
  if (isLocked) {
    return (
      <Container>
        <div className="w-full max-w-md mx-auto bg-card border-2 border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-accent border-2 border-black dark:border-white flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)]">
            <Lock className="h-8 w-8 text-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground">
              Password Required
            </h2>
            <p className="text-sm font-mono text-muted-foreground mt-2">
              This snippet is locked.
            </p>
          </div>
          <form onSubmit={handleUnlock} className="space-y-4">
            <Input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              className="h-12 border-2 border-black dark:border-white focus-visible:ring-0 shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)]"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 font-bold bg-primary text-primary-foreground border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:dark:shadow-none transition-all"
            >
              {loading ? "Verifying..." : "Unlock Snippet"}
            </Button>
          </form>
        </div>
      </Container>
    );
  }

  // UNLOCKED STATE UI (No changes)
  return (
    <Container>
      <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-card p-4 border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center text-foreground font-mono font-bold text-sm bg-accent/30 px-3 py-1 border-2 border-black/10 dark:border-white/10">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              {initialData.expireAt === "Never"
                ? "Expires: Never"
                : `Expires: ${new Date(initialData.expireAt).toLocaleString()}`}
            </span>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={copyLink}
              variant="outline"
              className="h-10 border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:dark:shadow-none transition-all font-bold"
            >
              Copy Link
            </Button>
            <Button
              onClick={copyText}
              className="h-10 border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:dark:shadow-none transition-all font-bold bg-primary text-primary-foreground"
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
        <div className="bg-card border-2 border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] overflow-hidden">
          {/* Decorative Bar */}
          <div className="bg-muted border-b-2 border-black dark:border-white px-4 py-3 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 border-2 border-black bg-background rounded-full" />
              <div className="w-3 h-3 border-2 border-black bg-background rounded-full" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Decrypted Content
            </span>
          </div>

          <pre className="p-6 sm:p-8 font-mono text-sm sm:text-base text-foreground bg-background whitespace-pre-wrap overflow-auto max-h-[70vh]">
            {content}
          </pre>
        </div>

        <div className="text-center pt-8">
          <Link
            href="/"
            className="text-sm font-bold text-muted-foreground hover:text-primary hover:underline"
          >
            ← Create a new snippet
          </Link>
        </div>
      </div>
    </Container>
  );
}
