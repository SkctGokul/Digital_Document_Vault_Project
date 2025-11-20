import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    registerAsAdmin: false,
    adminCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Trim all inputs
    const trimmedData = {
      username: formData.username?.trim() || "",
      email: formData.email?.trim() || "",
      password: formData.password?.trim() || "",
      confirmPassword: formData.confirmPassword?.trim() || "",
      fullName: formData.fullName?.trim() || "",
      registerAsAdmin: formData.registerAsAdmin,
      adminCode: formData.adminCode?.trim() || "",
    };

    // Validation
    if (
      !trimmedData.username ||
      !trimmedData.email ||
      !trimmedData.password ||
      !trimmedData.fullName
    ) {
      setError("All fields are required");
      return;
    }

    if (trimmedData.password !== trimmedData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (trimmedData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Admin registration validation
    if (trimmedData.registerAsAdmin) {
      const ADMIN_SECRET_CODE = "ADMIN2025"; // Admin registration code
      if (!trimmedData.adminCode) {
        setError("Admin registration code is required");
        return;
      }
      if (trimmedData.adminCode !== ADMIN_SECRET_CODE) {
        setError("Invalid admin registration code");
        return;
      }
    }

    setLoading(true);

    try {
      const userData = {
        username: trimmedData.username,
        email: trimmedData.email,
        password: trimmedData.password,
        fullName: trimmedData.fullName,
        isAdmin: trimmedData.registerAsAdmin,
        isActive: true,
      };

      const response = await registerUser(userData);

      if (!response || response.error) {
        setError(response?.error || "Registration failed. Please try again.");
      } else {
        const accountType = trimmedData.registerAsAdmin ? "admin" : "user";
        const loginRoute = trimmedData.registerAsAdmin
          ? "/admin/login"
          : "/login";
        alert(
          `${
            accountType.charAt(0).toUpperCase() + accountType.slice(1)
          } account created successfully! Please login.`
        );
        navigate(loginRoute);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <i className="fas fa-user-plus"></i>
          <h2>Create Your Account</h2>
          <p>Join DocSafe and secure your documents</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="fullName">
              <i className="fas fa-user"></i> Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user-circle"></i> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-lock"></i> Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-group admin-toggle">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="registerAsAdmin"
                checked={formData.registerAsAdmin}
                onChange={handleChange}
              />
              <span className="checkbox-text">
                <i className="fas fa-user-shield"></i> Register as Administrator
              </span>
            </label>
          </div>

          {formData.registerAsAdmin && (
            <div className="form-group admin-code-group">
              <label htmlFor="adminCode">
                <i className="fas fa-key"></i> Admin Registration Code
              </label>
              <input
                type="password"
                id="adminCode"
                name="adminCode"
                value={formData.adminCode}
                onChange={handleChange}
                placeholder="Enter admin registration code"
                required={formData.registerAsAdmin}
              />
              <small className="admin-code-hint">
                <i className="fas fa-info-circle"></i> Contact system
                administrator for the registration code
              </small>
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Registering...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i> Create Account
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
