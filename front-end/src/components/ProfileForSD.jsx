import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const ProfilForSD = ({ closeNavbar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return null; // Don't render if user is not logged in

  const goToDashboard = () => {
    switch (user.role) {
      case "editor":
        navigate("/dashboard/editor");
        break;
      case "admin":
        navigate("/dashboard/admin");
        break;
      case "super_admin":
        navigate("/dashboard/super-admin");
        break;
      default:
        navigate("/unauthorized");
        break;
    }
    closeNavbar();
  };

  const handleLogout = () => {
    logout();
    closeNavbar();
    navigate("/"); // Optionally navigate to home after logout
  };

  return (
    <div className="card p-3 mt-3 bg-dark shadow-sm border border-warning">
      <div className="d-flex align-items-center mb-3">
        <FaUserCircle size={50} className="text-warning me-3" />
        <div>
          <h5 className="mb-0 text-warning fw-bold">{user.username}</h5>
          <small className="text-warning">{user.role}</small>
        </div>
      </div>

      <ul className="list-unstyled mb-0">
        {!user ? (
          <li>
            {/*
            <Link to="/login" className="btn btn-outline-warning w-100" onClick={closeNavbar}>
              Login
            </Link>
           */}
          </li>
        ) : (
          <>
            <li className="mb-2">
              <button className="btn btn-outline-warning w-100" onClick={goToDashboard}>
                Dashboard
              </button>
            </li>
            <li>
              <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default ProfilForSD;
