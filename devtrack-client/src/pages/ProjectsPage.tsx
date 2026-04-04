import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProject, deleteProject, getProjects } from "../api/client";
import type { Project } from "../types";

export default function ProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!username) {
      setProjects([]);
      setLoading(false);
      return;
    }

    loadProjects();
  }, [username]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!username) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      await createProject({
        name: name.trim(),
        description: description.trim(),
      });
      setName("");
      setDescription("");
      await loadProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    }
  }

  async function handleDeleteProject(id: number) {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    try {
      await deleteProject(id);
      await loadProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to delete project");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  }

  const totalProjects = projects.length;
  const totalTasks = useMemo(
    () => projects.reduce((sum, project) => sum + project.tasks.length, 0),
    [projects]
  );
  const todoCount = useMemo(
    () =>
      projects.reduce(
        (sum, project) =>
          sum + project.tasks.filter((task) => task.status === "Todo").length,
        0
      ),
    [projects]
  );
  const doneCount = useMemo(
    () =>
      projects.reduce(
        (sum, project) =>
          sum + project.tasks.filter((task) => task.status === "Done").length,
        0
      ),
    [projects]
  );

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <h1 className="brand-title">DevTrack</h1>
          <p className="brand-subtitle">Project Collaboration Platform</p>
        </div>

        <div>
          {username ? (
            <div className="topbar-actions">
              <span className="welcome-text">Hello, {username}</span>
              <button className="secondary-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="topbar-actions">
              <Link to="/login" className="text-link">
                Login
              </Link>
              <Link to="/register" className="text-link">
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {username && (
        <section className="dashboard-grid">
          <div className="summary-card">
            <p className="summary-label">Projects</p>
            <h2>{totalProjects}</h2>
          </div>

          <div className="summary-card">
            <p className="summary-label">Tasks</p>
            <h2>{totalTasks}</h2>
          </div>

          <div className="summary-card">
            <p className="summary-label">Todo</p>
            <h2>{todoCount}</h2>
          </div>

          <div className="summary-card">
            <p className="summary-label">Done</p>
            <h2>{doneCount}</h2>
          </div>
        </section>
      )}

      <section className="panel">
        <h2 className="section-title">Create Project</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="input"
            />
          </div>

          <div className="form-group">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description"
              className="textarea"
            />
          </div>

          <button type="submit" className="primary-btn">
            Create Project
          </button>
        </form>
      </section>

      <section className="projects-section">
        <div className="section-header">
          <h2 className="section-title">Your Projects</h2>
        </div>

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : !username ? (
          <div className="empty-state">
            Please login to view and manage your projects.
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">No projects yet.</div>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <article key={project.id} className="project-card">
                <div className="project-card-body">
                  <h3 className="project-title">{project.name}</h3>
                  <p className="project-description">
                    {project.description || "No description"}
                  </p>

                  <div className="meta-row">
                    <span className="meta-badge">
                      Tasks: {project.tasks?.length ?? 0}
                    </span>
                  </div>
                </div>

                <div className="project-card-actions">
                  <Link to={`/projects/${project.id}`} className="text-link">
                    Open project
                  </Link>
                  <button
                    className="secondary-btn"
                    onClick={() => handleDeleteProject(project.id)}
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