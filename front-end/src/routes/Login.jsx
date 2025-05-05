import React, { useContext, useState } from 'react';
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../components/css/Login.css";

const Login = () => {
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(credentials);
    console.log("Login result:", result);

    if (result.success) {
      console.log("Login Successful!");
      switch (result.role) {
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
          navigate("/");
      }
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="py-5">
      <div className="login_container border border-secondary mt-5">
        <h2 className="login_heading">Login</h2>

        <form onSubmit={handleSubmit} className="login_form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="login_input"
            onChange={handleChange}
          />

          <div className="password_wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="login_input password_input"
              onChange={handleChange}
            />
            <span
              className="toggle_password_icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className='login_buttons'>
            <button type="submit" className="login_button">Login</button>
            <button type="button" className="login_Back_button" onClick={() => logout()}>Back</button>
          </div>

          <div>
            <p>Do not have an Account?</p>
            <Link to="/register">Click Me.!</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
