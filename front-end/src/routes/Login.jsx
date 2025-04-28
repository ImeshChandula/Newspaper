import React, { useContext, useState } from 'react';
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../components/css/Login.css";

const Login = () => {
  const { t } = useTranslation();
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
    <div className="login_container">
      <h2 className="login_heading">{t('loginTitle')}</h2>

      <form onSubmit={handleSubmit} className="login_form">
        <input
          type="text"
          name="username"
          placeholder={t('usernamePlaceholder')}
          className="login_input"
          onChange={handleChange}
        />

        <div className="password_wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={t('passwordPlaceholder')}
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
          <button type="submit" className="login_button">{t('loginButton')}</button>
          <button type="button" className="login_Back_button" onClick={() => logout()}>{t('backButton')}</button>
        </div>

        <div>
          <p>{t('noAccount')}</p>
          <Link to="/register">{t('clickMe')}</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
