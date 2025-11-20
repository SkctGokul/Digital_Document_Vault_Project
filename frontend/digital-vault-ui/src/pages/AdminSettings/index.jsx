import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminSettings.css";

function AdminSettings({ currentUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/admin/login");
    }
  }, [currentUser, navigate]);

  return (
    <div className="admin-settings-container">
      <div className="page-header">
        <h1>
          <i className="fas fa-cog"></i> System Settings
        </h1>
        <p>Configure system preferences and admin options</p>
      </div>

      <div className="settings-grid">
        <div className="settings-section">
          <h2>
            <i className="fas fa-shield-alt"></i> Security Settings
          </h2>
          <div className="setting-item">
            <label>Admin Registration Code</label>
            <input type="text" value="ADMIN2025" readOnly />
            <small>Code required for new admin registrations</small>
          </div>
          <div className="setting-item">
            <label>Session Timeout (minutes)</label>
            <input type="number" defaultValue="30" />
            <small>Auto-logout after period of inactivity</small>
          </div>
        </div>

        <div className="settings-section">
          <h2>
            <i className="fas fa-database"></i> Storage Settings
          </h2>
          <div className="setting-item">
            <label>Max File Size (MB)</label>
            <input type="number" defaultValue="50" />
            <small>Maximum upload file size per document</small>
          </div>
          <div className="setting-item">
            <label>Allowed File Types</label>
            <input
              type="text"
              defaultValue="pdf, doc, docx, jpg, png"
              readOnly
            />
            <small>Comma-separated list of allowed extensions</small>
          </div>
        </div>

        <div className="settings-section">
          <h2>
            <i className="fas fa-users"></i> User Management
          </h2>
          <div className="setting-item">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Allow user self-registration</span>
            </label>
            <small>Users can create accounts without admin approval</small>
          </div>
          <div className="setting-item">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Email verification required</span>
            </label>
            <small>Require email verification for new accounts</small>
          </div>
        </div>

        <div className="settings-section">
          <h2>
            <i className="fas fa-bell"></i> Notifications
          </h2>
          <div className="setting-item">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Email notifications</span>
            </label>
            <small>Send email alerts for important events</small>
          </div>
          <div className="setting-item">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Daily digest</span>
            </label>
            <small>Receive daily summary of system activity</small>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-save">
          <i className="fas fa-save"></i> Save Settings
        </button>
        <button className="btn-reset">
          <i className="fas fa-undo"></i> Reset to Defaults
        </button>
      </div>

      <div className="info-box">
        <i className="fas fa-info-circle"></i>
        <p>
          These settings are for display purposes in this demo. In a production
          environment, these would be connected to a backend configuration
          system.
        </p>
      </div>
    </div>
  );
}

export default AdminSettings;
