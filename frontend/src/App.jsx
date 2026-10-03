import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Hostels from "./pages/Hostels";
import Rooms from "./pages/Rooms";
import Allocation from "./pages/Allocation";
import Complaints from "./pages/Complaints";
import Transfers from "./pages/Transfers";
import Profile from "./pages/Profile";
import Users from "./pages/Users";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hostels"
          element={
            <ProtectedRoute>
              <Hostels />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/allocation"
          element={
            <ProtectedRoute>
              <Allocation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <Complaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transfers"
          element={
            <ProtectedRoute>
              <Transfers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;