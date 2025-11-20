import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../../services/api";
import "./AdminLogin.css";

function AdminLogin({ setCurrentUser }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    if (!formData.username?.trim() || !formData.password?.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);

    try {
      const data = await adminLogin(
        formData.username.trim(),
        formData.password.trim()
      );

      if (data.user) {
        // Check if the user is actually an admin
        if (data.user.isAdmin === true) {
          // Store admin user in localStorage
          localStorage.setItem("currentUser", JSON.stringify(data.user));
          setCurrentUser(data.user);
          navigate("/admin/dashboard");
        } else {
          setError(
            "Access denied. You are not authorized to access the admin portal."
          );
        }
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError(
        err.message || "Invalid admin credentials or unauthorized access"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <i className="fas fa-user-shield admin-icon"></i>
          <h2>Admin Portal</h2>
          <p>Secure Administrator Access</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Admin Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your admin username"
              disabled={loading}
              autoComplete="username"
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
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Authenticating...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Admin Login
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <p className="register-prompt">
            Need an admin account?{" "}
            <Link to="/register" className="register-link">
              Register Here
            </Link>
          </p>
          <Link to="/login" className="user-login-link">
            <i className="fas fa-arrow-left"></i> Back to User Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
