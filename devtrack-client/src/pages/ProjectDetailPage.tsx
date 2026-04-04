import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createTask,
  deleteTask,
  getProject,
  updateProject,
  updateTask,
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

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProject, setEditingProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState("Medium");
  const username = localStorage.getItem("username");

  async function loadProject() {
    try {
      const data = await getProject(projectId);
      setProject(data);
      setProjectName(data.name);
      setProjectDescription(data.description ?? "");
    } catch (error) {
      console.error(error);
      alert("Failed to load project");
      setProject(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!username) {
      navigate("/login");
      return;
    }

    if (!projectId || Number.isNaN(projectId)) {
      setLoading(false);
      return;
    }

    loadProject();
  }, [projectId, username, navigate]);

  const tasks = project?.tasks ?? [];

  const todoCount = tasks.filter((task) => task.status === "Todo").length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "InProgress"
  ).length;
  const doneCount = tasks.filter((task) => task.status === "Done").length;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "All" ? true : task.status === statusFilter;

      const keyword = searchTerm.trim().toLowerCase();
      const matchesSearch =
        keyword === ""
          ? true
          : task.title.toLowerCase().includes(keyword) ||
            (task.description ?? "").toLowerCase().includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [tasks, statusFilter, searchTerm]);

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

async function handleUpdateProject(e: React.FormEvent) {
  e.preventDefault();

  if (!project) return;

  if (!projectName.trim()) {
    alert("Project name is required");
    return;
  }

  try {
    await updateProject(project.id, {
      name: projectName.trim(),
      description: projectDescription.trim(),
    });
    setEditingProject(false);
    await loadProject();
  } catch (error) {
    console.error(error);
    alert("Failed to update project");
  }
}

  function startEditTask(task: {
    id: number;
    title: string;
    description?: string | null;
    priority: string;
  }) {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description ?? "");
    setEditTaskPriority(task.priority);
  }

  async function handleUpdateTask(e: React.FormEvent, taskId: number) {
    e.preventDefault();

    if (!editTaskTitle.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      await updateTask(taskId, {
        title: editTaskTitle.trim(),
        description: editTaskDescription.trim(),
        priority: editTaskPriority,
      });

      setEditingTaskId(null);
      setEditTaskTitle("");
      setEditTaskDescription("");
      setEditTaskPriority("Medium");
      await loadProject();
    } catch (error) {
      console.error(error);
      alert("Failed to update task");
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

  if (!username) {
    return null;
  }

  if (loading) {
    return (
      <div className="page-shell">
        <div className="empty-state">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-shell">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <Link to="/" className="text-link">
            ← Back to projects
          </Link>
        </div>
        <div className="empty-state">Project not found.</div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="section-header" style={{ marginBottom: 16 }}>
        <Link to="/" className="text-link">
          ← Back to projects
        </Link>
      </div>

      <section className="panel" style={{ marginBottom: 24 }}>
        {editingProject ? (
          <form onSubmit={handleUpdateProject}>
            <div className="form-group">
              <input
                className="input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project name"
              />
            </div>

            <div className="form-group">
              <textarea
                className="textarea"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Project description"
              />
            </div>

            <div className="project-card-actions" style={{ justifyContent: "flex-start" }}>
              <button type="submit" className="primary-btn">
                Save Project
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setEditingProject(false);
                  setProjectName(project.name);
                  setProjectDescription(project.description ?? "");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <div>
                <h1 className="brand-title" style={{ fontSize: 40, marginBottom: 12 }}>
                  {project.name}
                </h1>
                <p className="brand-subtitle" style={{ marginBottom: 16 }}>
                  {project.description || "No description"}
                </p>
              </div>

              <button
                className="secondary-btn"
                onClick={() => setEditingProject(true)}
              >
                Edit Project
              </button>
            </div>

            <div className="meta-row">
              <span className="meta-badge">Tasks: {tasks.length}</span>
              <span className="meta-badge">Todo: {todoCount}</span>
              <span className="meta-badge">In Progress: {inProgressCount}</span>
              <span className="meta-badge">Done: {doneCount}</span>
            </div>
          </>
        )}
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 220px",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <input
            className="input"
            placeholder="Search task title or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Todo">Todo</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-state">No matching tasks.</div>
        ) : (
          <div className="project-grid">
            {filteredTasks.map((task) => (
              <article key={task.id} className="project-card">
  {editingTaskId === task.id ? (
    <form onSubmit={(e) => handleUpdateTask(e, task.id)}>
      <div className="form-group">
        <input
          className="input"
          value={editTaskTitle}
          onChange={(e) => setEditTaskTitle(e.target.value)}
          placeholder="Task title"
        />
      </div>

      <div className="form-group">
        <textarea
          className="textarea"
          value={editTaskDescription}
          onChange={(e) => setEditTaskDescription(e.target.value)}
          placeholder="Task description"
        />
      </div>

      <div className="form-group">
        <select
          className="input"
          value={editTaskPriority}
          onChange={(e) => setEditTaskPriority(e.target.value)}
        >
          <option value="Low">Low priority</option>
          <option value="Medium">Medium priority</option>
          <option value="High">High priority</option>
        </select>
      </div>

      <div className="project-card-actions" style={{ flexWrap: "wrap", gap: 10 }}>
        <button type="submit" className="primary-btn">
          Save Task
        </button>
        <button
          type="button"
          className="secondary-btn"
          onClick={() => {
            setEditingTaskId(null);
            setEditTaskTitle("");
            setEditTaskDescription("");
            setEditTaskPriority("Medium");
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  ) : (
    <>
      <div className="task-card-topbar">
        <div className="task-card-topbar-actions">
          <button
            className="mini-btn mini-btn-edit"
            onClick={() => startEditTask(task)}
          >
            Edit
          </button>
          <button
            className="mini-btn mini-btn-delete"
            onClick={() => handleDeleteTask(task.id)}
          >
            Delete
          </button>
        </div>
      </div>

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
      </div>
    </>
  )}
</article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}