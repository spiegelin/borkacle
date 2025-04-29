import { ItemHeader } from "@/components/layout/ItemHeader"
import { CommentsSection } from "@/components/ui/CommentsSection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BugItem } from "@/types/item"

interface BugViewProps {
  item: BugItem
  onStatusChange: (newStatus: string) => void
}

export function BugView({ item, onStatusChange }: BugViewProps) {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <ItemHeader
        id={item.id}
        title={item.title}
        type={item.type}
        priority={item.priority}
        status={item.status}
        assignee={item.assignee}
        onStatusChange={onStatusChange}
      />
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Bug Details</CardTitle>
              <CardDescription>Information about this bug</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#3A3A3A]">Description</h3>
                <p className="mt-1 text-[#3A3A3A]">
                  The login page is not displaying correctly on mobile devices. The input fields and buttons are
                  overlapping and some content is cut off.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#3A3A3A]">Steps to Reproduce</h3>
                <ol className="list-decimal list-inside mt-1 text-[#3A3A3A]">
                  <li>Open the application on a mobile device (tested on iPhone 12 and Samsung Galaxy S21)</li>
                  <li>Navigate to the login page</li>
                  <li>Observe the layout issues with input fields and buttons</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-[#3A3A3A]">Expected Behavior</h3>
                <p className="mt-1 text-[#3A3A3A]">
                  The login page should be fully responsive, with all elements properly aligned and visible on mobile
                  devices.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#3A3A3A]">Severity</h3>
                <Badge variant="destructive" className="mt-1">
                  High
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-[#3A3A3A]">Related Items</h3>
                <ul className="list-disc list-inside mt-1 text-[#3A3A3A]">
                  <li>ORA-2340: Implement responsive design for all pages</li>
                  <li>ORA-2341: Mobile testing suite</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comments">
          <Card>
            <CardContent className="pt-6">
              <CommentsSection />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent updates and changes to this bug</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">1 hour ago</span>
                  <span className="text-[#3A3A3A]">Mike Johnson changed the status to In Progress</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">4 hours ago</span>
                  <span className="text-[#3A3A3A]">Jane Smith added steps to reproduce</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">1 day ago</span>
                  <span className="text-[#3A3A3A]">Bug reported by John Doe</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

