import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Complaints() {
  const [complaints, setComplaints] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const loadComplaints = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/complaints/`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Unable to load complaints");
      }

      const data = await response.json();
      setComplaints(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const submitComplaint = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!studentId || !title || !description) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/complaints/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          student_id: Number(studentId),
          room_id: roomId ? Number(roomId) : null,
          title: title,
          description: description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to submit complaint");
      }

      setMessage("Complaint submitted successfully!");

      setStudentId("");
      setRoomId("");
      setTitle("");
      setDescription("");

      loadComplaints();
    } catch (err) {
      setError(err.message);
    }
  };

  const statusStyle = (status) => {
    if (status === "resolved") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "in_progress") {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (status === "rejected") {
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      background: "#dbeafe",
      color: "#1d4ed8",
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Maintenance Complaints</h1>
        <p style={styles.subtitle}>
          Report and track hostel maintenance issues
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2>Submit Complaint</h2>

          <form onSubmit={submitComplaint}>
            <label style={styles.label}>Student ID *</label>

            <input
              type="number"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter student ID"
              style={styles.input}
            />

            <label style={styles.label}>Room ID</label>

            <input
              type="number"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              style={styles.input}
            />

            <label style={styles.label}>Complaint Title *</label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Broken fan"
              style={styles.input}
            />

            <label style={styles.label}>Description *</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem..."
              rows="5"
              style={styles.textarea}
            />

            <button type="submit" style={styles.button}>
              Submit Complaint
            </button>
          </form>

          {message && <div style={styles.success}>{message}</div>}
          {error && <div style={styles.error}>{error}</div>}
        </div>

        <div style={styles.card}>
          <h2>Complaint History</h2>

          {loading ? (
            <p>Loading...</p>
          ) : complaints.length === 0 ? (
            <p style={styles.muted}>No complaints found.</p>
          ) : (
            <div style={styles.list}>
              {complaints.map((complaint) => (
                <div key={complaint.id} style={styles.complaint}>
                  <div style={styles.complaintTop}>
                    <h3 style={styles.complaintTitle}>
                      {complaint.title}
                    </h3>

                    <span
                      style={{
                        ...styles.badge,
                        ...statusStyle(complaint.status),
                      }}
                    >
                      {complaint.status.replace("_", " ")}
                    </span>
                  </div>

                  <p style={styles.description}>
                    {complaint.description}
                  </p>

                  <div style={styles.meta}>
                    Student ID: {complaint.student_id}
                    {complaint.room_id
                      ? ` • Room ID: ${complaint.room_id}`
                      : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "32px",
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#172033",
  },

  header: {
    marginBottom: "28px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
  },

  subtitle: {
    color: "#64748b",
    marginTop: "8px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: "24px",
  },

  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
  },

  label: {
    display: "block",
    marginTop: "16px",
    marginBottom: "8px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "13px",
    border: "1px solid #dbe2ea",
    borderRadius: "10px",
    boxSizing: "border-box",
    fontSize: "15px",
  },

  textarea: {
    width: "100%",
    padding: "13px",
    border: "1px solid #dbe2ea",
    borderRadius: "10px",
    boxSizing: "border-box",
    fontSize: "15px",
    resize: "vertical",
  },

  button: {
    width: "100%",
    marginTop: "22px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  success: {
    marginTop: "16px",
    padding: "12px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "8px",
  },

  error: {
    marginTop: "16px",
    padding: "12px",
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  complaint: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "18px",
  },

  complaintTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
  },

  complaintTitle: {
    margin: 0,
  },

  badge: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },

  description: {
    color: "#475569",
    lineHeight: "1.5",
  },

  meta: {
    fontSize: "13px",
    color: "#64748b",
  },

  muted: {
    color: "#64748b",
  },
};

export default Complaints;