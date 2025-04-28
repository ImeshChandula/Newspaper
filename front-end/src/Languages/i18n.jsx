import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          home: "Home",
          sport: "Sport",
          education: "Education",
          politics: "Politics",
          newspaper: "News Paper",
          dateToday: "Today is {{date}}",
        },
      },
      si: {
        translation: {
          home: "මුල් පිටුව",
          sport: "ක්‍රීඩා",
          education: "අධ්‍යාපනය",
          politics: "දේශපාලනය",
          newspaper: "පුවත්පත",
          dateToday: "අද දිනය {{date}}",
        },
      },
      ta: {
        translation: {
          home: "முகப்பு",
          sport: "விளையாட்டு",
          education: "கல்வி",
          politics: "அரசியல்",
          newspaper: "செய்தித்தாள்",
          dateToday: "இன்றைய தேதி {{date}}",
        },
      },
    },
  });

export default i18n;
