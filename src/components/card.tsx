import { cn } from "~/lib/utils"

export const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-card text-foreground border-2 p-10", className)}
    {...props}
  />
)

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2 pb-10", className)} {...props} />
)

export const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <h3
    className={cn(
      "text-3xl leading-none font-serif-heading text-foreground",
      className
    )}
    {...props}
  />
)

export const CardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <h3 className={cn("text-xl text-muted-foreground leading-tight", className)} {...props} />
)

export const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(className)} {...props} />
)

export const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1 pt-10", className)} {...props} />
)
