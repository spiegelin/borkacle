import { ItemHeader } from "@/components/layout/ItemHeader"
import { CommentsSection } from "@/components/ui/CommentsSection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StoryItem } from "@/types/item"

interface StoryViewProps {
  item: StoryItem
  onStatusChange: (newStatus: string) => void
}

export function StoryView({ item, onStatusChange }: StoryViewProps) {
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
              <CardTitle>Story Details</CardTitle>
              <CardDescription>Information about this user story</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#3A3A3A]">Description</h3>
                <p className="mt-1 text-[#3A3A3A]">
                  As a database administrator, I want to create a comprehensive plan for migrating our existing database
                  to the new cloud infrastructure to ensure a smooth transition with minimal downtime.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#3A3A3A]">Acceptance Criteria</h3>
                <ul className="list-disc list-inside mt-1 text-[#3A3A3A]">
                  <li>Analyze current database structure and size</li>
                  <li>Identify potential migration challenges</li>
                  <li>Create a step-by-step migration process</li>
                  <li>Estimate required downtime</li>
                  <li>Develop a rollback plan in case of issues</li>
                  <li>Document the entire migration plan</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#3A3A3A]">Story Points</h3>
                <Badge variant="secondary" className="mt-1">
                  13 points
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-[#3A3A3A]">Related Items</h3>
                <ul className="list-disc list-inside mt-1 text-[#3A3A3A]">
                  <li>ORA-2345: Setup cloud infrastructure</li>
                  <li>ORA-2348: Implement database backup strategy</li>
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
              <CardDescription>Recent updates and changes to this story</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">3 hours ago</span>
                  <span className="text-[#3A3A3A]">Jane Smith added acceptance criteria</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">1 day ago</span>
                  <span className="text-[#3A3A3A]">Mike Johnson updated the story points</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">2 days ago</span>
                  <span className="text-[#3A3A3A]">Story created by John Doe</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

