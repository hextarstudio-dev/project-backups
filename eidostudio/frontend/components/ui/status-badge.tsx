import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-x-1.5 rounded-md bg-background px-2 py-0.5 text-xs border",
  {
    variants: {
      status: {
        success: "",
        error: "",
        default: "",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  leftIcon?: React.ComponentType<any>
  rightIcon?: React.ComponentType<any>
  leftLabel: string
  rightLabel: string
}

export function StatusBadge({
  className,
  status,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  leftLabel,
  rightLabel,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)} {...props}>
      <span className="inline-flex items-center gap-1 font-medium text-foreground">
        {LeftIcon && (
          <LeftIcon
            className={cn(
              "-ml-0.5 size-3 shrink-0",
              status === "success" && "text-emerald-600 dark:text-emerald-500",
              status === "error" && "text-red-600 dark:text-red-500"
            )}
            aria-hidden={true}
          />
        )}
        {leftLabel}
      </span>
      <span className="h-3 w-px bg-border" />
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        {RightIcon && (
          <RightIcon
            className="-ml-0.5 size-3 shrink-0"
            aria-hidden={true}
          />
        )}
        {rightLabel}
      </span>
    </span>
  )
}
