import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ currentUser }) => {
  const getLogoLink = () => {
    if (!currentUser) return "/";
    if (currentUser.isAdmin) return "/admin/dashboard";
    return "/dashboard";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={getLogoLink()} className="navbar-logo">
          <i className="fas fa-shield-alt"></i>
          DocSafe
        </Link>

        <ul className="navbar-menu">
          {!currentUser ? (
            <>
              <li className="navbar-item">
                <Link to="/" className="navbar-link">
                  Home
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to="/register"
                  className="navbar-link navbar-link-register"
                >
                  Register
                </Link>
              </li>
            </>
          ) : currentUser.isAdmin ? (
            <>
              {/* Admin Menu */}
              <li className="navbar-item">
                <Link to="/admin/dashboard" className="navbar-link">
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/admin/users" className="navbar-link">
                  <i className="fas fa-users"></i> User Management
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/admin/documents" className="navbar-link">
                  <i className="fas fa-file-alt"></i> All Documents
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to="/profile"
                  className="navbar-user"
                  title="View profile"
                >
                  <i className="fas fa-user-circle"></i> {currentUser.username}
                </Link>
              </li>
            </>
          ) : (
            <>
              {/* Regular User Menu */}
              <li className="navbar-item">
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/upload" className="navbar-link">
                  Upload
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/documents" className="navbar-link">
                  My Documents
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/downloads" className="navbar-link">
                  Downloads
                </Link>
              </li>
              <li className="navbar-item">
                <Link
                  to="/profile"
                  className="navbar-user"
                  title="View profile"
                >
                  <i className="fas fa-user-circle"></i> {currentUser.username}
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
