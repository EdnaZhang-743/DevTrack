import { useEffect, useState } from "react";
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

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ marginBottom: 8 }}>DevTrack</h1>
          <p style={{ marginTop: 0 }}>Project Collaboration Platform</p>
        </div>

        <div>
          {username ? (
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span>Hello, {username}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project description"
            style={{ width: "100%", padding: 10, minHeight: 80 }}
          />
        </div>

        <button type="submit">Create Project</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <div>
          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                background: "#fff",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{project.name}</h3>
              <p>{project.description || "No description"}</p>
              <p>Tasks: {project.tasks?.length ?? 0}</p>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Link to={`/projects/${project.id}`}>Open project</Link>
                <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}