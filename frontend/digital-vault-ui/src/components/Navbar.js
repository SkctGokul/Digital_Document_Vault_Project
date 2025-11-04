import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ currentUser, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-shield-alt"></i>
          Digital Vault
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
          ) : (
            <>
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
                <span className="navbar-user">
                  <i className="fas fa-user-circle"></i> {currentUser.username}
                </span>
              </li>
              <li className="navbar-item">
                <button
                  onClick={onLogout}
                  className="navbar-link navbar-logout"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
