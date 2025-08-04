import * as React from "react"
import { cn } from "./utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, helperText, placeholder, ...props }, ref) => {
    // Handle keyboard shortcuts for select all
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Check for Cmd+A (Mac) or Ctrl+A (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        e.currentTarget.select();
        return;
      }
      
      props.onKeyDown?.(e);
    };

    // Use helperText as placeholder if no placeholder is provided
    const effectivePlaceholder = placeholder || helperText;

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 selection:bg-blue-500 selection:text-white focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-slate-600 disabled:cursor-not-allowed disabled:opacity-50 justify-between",
          className
        )}
        ref={ref}
        {...props}
        placeholder={effectivePlaceholder}
        onKeyDown={handleKeyDown}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }