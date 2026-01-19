import mongoose from "mongoose";

const SnippetSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    password: { type: String, default: null },
    
    // 👇 CHANGED: Removed "index: true" from here to avoid duplicate warning
    expireAt: { type: Date, default: null }, 
  },
  { timestamps: true }
);

// This handles the indexing AND the self-destruct logic
SnippetSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Snippet = mongoose.models.Snippet || mongoose.model("Snippet", SnippetSchema);

export default Snippet;