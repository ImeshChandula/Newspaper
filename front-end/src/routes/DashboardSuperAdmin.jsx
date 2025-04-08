import React from 'react'
import PendingNewsModeration from '../components/PendingNewsModeration '
import UserManagement from "../components/UserManagement";

const DashboardSuperAdmin = () => {
  return (
    <div>
      <UserManagement />
      <PendingNewsModeration />
    </div>
  )
}

export default DashboardSuperAdmin