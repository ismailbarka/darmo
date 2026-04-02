'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import fr from '../locales/fr.json';
import ar from '../locales/ar.json';

type Language = 'fr' | 'ar';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  fr,
  ar,
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    // Check localStorage or browser preference on mount if needed, but 'fr' is default.
    const savedLang = localStorage.getItem('appLang') as Language;
    if (savedLang && (savedLang === 'fr' || savedLang === 'ar')) {
      // eslint-disable-next-line
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('appLang', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
