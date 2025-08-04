import * as React from "react";

import { cn } from "./utils";

interface InputProps extends React.ComponentProps<"input"> {
  helperText?: string;
}

function Input({ className, type, helperText, placeholder, ...props }: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Handle keyboard shortcuts for select all
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check for Cmd+A (Mac) or Ctrl+A (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.select();
      return;
    }
    
    props.onKeyDown?.(e);
  };

  // Use helperText as placeholder if no placeholder is provided
  const effectivePlaceholder = placeholder || helperText;

  return (
    <input
      ref={inputRef}
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-gray-400 selection:bg-blue-500 selection:text-white dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
      placeholder={effectivePlaceholder}
      onKeyDown={handleKeyDown}
    />
  );
}

export { Input };
