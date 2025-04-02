"use client"

import { useState } from "react"
import { CalendarIcon, Download, Filter, FileText, FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, subDays } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export function Reports() {
  const [dateRange, setDateRange] = useState("30days")
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  // Date range state
  const today = new Date()
  const [dateFrom, setDateFrom] = useState<Date>(subDays(today, 30))
  const [dateTo, setDateTo] = useState<Date>(today)
  const [calendarView, setCalendarView] = useState<"from" | "to">("from")

  // Filter state
  const [filters, setFilters] = useState({
    taskTypes: {
      bugs: true,
      tasks: true,
      stories: true,
      epics: true,
    },
    assignees: {
      johnDoe: true,
      sarahLee: true,
      mikeChen: true,
      unassigned: true,
    },
    priorities: {
      highest: true,
      high: true,
      medium: true,
      low: true,
      lowest: true,
    },
  })

  const handleFilterChange = (category: string, item: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: checked,
      },
    }))
  }

  const handleExport = (format: string) => {
    // In a real application, this would trigger an API call to generate the export
    console.log(`Exporting report in ${format} format...`)

    // Simulate export process
    const reportName = `oracle-cloud-report-${format(new Date(), "yyyy-MM-dd")}`

    // Show success message or download the file
    alert(`Report "${reportName}" has been exported as ${format.toUpperCase()}`)
  }

  const formatDateRange = () => {
    if (dateFrom && dateTo) {
      return `${format(dateFrom, "MMM d")} - ${format(dateTo, "MMM d")}`
    }
    return "Select date range"
  }

  const getActiveFilterCount = () => {
    const totalFilters =
      Object.values(filters.taskTypes).filter((v) => !v).length +
      Object.values(filters.assignees).filter((v) => !v).length +
      Object.values(filters.priorities).filter((v) => !v).length

    return totalFilters
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3A3A3A]">Reports</h1>
          <p className="text-gray-500">Enterprise Cloud Migration</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Calendar Button with Date Range Picker */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-gray-200">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formatDateRange()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Date Range</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDateFrom(subDays(today, 7))
                        setDateTo(today)
                      }}
                    >
                      Last 7 days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDateFrom(subDays(today, 30))
                        setDateTo(today)
                      }}
                    >
                      Last 30 days
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 flex gap-2 items-center border-b">
                <div>
                  <div className="text-sm font-medium mb-1">From</div>
                  <Button
                    variant={calendarView === "from" ? "default" : "outline"}
                    className="justify-start font-normal"
                    onClick={() => setCalendarView("from")}
                  >
                    {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </div>
                <div className="text-muted-foreground">to</div>
                <div>
                  <div className="text-sm font-medium mb-1">To</div>
                  <Button
                    variant={calendarView === "to" ? "default" : "outline"}
                    className="justify-start font-normal"
                    onClick={() => setCalendarView("to")}
                  >
                    {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                  </Button>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={calendarView === "from" ? dateFrom : dateTo}
                onSelect={(date) => {
                  if (date) {
                    if (calendarView === "from") {
                      setDateFrom(date)
                      setCalendarView("to")
                    } else {
                      setDateTo(date)
                      setCalendarOpen(false)
                    }
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Filter Button with Dialog */}
          <Button variant="outline" className="border-gray-200 relative" onClick={() => setFilterDialogOpen(true)}>
            <Filter className="h-4 w-4 mr-1" />
            Filter
            {getActiveFilterCount() > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-[#F7630C] absolute -top-1 -right-1">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Filter Reports</DialogTitle>
                <DialogDescription>Select the filters to apply to your reports.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <h3 className="font-medium mb-2">Task Types</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-bugs"
                        checked={filters.taskTypes.bugs}
                        onCheckedChange={(checked) => handleFilterChange("taskTypes", "bugs", checked as boolean)}
                      />
                      <Label htmlFor="filter-bugs">Bugs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-tasks"
                        checked={filters.taskTypes.tasks}
                        onCheckedChange={(checked) => handleFilterChange("taskTypes", "tasks", checked as boolean)}
                      />
                      <Label htmlFor="filter-tasks">Tasks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-stories"
                        checked={filters.taskTypes.stories}
                        onCheckedChange={(checked) => handleFilterChange("taskTypes", "stories", checked as boolean)}
                      />
                      <Label htmlFor="filter-stories">Stories</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-epics"
                        checked={filters.taskTypes.epics}
                        onCheckedChange={(checked) => handleFilterChange("taskTypes", "epics", checked as boolean)}
                      />
                      <Label htmlFor="filter-epics">Epics</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Assignees</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-john"
                        checked={filters.assignees.johnDoe}
                        onCheckedChange={(checked) => handleFilterChange("assignees", "johnDoe", checked as boolean)}
                      />
                      <Label htmlFor="filter-john">John Doe</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-sarah"
                        checked={filters.assignees.sarahLee}
                        onCheckedChange={(checked) => handleFilterChange("assignees", "sarahLee", checked as boolean)}
                      />
                      <Label htmlFor="filter-sarah">Sarah Lee</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-mike"
                        checked={filters.assignees.mikeChen}
                        onCheckedChange={(checked) => handleFilterChange("assignees", "mikeChen", checked as boolean)}
                      />
                      <Label htmlFor="filter-mike">Mike Chen</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-unassigned"
                        checked={filters.assignees.unassigned}
                        onCheckedChange={(checked) => handleFilterChange("assignees", "unassigned", checked as boolean)}
                      />
                      <Label htmlFor="filter-unassigned">Unassigned</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Priorities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-highest"
                        checked={filters.priorities.highest}
                        onCheckedChange={(checked) => handleFilterChange("priorities", "highest", checked as boolean)}
                      />
                      <Label htmlFor="filter-highest">Highest</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-high"
                        checked={filters.priorities.high}
                        onCheckedChange={(checked) => handleFilterChange("priorities", "high", checked as boolean)}
                      />
                      <Label htmlFor="filter-high">High</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-medium"
                        checked={filters.priorities.medium}
                        onCheckedChange={(checked) => handleFilterChange("priorities", "medium", checked as boolean)}
                      />
                      <Label htmlFor="filter-medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-low"
                        checked={filters.priorities.low}
                        onCheckedChange={(checked) => handleFilterChange("priorities", "low", checked as boolean)}
                      />
                      <Label htmlFor="filter-low">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="filter-lowest"
                        checked={filters.priorities.lowest}
                        onCheckedChange={(checked) => handleFilterChange("priorities", "lowest", checked as boolean)}
                      />
                      <Label htmlFor="filter-lowest">Lowest</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Reset all filters to true
                    setFilters({
                      taskTypes: {
                        bugs: true,
                        tasks: true,
                        stories: true,
                        epics: true,
                      },
                      assignees: {
                        johnDoe: true,
                        sarahLee: true,
                        mikeChen: true,
                        unassigned: true,
                      },
                      priorities: {
                        highest: true,
                        high: true,
                        medium: true,
                        low: true,
                        lowest: true,
                      },
                    })
                  }}
                >
                  Reset
                </Button>
                <Button onClick={() => setFilterDialogOpen(false)}>Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Export Button with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-gray-200">
                <Download className="h-4 w-4 mr-1" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <FileText className="h-4 w-4 mr-2" />
                <span>Export as CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                <span>Export as Excel</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FilePdf className="h-4 w-4 mr-2" />
                <span>Export as PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="burndown">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="burndown">Burndown</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="cumulative">Cumulative Flow</TabsTrigger>
          <TabsTrigger value="created-resolved">Created vs Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="burndown">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sprint Burndown</CardTitle>
                  <CardDescription>Tracking remaining work in the current sprint</CardDescription>
                </div>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="14days">Last 14 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-bar-chart-3 mx-auto text-gray-400 mb-4"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                  </svg>
                  <p className="text-gray-500">Burndown chart visualization would appear here</p>
                  <p className="text-sm text-gray-400 mt-1">Showing ideal vs actual burndown for Sprint 3</p>
                  <p className="text-sm text-gray-400 mt-1">Date range: {formatDateRange()}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {getActiveFilterCount() > 0 ? `${getActiveFilterCount()} filters applied` : "No filters applied"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="velocity">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Velocity</CardTitle>
                  <CardDescription>Story points completed per sprint</CardDescription>
                </div>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3sprints">Last 3 sprints</SelectItem>
                    <SelectItem value="6sprints">Last 6 sprints</SelectItem>
                    <SelectItem value="10sprints">Last 10 sprints</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-bar-chart mx-auto text-gray-400 mb-4"
                  >
                    <path d="M12 20V10" />
                    <path d="M18 20V4" />
                    <path d="M6 20v-4" />
                  </svg>
                  <p className="text-gray-500">Velocity chart visualization would appear here</p>
                  <p className="text-sm text-gray-400 mt-1">Showing story points completed across sprints</p>
                  <p className="text-sm text-gray-400 mt-1">Date range: {formatDateRange()}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {getActiveFilterCount() > 0 ? `${getActiveFilterCount()} filters applied` : "No filters applied"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cumulative">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cumulative Flow</CardTitle>
                  <CardDescription>Work distribution across workflow states</CardDescription>
                </div>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="14days">Last 14 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-area-chart mx-auto text-gray-400 mb-4"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M3 15 7 9l4 4 8-8 2 2" />
                  </svg>
                  <p className="text-gray-500">Cumulative flow diagram would appear here</p>
                  <p className="text-sm text-gray-400 mt-1">Showing work distribution across workflow states</p>
                  <p className="text-sm text-gray-400 mt-1">Date range: {formatDateRange()}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {getActiveFilterCount() > 0 ? `${getActiveFilterCount()} filters applied` : "No filters applied"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="created-resolved">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Created vs Resolved</CardTitle>
                  <CardDescription>Tracking issue creation and resolution rates</CardDescription>
                </div>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="14days">Last 14 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-line-chart mx-auto text-gray-400 mb-4"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  <p className="text-gray-500">Created vs Resolved chart would appear here</p>
                  <p className="text-sm text-gray-400 mt-1">Comparing issue creation and resolution rates</p>
                  <p className="text-sm text-gray-400 mt-1">Date range: {formatDateRange()}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {getActiveFilterCount() > 0 ? `${getActiveFilterCount()} filters applied` : "No filters applied"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3A3A3A]">42</div>
            <p className="text-xs text-green-600 mt-1">+12% from last sprint</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3A3A3A]">18</div>
            <p className="text-xs text-green-600 mt-1">+5% from last sprint</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3A3A3A]">3.2 days</div>
            <p className="text-xs text-red-600 mt-1">+0.5 days from last sprint</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Sprint Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3A3A3A]">35%</div>
            <p className="text-xs text-gray-500 mt-1">7 days remaining</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

