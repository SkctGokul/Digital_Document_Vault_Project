import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDocumentsAdmin, deleteDocument } from "../../services/api";
import "./AdminDocuments.css";

function AdminDocuments({ currentUser }) {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/admin/login");
      return;
    }
    fetchDocuments();
  }, [currentUser, navigate]);

  useEffect(() => {
    filterDocuments();
  }, [searchTerm, filterCategory, documents]);

  const fetchDocuments = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllDocumentsAdmin();
      setDocuments(data);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = [...documents];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.fileName?.toLowerCase().includes(search) ||
          doc.description?.toLowerCase().includes(search)
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((doc) => doc.category === filterCategory);
    }

    setFilteredDocuments(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Get current documents for pagination
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = filteredDocuments.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteDocument = async (docId, fileName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${fileName}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteDocument(docId);
        fetchDocuments();
      } catch (err) {
        alert("Failed to delete document: " + err.message);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const categories = ["all", ...new Set(documents.map((doc) => doc.category))];

  if (loading) {
    return (
      <div className="admin-documents-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-documents-container">
      <div className="page-header">
        <h1>
          <i className="fas fa-file-alt"></i> All Documents
        </h1>
        <p>View and manage all documents uploaded by users</p>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      <div className="stats-cards">
        <div className="stat-card">
          <i className="fas fa-file"></i>
          <div>
            <h3>{documents.length}</h3>
            <p>Total Documents</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-database"></i>
          <div>
            <h3>
              {formatFileSize(
                documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0)
              )}
            </h3>
            <p>Total Storage</p>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by filename or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="documents-table-wrapper">
        <table className="documents-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>File Name</th>
              <th>Category</th>
              <th>File Size</th>
              <th>Upload Date</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDocuments.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  <i className="fas fa-inbox"></i>
                  <p>No documents found</p>
                </td>
              </tr>
            ) : (
              currentDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.id}</td>
                  <td>
                    <div className="filename-cell">
                      <i className="fas fa-file-pdf"></i>
                      {doc.fileName}
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{doc.category}</span>
                  </td>
                  <td>{formatFileSize(doc.fileSize || 0)}</td>
                  <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                  <td>{doc.user?.username || "Unknown"}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                      title="Delete Document"
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="footer-info">
          <p>
            Showing {indexOfFirstDocument + 1} to{" "}
            {Math.min(indexOfLastDocument, filteredDocuments.length)} of{" "}
            {filteredDocuments.length} documents
          </p>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i> Previous
            </button>

            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`pagination-number ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                  onClick={() => handlePageClick(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDocuments;
