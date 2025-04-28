// src/Languages/LanguageSwitcherForMD.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LanguageSwitcherForMD = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const changeLanguage = (lng) => {
    if (lng !== currentLang) {
      i18n.changeLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
    }
  };

  return (
    <li className="nav-item d-lg-none px-3 py-2">
      <div className="d-flex align-items-center mb-2">
        <FaGlobe className="me-2" />
        <span className="fw-medium">Language ({i18n.language.toUpperCase()})</span>
      </div>
      <div className="btn-group btn-group-sm w-100" role="group" aria-label="Language switcher">
        {/* English */}
        <input
          type="radio"
          className="btn-check"
          name="langOptions"
          id="langEn"
          autoComplete="off"
          checked={currentLang === 'en'}
          onChange={() => changeLanguage('en')}
        />
        <label className="btn btn-outline-primary flex-fill" htmlFor="langEn">
          EN
        </label>

        {/* Sinhala */}
        <input
          type="radio"
          className="btn-check"
          name="langOptions"
          id="langSi"
          autoComplete="off"
          checked={currentLang === 'si'}
          onChange={() => changeLanguage('si')}
        />
        <label className="btn btn-outline-primary flex-fill" htmlFor="langSi">
          සිං
        </label>

        {/* Tamil */}
        <input
          type="radio"
          className="btn-check"
          name="langOptions"
          id="langTa"
          autoComplete="off"
          checked={currentLang === 'ta'}
          onChange={() => changeLanguage('ta')}
        />
        <label className="btn btn-outline-primary flex-fill" htmlFor="langTa">
          தமிழ்
        </label>
      </div>
    </li>
  );
};

export default LanguageSwitcherForMD;
