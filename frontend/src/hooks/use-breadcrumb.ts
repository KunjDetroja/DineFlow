import { useMemo } from "react"
import { useLocation } from "react-router-dom"

export type BreadcrumbItem = {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

export type BreadcrumbConfig = {
  [key: string]: {
    label: string
    icon?: React.ComponentType<{ className?: string }>
    children?: {
      [key: string]: {
        label: string
        icon?: React.ComponentType<{ className?: string }>
        children? : {
          [key: string]: {
            label: string
            icon?: React.ComponentType<{ className?: string }>
          }
        }
      }
    }
  }
}

export function useBreadcrumb(config: BreadcrumbConfig) {
  const location = useLocation()

  const breadcrumbs = useMemo(() => {
    const segments = location.pathname.split("/").filter(Boolean)
    const items: BreadcrumbItem[] = []
    let currentPath = ""

    segments.forEach((segment: string, index: number) => {
      currentPath += `/${segment}`
      
      if (index === 0) {
        // Handle root level
        const rootConfig = config[segment]
        if (rootConfig) {
          items.push({
            label: rootConfig.label,
            href: currentPath,
            icon: rootConfig.icon,
          })
        }
      } else {
        // Handle nested levels
        const parentSegment = segments[index - 1]
        const parentConfig = config[parentSegment]
        const childConfig = parentConfig?.children?.[segment]

        if (childConfig) {
          items.push({
            label: childConfig.label,
            href: currentPath,
            icon: childConfig.icon,
          })
        }
      }
    })

    return items
  }, [location.pathname, config])

  return breadcrumbs
} 