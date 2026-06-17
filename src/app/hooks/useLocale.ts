import { useState, useEffect } from 'react';

// Simple locale hook – reads from localStorage if set, otherwise defaults to Amharic ('am')
export function useLocale() {
  const [locale, setLocaleInternal] = useState<'am' | 'de' | 'en' | 'ti'>('am');

  useEffect(() => {
    const stored = localStorage.getItem('locale');
    if (stored === 'am' || stored === 'de' || stored === 'en' || stored === 'ti') {
      setLocaleInternal(stored);
    }
  }, []);

  const setLocale = (newLocale: 'am' | 'de' | 'en' | 'ti') => {
    localStorage.setItem('locale', newLocale);
    setLocaleInternal(newLocale);
  };

  return { locale, setLocale };
}
