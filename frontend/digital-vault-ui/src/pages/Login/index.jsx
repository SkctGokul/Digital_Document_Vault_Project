import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";
import "./Login.css";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (!formData.username || !formData.password) {
      setError("Please enter username and password");
      return;
    }

    // Trim whitespace from inputs
    const username = formData.username?.trim();
    const password = formData.password?.trim();

    if (!username || !password) {
      setError("Please enter valid username and password");
      return;
    }

    setLoading(true);

    try {
      // Authenticate with backend
      const response = await loginUser(username, password);

      // Check if login was successful
      if (response && response.user) {
        // Check if user is an admin trying to login through regular login
        if (response.user.isAdmin === true) {
          setError("Admin users must login through the Admin Portal");
          return;
        }

        // Store user info in localStorage
        localStorage.setItem("currentUser", JSON.stringify(response.user));
        onLogin(response.user);
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      // Display the error message from the server
      setError(err.message || "Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <i className="fas fa-sign-in-alt"></i>
          <h2>Welcome Back</h2>
          <p>Sign in to access your secure documents</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

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
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Signing In...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <a href="/register">Create Account</a>
          </p>
          <div className="admin-login-link">
            <a href="/admin/login" className="admin-link">
              <i className="fas fa-user-shield"></i> Administrator Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
