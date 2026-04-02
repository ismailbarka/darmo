'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { trackEvent } from '@/services/analytics';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLanguageChange = (newLang: 'fr' | 'ar') => {
    if (newLang !== language) {
      setLanguage(newLang);
      trackEvent('language_changed', { language: newLang });
    }
  };

  return (
    <div className="language-switcher">
      <div 
        className="lang-slider" 
        style={{ transform: `translateX(${language === 'fr' ? '0%' : '100%'})` }}
      />
      <button
        type="button"
        className={`lang-btn ${language === 'fr' ? 'lang-btn--active' : ''}`}
        onClick={() => handleLanguageChange('fr')}
      >
        {t('fr')}
      </button>
      <button
        type="button"
        className={`lang-btn ${language === 'ar' ? 'lang-btn--active' : ''}`}
        onClick={() => handleLanguageChange('ar')}
      >
        {t('ar')}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
