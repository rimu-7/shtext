"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { headers } from "next/headers"; 
import connectDB from "@/utils/db";
import Snippet from "@/utils/Snippet";
import bcrypt from "bcryptjs";
import { encrypt } from "@/utils/crypto";
import { ratelimit } from "@/utils/ratelimit";

// Duration Map
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

export async function createSnippet(prevState, formData) {
  // 1. Rate Limiting (IP Based - No Key Needed for Website)
  const ip = (await headers()).get("x-forwarded-for") || "unknown";
  const { success: limitSuccess } = await ratelimit.limit(`create_web_${ip}`);

  if (!limitSuccess) {
    return { success: false, message: "Too many requests. Please slow down." };
  }

  // 2. Extract Data
  const text = formData.get("text");
  const durationKey = formData.get("duration");
  const customSlug = formData.get("customSlug");
  const protection = formData.get("protection");
  const passwordRaw = formData.get("password");

  // 3. Validation
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return { success: false, message: "Content is required." };
  }
  if (text.length > 100000) {
    return { success: false, message: "Text is too long (Max 100KB)." };
  }

  const ms = DURATION_MAP[durationKey] || DURATION_MAP["15m"];
  const expireAt = ms ? new Date(Date.now() + ms) : null;

  await connectDB();

  // 4. Slug Logic
  let slug;
  if (customSlug && typeof customSlug === "string" && customSlug.trim() !== "") {
    slug = customSlug.trim().replace(/[^a-zA-Z0-9-_]/g, "");
    const existing = await Snippet.findOne({ slug }).lean();
    if (existing) return { success: false, message: "Custom PIN is already taken." };
  } else {
    let isUnique = false;
    while (!isUnique) {
      slug = nanoid(6);
      const check = await Snippet.findOne({ slug });
      if (!check) isUnique = true;
    }
  }

  // 5. Password & Encryption
  const hashedPassword = (protection === "password" && passwordRaw) 
    ? await bcrypt.hash(passwordRaw, 10) 
    : null;

  const encryptedContent = encrypt(text);

  // 6. Save
  try {
    await Snippet.create({
      content: encryptedContent,
      slug,
      password: hashedPassword,
      expireAt,
    });
  } catch (error) {
    console.error("DB Error:", error);
    return { success: false, message: "Database error." };
  }

  // 7. Redirect (This acts as the "Success" response)
  redirect(`/${slug}?new=1`);
}

// ... existing accessSnippet function ...
export async function accessSnippet(prevState, formData) {
    // ... keep your existing accessSnippet logic ...
    // (It's already correct)
    const ip = (await headers()).get("x-forwarded-for") || "unknown";
    const { success: limitSuccess } = await ratelimit.limit(`access_action_${ip}`);
  
    if (!limitSuccess) {
      return { success: false, message: "Too many attempts. Please slow down." };
    }
  
    const code = formData.get("accessCode");
  
    if (!code || typeof code !== "string" || code.trim() === "") {
      return { success: false, message: "Please enter a valid PIN or Code." };
    }
  
    const cleanCode = code.trim();
  
    try {
      await connectDB();
      const snippet = await Snippet.findOne({ slug: cleanCode }).lean();
  
      if (!snippet) {
        return { success: false, message: "Snippet not found. Check your PIN." };
      }
  
      // Manual Expiry Check
      if (snippet.expireAt && new Date(snippet.expireAt) <= new Date()) {
        // It's expired but mongo hasn't deleted it yet. Treat as gone.
        return { success: false, message: "Snippet not found or expired." };
      }
  
      // If found, redirect to the page
      redirect(`/${cleanCode}`);
    } catch (error) {
      if (error?.message === "NEXT_REDIRECT") throw error;
      console.error("Access error:", error);
      return { success: false, message: "An error occurred. Please try again." };
    }
}