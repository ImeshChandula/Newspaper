import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../components/css/Unauthorized.css';


const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

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
    <div className="unauthorized py-5 mt-5">
      <h1 className="unauthorized_heading mt-5">Access Denied</h1>
      <p className="unauthorized_message">You do not have permission to access this page.</p>
      <button className='unauthorized_button' onClick={goToDashboard}>
        Go to Dashboard
      </button>
      <a href="/" className="unauthorized_text">Go to Home-page</a>
    </div>
  )
}

export default Unauthorized