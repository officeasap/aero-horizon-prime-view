
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/translations';

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();

  const translate = (key: string): string => {
    // Get translations for current language, fallback to English
    const languageDict = translations[currentLanguage] || translations['en'];
    
    // Return translation if it exists, otherwise return the key
    return languageDict[key] || translations['en'][key] || key;
  };

  return {
    t: translate,
    currentLanguage
  };
};
