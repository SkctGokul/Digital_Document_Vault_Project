import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStats, getAllDocumentsAdmin } from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard({ currentUser }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0,
    totalDocuments: 0,
    totalStorage: 0,
  });
  const [documents, setDocuments] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if current user is admin
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [currentUser, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, docsData] = await Promise.all([
        getAdminStats(),
        getAllDocumentsAdmin(),
      ]);
      setStats({
        ...statsData,
        totalDocuments: docsData.length,
        totalStorage: docsData.reduce(
          (sum, doc) => sum + (doc.fileSize || 0),
          0
        ),
      });
      setDocuments(docsData);

      // Calculate category distribution
      const categories = {};
      docsData.forEach((doc) => {
        categories[doc.category] = (categories[doc.category] || 0) + 1;
      });
      setCategoryData(categories);

      // Get recent activity (last 5 uploads)
      const recent = docsData
        .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
        .slice(0, 5);
      setRecentActivity(recent);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>
          <i className="fas fa-chart-line"></i> Admin Dashboard
        </h1>
        <p>System Overview & Analytics</p>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>

        <div className="stat-card documents">
          <div className="stat-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalDocuments}</h3>
            <p>Total Documents</p>
          </div>
        </div>

        <div className="stat-card storage">
          <div className="stat-icon">
            <i className="fas fa-hdd"></i>
          </div>
          <div className="stat-content">
            <h3>{formatFileSize(stats.totalStorage)}</h3>
            <p>Storage Used</p>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="analytics-grid">
        {/* Category Distribution */}
        <div className="analytics-card">
          <div className="card-header">
            <h2>
              <i className="fas fa-folder-open"></i> Document Categories
            </h2>
          </div>
          <div className="category-chart">
            {Object.keys(categoryData).length > 0 ? (
              Object.entries(categoryData).map(([category, count]) => {
                const percentage = (
                  (count / stats.totalDocuments) *
                  100
                ).toFixed(1);
                return (
                  <div key={category} className="category-bar-item">
                    <div className="category-info">
                      <span className="category-name">{category}</span>
                      <span className="category-stats">
                        {count} docs ({percentage}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-data">
                <i className="fas fa-chart-bar"></i>
                <p>No category data available</p>
              </div>
            )}
          </div>
        </div>

        {/* User Statistics */}
        <div className="analytics-card">
          <div className="card-header">
            <h2>
              <i className="fas fa-users-cog"></i> User Statistics
            </h2>
          </div>
          <div className="user-stats-chart">
            <div className="stat-visual-item">
              <div className="stat-bar-container">
                <div className="stat-label">Total Users</div>
                <div className="stat-bar total-bar">
                  <div
                    className="stat-bar-fill"
                    style={{ width: "100%" }}
                  ></div>
                </div>
                <div className="stat-value">{stats.totalUsers}</div>
              </div>
            </div>
            <div className="stat-visual-item">
              <div className="stat-bar-container">
                <div className="stat-label">Active Users</div>
                <div className="stat-bar active-bar">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${
                        stats.totalUsers > 0
                          ? (stats.activeUsers / stats.totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="stat-value">{stats.activeUsers}</div>
              </div>
            </div>
            <div className="stat-visual-item">
              <div className="stat-bar-container">
                <div className="stat-label">Inactive Users</div>
                <div className="stat-bar inactive-bar">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${
                        stats.totalUsers > 0
                          ? (stats.inactiveUsers / stats.totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="stat-value">{stats.inactiveUsers}</div>
              </div>
            </div>
            <div className="stat-visual-item">
              <div className="stat-bar-container">
                <div className="stat-label">Admin Users</div>
                <div className="stat-bar admin-bar">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${
                        stats.totalUsers > 0
                          ? (stats.adminUsers / stats.totalUsers) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="stat-value">{stats.adminUsers}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="analytics-card full-width">
          <div className="card-header">
            <h2>
              <i className="fas fa-clock"></i> Recent Document Activity
            </h2>
          </div>
          <div className="recent-activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((doc) => (
                <div key={doc.id} className="activity-item">
                  <div className="activity-icon">
                    <i className="fas fa-file-upload"></i>
                  </div>
                  <div className="activity-details">
                    <div className="activity-title">{doc.fileName}</div>
                    <div className="activity-meta">
                      <span className="activity-category">
                        <i className="fas fa-tag"></i> {doc.category}
                      </span>
                      <span className="activity-size">
                        <i className="fas fa-database"></i>{" "}
                        {formatFileSize(doc.fileSize)}
                      </span>
                      <span className="activity-date">
                        <i className="fas fa-calendar"></i>{" "}
                        {formatDate(doc.uploadDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">
                <i className="fas fa-inbox"></i>
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
