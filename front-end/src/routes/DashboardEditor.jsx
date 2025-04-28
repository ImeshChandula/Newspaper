import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateNewsArticle from "../components/CreateNewsArticle";
import HistoryOfArticle from '../components/HistoryOfArticle';

const DashboardEditor = () => {
  const { t } = useTranslation();
  const [activeComponent, setActiveComponent] = useState('CreateNewsArticle');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'CreateNewsArticle':
        return <CreateNewsArticle />;
      case 'HistoryOfArticles':
        return <HistoryOfArticle />;
      default:
        return <CreateNewsArticle />;
    }
  };

  return (
    <div className="container mt-4 dashboard-container py-4">
      <h1 className="dashboard-title">{t('authorDashboard')}</h1>

      <div className="dashboard-nav">
        <div className="btn-group" role="group" aria-label="Dashboard Navigation">
          <button
            className={`btn nav-button ${activeComponent === 'CreateNewsArticle' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('CreateNewsArticle')}
          >
            <span className="btn-text">{t('createArticle')}</span>
          </button>
          <button
            className={`btn nav-button ${activeComponent === 'HistoryOfArticles' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveComponent('HistoryOfArticles')}
          >
            <span className="btn-text">{t('historyOfArticles')}</span>
          </button>
        </div>
      </div>

      <div className="card dashboard-card">
        <div className="card-body component-container">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardEditor;
