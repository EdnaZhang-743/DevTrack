import type { Project, TaskItem } from "../types";

const API_BASE = "http://localhost:5000/api";

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function getProject(id: number): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
}

export async function createProject(data: {
  name: string;
  description?: string;
}) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
}

export async function createTask(data: {
  projectId: number;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
}): Promise<TaskItem> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTaskStatus(
  id: number,
  status: string
): Promise<TaskItem> {
  const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update task status");
  return res.json();
}