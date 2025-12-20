import mongoose from "mongoose";

const SnippetSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },

    // ✅ IMPORTANT: store bcrypt hash (or null)
    password: { type: String, default: null },

    expireAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

// TTL index (delete when expireAt time is reached)
SnippetSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// ✅ DEV SAFETY: if you had old schema loaded without password, delete and re-register
const Snippet =
  mongoose.models.Snippet ||
  mongoose.model("Snippet", SnippetSchema);

export default Snippet;
