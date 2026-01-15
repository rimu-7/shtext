import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    visitorId: { type: String, index: true },
    sessionId: { type: String, index: true },

    startedAt: { type: Date, default: Date.now, index: true },
    lastSeenAt: { type: Date, default: Date.now, index: true },

    pageViews: { type: Number, default: 0 },
    pages: { type: [String], default: [] },
  },
  { timestamps: true }
);

SessionSchema.index({ visitorId: 1, lastSeenAt: -1 });

export default mongoose.models.Session || mongoose.model("Session", SessionSchema);
