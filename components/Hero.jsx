"use client";

import { useState, useEffect, useActionState } from "react";
import { createSnippet, accessSnippet } from "@/utils/action";
import { toast } from "sonner";
import {
  Loader2,
  ArrowRight,
  Lock,
  Clock,
  Hash,
  Search,
  Shield,
} from "lucide-react";
import { useFormStatus } from "react-dom";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-10 rounded-none justify-center border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none hover:dark:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2 font-bold bg-primary text-primary-foreground"
      >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating...
        </>
      ) : (
        <>
          Create Snippet <ArrowRight className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  );
}

export function RetrieveButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      variant="outline"
      className="h-full rounded-l-none border-l-0 border-2 border-black dark:border-white shadow-sm hover:bg-accent hover:text-accent-foreground"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
    </Button>
  );
}

export default function Hero() {
  const [createState, createAction] = useActionState(createSnippet, null);
  const [accessState, accessAction] = useActionState(accessSnippet, null);

  const [protection, setProtection] = useState("public");

  useEffect(() => {
    if (createState && !createState.success) {
      toast.error(createState.message);
      if (createState?.inputs?.protection)
        setProtection(createState.inputs.protection);
    }
  }, [createState]);

  useEffect(() => {
    if (accessState && !accessState.success) toast.error(accessState.message);
  }, [accessState]);

  return (
    <main className="min-h-[85vh] flex flex-col items-center justify-center p-4 md:p-8 bg-background relative overflow-hidden">
      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground drop-shadow-[4px_4px_0_var(--shadow-color)]">
            Sh...TEXT
          </h1>
          <p className="text-muted-foreground font-medium font-mono text-sm md:text-lg max-w-lg mx-auto">
            Paste content. Set PIN. Share. <br />
            It vanishes automatically.
          </p>
        </div>

        {/* CREATE FORM CARD */}
        <div className="bg-card border-2 border-border p-6 md:p-8 shadow-md">
          <form action={createAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text" className="text-base font-bold">Content</Label>
              <Textarea
                id="text"
                name="text"
                required
                defaultValue={createState?.inputs?.text || ""}
                placeholder="Write your sensitive content here..."
                className="min-h-[200px] resize-y custom-scrollbar font-mono text-base bg-background border-2 border-input focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:shadow-[4px_4px_0_0_var(--primary)] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Custom PIN */}
              <div className="space-y-2">
                <Label htmlFor="customSlug" className="flex items-center gap-2 font-bold">
                  <Hash className="h-4 w-4" /> Custom PIN
                </Label>
                <Input
                  id="customSlug"
                  name="customSlug"
                  defaultValue={createState?.inputs?.customSlug || ""}
                  placeholder="e.g. project-alpha"
                  className="h-9 border-2 border-input focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[4px_4px_0_0_var(--primary)] transition-all"
                />
              </div>

              {/* Expiration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2 font-bold">
                  <Clock className="h-4 w-4" /> Expiration
                </Label>
                <Select name="duration" defaultValue={createState?.inputs?.duration || "15"}>
                  <SelectTrigger className="h-10 border-2 border-input focus:ring-0 focus:border-primary focus:shadow-[4px_4px_0_0_var(--primary)] transition-all">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black shadow-md">
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="60">1 Hour</SelectItem>
                    <SelectItem value="120">2 Hours</SelectItem>
                    <SelectItem value="1440">24 Hours</SelectItem>
                    <SelectItem value="10080">7 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Protection */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="protection" className="flex items-center gap-2 font-bold">
                  <Shield className="h-4 w-4" /> Protection
                </Label>
                <Select
                  id="protection"
                  name="protection"
                  value={protection}
                  onValueChange={(val) => setProtection(val)}
                >
                  <SelectTrigger className="h-10 border-2 border-input focus:ring-0 focus:border-primary focus:shadow-[4px_4px_0_0_var(--primary)] transition-all">
                    <SelectValue placeholder="Select protection" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black shadow-md">
                    <SelectItem value="public">Public (no password)</SelectItem>
                    <SelectItem value="password">Password Protected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Password */}
              {protection === "password" && (
                <div className="space-y-2 md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="password" className="flex items-center gap-2 font-bold">
                    <Lock className="h-4 w-4" /> Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    required
                    placeholder="Enter a password"
                    autoComplete="new-password"
                    className="h-10 border-2 border-input focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[4px_4px_0_0_var(--primary)] transition-all"
                  />
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}