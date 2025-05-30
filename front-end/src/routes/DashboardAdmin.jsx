import React, { useState } from 'react'
import PendingNewsModeration from '../components/PendingNewsModeration '
import AcceptNewsModeration from '../components/AcceptNewsModeration';
import RejectNewsModeration from '../components/RejectNewsModeration';
import CreateNewsArticle from '../components/CreateNewsArticle';
import CreateNewUser from '../components/CreateNewUser';
import HistoryOfArticle from '../components/HistoryOfArticle';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/css/DashboardSuperAdmin.css'

const DashboardAdmin = () => {

  const [activeComponent, setActiveComponent] = useState('UserManagement')
  
  // Function to render the active component
  const renderComponent = () => {
    switch(activeComponent) {
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
        case 'HistoryOfArticles':
        return <HistoryOfArticle />
      default:
        return <PendingNewsModeration />
    }
  }


  return (
    <div className="container mt-5 dashboard-container pt-5">
      <h1 className="dashboard-title text-black pt-5">Admin Dashboard</h1>
      
      <div className="dashboard-nav">
        <div className="btn-group" role="group" aria-label="Dashboard Navigation">
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
            className={`btn nav-button ${activeComponent === 'HistoryOfArticles' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('HistoryOfArticles')}
          >
            <span className="btn-text">History Of Articles</span>
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
      
      <div className="card dashboard-card bg-white">
        <div className="card-body component-container">
          {renderComponent()}
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin