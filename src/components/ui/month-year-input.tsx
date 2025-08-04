import * as React from "react";
import { cn } from "./utils";

interface MonthYearInputProps extends Omit<React.ComponentProps<"input">, 'type' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  helperText?: string;
}

function MonthYearInput({ className, value, onChange, helperText, ...props }: MonthYearInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Handle keyboard shortcuts for select all
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check for Cmd+A (Mac) or Ctrl+A (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      e.stopPropagation();
      // Use the ref to select all text
      if (inputRef.current) {
        inputRef.current.select();
      }
      return;
    }
    
    props.onKeyDown?.(e);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remove any non-digits and non-slash characters
    inputValue = inputValue.replace(/[^0-9/]/g, '');
    
    // Remove any extra slashes (only allow one)
    const slashCount = (inputValue.match(/\//g) || []).length;
    if (slashCount > 1) {
      const parts = inputValue.split('/');
      inputValue = parts[0] + '/' + parts.slice(1).join('');
    }
    
    // Split by slash to get month and year parts
    const parts = inputValue.split('/');
    let month = parts[0] || '';
    let year = parts[1] || '';
    
    // Handle month validation and formatting
    if (month.length > 2) {
      // If more than 2 digits in month, move extras to year
      year = month.slice(2) + year;
      month = month.slice(0, 2);
    }
    
    // Validate month range (01-12)
    if (month.length === 2) {
      const monthNum = parseInt(month, 10);
      if (monthNum < 1 || monthNum > 12) {
        // Invalid month, move second digit to year
        year = month.slice(1) + year;
        month = month.slice(0, 1);
      }
    }
    
    // Limit year to 4 digits
    if (year.length > 4) {
      year = year.slice(0, 4);
    }
    
    // Build final formatted value
    let formattedValue = month;
    
    // Add slash automatically after 2 valid month digits
    if (month.length === 2 && !inputValue.includes('/')) {
      formattedValue = month + '/';
    } else if (inputValue.includes('/') || year.length > 0) {
      formattedValue = month + '/' + year;
    }
    
    // Call onChange with the formatted value
    onChange?.(formattedValue);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      data-slot="month-year-input"
      className={cn(
        "file:text-foreground placeholder:text-gray-400 selection:bg-blue-500 selection:text-white dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
      value={value || ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={helperText || "MM/YYYY"}
    />
  );
}

export { MonthYearInput };