/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ManageStudent from "./pages/ManageStudent.jsx";
import ManageUser from "./pages/ManageUser.jsx";
import TaskTraker from "./pages/TaskTraker.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

function App() {
  useEffect(() => {
    localStorage.removeItem("authToken");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/manageStudent" element={<ProtectedRoute><ManageStudent /></ProtectedRoute>} />
        <Route path="/manageUsers" element={<ProtectedRoute><ManageUser /></ProtectedRoute>} />
        <Route path="/taskTraker" element={<ProtectedRoute><TaskTraker /></ProtectedRoute>} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
