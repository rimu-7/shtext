"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";

export default function RateLimitAlert({ resetTime, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!resetTime) return;
    let called = false;

    const update = () => {
      const now = Date.now();
      const distance = resetTime - now;
      if (distance <= 0) {
        setTimeLeft(0);
        if (!called) {
          called = true;
          if (onExpire) {
            onExpire();
          }
          window.location.reload();
        }
      } else {
        setTimeLeft(Math.ceil(distance / 1000));
      }
    };

    update();
    const interval = setInterval(update, 250);
    return () => clearInterval(interval);
  }, [resetTime, onExpire]);

  if (!resetTime || timeLeft <= 0) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-600 p-4 shadow-[4px_4px_0_0_#dc2626] animate-in fade-in slide-in-from-top-2 w-full text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <AlertTriangle className="h-8 w-8 text-red-600 mb-1" />
        <h3 className="font-black uppercase text-red-600 tracking-wider text-xl">
          Limit Crossed
        </h3>
        <p className="text-sm font-mono text-red-600/80 mb-2">
          You've exceeded the request limit. Please wait before trying again.
        </p>
        <div className="flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900/50 px-4 py-2 border-2 border-red-600">
          <Clock className="w-5 h-5 text-red-600 animate-pulse" />
          <span className="font-bold font-mono text-red-600 text-lg">
            {timeLeft} {timeLeft === 1 ? "second" : "seconds"}
          </span>
        </div>
        <p className="text-xs text-red-500/60 mt-1 font-mono">
          Page will refresh automatically...
        </p>
      </div>
    </div>
  );
}
