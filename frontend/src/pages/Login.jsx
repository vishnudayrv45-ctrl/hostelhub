import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);

      const profile = await API.get("/users/me");

      localStorage.setItem("user", JSON.stringify(profile.data));

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <div className="brand-large">
          <div className="logo-icon large">H</div>
          <h1>HostelHub</h1>
        </div>

        <h2>Smart Hostel Management</h2>

        <p>
          Manage rooms, allocations, complaints and students
          from one powerful platform.
        </p>

        <div className="feature-list">
          <div>✓ Easy room management</div>
          <div>✓ Secure student allocation</div>
          <div>✓ Complaint tracking</div>
          <div>✓ Transfer management</div>
        </div>

      </div>

      <div className="auth-right">

        <div className="auth-card">

          <h1>Welcome Back 👋</h1>

          <p className="auth-subtitle">
            Sign in to your HostelHub account
          </p>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              className="primary-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="register-text">
            Don't have an account?{" "}
            <Link to="/register">
              Create Account
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;