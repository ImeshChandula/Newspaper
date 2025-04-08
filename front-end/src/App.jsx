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
import Footer from "./components/Footer.jsx"
import Navbar from "./components/Navbar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx"
import NewsDetail from "./components/NewsDetails.jsx";


const App = () => {


  return (
    <div className="bg-white">
      <ScrollToTop />
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/register" element={<Register />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/sport" element={<SportPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/politics" element={<PoliticsPage />} />

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
      </div>
      <Footer />
    </div>
  );
};

export default App;
