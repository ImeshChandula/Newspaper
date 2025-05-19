import React, { useState, useContext } from 'react'
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../components/css/Register.css';
import { AuthContext } from "../context/AuthContext";

const CreateNewUser = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editor, setEditor] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setEditor({ ...editor, [e.target.name]: e.target.value });
  };

  const goToNavigate = () => {
    if (!user) {
      navigate("/");
      return;
    }
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL_USERS}/register`, editor, {
        headers: { "Content-Type": "application/json" },
      });

      setMessage("User added successfully!");
      setEditor({ username: "", email: "", password: "" });

      setTimeout(() => goToNavigate(), 2000);
    } catch (error) {
      console.error("Error adding User:", error);
      if (error.response && error.response.status === 400) {
        setMessage("User already registered!");
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to add User.");
      }
    }
  };

  return (
    <div className="py-4">
      <div className="register_content border border-black bg-white">
        <h2 className="register_header text-black">Create New Editor Account</h2>

        {message && <p className="message_box">{message}</p>}

        <form onSubmit={handleSubmit} className="register_form">
          <input
            type="text"
            name="username"
            placeholder="User Name"
            value={editor.username}
            onChange={handleChange}
            className="register_input"
            required
          />

          <input
            type="text"
            name="email"
            placeholder="Gmail"
            value={editor.email}
            onChange={handleChange}
            className="register_input"
            required
          />

          <div className="password_wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={editor.password}
              onChange={handleChange}
              className="register_input password_input"
              required
            />
            <span
              className="toggle_password_icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="register_buttons">
            <button type="submit" className="register_submit_button">Submit</button>
            {!user && (
              <button type="button" className="register_Back_button" onClick={() => { navigate("/"); }}>Back</button>
            )}
          </div>

          {!user && (
            <div>
              <p className='text-muted'>If you have an Account?</p>
              <Link to="/login">Click Me.!</Link>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default CreateNewUser;
