"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import connectDB from "@/utils/db";
import Snippet from "@/utils/Snippet";
import bcrypt from "bcryptjs";

const ALLOWED_DURATIONS = new Set(["15", "30", "60", "120", "1440", "10080"]);

export async function createSnippet(prevState, formData) {
  const text = formData.get("text");
  const durationStr = formData.get("duration");
  const customSlug = formData.get("customSlug");
  const protection = formData.get("protection"); // "public" | "password"
  const passwordRaw = formData.get("password");

  const returnWithError = (message) => ({
    success: false,
    message,
    inputs: {
      text: typeof text === "string" ? text : "",
      customSlug: typeof customSlug === "string" ? customSlug : "",
      duration: typeof durationStr === "string" ? durationStr : "15",
      protection: typeof protection === "string" ? protection : "public",
    },
  });

  // validate text
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return returnWithError("Please enter some text to share.");
  }
  if (text.length > 100000) {
    return returnWithError("Text is too long. Please reduce size.");
  }

  // validate duration
  if (!durationStr || typeof durationStr !== "string" || !ALLOWED_DURATIONS.has(durationStr)) {
    return returnWithError("Invalid expiration duration selected.");
  }

  const durationMinutes = parseInt(durationStr, 10);
  const expireAt = new Date(Date.now() + durationMinutes * 60 * 1000);

  await connectDB();

  // slug
  let slug;
  if (customSlug && typeof customSlug === "string" && customSlug.trim() !== "") {
    slug = customSlug.trim().replace(/[^a-zA-Z0-9-_]/g, "");
    if (!slug) return returnWithError("Custom PIN is invalid. Use letters/numbers/-/_ only.");

    const existing = await Snippet.findOne({ slug }).lean();
    if (existing) return returnWithError("This Custom PIN/Link is already taken.");
  } else {
    slug = nanoid(6);
  }

  // protection / password
  const isProtected = protection === "password";
  const password = typeof passwordRaw === "string" ? passwordRaw.trim() : "";

  if (isProtected && !password) {
    return returnWithError("Password is required when protection is enabled.");
  }

  const hashedPassword = isProtected ? await bcrypt.hash(password, 10) : null;

  try {
    await Snippet.create({
      content: text,
      slug,
      password: hashedPassword, // ✅ saves now (schema must include password)
      expireAt,
    });
  } catch (error) {
    console.error("Error creating snippet:", error);
    if (error?.code === 11000) {
      return returnWithError("This PIN is currently in use. Please choose another.");
    }
    return returnWithError("Database error. Please try again later.");
  }

  // ✅ send user to snippet page and trigger auto-copy
  redirect(`/${slug}?new=1`);
}

export async function accessSnippet(prevState, formData) {
  const code = formData.get("accessCode");

  if (!code || typeof code !== "string" || code.trim() === "") {
    return { success: false, message: "Please enter a valid PIN or Code." };
  }

  const cleanCode = code.trim();

  try {
    await connectDB();
    const snippet = await Snippet.findOne({ slug: cleanCode }).lean();

    if (!snippet || (snippet.expireAt && new Date(snippet.expireAt) <= new Date())) {
      return { success: false, message: "Snippet not found. Check your PIN." };
    }

    redirect(`/${cleanCode}`);
  } catch (error) {
    if (error?.message === "NEXT_REDIRECT") throw error;
    console.error("Access error:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
}
