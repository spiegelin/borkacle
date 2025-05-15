// types/item.ts

export type Priority = "highest" | "high" | "medium" | "low" | "lowest";
export type Status = "todo" | "inProgress" | "review" | "done";

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
    priority: Priority
    status: Status
  }
  
  export type StoryItem = BaseItem & {
    type: "story"
    priority: Priority
    status: Status
  }
  
  export type BugItem = BaseItem & {
    type: "bug"
    priority: Priority
    status: Status
  }
  
  export type EpicItem = BaseItem & {
    type: "epic"
    priority: Priority
    status: Status
  }
  
  export type ItemType = TaskItem | StoryItem | BugItem | EpicItem;
