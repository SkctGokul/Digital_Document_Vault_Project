import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllDocumentsByUserId } from "../../services/api";
import "./Dashboard.css";

const Dashboard = ({ currentUser }) => {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    categories: {},
    recentUploads: [],
  });

  useEffect(() => {
    if (currentUser) {
      fetchDocuments();
    }
  }, [currentUser]);

  const fetchDocuments = async () => {
    try {
      const docs = await getAllDocumentsByUserId(currentUser.id);
      setDocuments(docs);
      calculateStats(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const calculateStats = (docs) => {
    const categories = {};
    docs.forEach((doc) => {
      categories[doc.category] = (categories[doc.category] || 0) + 1;
    });

    const recentUploads = docs
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
      .slice(0, 5);

    setStats({
      totalDocuments: docs.length,
      categories,
      recentUploads,
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!currentUser) {
    return (
      <div className="dashboard-container">Please login to view dashboard</div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>
            Welcome back,{" "}
            <span className="user-name">
              {currentUser.fullName || currentUser.username}
            </span>
            !
          </h1>
          <p>Here's what's happening with your documents today.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">
            <i className="fas fa-file"></i>
          </div>
          <div className="stat-content">
            <h3>Total Documents</h3>
            <p className="stat-number">{stats.totalDocuments}</p>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">
            <i className="fas fa-folder-open"></i>
          </div>
          <div className="stat-content">
            <h3>Categories</h3>
            <p className="stat-number">
              {Object.keys(stats.categories).length}
            </p>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">
            <i className="fas fa-upload"></i>
          </div>
          <div className="stat-content">
            <h3>Recent Uploads</h3>
            <p className="stat-number">{stats.recentUploads.length}</p>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">
            <i className="fas fa-hdd"></i>
          </div>
          <div className="stat-content">
            <h3>Storage Used</h3>
            <p className="stat-number">
              {formatFileSize(
                documents.reduce((sum, doc) => sum + doc.fileSize, 0)
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="quick-actions">
          <h2>
            <i className="fas fa-bolt"></i> Quick Actions
          </h2>
          <div className="action-buttons">
            <Link to="/upload" className="action-btn action-upload">
              <i className="fas fa-upload"></i>
              <span>Upload Document</span>
            </Link>
            <Link to="/documents" className="action-btn action-view">
              <i className="fas fa-folder"></i>
              <span>View All Documents</span>
            </Link>
            <Link
              to="/documents?search=true"
              className="action-btn action-search"
            >
              <i className="fas fa-search"></i>
              <span>Search Documents</span>
            </Link>
            <Link to="/documents" className="action-btn action-edit">
              <i className="fas fa-edit"></i>
              <span>Edit Documents</span>
            </Link>
          </div>
        </div>

        <div className="recent-documents">
          <h2>
            <i className="fas fa-clock"></i> Recent Documents
          </h2>
          {stats.recentUploads.length > 0 ? (
            <div className="document-list">
              {stats.recentUploads.map((doc) => (
                <div key={doc.id} className="document-item">
                  <div className="document-icon">
                    <i className="fas fa-file"></i>
                  </div>
                  <div className="document-info">
                    <h4>{doc.fileName}</h4>
                    <p className="document-meta">
                      <span className="category-badge">{doc.category}</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                      <span>{formatDate(doc.uploadDate)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <p>No documents uploaded yet</p>
              <Link to="/upload" className="btn-primary">
                Upload Your First Document
              </Link>
            </div>
          )}
        </div>

        <div className="categories-section">
          <h2>
            <i className="fas fa-chart-pie"></i> Documents by Category
          </h2>
          {Object.keys(stats.categories).length > 0 ? (
            <div className="categories-list">
              {Object.entries(stats.categories).map(([category, count]) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <span className="category-count">{count} documents</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No categories yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
