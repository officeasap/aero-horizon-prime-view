
import { useLanguage } from '@/contexts/LanguageContext';

// Simple translation function that can be expanded with actual translations
export const useTranslation = () => {
  const { currentLanguage } = useLanguage();

  const translate = (key: string): string => {
    // For now, return the key itself as we haven't implemented actual translations
    // In a real implementation, this would look up translations from a dictionary
    return key;
  };

  return {
    t: translate,
    currentLanguage
  };
};
