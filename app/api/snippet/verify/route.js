import { NextResponse } from "next/server";
import { headers } from "next/headers";
import connectDB from "@/utils/db";
import Snippet from "@/utils/Snippet";
import bcrypt from "bcryptjs";
import { decrypt } from "@/utils/crypto";
import { ratelimit } from "@/utils/ratelimit";
import { isAuthenticated } from "@/utils/auth";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    // 1. Authenticate
    const auth = isAuthenticated(req);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid API Key" },
        { status: 401 }
      );
    }

    // 2. Rate Limit
    const ip = (await headers()).get("x-forwarded-for") || "unknown";
    const identifier = auth.key || ip;

    const { success: limitSuccess } = await ratelimit.limit(`verify_${identifier}`);
    if (!limitSuccess) {
      return NextResponse.json(
        { success: false, message: "Too many attempts. Please wait." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { slug, password } = body;

    if (!slug) {
      return NextResponse.json({ success: false, message: "Missing slug." }, { status: 400 });
    }

    await connectDB();
    const snippet = await Snippet.findOne({ slug }).lean();

    // 3. Existence Check
    if (!snippet) {
      return NextResponse.json({ success: false, message: "Snippet not found." }, { status: 404 });
    }

    // 4. Expiry Safety Check
    if (snippet.expireAt && new Date(snippet.expireAt) <= new Date()) {
      await Snippet.deleteOne({ _id: snippet._id });
      return NextResponse.json({ success: false, message: "Snippet expired." }, { status: 404 });
    }

    // 5. Password Verification
    let isAllowed = false;
    
    if (!snippet.password) {
      isAllowed = true;
    } else {
      if (!password) {
        return NextResponse.json({ success: false, message: "Password required." }, { status: 401 });
      }
      isAllowed = await bcrypt.compare(password, snippet.password);
    }

    if (!isAllowed) {
      // Fake delay to prevent timing attacks
      await new Promise((r) => setTimeout(r, 200)); 
      return NextResponse.json({ success: false, message: "Incorrect password." }, { status: 401 });
    }

    // 6. Decrypt & Return
    try {
      const decryptedContent = decrypt(snippet.content);
      return NextResponse.json({ success: true, content: decryptedContent });
    } catch (e) {
      console.error("Decryption failed:", e);
      return NextResponse.json({ success: false, message: "Data error." }, { status: 500 });
    }

  } catch (error) {
    console.error("Verify API Error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}