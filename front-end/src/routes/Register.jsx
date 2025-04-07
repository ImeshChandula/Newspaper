import React, {useContext, useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import '../components/css/Register.css';



const Register = () => {

const { logout } = useContext(AuthContext);
const navigate = useNavigate();
const [user, setUser] = useState({
    username: "",
    password: "",
});

const [message, setMessage] = useState("");
    

const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, user, {
      headers: { "Content-Type": "application/json" },
    });

    setMessage("Admin added successfully!");
    setUser({ username: "", password: "" });

    setTimeout(() => navigate("/"), 2000);
  } catch (error) {
    console.error("Error adding Admin:", error);
    setMessage("Failed to add Admin.");
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
          value={user.username}
          onChange={handleChange}
          className="register_input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          className="register_input"
          required
        />

        <div className="register_buttons">
          <button type="submit" className="register_submit_button">Submit</button>
          <button className="register_Back_button" onClick={()=> {logout();}}>Back</button>
        </div>
      </form>
    </div>
  )
}

export default Register