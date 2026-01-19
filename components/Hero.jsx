"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSnippet } from "@/utils/action"; // 👈 Import the Server Action
import {
  Loader2,
  Lock,
  Clock,
  Hash,
  Shield,
  FileText,
  Globe,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Container from "./Container";

export default function Hero() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    customSlug: "",
    duration: "15m",
    protection: "public",
    password: "",
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Construct FormData manually from React State
      // This bridges your controlled UI with the Server Action
      const payload = new FormData();
      payload.append("text", formData.text);
      payload.append("duration", formData.duration);
      payload.append("customSlug", formData.customSlug);
      payload.append("protection", formData.protection);

      if (formData.protection === "password") {
        payload.append("password", formData.password);
      }

      // 2. Call the Server Action directly (No fetch/API key needed)
      // We pass 'null' as the first arg because the action expects (prevState, formData)
      const result = await createSnippet(null, payload);

      // 3. Handle Error (Success redirects automatically)
      if (result && !result.success) {
        toast.error(result.message || "Failed to create snippet");
        setLoading(false);
      }
    } catch (error) {
      // Note: Next.js redirects typically throw an error to navigate.
      // We ignore redirect errors, but catch actual crashes.
      if (error.message === "NEXT_REDIRECT") {
        throw error;
      }
      toast.error("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="w-full py-10 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground uppercase">
            Sh...
            <span className="bg-primary text-white px-2 dark:text-black">
              TEXT
            </span>
          </h1>
        </div>

        {/* MAIN FORM CONTAINER */}
        <div className="bg-background border-2 border-black dark:border-white p-6 md:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* TEXT INPUT */}
            <div className="space-y-3">
              <Label
                htmlFor="text"
                className="text-base font-black uppercase flex items-center gap-2"
              >
                <FileText className="w-4 h-4" /> 01. Content
              </Label>
              <Textarea
                id="text"
                required
                value={formData.text}
                onChange={(e) => handleChange("text", e.target.value)}
                placeholder="Paste sensitive data here..."
                // NOTE: rounded-none creates the outline look
                className="min-h-[200px] resize-y rounded-none border-2 border-black dark:border-white focus-visible:ring-0 focus-visible:outline-none focus-visible:shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:focus-visible:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-all p-4 font-mono text-base"
              />
            </div>

            {/* GRID SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* SLUG INPUT */}
              <div className="space-y-3">
                <Label className="text-base font-black uppercase flex items-center gap-2">
                  <Hash className="w-4 h-4" /> 02. Custom Link
                </Label>
                <Input
                  value={formData.customSlug}
                  onChange={(e) => handleChange("customSlug", e.target.value)}
                  placeholder="e.g. project-x"
                  // HEIGHT NORMALIZATION: h-14
                  className="h-14 rounded-none border-2 border-black dark:border-white focus-visible:ring-0 focus-visible:outline-none focus-visible:shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:focus-visible:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-all font-mono"
                />
              </div>

              {/* DURATION SELECT */}
              <div className="space-y-3">
                <Label className="text-base font-black uppercase flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 03. Auto-Delete
                </Label>
                <Select
                  value={formData.duration}
                  onValueChange={(val) => handleChange("duration", val)}
                >
                  {/* Trigger with h-14 fix and flex centering */}
                  <SelectTrigger className="h-14 w-full rounded-none border-2 border-black dark:border-white focus:ring-0 focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-all flex items-center">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>

                  <SelectContent
                    className="
                    rounded-none border-2 border-black dark:border-white 
                    
                    /* 1. Target any child with role='option' that is focused (hovered) */
                    [&_[role=option]:focus]:bg-primary 
                    [&_[role=option]:focus]:text-primary-foreground
                    
                    /* 2. Target the currently selected item */
                    [&_[role=option][data-state=checked]]:bg-primary 
                    [&_[role=option][data-state=checked]]:text-primary-foreground
                  "
                  >
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="30m">30 Minutes</SelectItem>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* PROTECTION SELECTOR */}
              <div className="space-y-3 md:col-span-2">
                <Label className="text-base font-black uppercase flex items-center gap-2">
                  <Shield className="w-4 h-4" /> 04. Security Level
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {/* OPTION 1: PUBLIC (RED) */}
                  <div
                    onClick={() => handleChange("protection", "public")}
                    className={`
                        h-14 cursor-pointer border-2 flex items-center justify-center gap-3 transition-all rounded-none
                        ${
                          formData.protection === "public"
                            ? "border-red-600 bg-red-50 text-red-600 shadow-[4px_4px_0_0_#dc2626] dark:bg-red-900/20"
                            : "border-black/20 dark:border-white/20 hover:border-red-600/50 text-muted-foreground"
                        }
                      `}
                  >
                    <Globe className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-wider">
                      Public
                    </span>
                  </div>

                  {/* OPTION 2: PASSWORD (GREEN) */}
                  <div
                    onClick={() => handleChange("protection", "password")}
                    className={`
                        h-14 cursor-pointer border-2 flex items-center justify-center gap-3 transition-all rounded-none
                        ${
                          formData.protection === "password"
                            ? "border-green-600 bg-green-50 text-green-600 shadow-[4px_4px_0_0_#16a34a] dark:bg-green-900/20"
                            : "border-black/20 dark:border-white/20 hover:border-green-600/50 text-muted-foreground"
                        }
                      `}
                  >
                    <Lock className="w-5 h-5" />
                    <span className="font-bold uppercase tracking-wider">
                      Password
                    </span>
                  </div>
                </div>
              </div>

              {/* PASSWORD FIELD (Only shows if protected) */}
              {formData.protection === "password" && (
                <div className="space-y-3 md:col-span-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-base font-black uppercase flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" /> Set Password
                  </Label>
                  <Input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Enter access code..."
                    // Green accent on focus to match the theme
                    className="h-14 rounded-none border-2 border-black dark:border-white focus-visible:ring-0 focus-visible:outline-none focus-visible:border-green-600 focus-visible:shadow-[4px_4px_0_0_#16a34a] transition-all"
                  />
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="h-14 w-full px-3 sm:px-4 text-3xl rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none hover:dark:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2 font-bold bg-primary text-primary-foreground"
              >
                {loading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <>Create Snippet</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
