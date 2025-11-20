import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  toggleUserStatus,
  toggleAdminStatus,
  deleteUserAdmin,
} from "../../services/api";
import "./AdminUsers.css";

function AdminUsers({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate("/admin/login");
      return;
    }
    fetchUsers();
  }, [currentUser, navigate]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, filterStatus, users]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search) ||
          user.fullName?.toLowerCase().includes(search)
      );
    }

    if (filterStatus === "active") {
      filtered = filtered.filter((user) => user.isActive);
    } else if (filterStatus === "inactive") {
      filtered = filtered.filter((user) => !user.isActive);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Get current users for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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

  const handleToggleStatus = async (userId) => {
    if (window.confirm("Are you sure you want to change this user's status?")) {
      try {
        await toggleUserStatus(userId);
        fetchUsers();
      } catch (err) {
        alert("Failed to update user status: " + err.message);
      }
    }
  };

  const handleToggleAdmin = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to change this user's admin status?"
      )
    ) {
      try {
        await toggleAdminStatus(userId);
        fetchUsers();
      } catch (err) {
        alert("Failed to update admin status: " + err.message);
      }
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${username}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteUserAdmin(userId);
        fetchUsers();
      } catch (err) {
        alert("Failed to delete user: " + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-users-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="page-header">
        <h1>
          <i className="fas fa-users"></i> User Management
        </h1>
        <p>Manage all registered users and their permissions</p>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      <div className="controls-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search users by name, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  <i className="fas fa-inbox"></i>
                  <p>No users found</p>
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <div className="username-cell">
                      <i className="fas fa-user"></i> {user.username}
                    </div>
                  </td>
                  <td>{user.fullName || "-"}</td>
                  <td>{user.email}</td>
                  <td>
                    {new Date(user.registrationDate).toLocaleDateString()}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.isActive ? "active" : "inactive"
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <i className="fas fa-check-circle"></i> Active
                        </>
                      ) : (
                        <>
                          <i className="fas fa-times-circle"></i> Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`role-badge ${
                        user.isAdmin ? "admin" : "user"
                      }`}
                    >
                      {user.isAdmin ? (
                        <>
                          <i className="fas fa-shield-alt"></i> Admin
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user"></i> User
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-toggle-status"
                        onClick={() => handleToggleStatus(user.id)}
                        title={
                          user.isActive ? "Deactivate User" : "Activate User"
                        }
                      >
                        <i
                          className={`fas ${
                            user.isActive ? "fa-user-slash" : "fa-user-check"
                          }`}
                        ></i>
                      </button>

                      <button
                        className="btn-toggle-admin"
                        onClick={() => handleToggleAdmin(user.id)}
                        title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                      >
                        <i
                          className={`fas ${
                            user.isAdmin ? "fa-user-minus" : "fa-user-plus"
                          }`}
                        ></i>
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        title="Delete User"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
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
            Showing {indexOfFirstUser + 1} to{" "}
            {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
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

export default AdminUsers;
