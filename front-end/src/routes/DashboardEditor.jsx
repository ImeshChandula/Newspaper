import React, { useState } from 'react';
import CreateNewsArticle from "../components/CreateNewsArticle";
import HistoryOfArticle from '../components/HistoryOfArticle';

const DashboardEditor = () => {
  const [activeComponent, setActiveComponent] = useState('UserManagement')

  // Function to render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case 'PendingNewsModeration':
        return <CreateNewsArticle />
      case 'HistoryOfArticles':
        return <HistoryOfArticle />
      default:
        return <CreateNewsArticle />
    }
  }
  return (

    <div className="container mt-4 dashboard-container py-5 bg-dark">
      <h1 className="dashboard-title text-white">Author Dashboard</h1>
      
      <div className="dashboard-nav">
        <div className="btn-group" role="group" aria-label="Dashboard Navigation">
          <button 
            className={`btn nav-button ${activeComponent === 'CreateNewsArticle' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('CreateNewsArticle')}
          >
            <span className="btn-text">Create Article</span>
          </button>
          <button 
            className={`btn nav-button ${activeComponent === 'HistoryOfArticles' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('HistoryOfArticles')}
          >
            <span className="btn-text">History Of Articles</span>
          </button>
        </div>
      </div>
      
      <div className="card dashboard-card bg-dark">
        <div className="card-body component-container">
          {renderComponent()}
        </div>
      </div>
    </div>
  )
}

export default DashboardEditor