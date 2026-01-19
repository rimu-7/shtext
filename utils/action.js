"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import connectDB from "@/utils/db";
import Snippet from "@/utils/Snippet";
import bcrypt from "bcryptjs";
import { encrypt, decrypt } from "@/utils/crypto";
import { ratelimit } from "@/utils/ratelimit";

// Map durations to milliseconds
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

// --- 1. CREATE SNIPPET (Server Action) ---
export async function createSnippet(prevState, formData) {
  const ip = (await headers()).get("x-forwarded-for") || "unknown";
  
  // Rate Limit: Prevent spam creation
  const { success: limitSuccess } = await ratelimit.limit(`create_web_${ip}`);
  if (!limitSuccess) {
    return { success: false, message: "Too many requests. Please slow down." };
  }

  // Extract Data
  const text = formData.get("text");
  const durationKey = formData.get("duration");
  const customSlug = formData.get("customSlug");
  const protection = formData.get("protection");
  const passwordRaw = formData.get("password");

  // Validation
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return { success: false, message: "Content is required." };
  }
  if (text.length > 100000) {
    return { success: false, message: "Text is too long (Max 100KB)." };
  }

  const ms = DURATION_MAP[durationKey] || DURATION_MAP["15m"];
  const expireAt = ms ? new Date(Date.now() + ms) : null;

  await connectDB();

  // Slug Logic
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

  // Password & Encryption
  const hashedPassword = (protection === "password" && passwordRaw) 
    ? await bcrypt.hash(passwordRaw, 10) 
    : null;

  const encryptedContent = encrypt(text); // 🔒 Encrypt before saving

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

  redirect(`/${slug}?new=1`);
}

// --- 2. ACCESS SNIPPET (Search Bar Redirect) ---
export async function accessSnippet(prevState, formData) {
  const ip = (await headers()).get("x-forwarded-for") || "unknown";
  const { success: limitSuccess } = await ratelimit.limit(`access_web_${ip}`);

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
      return { success: false, message: "Snippet not found." };
    }

    if (snippet.expireAt && new Date(snippet.expireAt) <= new Date()) {
      return { success: false, message: "Snippet expired." };
    }

    redirect(`/${cleanCode}`);
  } catch (error) {
    if (error?.message === "NEXT_REDIRECT") throw error;
    console.error("Access error:", error);
    return { success: false, message: "An error occurred." };
  }
}

// --- 3. VERIFY & DECRYPT (Secure Password Check) ---
export async function verifySnippetPassword(slug, password) {
  const ip = (await headers()).get("x-forwarded-for") || "unknown";
  
  // Rate Limit: Prevent brute-force password guessing
  const { success: limitSuccess } = await ratelimit.limit(`verify_web_${ip}`);
  if (!limitSuccess) {
    return { success: false, message: "Too many attempts. Please slow down." };
  }

  if (!slug || !password) {
    return { success: false, message: "Missing credentials." };
  }

  try {
    await connectDB();
    const snippet = await Snippet.findOne({ slug }).lean();

    if (!snippet) {
      return { success: false, message: "Snippet not found." };
    }

    // Expiry Check
    if (snippet.expireAt && new Date(snippet.expireAt) <= new Date()) {
       return { success: false, message: "Snippet expired." };
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, snippet.password);
    if (!isMatch) {
       // Anti-timing attack delay
       await new Promise(r => setTimeout(r, 500));
       return { success: false, message: "Incorrect password." };
    }

    // Success: Decrypt and Return
    const content = decrypt(snippet.content);
    return { success: true, content };

  } catch (error) {
    console.error("Verify Action Error:", error);
    return { success: false, message: "Server error." };
  }
}