import React, { useEffect } from "react";
import "./language.css"

const GoogleTranslate = ({ id = "google_translate_element" }) => {
    useEffect(() => {
        const scriptId = "google-translate-script";

        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);

            window.googleTranslateElementInit = () => {
                if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: "en",
                            includedLanguages: "en,si,ta",
                            layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
                        },
                        id
                    );
                }
            };
        } else {
            // If already loaded and ready
            const checkAndInit = setInterval(() => {
                if (window.google && window.google.translate) {
                    clearInterval(checkAndInit);
                    new window.google.translate.TranslateElement(
                        {
                            pageLanguage: "en",
                            includedLanguages: "en,si,ta",
                            layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
                        },
                        id
                    );
                }
            }, 500);
        }
    }, [id]);

    return (
        <div
            id={id}
            className="translate-container bg-black bg-opacity-10 rounded px-2 py-1 shadow-sm"
            style={{
                minWidth: "120px",
                fontSize: "0.85rem",
            }}
        ></div>
    );
};

export default GoogleTranslate;
