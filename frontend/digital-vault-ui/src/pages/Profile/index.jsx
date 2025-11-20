import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../services/api";
import "./Profile.css";

const Profile = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const freshUser = await getUserById(userId);
        setUser(freshUser || currentUser);
      } catch (e) {
        console.error("Profile load error:", e);
        setUser(currentUser || null);
        setError("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [userId]);

  const formatDateTime = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="auth-required">
          <i className="fas fa-lock"></i>
          <h2>Authentication Required</h2>
          <p>Please login to view your profile</p>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {loading ? (
        <div className="loading-card">
          <div className="spinner"></div>
          <p>Loading your profile…</p>
        </div>
      ) : error ? (
        <div className="error-card">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="info-grid single">
            <div className="info-card">
              <div className="info-row">
                <span>Full Name</span>
                <strong>{user?.fullName || "—"}</strong>
              </div>
              <div className="info-row">
                <span>Username</span>
                <strong>{user?.username || "—"}</strong>
              </div>
              <div className="info-row">
                <span>Email</span>
                <strong>{user?.email || "—"}</strong>
              </div>
              <div className="info-row">
                <span>User ID</span>
                <strong>{user?.id || "—"}</strong>
              </div>
              <div className="info-row">
                <span>Member Since</span>
                <strong>
                  {user?.registrationDate
                    ? formatDateTime(user.registrationDate)
                    : "—"}
                </strong>
              </div>
              <div className="logout-row">
                <button className="btn-logout-profile" onClick={onLogout}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
