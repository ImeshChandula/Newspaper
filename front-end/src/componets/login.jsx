import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import YourImage from "./rm218-bb-07.jpg"; 

const Login = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div 
        className="w-75 h-75 p-5 rounded shadow d-flex flex-row position-relative" 
        style={{
          backgroundImage: `url(${YourImage})`,
          backgroundSize: "cover", // Ensure the image covers the entire area
          backgroundPosition: "center", // Ensure the image is centered
          backgroundRepeat: "no-repeat", // Don't repeat the image
          width: "100%", // Ensure the container is 100% width
          height: "100%" // Ensure the container is 100% height
        }}
      >
        <div 
          className="position-absolute top-0 left-0 w-100 h-100 bg-dark opacity-50"
          style={{ zIndex: -1 }} // Keeps the overlay behind the content
        />
        <div className="w-50 d-flex flex-column justify-content-center p-4 rounded" 
             style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}> {/* Transparent rectangle */}
          <h2 className="text-center mb-4 text-white">Login</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-white">Email address</label>
              <input type="email" className="form-control" id="email" placeholder="Enter your email" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-white">Password</label>
              <input type="password" className="form-control" id="password" placeholder="Enter your password" />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
