
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCountryLanguage } from '@/utils/translations';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    return localStorage.getItem('preferredLanguage') || 'en';
  });

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'local' : 'en';
    setLanguage(newLang);
  };

  // Detect user's location and set initial language
  useEffect(() => {
    const detectUserLanguage = async () => {
      try {
        // Only detect if no preference is saved
        if (!localStorage.getItem('preferredLanguage')) {
          const response = await fetch('https://ipwho.is/');
          const data = await response.json();
          
          console.log('IP Geolocation data:', data);
          
          if (data.success && data.country_code) {
            const language = getCountryLanguage(data.country_code);
            console.log('Detected language:', language);
            setLanguage(language);
          }
        }
      } catch (error) {
        console.error('Error detecting user language:', error);
        setLanguage('en'); // Fallback to English
      }
    };

    detectUserLanguage();
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
