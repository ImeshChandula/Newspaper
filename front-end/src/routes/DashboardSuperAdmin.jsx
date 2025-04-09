import React from 'react'
import PendingNewsModeration from '../components/PendingNewsModeration '
import UserManagement from "../components/UserManagement";
import AcceptNewsModeration from '../components/AcceptNewsModeration';
import RejectNewsModeration from '../components/RejectNewsModeration';

const DashboardSuperAdmin = () => {
  return (
    <div>
      <UserManagement />
      <PendingNewsModeration />
      <AcceptNewsModeration />
      <RejectNewsModeration />
    </div>
  )
}

export default DashboardSuperAdmin