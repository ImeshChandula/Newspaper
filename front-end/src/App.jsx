import React from "react";
import { Route, Routes } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";


import Home from "./routes/Home.jsx";
import Login from "./routes/Login.jsx";
import Register from './routes/Register.jsx';
import DashboardEditor from "./routes/DashboardEditor.jsx";
import DashboardAdmin from "./routes/DashboardAdmin.jsx";
import DashboardSuperAdmin from "./routes/DashboardSuperAdmin.jsx";
import Unauthorized from "./routes/Unauthorized.jsx";
import ProtectedRoute from "./context/ProtectedRoute.js";


const App = () => {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="register" element={<Register />} />

        <Route 
            path="/dashboard/editor" 
            element={
              <ProtectedRoute allowedRoles={["editor"]}>
                <DashboardEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/admin" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/super-admin" 
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <DashboardSuperAdmin />
              </ProtectedRoute>
            } 
          />
    </Routes>
    </>
  );
};

export default App;
