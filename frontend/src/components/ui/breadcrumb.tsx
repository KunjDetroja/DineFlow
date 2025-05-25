import * as React from "react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { type BreadcrumbItem } from "@/hooks/use-breadcrumb"

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
}

export function Breadcrumb({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <span className="mx-1" aria-hidden="true">
                {separator}
              </span>
            )}
            <Link
              to={item.href}
              className={cn(
                "flex items-center gap-1.5 font-medium transition-colors hover:text-foreground",
                isLast && "text-foreground pointer-events-none"
              )}
              aria-current={isLast ? "page" : undefined}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </Link>
          </React.Fragment>
        )
      })}
    </nav>
  )
}
