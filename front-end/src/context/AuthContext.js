import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) { // Check if token is still valid
        setUser(decoded);
      } else {
        logout(); // If expired, clear token and logout
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL_USERS}/login`, credentials);
      localStorage.setItem("token", res.data.token);

      const decodedUser = jwtDecode(res.data.token);
      setUser(decodedUser);

      return { success: true, role: decodedUser.role  };
    } catch (error) {
      console.error("Login failed", error.response);
      return {  success: false, 
                message: error?.response?.data?.message ?? error?.message ?? "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
