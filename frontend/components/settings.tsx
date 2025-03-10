"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function Settings() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#3A3A3A]">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Update your project information and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project-name" className="text-right">
                    Project Name
                  </Label>
                  <Input id="project-name" defaultValue="Enterprise Cloud Migration" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project-key" className="text-right">
                    Project Key
                  </Label>
                  <Input id="project-key" defaultValue="ORA" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project-lead" className="text-right">
                    Project Lead
                  </Label>
                  <Select defaultValue="john">
                    <SelectTrigger id="project-lead" className="col-span-3">
                      <SelectValue placeholder="Select project lead" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="sarah">Sarah Lee</SelectItem>
                      <SelectItem value="mike">Mike Chen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    className="col-span-3"
                    defaultValue="Project to migrate enterprise applications to Oracle Cloud Infrastructure."
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#F7630C] hover:bg-[#E25A00]">Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Avatar</CardTitle>
                <CardDescription>Upload a project avatar or icon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-md bg-[#F7630C] flex items-center justify-center text-white font-bold text-2xl">
                    O
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline">Upload New Avatar</Button>
                    <p className="text-xs text-gray-500">Recommended size: 256x256px. Max file size: 1MB.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Project Members</CardTitle>
              <CardDescription>Manage team members and their roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <Input placeholder="Search members" />
                </div>
                <Button className="bg-[#1A4F9C] hover:bg-[#00758F]">Add Member</Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-500">Name</th>
                      <th className="text-left p-3 font-medium text-gray-500">Email</th>
                      <th className="text-left p-3 font-medium text-gray-500">Role</th>
                      <th className="text-left p-3 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#1A4F9C] flex items-center justify-center text-white text-xs">
                            JD
                          </div>
                          <span>John Doe</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-500">john.doe@oracle.com</td>
                      <td className="p-3">
                        <Select defaultValue="admin">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          Remove
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#00758F] flex items-center justify-center text-white text-xs">
                            SL
                          </div>
                          <span>Sarah Lee</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-500">sarah.lee@oracle.com</td>
                      <td className="p-3">
                        <Select defaultValue="member">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          Remove
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-[#F80000] flex items-center justify-center text-white text-xs">
                            MC
                          </div>
                          <span>Mike Chen</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-500">mike.chen@oracle.com</td>
                      <td className="p-3">
                        <Select defaultValue="viewer">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          Remove
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-assigned">When I'm assigned to an issue</Label>
                    <Switch id="email-assigned" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-mentioned">When I'm mentioned in a comment</Label>
                    <Switch id="email-mentioned" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-status">When an issue status changes</Label>
                    <Switch id="email-status" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-sprint">When a sprint starts or ends</Label>
                    <Switch id="email-sprint" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-daily">Daily summary of activity</Label>
                    <Switch id="email-daily" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">In-App Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-assigned">When I'm assigned to an issue</Label>
                    <Switch id="app-assigned" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-mentioned">When I'm mentioned in a comment</Label>
                    <Switch id="app-mentioned" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-status">When an issue status changes</Label>
                    <Switch id="app-status" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-comment">When someone comments on my issue</Label>
                    <Switch id="app-comment" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="app-sprint">When a sprint starts or ends</Label>
                    <Switch id="app-sprint" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button variant="outline">Reset to Default</Button>
              <Button className="bg-[#1A4F9C] hover:bg-[#00758F]">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect with your favorite tools and services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Here you can manage integrations with third-party services.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Manage advanced project configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">API URL</Label>
                <Input id="api-url" type="url" placeholder="https://api.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" type="url" placeholder="https://webhook.example.com" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-debug">Enable Debug Mode</Label>
                <Switch id="enable-debug" />
              </div>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button variant="outline">Reset to Default</Button>
              <Button className="bg-[#1A4F9C] hover:bg-[#00758F]">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

