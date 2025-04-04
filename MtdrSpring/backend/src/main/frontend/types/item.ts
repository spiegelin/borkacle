// types/item.ts

export type BaseItem = {
    id: string
    title: string
    assignee?: {
      name: string
      initials: string
      avatar?: string
    }
  }
  
  export type TaskItem = BaseItem & {
    type: "task"
    priority: "high" | "highest" | "medium" | "low" | "lowest"
    status: "to do" | "in progress" | "review" | "done"
  }
  
  export type StoryItem = BaseItem & {
    type: "story"
    priority: "high" | "highest" | "medium" | "low" | "lowest"
    status: "to do" | "in progress" | "review" | "done"
  }
  
  export type BugItem = BaseItem & {
    type: "bug"
    priority: "high" | "highest" | "medium" | "low" | "lowest"
    status: "to do" | "in progress" | "review" | "done"
  }
  
  export type ItemType = TaskItem | StoryItem | BugItem
