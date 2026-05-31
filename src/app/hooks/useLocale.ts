import { useState, useEffect } from 'react';

// Simple locale hook – reads from localStorage if set, otherwise defaults to Amharic ('am')
export function useLocale() {
  const [locale, setLocale] = useState<'am' | 'de' | 'en'>('am');

  useEffect(() => {
    const stored = localStorage.getItem('locale');
    if (stored === 'am' || stored === 'de' || stored === 'en') {
      setLocale(stored);
    }
  }, []);

  return { locale, setLocale };
}
