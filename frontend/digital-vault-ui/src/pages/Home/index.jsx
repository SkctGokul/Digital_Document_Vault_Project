import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import homeImg from "../../assets/digivault home image.jpg";

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <i className="fas fa-shield-alt"></i> Digital Document Vault
          </h1>
          <p className="hero-subtitle">
            Secure, Organize, and Access Your Documents Anywhere, Anytime
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started <i className="fas fa-arrow-right"></i>
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In <i className="fas fa-sign-in-alt"></i>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src={homeImg}
            alt="Document Management System"
            className="hero-img"
          />
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Choose DocSafe?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-lock"></i>
            </div>
            <h3>Secure Storage</h3>
            <p>
              Military-grade encryption ensures your documents are safe and
              protected from unauthorized access.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-folder-open"></i>
            </div>
            <h3>Easy Organization</h3>
            <p>
              Organize your documents by categories, making it simple to find
              what you need when you need it.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-cloud"></i>
            </div>
            <h3>Cloud Access</h3>
            <p>
              Access your documents from anywhere in the world with our secure
              cloud-based platform.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>Quick Search</h3>
            <p>
              Find your documents instantly with our powerful search
              functionality.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-share-alt"></i>
            </div>
            <h3>Easy Sharing</h3>
            <p>
              Share documents securely with colleagues, friends, or family
              members.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h3>Mobile Friendly</h3>
            <p>
              Access and manage your documents on any device - desktop, tablet,
              or mobile.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
