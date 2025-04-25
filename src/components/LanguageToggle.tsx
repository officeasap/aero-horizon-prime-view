
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageToggle = () => {
  const { currentLanguage, toggleLanguage } = useLanguage();
  
  // Determine what to display as current language code
  const displayLanguage = currentLanguage === 'local' ? 
    (localStorage.getItem('detectedLanguage') || 'ID') : 
    currentLanguage.toUpperCase();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative hover:bg-[#A80000]/10"
      title={`Switch to ${currentLanguage === 'en' ? 'Local' : 'English'} language`}
    >
      <Globe className="h-5 w-5" />
      <span className="absolute -bottom-1 right-0 text-xs font-bold">
        {displayLanguage}
      </span>
    </Button>
  );
};

export default LanguageToggle;
