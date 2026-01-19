"use client";

import { useActionState, useEffect, useState } from "react";
import { createSnippet } from "@/utils/action";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Loader2, ArrowRight, Lock, Clock, Hash, Shield } from "lucide-react";

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

// 1. Separate Submit Button Component for "Pending" state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-10 w-full md:w-auto rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:dark:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 font-bold bg-primary text-primary-foreground"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        "Create Snippet"
      )}
      {!pending && <ArrowRight className="h-4 w-4" />}
    </Button>
  );
}

export default function Hero() {
  // 2. Hook up the Server Action
  const [state, formAction] = useActionState(createSnippet, null);

  // State for conditional rendering (Protection field)
  const [protection, setProtection] = useState("public");

  // 3. Watch for Errors
  useEffect(() => {
    if (state && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Container>
      <div className="w-full relative z-10">
        <div className="text-center my-8 md:mb-10 space-y-3 md:space-y-4">
          <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground uppercase">
            Sh...
            <span className="bg-primary text-white px-2 dark:text-black">
              TEXT
            </span>
          </h1>
        </div>
          <p className="text-muted-foreground font-medium font-mono text-sm md:text-lg max-w-xs sm:max-w-lg mx-auto">
            Paste content. Set PIN. Share. <br className="hidden sm:block" />
            It vanishes automatically.
          </p>
        </div>

        <div className="bg-card border-2 border-border p-5 md:p-8 shadow-md">
          {/* 4. Use 'action' instead of 'onSubmit' */}
          <form action={formAction} className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text" className="text-base font-bold">
                Content
              </Label>
              <Textarea
                id="text"
                name="text" // 👈 'name' is required for Server Actions
                required
                placeholder="Write your sensitive content here..."
                className="min-h-[150px] md:min-h-[200px] w-full resize-y font-mono text-base bg-background border-2 border-input focus-visible:ring-0 focus-visible:border-primary shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold">
                  <Hash className="h-4 w-4" /> Custom PIN (Optional)
                </Label>
                <Input
                  name="customSlug"
                  placeholder="e.g. project-alpha"
                  className="h-10 w-full border-2 border-input focus-visible:ring-0 focus-visible:border-primary shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold">
                  <Clock className="h-4 w-4" /> Expiration
                </Label>
                <Select name="duration" defaultValue="15m">
                  <SelectTrigger className="h-10 w-full border-2 border-input focus:ring-0 focus:border-primary shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-all">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black">
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="30m">30 Minutes</SelectItem>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="2h">2 Hours</SelectItem>
                    <SelectItem value="6h">6 Hours</SelectItem>
                    <SelectItem value="12h">12 Hours</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="15d">15 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2 font-bold">
                  <Shield className="h-4 w-4" /> Protection
                </Label>
                <Select
                  name="protection"
                  value={protection}
                  onValueChange={setProtection}
                >
                  <SelectTrigger className="h-10 w-full border-2 border-input focus:ring-0 focus:border-primary shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-all">
                    <SelectValue placeholder="Select protection" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black">
                    <SelectItem value="public">Public (no password)</SelectItem>
                    <SelectItem value="password">Password Protected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {protection === "password" && (
                <div className="space-y-2 md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label className="flex items-center gap-2 font-bold">
                    <Lock className="h-4 w-4" /> Password
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    required
                    placeholder="Enter a password"
                    className="h-10 w-full border-2 border-input focus-visible:ring-0 focus-visible:border-primary shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-all"
                  />
                </div>
              )}
            </div>

            <div className="pt-4 flex w-full md:justify-end">
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
