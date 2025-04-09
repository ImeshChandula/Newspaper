import React, { useState } from 'react'
import PendingNewsModeration from '../components/PendingNewsModeration '
import UserManagement from "../components/UserManagement";
import AcceptNewsModeration from '../components/AcceptNewsModeration';
import RejectNewsModeration from '../components/RejectNewsModeration';
import CreateNewsArticle from '../components/CreateNewsArticle';
import CreateNewUser from '../components/CreateNewUser';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container mt-4">
      <div className="mb-4">
        <div className="btn-group" role="group" aria-label="Dashboard Navigation">
          <button 
            className={`btn ${activeComponent === 'UserManagement' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('UserManagement')}
          >
            User Management
          </button>
          <button 
            className={`btn ${activeComponent === 'PendingNewsModeration' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('PendingNewsModeration')}
          >
            Pending News
          </button>
          <button 
            className={`btn ${activeComponent === 'AcceptNewsModeration' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('AcceptNewsModeration')}
          >
            Accepted News
          </button>
          <button 
            className={`btn ${activeComponent === 'RejectNewsModeration' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('RejectNewsModeration')}
          >
            Rejected News
          </button>
          <button 
            className={`btn ${activeComponent === 'CreateNewsArticle' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('CreateNewsArticle')}
          >
            Create Article
          </button>
          <button 
            className={`btn ${activeComponent === 'CreateUser' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('CreateUser')}
          >
            Create User
          </button>
        </div>
      </div>
      
      <div className="card">
        <div className="card-body">
          {renderComponent()}
        </div>
      </div>
    </div>
  )
}

export default DashboardSuperAdmin