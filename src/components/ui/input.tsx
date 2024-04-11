import * as React from "react"

import { cn } from "~/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  keepPlaceholder?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, keepPlaceholder, placeholder, ...props }, ref) => {
    return keepPlaceholder ? (
      <div className="flex gap-[0.5ch] border-2 bg-background px-4 py-3 transition-colors text-muted-foreground focus-within:ring-1 focus-within:ring-muted-foreground disabled:cursor-not-allowed disabled:opacity-50">
        {placeholder}
        <input
          type={type}
          className={cn(
            "border-none grow bg-transparent text-foreground focus-visible:outline-none",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        className={cn(
          "flex w-full border-2 bg-background px-4 py-3 transition-colors file:border-0 file:bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
