// utils/languageHelper.js

const translations = {
  en: {
    welcome: 'Welcome',
    goodbye: 'Goodbye',
  },
  de: {
    welcome: 'Willkommen',
    goodbye: 'Auf Wiedersehen',
  },
};

// Funktion zum Abrufen der Übersetzung
const translate = (lang, key) => {
  return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
};

module.exports = { translate };
