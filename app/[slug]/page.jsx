import Link from "next/link";
import connectDB from "@/utils/db";
import Snippet from "@/utils/Snippet";
import SnippetClient from "./SnippetClient";
import { ArrowLeft, FileQuestion } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getSnippet(slug) {
  await connectDB();
  const snippet = await Snippet.findOne({ slug }).lean();
  if (!snippet) return null;

  if (snippet.expireAt && new Date(snippet.expireAt) <= new Date()) {
    await Snippet.deleteOne({ _id: snippet._id }).catch(() => {});
    return null;
  }

  const isProtected = !!snippet.password;

  return {
    isProtected,
    expireAt: new Date(snippet.expireAt).toISOString(),
    content: isProtected ? null : snippet.content,
  };
}

export default async function ViewSnippet({ params }) {
  const { slug } = await params;
  const data = await getSnippet(slug);

  if (!data) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border-2 border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-muted border-2 border-black dark:border-white mb-6 flex items-center justify-center">
            <FileQuestion className="h-8 w-8 text-foreground" />
          </div>
          
          <h1 className="text-3xl font-black text-foreground mb-2">
            Snippet not found
          </h1>
          <p className="text-muted-foreground font-medium font-mono text-sm mb-8">
            This link is invalid or the snippet has vanished into the void.
          </p>
          
          <Link
            href="/"
            className="h-10 rounded-none justify-center border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none hover:dark:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2 font-bold bg-primary text-primary-foreground"
          >
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