import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Digital Vault</h3>
          <p>Secure document storage and management system</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>
            <i className="fas fa-envelope"></i> support@digitalvault.com
          </p>
          <p>
            <i className="fas fa-phone"></i> +1 234 567 890
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Digital Document Vault. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
