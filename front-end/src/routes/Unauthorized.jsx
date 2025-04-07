import React from 'react'
import '../components/css/Unauthorized.css';


const Unauthorized = () => {
  return (
    <div className="unauthorized">
      <h1 className="unauthorized_heading">Access Denied</h1>
      <p className="unauthorized_message">You do not have permission to access this page.</p>
      <a href="/login" className="unauthorized_text">Go to Login</a>
    </div>
  )
}

export default Unauthorized