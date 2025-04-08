import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const ProfilForSD = ({ closeNavbar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const goToDashboard = () => {
    if (!user) return;
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
    }
    closeNavbar();
  };

  const handleLogout = () => {
    logout();
    closeNavbar();
  };

  return (
    <div className="card p-3 mt-3 bg-light shadow-sm">
      <div className="d-flex align-items-center mb-3">
        <FaUserCircle size={50} className="text-secondary me-3" />
        <div>
          <h5 className="mb-0">{user ? user.username : "Guest"}</h5>
          <small className="text-muted">{user ? user.role : "Visitor"}</small>
        </div>
      </div>

      <ul className="list-unstyled mb-0">
        {!user ? (
          <li>
            <Link to="/login" className="btn btn-outline-primary w-100" onClick={closeNavbar}>
              Login
            </Link>
          </li>
        ) : (
          <>
            <li className="mb-2">
              <button className="btn btn-outline-secondary w-100" onClick={goToDashboard}>
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
