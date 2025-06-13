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
  DialogTrigger
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
  return null;
}
