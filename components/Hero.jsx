"use client";

import { useActionState, useEffect, useState } from "react";
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 focus:ring-4 focus:ring-gray-100 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Generating...
        </>
      ) : (
        <>
          Create Snippet <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

export function RetrieveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2.5 bg-gray-100 text-gray-900 font-medium text-sm rounded-r-lg hover:bg-gray-200 border border-l-0 border-gray-300 disabled:opacity-70 transition-colors flex items-center justify-center"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Search className="h-4 w-4" />
      )}
    </button>
  );
}

export default function Hero() {
  const [createState, createAction] = useActionState(createSnippet, null);
  const [accessState, accessAction] = useActionState(accessSnippet, null);

  const [protection, setProtection] = useState("public"); // UI state only

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
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-2xl ">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
            Sh...TEXT
          </h1>
          <p className="text-gray-500 text-sm md:text-lg max-w-lg mx-auto">
            Paste your content, set a PIN, and share. It vanishes automatically
            when the time is up.
          </p>
        </div>

        {/* CREATE FORM */}
        <form action={createAction} className="space-y-6">
          <textarea
            name="text"
            id="text"
            required
            defaultValue={createState?.inputs?.text || ""}
            placeholder="Write your sensitive content here..."
            className="block w-full rounded-lg border-gray-300 border focus:border-gray-500 focus:ring-gray-500 sm:text-sm min-h-[200px] p-4 resize-y"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
                htmlFor="customSlug"
              >
                <Hash className="h-3.5 w-3.5" /> Custom PIN{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="customSlug"
                id="customSlug"
                defaultValue={createState?.inputs?.customSlug || ""}
                placeholder="e.g. project-alpha"
                className="block w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-gray-500 sm:text-sm py-2.5 px-3"
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
                htmlFor="duration"
              >
                <Clock className="h-3.5 w-3.5" /> Expiration
              </label>
              <select
                name="duration"
                id="duration"
                defaultValue={createState?.inputs?.duration || "15"}
                className="block w-full rounded-lg border-gray-300 border focus:border-gray-500 focus:ring-gray-500 sm:text-sm py-2.5 px-3"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
                <option value="120">2 Hours</option>
                <option value="1440">24 Hours</option>
                <option value="10080">7 Days</option>
              </select>
            </div>

            {/* ✅ Protection select */}
            <div className="space-y-1.5 md:col-span-2">
              <label
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
                htmlFor="protection"
              >
                <Shield className="h-3.5 w-3.5" /> Protection
              </label>

              <select
                name="protection"
                id="protection"
                value={protection}
                onChange={(e) => setProtection(e.target.value)}
                className="block w-full rounded-lg border-gray-300 border focus:border-gray-500 focus:ring-gray-500 sm:text-sm py-2.5 px-3"
              >
                <option value="public">Public (no password)</option>
                <option value="password">Password Protected</option>
              </select>
            </div>

            {/* ✅ Password required only when protection=password */}
            {protection === "password" && (
              <div className="space-y-1.5 md:col-span-2">
                <label
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  htmlFor="password"
                >
                  <Lock className="h-3.5 w-3.5" /> Password{" "}
                  <span className="text-gray-400 font-normal">(Required)</span>
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  autoComplete="new-password"
                  placeholder="Enter a password"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm py-2.5 px-3"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>
      </div>
    </main>
  );
}
