import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  getAdminStats,
  getAllDocumentsAdmin,
} from "../../services/api";
import "./AdminReports.css";

function AdminReports({ currentUser }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0,
    totalDocuments: 0,
    totalStorage: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [currentUser, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userStats, documents] = await Promise.all([
        getAdminStats(),
        getAllDocumentsAdmin(),
      ]);

      const totalStorage = documents.reduce(
        (sum, doc) => sum + (doc.fileSize || 0),
        0
      );

      setStats({
        ...userStats,
        totalDocuments: documents.length,
        totalStorage,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="admin-reports-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reports-container">
      <div className="page-header">
        <h1>
          <i className="fas fa-chart-bar"></i> System Reports
        </h1>
        <p>Comprehensive overview of system statistics and analytics</p>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <div className="report-icon users">
            <i className="fas fa-users"></i>
          </div>
          <div className="report-content">
            <h2>{stats.totalUsers}</h2>
            <p>Total Users</p>
            <div className="report-details">
              <span className="detail-item">
                <i className="fas fa-check-circle"></i> {stats.activeUsers}{" "}
                Active
              </span>
              <span className="detail-item">
                <i className="fas fa-times-circle"></i> {stats.inactiveUsers}{" "}
                Inactive
              </span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="report-icon admins">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="report-content">
            <h2>{stats.adminUsers}</h2>
            <p>Administrator Accounts</p>
            <div className="report-details">
              <span className="detail-item">
                {((stats.adminUsers / stats.totalUsers) * 100).toFixed(1)}% of
                all users
              </span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="report-icon documents">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="report-content">
            <h2>{stats.totalDocuments}</h2>
            <p>Total Documents</p>
            <div className="report-details">
              <span className="detail-item">
                {stats.totalUsers > 0
                  ? (stats.totalDocuments / stats.totalUsers).toFixed(1)
                  : 0}{" "}
                docs/user avg
              </span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="report-icon storage">
            <i className="fas fa-database"></i>
          </div>
          <div className="report-content">
            <h2>{formatFileSize(stats.totalStorage)}</h2>
            <p>Total Storage Used</p>
            <div className="report-details">
              <span className="detail-item">
                {stats.totalDocuments > 0
                  ? formatFileSize(stats.totalStorage / stats.totalDocuments)
                  : "0 Bytes"}{" "}
                avg/doc
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>
            <i className="fas fa-chart-pie"></i> User Activity
          </h3>
          <div className="chart-content">
            <div className="progress-bar-group">
              <div className="progress-item">
                <div className="progress-label">
                  <span>Active Users</span>
                  <span className="progress-value">{stats.activeUsers}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill active"
                    style={{
                      width: `${(stats.activeUsers / stats.totalUsers) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="progress-item">
                <div className="progress-label">
                  <span>Inactive Users</span>
                  <span className="progress-value">{stats.inactiveUsers}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill inactive"
                    style={{
                      width: `${
                        (stats.inactiveUsers / stats.totalUsers) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="progress-item">
                <div className="progress-label">
                  <span>Admin Users</span>
                  <span className="progress-value">{stats.adminUsers}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill admin"
                    style={{
                      width: `${(stats.adminUsers / stats.totalUsers) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>
            <i className="fas fa-info-circle"></i> System Summary
          </h3>
          <div className="summary-list">
            <div className="summary-item">
              <i className="fas fa-users"></i>
              <span>Total registered users in the system</span>
              <strong>{stats.totalUsers}</strong>
            </div>
            <div className="summary-item">
              <i className="fas fa-file"></i>
              <span>Documents uploaded by all users</span>
              <strong>{stats.totalDocuments}</strong>
            </div>
            <div className="summary-item">
              <i className="fas fa-hdd"></i>
              <span>Total storage space utilized</span>
              <strong>{formatFileSize(stats.totalStorage)}</strong>
            </div>
            <div className="summary-item">
              <i className="fas fa-percentage"></i>
              <span>Active user rate</span>
              <strong>
                {stats.totalUsers > 0
                  ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)
                  : 0}
                %
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
