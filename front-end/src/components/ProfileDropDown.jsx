import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import "./css/ProfileDropdown.css";

const ProfileDropdown = () => {
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
            default:
                // Handle unexpected role or fallback
                navigate("/unauthorized"); // Redirect to home or another appropriate page
                break;
        }
    };

    return (
        <div className="dropdown profile-dropdown">
            <button
                className="btn btn-outline-warning dropdown-toggle d-flex align-items-center profile-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="profileDropdown"
            >
                <FaUserCircle className="me-2" size={22} />
                {user ? user.username : "Guest"}
            </button>

            <ul className="dropdown-menu dropdown-menu-end profile-menu" aria-labelledby="profileDropdown">
                <li className="dropdown-item-text fw-bold text-warning">
                    {user ? user.username : "Guest"}
                </li>
                <li className="dropdown-item-text text-warning small">
                    {user ? user.role : "Visitor"}
                </li>
                <li><hr className="dropdown-divider" /></li>

                {user && (
                    <li>
                        <button className="dropdown-item btn-dashboard" onClick={goToDashboard}>
                            Dash Board
                        </button>
                    </li>
                )}

                {!user ? (
                    <li>
                        {/*
                        <Link className="dropdown-item btn-dashboard" to="/login">
                            Login
                        </Link>
                        */}
                    </li>
                ) : (
                    <li>
                        <button className="dropdown-item text-danger" onClick={() => { logout(); navigate("/"); }}>
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default ProfileDropdown;
