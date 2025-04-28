import i18n from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            Home: 'Home',
            Sport: 'Sport',
            Education: 'Education',
            Politics: 'Politics',
        }
    },
    si: {
        translation: {
            Home: 'මුල් පිටුව',
            Sport: 'ක්‍රීඩා',
            Education: 'අධ්‍යාපන',
            Politics: 'දේශපාලන',
        }
    },
    ta: {
        translation: {
            Home: 'முகப்பு',
            Sport: 'விளையாட்டு',
            Education: 'கல்வி',
            Politics: 'அரசியல்',
        }
    }
};

i18n
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        resources,
        fallbackLng: 'en',
        detection: {
            // Look at localStorage first
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
