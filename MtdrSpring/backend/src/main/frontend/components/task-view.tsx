import { ItemHeader } from "./item-header"
import { CommentsSection } from "./comments-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TaskViewProps {
  item: {
    id: string
    title: string
    type: "task"
    priority: "highest" | "high" | "medium" | "low" | "lowest"
    status: "to do" | "in progress" | "review" | "done"
    assignee?: {
      name: string
      avatar?: string
      initials: string
    }
  }
  onStatusChange: (newStatus: string) => void
}

export function TaskView({ item, onStatusChange }: TaskViewProps) {
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
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Information about this task</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#3A3A3A]">Description</h3>
                <p className="mt-1 text-[#3A3A3A]">
                  Set up the necessary cloud infrastructure for our project, including virtual machines, storage, and
                  networking components.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#3A3A3A]">Acceptance Criteria</h3>
                <ul className="list-disc list-inside mt-1 text-[#3A3A3A]">
                  <li>Create and configure 3 virtual machines</li>
                  <li>Set up a virtual network with proper subnets</li>
                  <li>Configure storage accounts for data persistence</li>
                  <li>Implement necessary security measures (firewalls, access controls)</li>
                  <li>Document the infrastructure setup for team reference</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#3A3A3A]">Related Items</h3>
                <ul className="list-disc list-inside mt-1 text-[#3A3A3A]">
                  <li>ORA-2346: Database migration plan</li>
                  <li>ORA-2347: Configure monitoring and alerting</li>
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
              <CardDescription>Recent updates and changes to this task</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">2 hours ago</span>
                  <span className="text-[#3A3A3A]">John Doe changed the status to In Progress</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">1 day ago</span>
                  <span className="text-[#3A3A3A]">Jane Smith updated the description</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">2 days ago</span>
                  <span className="text-[#3A3A3A]">Task created by Mike Johnson</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

