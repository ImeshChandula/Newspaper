import React from 'react';
import CreateNewsArticle from "../components/CreateNewsArticle";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/css/DashboardSuperAdmin.css';

const DashboardEditor = () => {
  return (
    <div className="editor-dashboard"> 
      <h1 className="dashboard-title">Author Dashboard</h1>
      
      <CreateNewsArticle />
    </div>
  )
}

export default DashboardEditor