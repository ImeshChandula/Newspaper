import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // using Link instead of <a>
import '../components/css/Unauthorized.css';

const Unauthorized = () => {
  const { t } = useTranslation();

  return (
    <div className="unauthorized py-5">
      <h1 className="unauthorized_heading">{t('accessDenied')}</h1>
      <p className="unauthorized_message">{t('noPermission')}</p>
      <Link to="/" className="unauthorized_text">
        {t('goHome')}
      </Link>
    </div>
  );
};

export default Unauthorized;
