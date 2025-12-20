import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Snippet from "@/utils/Snippet";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ helpful: lets you open /api/snippet/verify in browser to confirm route exists
export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/snippet/verify" });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const password = typeof body.password === "string" ? body.password.trim() : "";

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Missing snippet code." },
        { status: 400 }
      );
    }

    await connectDB();
    const snippet = await Snippet.findOne({ slug }).lean();

    if (!snippet) {
      return NextResponse.json(
        { success: false, message: "Snippet not found or expired." },
        { status: 404 }
      );
    }

    // Expired check
    if (snippet.expireAt && new Date(snippet.expireAt) <= new Date()) {
      await Snippet.deleteOne({ _id: snippet._id }).catch(() => {});
      return NextResponse.json(
        { success: false, message: "Snippet not found or expired." },
        { status: 404 }
      );
    }

    // Not protected => return content
    if (!snippet.password) {
      return NextResponse.json({ success: true, content: snippet.content }, { status: 200 });
    }

    // Protected => require password
    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required." },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, snippet.password);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: "Incorrect password." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, content: snippet.content }, { status: 200 });
  } catch (e) {
    console.error("verify route error:", e);
    return NextResponse.json(
      { success: false, message: "Verification failed." },
      { status: 500 }
    );
  }
}
