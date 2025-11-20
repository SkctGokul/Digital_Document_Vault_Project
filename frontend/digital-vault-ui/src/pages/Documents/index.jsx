import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllDocumentsByUserId,
  getDocumentsByCategory,
  searchDocumentsByFileName,
  deleteDocument,
  downloadDocument,
  updateDocument,
} from "../../services/api";
import "./Documents.css";

const Documents = ({ currentUser }) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingDocument, setViewingDocument] = useState(null);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage] = useState(3);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ fileName: "", category: "" });

  const categories = [
    "All",
    "Personal",
    "Work",
    "Financial",
    "Legal",
    "Medical",
    "Education",
    "Other",
  ];

  useEffect(() => {
    if (currentUser) {
      fetchDocuments();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, selectedCategory]);

  // Cleanup blob URL when component unmounts or document changes
  useEffect(() => {
    return () => {
      if (documentUrl) {
        window.URL.revokeObjectURL(documentUrl);
      }
    };
  }, [documentUrl]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getAllDocumentsByUserId(currentUser.id);
      setDocuments(docs);
      setFilteredDocuments(docs);
    } catch (err) {
      setError("Failed to fetch documents");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((doc) => doc?.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc?.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
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

  const handleViewDocument = async (doc) => {
    try {
      // Clean up previous URL if exists
      if (documentUrl) {
        window.URL.revokeObjectURL(documentUrl);
      }

      const blob = await downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);

      setDocumentUrl(url);
      setViewingDocument(doc);
    } catch (err) {
      alert("Failed to load document for viewing");
      console.error("View error:", err);
    }
  };

  const handleCloseViewer = () => {
    if (documentUrl) {
      window.URL.revokeObjectURL(documentUrl);
    }
    setDocumentUrl(null);
    setViewingDocument(null);
  };

  const handleDelete = async (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(documentId);
        setDocuments(documents.filter((doc) => doc.id !== documentId));
        alert("Document deleted successfully");
      } catch (err) {
        alert("Failed to delete document");
        console.error("Delete error:", err);
      }
    }
  };

  const handleDownload = async (doc) => {
    try {
      const blob = await downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Save download to history
      saveDownloadHistory(doc);
    } catch (err) {
      alert("Failed to download document");
      console.error("Download error:", err);
    }
  };

  const startEdit = (doc) => {
    setEditingId(doc.id);
    setEditForm({ fileName: doc.fileName || "", category: doc.category || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ fileName: "", category: "" });
  };

  const saveEdit = async (documentId) => {
    // Basic validation
    if (!editForm.fileName.trim()) {
      alert("File name cannot be empty");
      return;
    }
    if (!editForm.category.trim()) {
      alert("Category cannot be empty");
      return;
    }

    try {
      const updated = await updateDocument(documentId, {
        fileName: editForm.fileName,
        category: editForm.category,
        description: undefined,
      });

      // Update the documents in state
      const updatedDocs = documents.map((d) =>
        d.id === documentId
          ? { ...d, fileName: updated.fileName, category: updated.category }
          : d
      );
      setDocuments(updatedDocs);
      setFilteredDocuments(updatedDocs);
      setEditingId(null);
      setEditForm({ fileName: "", category: "" });
      alert("Document updated successfully");
    } catch (err) {
      console.error("Failed to update document", err);
      alert("Failed to update document");
    }
  };

  const saveDownloadHistory = (doc) => {
    try {
      if (!doc || !doc.fileName) {
        console.warn("Invalid document object for download history");
        return;
      }

      const downloadEntry = {
        downloadId: Date.now() + Math.random(),
        documentId: doc.id || null,
        fileName: doc.fileName || "Unknown",
        fileType: doc.fileType || "application/octet-stream",
        fileSize: doc.fileSize || 0,
        category: doc.category || "Other",
        description: doc.description || "",
        downloadDate: new Date().toISOString(),
        userId: currentUser?.id || null,
      };

      const existingDownloads = localStorage.getItem("downloadHistory");
      let downloads = [];

      if (existingDownloads) {
        try {
          const parsed = JSON.parse(existingDownloads);
          downloads = Array.isArray(parsed) ? parsed : [];
        } catch (parseError) {
          console.error("Error parsing download history:", parseError);
          downloads = [];
        }
      }

      downloads.unshift(downloadEntry);
      const limitedDownloads = downloads.slice(0, 100);
      localStorage.setItem("downloadHistory", JSON.stringify(limitedDownloads));
    } catch (error) {
      console.error("Error saving download history:", error);
    }
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes("pdf")) return "fa-file-pdf";
    if (fileType?.includes("image")) return "fa-file-image";
    if (fileType?.includes("word") || fileType?.includes("document"))
      return "fa-file-word";
    if (fileType?.includes("excel") || fileType?.includes("spreadsheet"))
      return "fa-file-excel";
    if (fileType?.includes("powerpoint") || fileType?.includes("presentation"))
      return "fa-file-powerpoint";
    if (fileType?.includes("zip") || fileType?.includes("compressed"))
      return "fa-file-archive";
    return "fa-file-alt";
  };

  const canPreview = (fileType) => {
    return (
      fileType?.includes("pdf") ||
      fileType?.includes("image") ||
      fileType?.includes("text")
    );
  };

  if (!currentUser) {
    return (
      <div className="documents-container">
        <div className="auth-required">
          <i className="fas fa-lock"></i>
          <h2>Authentication Required</h2>
          <p>Please login to view your documents</p>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="documents-container">
      <div className="documents-header">
        <div className="header-content">
          <h1>
            <i className="fas fa-folder-open"></i> My Documents
          </h1>
          <p>Manage and organize your uploaded documents</p>
        </div>
        <button onClick={() => navigate("/upload")} className="btn-upload">
          <i className="fas fa-plus"></i> Upload New
        </button>
      </div>

      <div className="documents-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading documents...</p>
        </div>
      ) : filteredDocuments.length > 0 ? (
        <>
          <div className="documents-count">
            Showing {indexOfFirstDocument + 1} to{" "}
            {Math.min(indexOfLastDocument, filteredDocuments.length)} of{" "}
            {filteredDocuments.length} documents
          </div>
          <div className="documents-grid">
            {currentDocuments.map((doc) => (
              <div key={doc.id} className="document-card">
                <div
                  className="document-card-header"
                  onClick={() => handleViewDocument(doc)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={`file-icon ${getFileIcon(doc.fileType)}`}>
                    <i className={`fas ${getFileIcon(doc.fileType)}`}></i>
                  </div>
                  <span className="category-badge">{doc.category}</span>
                </div>

                <div
                  className="document-card-body"
                  onClick={() => (editingId ? null : handleViewDocument(doc))}
                  style={{ cursor: editingId ? "default" : "pointer" }}
                >
                  {editingId === doc.id ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label>File Name</label>
                        <input
                          type="text"
                          value={editForm.fileName}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              fileName: e.target.value,
                            })
                          }
                          className="edit-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <input
                          type="text"
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value,
                            })
                          }
                          className="edit-input"
                        />
                      </div>
                      <div className="edit-actions">
                        <button
                          onClick={() => saveEdit(doc.id)}
                          className="btn-save"
                        >
                          <i className="fas fa-check"></i> Save
                        </button>
                        <button onClick={cancelEdit} className="btn-cancel">
                          <i className="fas fa-times"></i> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="document-title">{doc.fileName}</h3>
                      {doc.description && (
                        <p className="document-description">
                          {doc.description}
                        </p>
                      )}

                      <div className="document-meta">
                        <span>
                          <i className="fas fa-database"></i>{" "}
                          {formatFileSize(doc.fileSize)}
                        </span>
                        <span>
                          <i className="fas fa-clock"></i>{" "}
                          {formatDate(doc.uploadDate)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="document-card-actions">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="btn-action btn-download"
                    title="Download"
                  >
                    <i className="fas fa-download"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="btn-action btn-delete"
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                  {editingId !== doc.id && (
                    <button
                      onClick={() => startEdit(doc)}
                      className="btn-action btn-edit"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
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
        </>
      ) : (
        <div className="empty-state">
          <i className="fas fa-folder-open"></i>
          <h3>No documents found</h3>
          <p>
            {searchTerm || selectedCategory !== "All"
              ? "Try adjusting your filters"
              : "Upload your first document to get started"}
          </p>
          {!searchTerm && selectedCategory === "All" && (
            <button onClick={() => navigate("/upload")} className="btn-primary">
              <i className="fas fa-cloud-upload-alt"></i> Upload Document
            </button>
          )}
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="document-viewer-modal" onClick={handleCloseViewer}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <i
                  className={`fas ${getFileIcon(viewingDocument.fileType)}`}
                ></i>
                <h3>{viewingDocument.fileName}</h3>
              </div>
              <button className="close-btn" onClick={handleCloseViewer}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {canPreview(viewingDocument.fileType) ? (
                viewingDocument.fileType?.includes("image") ? (
                  <img
                    src={documentUrl}
                    alt={viewingDocument.fileName}
                    className="preview-image"
                  />
                ) : viewingDocument.fileType?.includes("pdf") ? (
                  <iframe
                    src={documentUrl}
                    className="preview-iframe"
                    title={viewingDocument.fileName}
                  />
                ) : (
                  <iframe
                    src={documentUrl}
                    className="preview-iframe"
                    title={viewingDocument.fileName}
                  />
                )
              ) : (
                <div className="no-preview">
                  <i className="fas fa-file-alt"></i>
                  <p>Preview not available for this file type</p>
                  <button
                    onClick={() => handleDownload(viewingDocument)}
                    className="btn-primary"
                  >
                    <i className="fas fa-download"></i> Download to View
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <div className="document-info">
                <span>
                  <strong>Category:</strong> {viewingDocument.category}
                </span>
                <span>
                  <strong>Size:</strong>{" "}
                  {formatFileSize(viewingDocument.fileSize)}
                </span>
                <span>
                  <strong>Uploaded:</strong>{" "}
                  {formatDate(viewingDocument.uploadDate)}
                </span>
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => handleDownload(viewingDocument)}
                  className="btn-secondary"
                >
                  <i className="fas fa-download"></i> Download
                </button>
                <button onClick={handleCloseViewer} className="btn-outline">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
