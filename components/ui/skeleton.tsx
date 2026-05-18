import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50 dark:bg-zinc-800/40", className)}
      {...props}
    />
  )
}

export { Skeleton }
