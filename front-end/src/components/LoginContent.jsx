import React, { useContext, useState } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginContent = () => {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  
  const handleChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      const success = await login(credentials); 
      if (success) {
        console.log("Login Success.!");
        navigate("/dashboard");
      } else {
        console.log("Login Fail.!");
        alert("Invalid Username or Password. Please try again.");
      }
  };

  return (
    <div className=" max-w-lg mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="p-2 border rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-2 border rounded"
          onChange={handleChange}
        />
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
      </form>

    </div>
  )
}
