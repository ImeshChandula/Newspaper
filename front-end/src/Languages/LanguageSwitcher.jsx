import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import '../components/css/LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            className="dropdown language-switcher px-2"
            ref={dropdownRef}
        >
            <button
                className="btn btn-sm btn-outline-primary dropdown-toggle d-flex align-items-center gap-2 py-2 rounded-pill"
                type="button"
                id="languageDropdown"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <FaGlobe /> <span className="fw-medium">Language</span>
            </button>

            <ul
                className={`dropdown-menu dropdown-menu-end rounded mt-2 ${isOpen ? 'show' : ''}`}
                aria-labelledby="languageDropdown"
            >
                <li>
                    <button className="dropdown-item" onClick={() => changeLanguage('en')}>English</button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={() => changeLanguage('si')}>සිංහල</button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={() => changeLanguage('ta')}>தமிழ்</button>
                </li>
            </ul>
        </div>
    );
};

export default LanguageSwitcher;
