import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [requestedRoomId, setRequestedRoomId] = useState("");
  const [reason, setReason] = useState("");

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

  const loadData = async () => {
    try {
      setLoading(true);

      const [transferResponse, roomsResponse] = await Promise.all([
        fetch(`${API_URL}/transfers/`, {
          headers: getHeaders(),
        }),

        fetch(`${API_URL}/rooms/`, {
          headers: getHeaders(),
        }),
      ]);

      if (!transferResponse.ok) {
        throw new Error("Unable to load transfer requests");
      }

      if (!roomsResponse.ok) {
        throw new Error("Unable to load rooms");
      }

      const transferData = await transferResponse.json();
      const roomData = await roomsResponse.json();

      setTransfers(transferData);
      setRooms(roomData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitTransfer = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!studentId || !requestedRoomId || !reason) {
      setError("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(
  `${API_URL}/transfers/?student_id=${Number(studentId)}&requested_room_id=${Number(requestedRoomId)}&reason=${encodeURIComponent(reason)}`,
  {
    method: "POST",
    headers: getHeaders(),
  }
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Transfer request failed"
        );
      }

      setMessage("Transfer request submitted successfully!");

      setStudentId("");
      setRequestedRoomId("");
      setReason("");

      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getRoomNumber = (id) => {
    const room = rooms.find((r) => r.id === id);

    return room ? room.room_number : `Room #${id}`;
  };

  const statusStyle = (status) => {
    if (status === "approved") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "rejected") {
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      background: "#fef3c7",
      color: "#92400e",
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Room Transfer</h1>

        <p style={styles.subtitle}>
          Request a transfer to another hostel room
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2>New Transfer Request</h2>

          <form onSubmit={submitTransfer}>
            <label style={styles.label}>Student ID *</label>

            <input
              type="number"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter student ID"
              style={styles.input}
            />

            <label style={styles.label}>
              Requested Room *
            </label>

            <select
              value={requestedRoomId}
              onChange={(e) =>
                setRequestedRoomId(e.target.value)
              }
              style={styles.input}
            >
              <option value="">Select requested room</option>

              {rooms
                .filter((room) => room.status === "available")
                .map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.room_number} —{" "}
                    {room.occupied}/{room.capacity}
                  </option>
                ))}
            </select>

            <label style={styles.label}>Reason *</label>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why do you want to transfer?"
              rows="5"
              style={styles.textarea}
            />

            <button type="submit" style={styles.button}>
              Submit Transfer Request
            </button>
          </form>

          {message && (
            <div style={styles.success}>{message}</div>
          )}

          {error && (
            <div style={styles.error}>{error}</div>
          )}
        </div>

        <div style={styles.card}>
          <h2>Transfer Requests</h2>

          {loading ? (
            <p>Loading...</p>
          ) : transfers.length === 0 ? (
            <p style={styles.muted}>
              No transfer requests found.
            </p>
          ) : (
            <div style={styles.list}>
              {transfers.map((transfer) => (
                <div
                  key={transfer.id}
                  style={styles.transfer}
                >
                  <div style={styles.transferTop}>
                    <strong>
                      Transfer #{transfer.id}
                    </strong>

                    <span
                      style={{
                        ...styles.badge,
                        ...statusStyle(transfer.status),
                      }}
                    >
                      {transfer.status}
                    </span>
                  </div>

                  <div style={styles.info}>
                    <p>
                      <strong>Student:</strong>{" "}
                      {transfer.student_id}
                    </p>

                    <p>
                      <strong>Current Room:</strong>{" "}
                      {transfer.current_room_id
                        ? getRoomNumber(
                            transfer.current_room_id
                          )
                        : "Not assigned"}
                    </p>

                    <p>
                      <strong>Requested Room:</strong>{" "}
                      {transfer.requested_room_id
                        ? getRoomNumber(
                            transfer.requested_room_id
                          )
                        : "Not specified"}
                    </p>

                    <p>
                      <strong>Reason:</strong>{" "}
                      {transfer.reason}
                    </p>
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
    background: "#fff",
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

  transfer: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "18px",
  },

  transferTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badge: {
    padding: "6px 11px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  info: {
    marginTop: "10px",
    color: "#475569",
    lineHeight: "1.4",
  },

  muted: {
    color: "#64748b",
  },
};

export default Transfers;