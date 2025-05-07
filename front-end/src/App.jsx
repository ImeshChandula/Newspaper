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
import NewsDetail from "./components/NewsDetails.jsx";
import SportPage from "./pages/Sport.jsx"
import EducationPage from "./pages/Education.jsx"
import PoliticsPage from "./pages/Politics.jsx"
import EditNewsContent from "./routes/EditNewsContent.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import UpdateAdManager from "./components/UpdateAdManager.jsx";
import ScrollToTopButton from "./components/ScrollToTopButton.jsx";
import ForeignNews from "./pages/ForeignNews.jsx";

const App = () => {


  return (
    <div className="bg-white">
      <Navbar />
      <ScrollToTop/>
      <div className="container mt-4 bg-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/register" element={<Register />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/sports" element={<SportPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/politics" element={<PoliticsPage />} />
          <Route path="/foreign" element={<ForeignNews />} />
          <Route path="/update-ad/:id" element={<UpdateAdManager />} />
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
          <Route 
            path="/editNews"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
                <EditNewsContent />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ScrollToTopButton/>
      </div>
      <Footer />
    </div>
  );
};

export default App;
