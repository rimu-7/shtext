"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import connectDB from "@/utils/db";
import Snippet from "@/utils/Snippet";
import bcrypt from "bcryptjs";
import { encrypt } from "@/utils/crypto";
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

export async function createSnippet(prevState, formData) {
  // 1. Rate Limiting (Prevent Spam)
  const ip = (await headers()).get("x-forwarded-for") || "unknown";
  const { success: limitSuccess } = await ratelimit.limit(`create_action_${ip}`);

  if (!limitSuccess) {
    return {
      success: false,
      message: "Too many requests. Please wait a moment.",
      inputs: Object.fromEntries(formData),
    };
  }

  const text = formData.get("text");
  const durationKey = formData.get("duration");
  const customSlug = formData.get("customSlug");
  const protection = formData.get("protection");
  const passwordRaw = formData.get("password");

  const returnWithError = (message) => ({
    success: false,
    message,
    inputs: {
      text: typeof text === "string" ? text : "",
      customSlug: typeof customSlug === "string" ? customSlug : "",
      duration: typeof durationKey === "string" ? durationKey : "15m",
      protection: typeof protection === "string" ? protection : "public",
    },
  });

  // 2. Validate Text
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return returnWithError("Please enter some text to share.");
  }
  if (text.length > 100000) {
    return returnWithError("Text is too long. Please reduce size.");
  }

  // 3. Validate Duration
  if (!durationKey || !DURATION_MAP.hasOwnProperty(durationKey)) {
    return returnWithError("Invalid expiration duration selected.");
  }

  const ms = DURATION_MAP[durationKey];
  const expireAt = ms ? new Date(Date.now() + ms) : null;

  await connectDB();

  // 4. Handle Slug
  let slug;
  if (customSlug && typeof customSlug === "string" && customSlug.trim() !== "") {
    slug = customSlug.trim().replace(/[^a-zA-Z0-9-_]/g, "");
    if (!slug) return returnWithError("Custom PIN is invalid. Use letters/numbers/-/_ only.");

    const existing = await Snippet.findOne({ slug }).lean();
    if (existing) return returnWithError("This Custom PIN is already taken.");
  } else {
    // Ensure uniqueness for random IDs
    let isUnique = false;
    while (!isUnique) {
      slug = nanoid(6);
      const check = await Snippet.findOne({ slug });
      if (!check) isUnique = true;
    }
  }

  // 5. Password Logic
  const isProtected = protection === "password";
  const password = typeof passwordRaw === "string" ? passwordRaw.trim() : "";

  if (isProtected && !password) {
    return returnWithError("Password is required when protection is enabled.");
  }

  const hashedPassword = isProtected ? await bcrypt.hash(password, 10) : null;

  // 6. ENCRYPTION & Save
  try {
    const encryptedContent = encrypt(text); // 👈 Encrypt before saving

    await Snippet.create({
      content: encryptedContent,
      slug,
      password: hashedPassword,
      expireAt,
    });
  } catch (error) {
    console.error("Error creating snippet:", error);
    return returnWithError("Database error. Please try again later.");
  }

  // Redirect to the new snippet page
  redirect(`/${slug}?new=1`);
}

export async function accessSnippet(prevState, formData) {
  // 1. Rate Limiting
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