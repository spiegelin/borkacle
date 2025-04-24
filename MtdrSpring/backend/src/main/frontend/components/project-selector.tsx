"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateProjectDialog } from "@/components/create-project-dialog"

interface Project {
  id: string
  name: string
  description: string
  startDate: Date | undefined
  endDate: Date | undefined
  identifier: string
}

export function ProjectSelector() {
  const [currentProject, setCurrentProject] = useState("Enterprise Cloud Migration")
  const [createProjectOpen, setCreateProjectOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Enterprise Cloud Migration",
      description: "Migrating enterprise applications to the cloud",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-12-31"),
      identifier: "ECM001",
    },
    {
      id: "2",
      name: "Customer Portal Redesign",
      description: "Redesigning the customer portal for better UX",
      startDate: new Date("2023-02-15"),
      endDate: new Date("2023-08-15"),
      identifier: "CPR002",
    },
    {
      id: "3",
      name: "Database Optimization",
      description: "Optimizing database performance for scalability",
      startDate: new Date("2023-03-01"),
      endDate: new Date("2023-09-30"),
      identifier: "DBO003",
    },
    {
      id: "4",
      name: "Security Compliance",
      description: "Ensuring compliance with latest security standards",
      startDate: new Date("2023-04-01"),
      endDate: new Date("2023-10-31"),
      identifier: "SEC004",
    },
    {
      id: "5",
      name: "Mobile App Development",
      description: "Developing a new mobile app for customers",
      startDate: new Date("2023-05-01"),
      endDate: new Date("2023-11-30"),
      identifier: "MAD005",
    },
  ])

  const handleCreateProject = (project: {
    name: string
    description: string
    startDate: Date | undefined
    endDate: Date | undefined
    identifier: string
  }) => {
    const projectWithId: Project = {
      ...project,
      id: (projects.length + 1).toString(),
    }
    setProjects([...projects, projectWithId])
    setCurrentProject(project.name)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between mt-4 bg-white border-gray-200 text-[#3A3A3A]">
            {currentProject}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => setCurrentProject(project.name)}
              className={currentProject === project.name ? "bg-gray-100" : ""}
            >
              {project.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setCreateProjectOpen(true)}>
            <span className="text-[#C74634]">+ Create new project</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateProjectDialog
        open={createProjectOpen}
        setOpen={setCreateProjectOpen}
        onCreateProject={handleCreateProject}
      />
    </>
  )
}

