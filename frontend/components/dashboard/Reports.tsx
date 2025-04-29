"use client"

import { useState } from "react"
import {
  CalendarIcon,
  Download,
  Filter,
  FileText,
  FileSpreadsheet,
  FileIcon as FilePdf,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, subDays } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Importamos Chart.js y react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"

// Registramos componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
)

type FilterCategory = "taskTypes" | "assignees" | "priorities"

type TaskTypes = {
  bugs: boolean
  tasks: boolean
  stories: boolean
  epics: boolean
}

type Assignees = {
  johnDoe: boolean
  sarahLee: boolean
  mikeChen: boolean
  unassigned: boolean
}

type Priorities = {
  highest: boolean
  high: boolean
  medium: boolean
  low: boolean
  lowest: boolean
}

type Filters = {
  taskTypes: TaskTypes
  assignees: Assignees
  priorities: Priorities
}

type FilterItem<T extends FilterCategory> = T extends "taskTypes" 
  ? keyof TaskTypes 
  : T extends "assignees" 
  ? keyof Assignees 
  : keyof Priorities

export function Reports() {
  // Estado inicial de filtros
  const [dateRange, setDateRange] = useState("30days")
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  // Rango de fechas para el calendario
  const today = new Date()
  const [dateFrom, setDateFrom] = useState<Date>(subDays(today, 30))
  const [dateTo, setDateTo] = useState<Date>(today)
  const [calendarView, setCalendarView] = useState<"from" | "to">("from")

  // Configuración de filtros
  const [filters, setFilters] = useState<Filters>({
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

  // Manejo de cambios en el estado de los filtros
  const handleFilterChange = <T extends FilterCategory>(category: T, item: FilterItem<T>, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: checked,
      },
    }))
  }

  // Función de exportar (placeholder)
  const handleExport = (formatType: string) => {
    console.log(`Exporting report in ${formatType} format...`)
    const reportName = `oracle-cloud-report-${format(new Date(), "yyyy-MM-dd")}`
    alert(`Report "${reportName}" has been exported as ${formatType.toUpperCase()}`)
  }

  // Formato del rango de fechas seleccionado
  const formatDateRange = () => {
    if (dateFrom && dateTo) {
      return `${format(dateFrom, "MMM d")} - ${format(dateTo, "MMM d")}`
    }
    return "Select date range"
  }

  // Contar cuántos filtros se han "desmarcado"
  const getActiveFilterCount = () => {
    const totalFilters =
      Object.values(filters.taskTypes).filter((v) => !v).length +
      Object.values(filters.assignees).filter((v) => !v).length +
      Object.values(filters.priorities).filter((v) => !v).length
    return totalFilters
  }

  // ------------------------------
  //  DATOS Y OPCIONES PARA CHARTS
  // ------------------------------

  // 1) BURNDOWN (Line Chart)
  const burndownData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    datasets: [
      {
        label: "Ideal Burndown",
        data: [50, 40, 30, 20, 10],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
      {
        label: "Actual Burndown",
        data: [50, 45, 36, 28, 15],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.3,
      },
    ],
  }

  const burndownOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Sprint Burndown (Example)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Remaining Points",
        },
      },
      x: {
        title: {
          display: true,
          text: "Days",
        },
      },
    },
  }

  // 2) VELOCITY (Bar Chart)
  // Ejemplo de "story points" completados en 5 sprints
  const velocityData = {
    labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5"],
    datasets: [
      {
        label: "Story Points Completed",
        data: [20, 25, 15, 30, 28],
        backgroundColor: "rgba(34, 197, 94, 0.5)", // verde
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  }

  const velocityOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Team Velocity (Example)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Story Points",
        },
      },
      x: {
        title: {
          display: true,
          text: "Sprints",
        },
      },
    },
  }

  // 3) CUMULATIVE FLOW (Stacked Area con Line)
  // Simulamos 3 estados: To Do, In Progress, Done
  const cumulativeData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    datasets: [
      {
        label: "To Do",
        data: [10, 8, 7, 6, 5],
        borderColor: "rgba(96, 165, 250, 1)", // azul
        backgroundColor: "rgba(96, 165, 250, 0.3)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "In Progress",
        data: [5, 6, 6, 5, 3],
        borderColor: "rgba(250, 204, 21, 1)", // amarillo
        backgroundColor: "rgba(250, 204, 21, 0.3)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Done",
        data: [2, 4, 6, 7, 10],
        borderColor: "rgba(34, 197, 94, 1)", // verde
        backgroundColor: "rgba(34, 197, 94, 0.3)",
        fill: true,
        tension: 0.3,
      },
    ],
  }

  const cumulativeOptions = {
    responsive: true,
    stacked: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Cumulative Flow (Example)",
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Days",
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Tasks",
        },
      },
    },
  }

  // 4) CREATED vs RESOLVED (Line Chart con 2 datasets)
  const createdResolvedData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Created",
        data: [8, 12, 10, 15],
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      },
      {
        label: "Resolved",
        data: [5, 9, 8, 13],
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.3,
      },
    ],
  }

  const createdResolvedOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Created vs Resolved (Example)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Issues",
        },
      },
      x: {
        title: {
          display: true,
          text: "Weeks",
        },
      },
    },
  }

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3A3A3A]">Reports</h1>
          <p className="text-gray-500">Enterprise Cloud Migration</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Botón para rango de fechas (Calendario) */}
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

          {/* Botón de filtros (Dialog) */}
          <Button variant="outline" className="border-gray-200 relative" onClick={() => setFilterDialogOpen(true)}>
            <Filter className="h-4 w-4 mr-1" />
            Filter
            {getActiveFilterCount() > 0 && (
              <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-[#C74634] absolute -top-1 -right-1">
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
                {/* Tipo de Tareas */}
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

                {/* Asignados */}
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

                {/* Prioridades */}
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
                    // Resetea todos los filtros a true
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

          {/* Botón de exportar (Dropdown) */}
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

      {/* Tabs con cada gráfica */}
      <Tabs defaultValue="burndown">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="burndown">Burndown</TabsTrigger>
          <TabsTrigger value="velocity">Velocity</TabsTrigger>
          <TabsTrigger value="cumulative">Cumulative Flow</TabsTrigger>
          <TabsTrigger value="created-resolved">Created vs Resolved</TabsTrigger>
        </TabsList>

        {/* BURNDOWN */}
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
              <div className="bg-white p-4 rounded-md shadow-sm">
                <Line data={burndownData} options={burndownOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VELOCITY */}
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
              <div className="bg-white p-4 rounded-md shadow-sm">
                <Bar data={velocityData} options={velocityOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CUMULATIVE FLOW */}
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
              <div className="bg-white p-4 rounded-md shadow-sm">
                {/* Usamos Line pero con fill y stacked */}
                <Line data={cumulativeData} options={cumulativeOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CREATED vs RESOLVED */}
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
              <div className="bg-white p-4 rounded-md shadow-sm">
                <Line data={createdResolvedData} options={createdResolvedOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tarjetas de datos falsos (Indicadores) */}
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
