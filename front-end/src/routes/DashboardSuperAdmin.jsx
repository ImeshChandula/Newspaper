import React, { useState } from 'react'
import PendingNewsModeration from '../components/PendingNewsModeration '
import UserManagement from "../components/UserManagement";
import AcceptNewsModeration from '../components/AcceptNewsModeration';
import RejectNewsModeration from '../components/RejectNewsModeration';
import CreateNewsArticle from '../components/CreateNewsArticle';
import CreateNewUser from '../components/CreateNewUser';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/css/DashboardSuperAdmin.css';

const DashboardSuperAdmin = () => {

  const [activeComponent, setActiveComponent] = useState('UserManagement')
  
  // Function to render the active component
  const renderComponent = () => {
    switch(activeComponent) {
      case 'UserManagement':
        return <UserManagement />
      case 'PendingNewsModeration':
        return <PendingNewsModeration />
      case 'AcceptNewsModeration':
        return <AcceptNewsModeration />
      case 'RejectNewsModeration':
        return <RejectNewsModeration />
      case 'CreateNewsArticle':
        return <CreateNewsArticle />
      case 'CreateUser':
        return <CreateNewUser />
      default:
        return <PendingNewsModeration />
    }
  }



  return (
    <div className="container mt-4 dashboard-container py-4">
      <h1 className="dashboard-title">Super Admin Dashboard</h1>
      
      <div className="dashboard-nav">
        <div className="btn-group" role="group" aria-label="Dashboard Navigation">
          <button 
            className={`btn nav-button ${activeComponent === 'UserManagement' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('UserManagement')}
          >
            <span className="btn-text">User Management</span>
          </button>
          <button 
            className={`btn nav-button ${activeComponent === 'PendingNewsModeration' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('PendingNewsModeration')}
          >
            <span className="btn-text">Pending News</span>
          </button>
          <button 
            className={`btn nav-button ${activeComponent === 'AcceptNewsModeration' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('AcceptNewsModeration')}
          >
            <span className="btn-text">Accepted News</span>
          </button>
          <button 
            className={`btn nav-button ${activeComponent === 'RejectNewsModeration' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('RejectNewsModeration')}
          >
            <span className="btn-text">Rejected News</span>
          </button>
          <button 
            className={`btn nav-button ${activeComponent === 'CreateNewsArticle' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('CreateNewsArticle')}
          >
            <span className="btn-text">Create Article</span>
          </button>
          <button 
            className={`btn nav-button ${activeComponent === 'CreateUser' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('CreateUser')}
          >
            <span className="btn-text">Create User</span>
          </button>
        </div>
      </div>
      
      <div className="card dashboard-card">
        <div className="card-body component-container">
          {renderComponent()}
        </div>
      </div>
    </div>
  )
}

export default DashboardSuperAdmin