import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createTask,
  deleteTask,
  getProject,
  updateTaskStatus,
} from "../api/client";
import type { Project } from "../types";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectId = Number(id);

  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");

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
    if (!username) {
      navigate("/login");
      return;
    }

    if (!projectId) return;
    loadProject();
  }, [projectId, username, navigate]);

  if (!username) {
    return null;
  }

  if (loading) {
    return <div className="page-shell"><div className="empty-state">Loading...</div></div>;
  }

  if (!project) {
    return <div className="page-shell"><div className="empty-state">Project not found.</div></div>;
  }

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

  const todoCount = project.tasks.filter((task) => task.status === "Todo").length;
  const inProgressCount = project.tasks.filter(
    (task) => task.status === "InProgress"
  ).length;
  const doneCount = project.tasks.filter((task) => task.status === "Done").length;

  return (
    <div className="page-shell">
      <div className="section-header" style={{ marginBottom: 16 }}>
        <Link to="/" className="text-link">
          ← Back to projects
        </Link>
      </div>

      <section className="panel" style={{ marginBottom: 24 }}>
        <h1 className="brand-title" style={{ fontSize: 40, marginBottom: 12 }}>
          {project.name}
        </h1>
        <p className="brand-subtitle" style={{ marginBottom: 16 }}>
          {project.description || "No description"}
        </p>

        <div className="meta-row">
          <span className="meta-badge">Tasks: {project.tasks.length}</span>
          <span className="meta-badge">Todo: {todoCount}</span>
          <span className="meta-badge">In Progress: {inProgressCount}</span>
          <span className="meta-badge">Done: {doneCount}</span>
        </div>
      </section>

      <section className="panel" style={{ marginBottom: 24 }}>
        <h2 className="section-title">Create Task</h2>

        <form onSubmit={handleCreateTask}>
          <div className="form-group">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="input"
            />
          </div>

          <div className="form-group">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              className="textarea"
            />
          </div>

          <div className="form-group">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input"
            >
              <option value="Low">Low priority</option>
              <option value="Medium">Medium priority</option>
              <option value="High">High priority</option>
            </select>
          </div>

          <button type="submit" className="primary-btn">
            Create Task
          </button>
        </form>
      </section>

      <section className="projects-section">
        <div className="section-header">
          <h2 className="section-title">Tasks</h2>
        </div>

        {project.tasks.length === 0 ? (
          <div className="empty-state">No tasks yet.</div>
        ) : (
          <div className="project-grid">
            {project.tasks.map((task) => (
              <article key={task.id} className="project-card">
                <div className="project-card-body">
                  <h3 className="project-title" style={{ fontSize: 24 }}>
                    {task.title}
                  </h3>
                  <p className="project-description">
                    {task.description || "No description"}
                  </p>

                  <div className="meta-row" style={{ marginBottom: 12 }}>
                    <span className="meta-badge">Priority: {task.priority}</span>
                    <span
                      style={{
                        ...getStatusStyle(task.status),
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontSize: 14,
                        fontWeight: 600,
                        display: "inline-block",
                      }}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>

                <div
                  className="project-card-actions"
                  style={{ flexWrap: "wrap", gap: 10 }}
                >
                  <button
                    className="secondary-btn"
                    onClick={() => handleStatusChange(task.id, "Todo")}
                  >
                    Todo
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => handleStatusChange(task.id, "InProgress")}
                  >
                    In Progress
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => handleStatusChange(task.id, "Done")}
                  >
                    Done
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}