import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-gray-500 selection:bg-primary-200/50 selection:text-black",
        "bg-dark-200/50 border border-gray-700/50 flex h-14 w-full min-w-0 rounded-xl",
        "px-4 py-3 text-base shadow-lg backdrop-blur-sm",
        "transition-all duration-300 ease-out outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus:border-primary-200/50 focus:bg-dark-200/80 focus:shadow-primary-200/20 focus:scale-[1.01]",
        "hover:border-gray-600/50 hover:bg-dark-200/70",
        "aria-invalid:border-destructive/50 aria-invalid:shadow-destructive/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
