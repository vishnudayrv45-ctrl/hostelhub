import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Allocation() {
  const [allocations, setAllocations] = useState([]);
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [roomId, setRoomId] = useState("");

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
      setError("");

      const [allocationRes, usersRes, roomsRes] = await Promise.all([
        fetch(`${API_URL}/allocations/`, {
          headers: getHeaders(),
        }),
        fetch(`${API_URL}/users/`, {
          headers: getHeaders(),
        }),
        fetch(`${API_URL}/rooms/`, {
          headers: getHeaders(),
        }),
      ]);

      if (!allocationRes.ok) {
        throw new Error("Unable to load allocations");
      }

      if (!usersRes.ok) {
        throw new Error("Unable to load users");
      }

      if (!roomsRes.ok) {
        throw new Error("Unable to load rooms");
      }

      const allocationData = await allocationRes.json();
      const usersData = await usersRes.json();
      const roomsData = await roomsRes.json();

      setAllocations(allocationData);

      setStudents(
        usersData.filter((user) => user.role === "student")
      );

      setRooms(roomsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createAllocation = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!studentId || !roomId) {
      setError("Please select a student and room.");
      return;
    }

    try {
      const response = await fetch(
  `${API_URL}/allocations/?student_id=${Number(studentId)}&room_id=${Number(roomId)}`,
  {
    method: "POST",
    headers: getHeaders(),
  }
);

      const data = await response.json();

      if (!response.ok) {
  let errorMessage = "Allocation failed";

  if (typeof data.detail === "string") {
    errorMessage = data.detail;
  } else if (Array.isArray(data.detail)) {
    errorMessage = data.detail
      .map((item) => {
        if (typeof item === "string") return item;

        return item.msg || item.message || JSON.stringify(item);
      })
      .join(", ");
  } else if (data.detail && typeof data.detail === "object") {
    errorMessage =
      data.detail.msg ||
      data.detail.message ||
      JSON.stringify(data.detail);
  }

  throw new Error(errorMessage);
}

      setMessage("Room allocated successfully!");

      setStudentId("");
      setStudentSearch("");
      setRoomId("");

      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStudentName = (id) => {
    const student = students.find((s) => s.id === id);

    return student
      ? student.name
      : `Student #${id}`;
  };

  const getRoomNumber = (id) => {
    const room = rooms.find((r) => r.id === id);

    return room
      ? room.room_number
      : `Room #${id}`;
  };

  // Search students by name or email
  const filteredStudents = students.filter((student) => {
    const search = studentSearch.toLowerCase().trim();

    if (!search) {
      return false;
    }

    return (
      student.name.toLowerCase().includes(search) ||
      student.email.toLowerCase().includes(search)
    );
  });

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Room Allocation
          </h1>

          <p style={styles.subtitle}>
            Allocate hostel rooms to registered students
          </p>
        </div>
      </div>

      <div style={styles.grid}>

        {/* NEW ALLOCATION */}
        <div style={styles.card}>

          <h2>New Allocation</h2>

          <form onSubmit={createAllocation}>

            {/* STUDENT SEARCH */}
            <label style={styles.label}>
              Student
            </label>

            <div style={styles.searchContainer}>

              <input
                type="text"
                placeholder="Enter student name..."
                value={studentSearch}
                onChange={(e) => {
                  setStudentSearch(e.target.value);
                  setStudentId("");
                }}
                style={styles.input}
                autoComplete="off"
              />

              {/* SEARCH RESULTS */}
              {studentSearch && !studentId && (
                <div style={styles.searchResults}>

                  {filteredStudents.length === 0 ? (
                    <div style={styles.noResults}>
                      No student found
                    </div>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        style={styles.studentResult}
                        onClick={() => {
                          setStudentId(String(student.id));
                          setStudentSearch(student.name);
                        }}
                      >
                        <strong>
                          {student.name}
                        </strong>

                        <span style={styles.studentEmail}>
                          {student.email}
                        </span>
                      </div>
                    ))
                  )}

                </div>
              )}

            </div>

            {/* SELECTED STUDENT */}
            {studentId && (
              <div style={styles.selectedStudent}>
                ✓ Student selected:{" "}
                <strong>{studentSearch}</strong>
              </div>
            )}

            {/* ROOM */}
            <label style={styles.label}>
              Room
            </label>

            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              style={styles.input}
            >
              <option value="">
                Select room
              </option>

              {rooms
                .filter(
                  (room) =>
                    room.status === "available" &&
                    room.occupied < room.capacity
                )
                .map((room) => (
                  <option
                    key={room.id}
                    value={room.id}
                  >
                    Room {room.room_number} —{" "}
                    {room.occupied}/{room.capacity}
                  </option>
                ))}
            </select>

            {/* BUTTON */}
            <button
              type="submit"
              style={styles.button}
            >
              Allocate Room
            </button>

          </form>

          {/* SUCCESS */}
          {message && (
            <div style={styles.success}>
              {message}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

        </div>

        {/* CURRENT ALLOCATIONS */}
        <div style={styles.card}>

          <h2>Current Allocations</h2>

          {loading ? (
            <p>Loading...</p>
          ) : allocations.length === 0 ? (
            <p style={styles.muted}>
              No allocations found.
            </p>
          ) : (
            <div style={styles.list}>

              {allocations.map((allocation) => (
                <div
                  key={allocation.id}
                  style={styles.item}
                >

                  <div>

                    <strong>
                      {getStudentName(
                        allocation.student_id
                      )}
                    </strong>

                    <p style={styles.small}>
                      Room:{" "}
                      {getRoomNumber(
                        allocation.room_id
                      )}
                    </p>

                  </div>

                  <span style={styles.badge}>
                    {allocation.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

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
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.06)",
  },

  label: {
    display: "block",
    marginTop: "18px",
    marginBottom: "8px",
    fontWeight: "600",
  },

  searchContainer: {
    position: "relative",
  },

  input: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #dbe2ea",
    fontSize: "15px",
    boxSizing: "border-box",
    background: "#fff",
    outline: "none",
  },

  searchResults: {
    position: "absolute",
    top: "52px",
    left: 0,
    right: 0,
    background: "#ffffff",
    border: "1px solid #dbe2ea",
    borderRadius: "10px",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.12)",
    zIndex: 100,
    maxHeight: "220px",
    overflowY: "auto",
  },

  studentResult: {
    padding: "12px 14px",
    cursor: "pointer",
    borderBottom: "1px solid #eef2f7",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  studentEmail: {
    fontSize: "12px",
    color: "#64748b",
  },

  noResults: {
    padding: "14px",
    color: "#64748b",
  },

  selectedStudent: {
    marginTop: "8px",
    padding: "9px 12px",
    borderRadius: "8px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "13px",
  },

  button: {
    width: "100%",
    marginTop: "24px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },

  success: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "8px",
    background: "#dcfce7",
    color: "#166534",
  },

  error: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#991b1b",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
  },

  badge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  small: {
    margin: "5px 0 0",
    color: "#64748b",
  },

  muted: {
    color: "#64748b",
  },
};

export default Allocation;