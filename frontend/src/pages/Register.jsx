import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await API.post("/users/", form);

      alert("Account created successfully!");

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Registration failed."
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

        <h2>Create your account</h2>

        <p>
          Join HostelHub and manage your hostel activities
          easily and securely.
        </p>

      </div>

      <div className="auth-right">

        <div className="auth-card">

          <h1>Create Account</h1>

          <p className="auth-subtitle">
            Register for HostelHub
          </p>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>

            <label>Full Name</label>

            <input
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>

            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Phone</label>

            <input
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
            />

            <label>Password</label>

            <input
              name="password"
              type="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <label>Role</label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="warden">Warden</option>
              <option value="admin">Admin</option>
            </select>

            <button
              className="primary-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

          </form>

          <p className="register-text">
            Already have an account?{" "}
            <Link to="/login">
              Sign In
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;