import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Backpic from './rm218-bb-07.jpg';
import userpic from './R-removebg-preview.png';
import partpic from './looped-animation-3d-rendering-with-a-metallic-texture-and-gradient-wavy-background-free-video.jpg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Signin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true); 
    setError(""); 

   
    if (username === 'admin' && password === 'password') {
      setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true');  // Save login state
        localStorage.setItem('username', username); // Store username
        onLogin(true); 
        navigate('/'); // Redirect to home after login
      }, 1000);
    } else {
      setError("Invalid username or password."); 
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{
      backgroundImage: `url(${Backpic})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>
      <div className="container d-flex align-items-center justify-content-center" style={{ maxWidth: '1100px', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '40px', borderRadius: '25px', boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.4)' }}>
        
        {/* Left Side - Login Form */}
        <div className="p-4 text-light" style={{
          width: '55%',
          height: '450px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '30px',
          borderRadius: '10px'
        }}>
          <div className="text-center mb-3">
            <img src={userpic} alt="User" className="rounded-circle" style={{ width: '80px', height: '80px' }} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input 
                type="text" 
                className="form-control bg-transparent text-light border border-light rounded-pill" 
                placeholder="USERNAME" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                style={{ fontSize: '18px', padding: '12px' }}
              />
            </div>
            <div className="mb-3">
              <input 
                type="password" 
                className="form-control bg-transparent text-light border border-light rounded-pill" 
                placeholder="PASSWORD" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ fontSize: '18px', padding: '12px' }}
              />
            </div>
            <button 
              type="submit" 
              className="btn w-100 text-light rounded-pill" 
              style={{
                fontSize: '20px',
                padding: '12px',
                background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
                border: 'none',
                transition: '0.3s',
              }}
              disabled={loading} 
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
            
           
            {error && <div className="text-danger mt-3">{error}</div>}
            
            
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="" className="text-light text-decoration-none">Forgot Password?</a>
            </div>
            
            <div className="text-center mt-3">
              <Link to="/signup" className="text-light text-decoration-none">Create an Account</Link>
            </div>
          </form>
        </div>
        
        {/* Right Side - Welcome Section */}
        <div className="position-relative" style={{
          width: '55%',
          height: '450px',
          borderRadius: '10px',
          overflow: 'hidden',
          marginLeft: '20px'
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${partpic})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)'
          }}></div>
          <div className="position-absolute w-100 h-100 d-flex flex-column justify-content-end align-items-left text-center text-light" style={{
            backdropFilter: 'blur(5px)',
            padding: '40px'
          }}>
            <h1 className="fw-bold" style={{ fontSize: '2.5rem' }}>Welcome</h1>
            <p style={{ fontSize: '1.2rem' }}>about the company</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
