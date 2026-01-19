import { cn } from "@/lib/utils";

export default function Container({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}