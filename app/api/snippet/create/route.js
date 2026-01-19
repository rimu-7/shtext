import { NextResponse } from "next/server";
import { headers } from "next/headers";
import connectDB from "@/utils/db";
import Snippet from "@/utils/Snippet";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { encrypt } from "@/utils/crypto";
import { ratelimit } from "@/utils/ratelimit";
import { isAuthenticated } from "@/utils/auth";

export const runtime = "nodejs";

const DURATION_MAP = {
  "15m": 15 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "2h": 2 * 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "15d": 15 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  "forever": null,
};

export async function POST(req) {
  try {
    // 1. Authenticate (Check API Key)
    const auth = isAuthenticated(req);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid API Key" },
        { status: 401 }
      );
    }

    // 2. Rate Limit (Per API Key OR Per IP)
    const ip = (await headers()).get("x-forwarded-for") || "unknown";
    const identifier = auth.key || ip; // Prioritize API key for limit tracking
    
    const { success: limitSuccess } = await ratelimit.limit(`create_${identifier}`);
    if (!limitSuccess) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { text, duration, customSlug, password } = body;

    // 3. Validate Input
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { success: false, message: "Content is required." },
        { status: 400 }
      );
    }
    if (text.length > 100000) {
      return NextResponse.json(
        { success: false, message: "Content too large (Max 100KB)." },
        { status: 413 }
      );
    }

    await connectDB();

    // 4. Handle Slug
    let slug = customSlug ? customSlug.trim().replace(/[^a-zA-Z0-9-_]/g, "") : nanoid(6);
    
    if (customSlug) {
      const existing = await Snippet.findOne({ slug });
      if (existing) {
        return NextResponse.json(
          { success: false, message: "Custom PIN is already taken." },
          { status: 409 }
        );
      }
    } else {
      // Ensure generated ID is unique
      let isUnique = false;
      while (!isUnique) {
        const check = await Snippet.findOne({ slug });
        if (!check) isUnique = true;
        else slug = nanoid(6);
      }
    }

    // 5. Hash Password & Encrypt Content
    const hashedPassword = (password && password.trim()) 
      ? await bcrypt.hash(password.trim(), 10) 
      : null;

    const encryptedContent = encrypt(text);

    // 6. Calculate Expiry
    let expireAt = null;
    if (duration !== "forever") {
      const ms = DURATION_MAP[duration] || DURATION_MAP["15m"];
      expireAt = new Date(Date.now() + ms);
    }

    // 7. Save to DB
    await Snippet.create({
      content: encryptedContent,
      slug,
      password: hashedPassword,
      expireAt,
    });

    return NextResponse.json({ success: true, slug });

  } catch (error) {
    console.error("Create API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}