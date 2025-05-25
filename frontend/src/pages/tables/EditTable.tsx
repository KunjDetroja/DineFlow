import { Breadcrumb } from "@/components/ui/breadcrumb"
import { useBreadcrumb } from "@/hooks/use-breadcrumb"
import { breadcrumbConfig } from "@/config/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from "react-router-dom"
import { useMemo } from "react"
import { type BreadcrumbItem } from "@/hooks/use-breadcrumb"

export default function EditTable() {
  const { id } = useParams()
  const breadcrumbs = useBreadcrumb(breadcrumbConfig)

  // Add the table ID as a new breadcrumb item
  const updatedBreadcrumbs = useMemo(() => {
    if (!breadcrumbs.length || !id) return breadcrumbs

    // Make the Edit item non-clickable by setting href to current path
    const modifiedBreadcrumbs = breadcrumbs.map((item, index) => {
      if (index === breadcrumbs.length - 1) {
        return {
          ...item,
          href: `/tables/edit/${id}`,
        }
      }
      return item
    })

    return [
      ...modifiedBreadcrumbs,
      {
        label: id,
        href: `/tables/edit/${id}`,
      } as BreadcrumbItem,
    ]
  }, [breadcrumbs, id])

  return (
    <div className="space-y-6">
      <Breadcrumb items={updatedBreadcrumbs} />
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Table {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input id="tableNumber" placeholder="Enter table number" defaultValue="Table 1" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" placeholder="Enter table capacity" defaultValue="4" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Enter table location" defaultValue="Window Side" />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline">Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 