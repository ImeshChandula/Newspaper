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
    password: "",
  });

  const [message, setMessage] = useState("");


  const handleChange = (e) => {
    setEditor({ ...editor, [e.target.name]: e.target.value });
  };

  const goToNavigate = () => {
    if(!user){
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
        // Handle unexpected role or fallback
        navigate("/unauthorized"); // Redirect to home or another appropriate page
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
      setEditor({ username: "", password: "" });

      setTimeout(() => goToNavigate(), 2000);
    } catch (error) {
      console.error("Error adding User:", error);

      if (error.response && error.response.status === 400) {
        // 400 is returned by backend for already registered users
        setMessage("User already registered!");
      } else if (error.response?.data?.message) {
        // If backend sends a custom error message
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to add User.");
      }
    }
  };



  return (
    <div className="register_content">
      <h2 className="register_header">Create New Editor Account</h2>

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
          type="password"
          name="password"
          placeholder="Password"
          value={editor.password}
          onChange={handleChange}
          className="register_input"
          required
        />

        <div className="register_buttons">
          <button type="submit" className="register_submit_button">Submit</button>
          <button className="register_Back_button" onClick={() => { navigate("/"); }}>Back</button>
        </div>

        {!user ? (
          <div>
            <p>If you have an Account? </p>
            <Link to="/login">Click Me.!</Link>
          </div>
        ) : (
          <div></div>
        )}
        

      </form>
    </div>
  )
}

export default CreateNewUser