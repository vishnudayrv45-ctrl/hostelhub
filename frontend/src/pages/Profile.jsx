import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to load profile");
      }

      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.loader}>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <h2>Unable to load profile</h2>
          <p>{error}</p>
          <button
            style={styles.button}
            onClick={fetchProfile}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>My Profile</h1>
        <p>View your HostelHub account information</p>
      </div>

      <div style={styles.profileCard}>
        <div style={styles.avatar}>
          {profile?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <h2>{profile?.name}</h2>

        <span style={styles.role}>
          {profile?.role?.toUpperCase()}
        </span>

        <div style={styles.details}>
          <div style={styles.detail}>
            <span style={styles.label}>User ID</span>
            <strong>{profile?.id}</strong>
          </div>

          <div style={styles.detail}>
            <span style={styles.label}>Full Name</span>
            <strong>{profile?.name}</strong>
          </div>

          <div style={styles.detail}>
            <span style={styles.label}>Email</span>
            <strong>{profile?.email}</strong>
          </div>

          <div style={styles.detail}>
            <span style={styles.label}>Phone</span>
            <strong>
              {profile?.phone || "Not provided"}
            </strong>
          </div>

          <div style={styles.detail}>
            <span style={styles.label}>Role</span>
            <strong>
              {profile?.role}
            </strong>
          </div>

          <div style={styles.detail}>
            <span style={styles.label}>Account Status</span>

            <span
              style={
                profile?.is_active
                  ? styles.active
                  : styles.inactive
              }
            >
              {profile?.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    background: "#f5f7fb",
    color: "#172033",
  },

  header: {
    marginBottom: "30px",
  },

  headerTitle: {
    fontSize: "32px",
  },

  headerText: {
    color: "#64748b",
  },

  profileCard: {
    maxWidth: "750px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "35px",
    textAlign: "center",
    boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
  },

  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    margin: "0 auto 15px",
    background: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "38px",
    fontWeight: "700",
  },

  role: {
    display: "inline-block",
    marginTop: "8px",
    padding: "7px 15px",
    borderRadius: "20px",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: "700",
  },

  details: {
    marginTop: "35px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    textAlign: "left",
  },

  detail: {
    padding: "18px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    color: "#64748b",
    fontSize: "13px",
  },

  active: {
    color: "#15803d",
    fontWeight: "700",
  },

  inactive: {
    color: "#dc2626",
    fontWeight: "700",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fb",
  },

  loader: {
    fontSize: "18px",
    color: "#64748b",
  },

  errorCard: {
    maxWidth: "500px",
    margin: "100px auto",
    padding: "30px",
    background: "#ffffff",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  button: {
    marginTop: "15px",
    padding: "12px 22px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Profile;