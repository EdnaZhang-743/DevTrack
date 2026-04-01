import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createProject, getProjects } from "../api/client";
import type { Project } from "../types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

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
    loadProjects();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <h1>DevTrack</h1>
      <p>Project Collaboration Platform</p>

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
              <Link to={`/projects/${project.id}`}>Open project</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}