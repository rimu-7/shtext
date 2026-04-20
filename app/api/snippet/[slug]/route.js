import { NextResponse } from "next/server";
import { headers } from "next/headers";
import connectDB from "@/utils/db";
import Snippet from "@/utils/Snippet";
import { decrypt } from "@/utils/crypto";
import { ratelimit } from "@/utils/ratelimit";
import { isAuthenticated } from "@/utils/auth";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {
    // 1. Rate Limiting (optional but good for production)
    const ip = (await headers()).get("x-forwarded-for") || "unknown";
    const { success: limitSuccess, reset } = await ratelimit.limit(`get_${ip}`);
    
    if (!limitSuccess) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please slow down.", reset },
        { status: 429 }
      );
    }

    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid snippet slug." },
        { status: 400 }
      );
    }

    await connectDB();
    const snippet = await Snippet.findOne({ slug }).lean();

    if (!snippet) {
      return NextResponse.json(
        { success: false, message: "Snippet not found." },
        { status: 404 }
      );
    }

    // 2. Expiry Check
    if (snippet.expireAt && new Date(snippet.expireAt) <= new Date()) {
      // Background cleanup
      await Snippet.deleteOne({ _id: snippet._id }).catch(() => {});
      return NextResponse.json(
        { success: false, message: "Snippet expired." },
        { status: 404 }
      );
    }

    const isProtected = !!snippet.password;
    let content = null;

    // If public, we decrypt on the server to return immediately
    if (!isProtected) {
      try {
        content = decrypt(snippet.content);
      } catch (e) {
        console.error("Decryption error on server:", e);
        return NextResponse.json(
          { success: false, message: "Error decrypting content." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        isProtected,
        expireAt: snippet.expireAt ? new Date(snippet.expireAt).toISOString() : "Never",
        content, // Will be null if protected, plaintext if public
      }
    });

  } catch (error) {
    console.error("Get Snippet API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
