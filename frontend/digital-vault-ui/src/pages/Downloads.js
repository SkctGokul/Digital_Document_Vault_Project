import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Downloads.css";

const Downloads = ({ currentUser }) => {
  const navigate = useNavigate();
  const [downloads, setDownloads] = useState([]);
  const [filteredDownloads, setFilteredDownloads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load downloads from localStorage
    loadDownloads();
  }, []);

  useEffect(() => {
    filterDownloads();
  }, [downloads, searchTerm]);

  const loadDownloads = () => {
    const storedDownloads = localStorage.getItem("downloadHistory");
    if (storedDownloads) {
      const parsed = JSON.parse(storedDownloads);
      setDownloads(parsed);
    }
  };

  const filterDownloads = () => {
    if (!searchTerm) {
      setFilteredDownloads(downloads);
    } else {
      const filtered = downloads.filter((download) =>
        download.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDownloads(filtered);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear download history?")) {
      localStorage.removeItem("downloadHistory");
      setDownloads([]);
      setFilteredDownloads([]);
    }
  };

  const removeDownload = (downloadId) => {
    const updated = downloads.filter((d) => d.downloadId !== downloadId);
    localStorage.setItem("downloadHistory", JSON.stringify(updated));
    setDownloads(updated);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return "fa-file";
    if (fileType.includes("pdf")) return "fa-file-pdf";
    if (fileType.includes("image")) return "fa-file-image";
    if (fileType.includes("word") || fileType.includes("document"))
      return "fa-file-word";
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return "fa-file-excel";
    if (fileType.includes("powerpoint") || fileType.includes("presentation"))
      return "fa-file-powerpoint";
    if (fileType.includes("zip") || fileType.includes("compressed"))
      return "fa-file-archive";
    return "fa-file-alt";
  };

  if (!currentUser) {
    return (
      <div className="downloads-container">
        <div className="auth-required">
          <i className="fas fa-lock"></i>
          <h2>Authentication Required</h2>
          <p>Please login to view your downloads</p>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="downloads-container">
      <div className="downloads-header">
        <div className="header-content">
          <h1>
            <i className="fas fa-download"></i> Download History
          </h1>
          <p>View and manage your downloaded documents</p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => navigate("/documents")}
            className="btn-secondary"
          >
            <i className="fas fa-folder"></i> My Documents
          </button>
          {downloads.length > 0 && (
            <button onClick={clearHistory} className="btn-clear">
              <i className="fas fa-trash"></i> Clear History
            </button>
          )}
        </div>
      </div>

      <div className="downloads-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search downloads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredDownloads.length > 0 ? (
        <>
          <div className="downloads-count">
            Showing {filteredDownloads.length} of {downloads.length} downloads
          </div>
          <div className="downloads-list">
            {filteredDownloads.map((download) => (
              <div key={download.downloadId} className="download-card">
                <div className="download-icon-wrapper">
                  <div
                    className={`file-icon ${getFileIcon(download.fileType)}`}
                  >
                    <i className={`fas ${getFileIcon(download.fileType)}`}></i>
                  </div>
                </div>

                <div className="download-details">
                  <h3 className="download-filename">{download.fileName}</h3>
                  <div className="download-meta">
                    <span className="category-badge">{download.category}</span>
                    <span>
                      <i className="fas fa-database"></i>{" "}
                      {formatFileSize(download.fileSize)}
                    </span>
                    <span>
                      <i className="fas fa-download"></i>{" "}
                      {formatDate(download.downloadDate)}
                    </span>
                  </div>
                  {download.description && (
                    <p className="download-description">
                      {download.description}
                    </p>
                  )}
                </div>

                <div className="download-actions">
                  <button
                    onClick={() => removeDownload(download.downloadId)}
                    className="btn-remove"
                    title="Remove from history"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <i className="fas fa-download"></i>
          <h3>No downloads yet</h3>
          <p>
            {searchTerm
              ? "No downloads match your search"
              : "Downloaded documents will appear here"}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate("/documents")}
              className="btn-primary"
            >
              <i className="fas fa-folder-open"></i> Browse Documents
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Downloads;
