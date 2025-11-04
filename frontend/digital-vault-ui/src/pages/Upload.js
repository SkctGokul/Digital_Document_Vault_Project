import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadDocument } from "../services/api";
import "./Upload.css";

const Upload = ({ currentUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    file: null,
    category: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const categories = [
    "Personal",
    "Work",
    "Financial",
    "Legal",
    "Medical",
    "Education",
    "Other",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB");
        return;
      }
      setFormData({ ...formData, file });
      setFilePreview({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
      });
      setError("");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.file) {
      setError("Please select a file to upload");
      return;
    }

    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    if (!currentUser) {
      setError("Please login to upload documents");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("file", formData.file);
      data.append("userId", currentUser.id);
      data.append("category", formData.category);
      data.append("description", formData.description);

      const result = await uploadDocument(data);

      console.log("Upload successful:", result);
      setSuccess("Document uploaded successfully!");
      setFormData({
        file: null,
        category: "",
        description: "",
      });
      setFilePreview(null);

      setTimeout(() => {
        navigate("/documents");
      }, 2000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        `Failed to upload document: ${err.message || "Please try again."}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="upload-container">
        <div className="auth-required">
          <i className="fas fa-lock"></i>
          <h2>Authentication Required</h2>
          <p>Please login to upload documents</p>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="upload-header">
          <i className="fas fa-cloud-upload-alt"></i>
          <h2>Upload Document</h2>
          <p>Securely store your important documents</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {error && (
            <div className="message error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {success && (
            <div className="message success-message">
              <i className="fas fa-check-circle"></i> {success}
            </div>
          )}

          <div className="file-upload-area">
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              accept="*/*"
              style={{ display: "none" }}
            />
            <label htmlFor="file-input" className="file-upload-label">
              {filePreview ? (
                <div className="file-preview">
                  <i className="fas fa-file-alt"></i>
                  <div className="file-details">
                    <h4>{filePreview.name}</h4>
                    <p>
                      {filePreview.size} • {filePreview.type || "Unknown type"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={(e) => {
                      e.preventDefault();
                      setFormData({ ...formData, file: null });
                      setFilePreview(null);
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <div className="file-upload-placeholder">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <h3>Drop your file here or click to browse</h3>
                  <p>Maximum file size: 50MB</p>
                </div>
              )}
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="category">
              <i className="fas fa-folder"></i> Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <i className="fas fa-align-left"></i> Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a description for your document"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || !formData.file}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-cloud-upload-alt"></i> Upload Document
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
