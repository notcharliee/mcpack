import { cn } from "~/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { forwardRef } from "react"

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline",
    asChild?: boolean,
  }
>(({ className, variant, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      className={cn(
        // general
        "px-4 py-1 text-xl font-serif-heading active:brightness-75 active:scale-[.99]",
        // default variant
        (!variant || variant === "default") &&
          "bg-accent shadow-[0_4px_0_var(--accent-dark),4px_0_0_var(--accent-dark),-4px_0_0_var(--accent-dark),0_-4px_0_var(--accent-light)] [text-shadow:0_2px_0_var(--accent-dark)]",
        // destructive variant
        variant === "destructive" &&
          "bg-destructive shadow-[0_4px_0_var(--destructive-dark),4px_0_0_var(--destructive-dark),-4px_0_0_var(--destructive-dark),0_-4px_0_var(--destructive-light)] [text-shadow:0_2px_0_var(--destructive-dark)]",
        // outline
        variant === "outline" &&
          "bg-background border-2 font-serif text-muted-foreground flex items-center px-4 py-3 text-base",
        // overrides
        className
      )}
      {...props}
    />
  )
})
