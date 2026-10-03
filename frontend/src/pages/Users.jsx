import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users/`, {
        headers: {
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load users"
        );
      }

      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.role?.toLowerCase().includes(value)
    );
  });

  const getRoleStyle = (role) => {
    if (role === "admin") {
      return {
        background: "#ede9fe",
        color: "#6d28d9",
      };
    }

    if (role === "warden") {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    return {
      background: "#dbeafe",
      color: "#1d4ed8",
    };
  };

  if (loading) {
    return (
      <div style={styles.center}>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Users</h1>
          <p style={styles.subtitle}>
            Manage HostelHub users and their roles
          </p>
        </div>

        <div style={styles.total}>
          <strong>{users.length}</strong>
          <span>Total Users</span>
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
          <button
            onClick={fetchUsers}
            style={styles.retry}
          >
            Retry
          </button>
        </div>
      )}

      <div style={styles.searchCard}>
        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      <div style={styles.card}>
        {filteredUsers.length === 0 ? (
          <div style={styles.empty}>
            <h3>No users found</h3>
            <p>
              There are no users matching your search.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={styles.td}>
                      #{user.id}
                    </td>

                    <td style={styles.td}>
                      <div style={styles.userName}>
                        <div style={styles.avatar}>
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <strong>{user.name}</strong>
                      </div>
                    </td>

                    <td style={styles.td}>
                      {user.email}
                    </td>

                    <td style={styles.td}>
                      {user.phone || "—"}
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.role,
                          ...getRoleStyle(user.role),
                        }}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span
                        style={
                          user.is_active
                            ? styles.active
                            : styles.inactive
                        }
                      >
                        ●{" "}
                        {user.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    background: "#f5f7fb",
    color: "#172033",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
  },

  subtitle: {
    marginTop: "8px",
    color: "#64748b",
  },

  total: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#ffffff",
    padding: "15px 25px",
    borderRadius: "14px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
  },

  searchCard: {
    background: "#ffffff",
    padding: "18px",
    borderRadius: "15px",
    marginBottom: "20px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  search: {
    width: "100%",
    padding: "14px",
    border: "1px solid #dbe2ea",
    borderRadius: "10px",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
  },

  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "10px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: "16px",
    textAlign: "left",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
  },

  td: {
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
    fontSize: "14px",
  },

  userName: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },

  role: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  active: {
    color: "#15803d",
    fontWeight: "700",
  },

  inactive: {
    color: "#dc2626",
    fontWeight: "700",
  },

  error: {
    padding: "15px",
    marginBottom: "20px",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "10px",
  },

  retry: {
    marginLeft: "15px",
    padding: "7px 14px",
    border: "none",
    borderRadius: "7px",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    padding: "60px",
    color: "#64748b",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
  },
};

export default Users;