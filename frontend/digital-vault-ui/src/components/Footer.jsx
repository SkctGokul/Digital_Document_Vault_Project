import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>DocSafe</h3>
          <p>
            Secure document storage and management—your files, always protected.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/">Privacy Policy</Link>
          <span className="separator">|</span>
          <Link to="/">Terms of Service</Link>
          <span className="separator">|</span>
          <Link to="/">Contact Us</Link>
        </div>
        <div className="footer-social">
          <span aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </span>
          <span aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </span>
          <span aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </span>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © 2025 <strong>DocSafe</strong> Designed by{" "}
          <strong>Gokulkrishnan M</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
