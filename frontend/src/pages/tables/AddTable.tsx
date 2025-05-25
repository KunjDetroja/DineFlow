import { Breadcrumb } from "@/components/ui/breadcrumb"
import { useBreadcrumb } from "@/hooks/use-breadcrumb"
import { breadcrumbConfig } from "@/config/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddTable() {
  const breadcrumbs = useBreadcrumb(breadcrumbConfig)

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbs} />
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Table</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input id="tableNumber" placeholder="Enter table number" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" placeholder="Enter table capacity" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Enter table location" />
            </div>
            
            <Button type="submit">Add Table</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 