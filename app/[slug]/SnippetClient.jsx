"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock, Copy, Check, Clock } from "lucide-react";
import Link from "next/link";

export default function SnippetClient({ initialData, slug }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLocked, setIsLocked] = useState(initialData.isProtected);
  const [content, setContent] = useState(initialData.content || "");
  const [passwordInput, setPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ✅ auto-copy link after create
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
        router.replace(`/${slug}`, { scroll: false }); // remove ?new=1
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
          password: passwordInput.trim(), // ✅ trim here too
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
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200  p-8 text-center space-y-6">
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          <Lock className="h-6 w-6 text-gray-600" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Password Required
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            This snippet is protected.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            required
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter password"
            className="block w-full rounded-lg border-gray-300 border focus:border-gray-900 focus:ring-gray-900 sm:text-sm px-3 py-2.5"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 focus:ring-4 focus:ring-gray-100 transition-all disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Unlock Snippet"}
          </button>
        </form>

        {/* still allow link copy while locked */}
        <button
          onClick={copyLink}
          className="w-full py-2.5 px-4 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Copy Link
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="h-4 w-4 mr-2" />
          <span>
            Expires: {new Date(initialData.expireAt).toLocaleString()}
          </span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={copyLink}
            className="flex-1 sm:flex-none justify-center items-center flex gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Copy Link
          </button>

          <button
            onClick={copyText}
            className="flex-1 sm:flex-none justify-center items-center flex gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy Text"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
          </div>
          <span className="ml-2 text-xs text-gray-400 font-mono">Raw Text</span>
        </div>

        <pre className="p-6 sm:p-8 font-mono text-sm sm:text-base text-gray-800 whitespace-pre-wrap leading-relaxed overflow-auto max-h-[70vh]">
          {content}
        </pre>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors hover:underline"
        >
          Create a new snippet
        </Link>
      </div>
    </div>
  );
}
