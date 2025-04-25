
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();

  const translate = (key: string): string => {
    // Get resolved language code - if currentLanguage is 'local', we need to determine which local language to use
    const resolvedLanguage = currentLanguage === 'local' ? 
      (localStorage.getItem('detectedLanguage') || 'id') : 
      currentLanguage;
    
    // Get translations for current language, fallback to English
    const languageDict = translations[resolvedLanguage] || translations['en'];
    
    // Return translation if it exists, otherwise return the key
    return languageDict[key] || translations['en'][key] || key;
  };

  return {
    t: translate,
    currentLanguage
  };
};
