import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaGlobe } from 'react-icons/fa'; // 🌐 Icon

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('i18nextLng', lng);
        setIsOpen(false); // Close dropdown after selecting
    };

    // Close dropdown when clicking outside
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
        <motion.div
            className="dropdown"
            ref={dropdownRef}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
        >
            <button
                className="btn btn-sm btn-outline-primary dropdown-toggle d-flex align-items-center gap-2"
                type="button"
                id="languageDropdown"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <FaGlobe />
            </button>

            <ul
                className={`dropdown-menu dropdown-menu-end mt-2 ${isOpen ? 'show' : ''}`}
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
        </motion.div>
    );
};

export default LanguageSwitcher;
