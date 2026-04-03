import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/client";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const result = await login({ email, password });

      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.username);
      localStorage.setItem("email", result.email);

      alert("Login successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "60px auto", padding: "0 16px" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ width: "100%", padding: 10 }}
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: 16 }}>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}