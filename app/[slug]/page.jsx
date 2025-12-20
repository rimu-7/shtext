import Link from "next/link";
import connectDB from "@/utils/db";
import Snippet from "@/utils/Snippet";
import SnippetClient from "./SnippetClient";

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
    // ✅ hide content if protected
    content: isProtected ? null : snippet.content,
  };
}

export default async function ViewSnippet({ params }) {
  const { slug } = await params;
  const data = await getSnippet(slug);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Snippet not found
        </h1>
        <p className="text-gray-500 mb-6 max-w-sm">
          This link is invalid or the snippet has expired.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Create New
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50 flex flex-col items-center pt-12 sm:pt-24 p-4">
      <SnippetClient initialData={data} slug={slug} />
    </main>
  );
}
