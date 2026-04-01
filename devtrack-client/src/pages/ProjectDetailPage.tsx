import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createTask,
  deleteTask,
  getProject,
  updateTaskStatus,
} from "../api/client";
import type { Project } from "../types";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const projectId = Number(id);

  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(true);

  async function loadProject() {
    try {
      const data = await getProject(projectId);
      setProject(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!projectId) return;
    loadProject();
  }, [projectId]);

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      await createTask({
        projectId,
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      setTitle("");
      setDescription("");
      setPriority("Medium");
      await loadProject();
    } catch (error) {
      console.error(error);
      alert("Failed to create task");
    }
  }

  async function handleStatusChange(taskId: number, newStatus: string) {
    try {
      await updateTaskStatus(taskId, newStatus);
      await loadProject();
    } catch (error) {
      console.error(error);
      alert("Failed to update task status");
    }
  }
 
  async function handleDeleteTask(taskId: number) {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      await deleteTask(taskId);
      await loadProject();
    } catch (error) {
      console.error(error);
      alert("Failed to delete task");
    }
  }

  function getStatusStyle(status: string) {
    switch (status) {
      case "Done":
        return { background: "#d1fae5", color: "#065f46" };
      case "InProgress":
        return { background: "#dbeafe", color: "#1e40af" };
      default:
        return { background: "#f3f4f6", color: "#374151" };
    }
  }

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  if (!project) return <p style={{ padding: 24 }}>Project not found.</p>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <Link to="/">← Back to projects</Link>

      <h1>{project.name}</h1>
      <p>{project.description || "No description"}</p>

      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          margin: "24px 0",
        }}
      >
        <h2>Create Task</h2>
        <form onSubmit={handleCreateTask}>
          <div style={{ marginBottom: 12 }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              style={{ width: "100%", padding: 10 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              style={{ width: "100%", padding: 10, minHeight: 80 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{ width: "100%", padding: 10 }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button type="submit">Create Task</button>
        </form>
      </div>

      <div>
        <h2>Tasks</h2>
        {project.tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          project.tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                background: "#fff",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{task.title}</h3>
              <p>{task.description || "No description"}</p>
              <p>Priority: {task.priority}</p>
              <p>
                Status:{" "}
                <span
                  style={{
                    ...getStatusStyle(task.status),
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 14,
                    fontWeight: 600,
                    display: "inline-block",
                  }}
                >
                  {task.status}
                </span>
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => handleStatusChange(task.id, "Todo")}>
                    Todo
                </button>
                <button onClick={() => handleStatusChange(task.id, "InProgress")}>
                    In Progress
                </button>
                <button onClick={() => handleStatusChange(task.id, "Done")}>
                    Done
                </button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}