export interface TaskItem {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  dueDate?: string | null;
  projectId: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
  tasks: TaskItem[];
}