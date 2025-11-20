import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/api";
import "./AdminRegister.css";

function AdminRegister() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    adminCode: "", // Secret code to verify admin registration
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.username?.trim() ||
      !formData.email?.trim() ||
      !formData.password?.trim() ||
      !formData.fullName?.trim() ||
      !formData.adminCode?.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Verify admin code (In production, this should be verified on backend)
    const ADMIN_SECRET_CODE = "ADMIN2025"; // This is just for demo
    if (formData.adminCode !== ADMIN_SECRET_CODE) {
      setError("Invalid admin registration code");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        fullName: formData.fullName.trim(),
        isAdmin: true, // This user will be an admin
        isActive: true,
      };

      await registerUser(userData);
      alert("Admin account created successfully! You can now login.");
      navigate("/admin/login");
    } catch (err) {
      console.error("Admin registration error:", err);
      setError(err.message || "Failed to create admin account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-box">
        <div className="admin-register-header">
          <i className="fas fa-user-shield admin-icon"></i>
          <h2>Admin Registration</h2>
          <p>Create a new administrator account</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-register-form">
          <div className="form-group">
            <label htmlFor="fullName">
              <i className="fas fa-id-card"></i> Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              disabled={loading}
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
              disabled={loading}
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
              placeholder="Create a password (min 6 characters)"
              disabled={loading}
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
              disabled={loading}
            />
          </div>

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
              disabled={loading}
            />
            <small className="admin-code-hint">
              <i className="fas fa-info-circle"></i> Contact system
              administrator for the registration code
            </small>
          </div>

          <button
            type="submit"
            className="admin-register-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i> Create Admin Account
              </>
            )}
          </button>
        </form>

        <div className="admin-register-footer">
          <Link to="/admin/login" className="back-to-login">
            <i className="fas fa-arrow-left"></i> Back to Admin Login
          </Link>
          <Link to="/register" className="user-register-link">
            <i className="fas fa-user"></i> Register as Regular User
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
