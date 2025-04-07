import React from 'react'

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
      <p className="text-lg mt-2">You do not have permission to access this page.</p>
      <a href="/login" className="text-blue-500 mt-4">Go to Login</a>
    </div>
  )
}

export default Unauthorized