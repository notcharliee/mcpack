import { cn } from "~/lib/utils"

export const Button = ({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive"
}) => (
  <button
    className={cn(
      // general
      "px-4 h-9 text-xl font-serif-heading active:brightness-75 active:scale-[.99]",
      // default variant
      (!variant || variant === "default") &&
        "bg-accent shadow-[0_4px_0_var(--accent-dark),4px_0_0_var(--accent-dark),-4px_0_0_var(--accent-dark),0_-4px_0_var(--accent-light)] [text-shadow:0_2px_0_var(--accent-dark)]",
      // destructive variant
      variant === "destructive" &&
        "bg-destructive shadow-[0_4px_0_var(--destructive-dark),4px_0_0_var(--destructive-dark),-4px_0_0_var(--destructive-dark),0_-4px_0_var(--destructive-light)] [text-shadow:0_2px_0_var(--destructive-dark)]",
      // overrides
      className
    )}
    {...props}
  />
)
