import connectDB from "@/utils/db";
import Snippet from "@/utils/Snippet";
import SnippetClient from "./SnippetClient";
import { decrypt } from "@/utils/crypto"; // 👈 New import
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export const dynamic = "force-dynamic";

async function getSnippet(slug) {
  await connectDB();
  const snippet = await Snippet.findOne({ slug }).lean();

  if (!snippet) return null;

  // Manual Expiry Check (Safety)
  if (snippet.expireAt && new Date(snippet.expireAt) <= new Date()) {
    await Snippet.deleteOne({ _id: snippet._id }).catch(() => {});
    return null;
  }

  const isProtected = !!snippet.password;
  let content = null;

  // If public, we decrypt on the server to show immediately
  if (!isProtected) {
    try {
      content = decrypt(snippet.content);
    } catch (e) {
      console.error("Decryption error on server:", e);
      content = "Error: Could not decrypt content.";
    }
  }

  return {
    isProtected,
    expireAt: snippet.expireAt ? new Date(snippet.expireAt).toISOString() : "Never",
    content, // Will be null if protected, or string if public
  };
}

export default async function ViewSnippet({ params }) {
  const { slug } = await params;
  const data = await getSnippet(slug);

  // 404 View
  if (!data) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border-2 border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-muted border-2 border-black dark:border-white mb-6 flex items-center justify-center">
            <FileQuestion className="h-8 w-8 text-foreground" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-2">Snippet not found</h1>
          <p className="text-muted-foreground font-medium font-mono text-sm mb-8">
            This link is invalid or the snippet has vanished into the void.
          </p>
          <Link href="/" className="h-10 justify-center border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex items-center gap-2 font-bold bg-primary text-primary-foreground p-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Create New Snippet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center pt-12 sm:pt-20 p-4 pb-20">
      <SnippetClient initialData={data} slug={slug} />
    </main>
  );
}