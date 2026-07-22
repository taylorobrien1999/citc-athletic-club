import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('citc_theme');

    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    } else {
      // No manual preference saved yet — auto-detect from the visitor's own
      // device clock. Dark between 7pm and 7am local time, light otherwise.
      const hour = new Date().getHours();
      const autoTheme = (hour >= 19 || hour < 7) ? 'dark' : 'light';
      setTheme(autoTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('citc_theme', next); // manual choice always wins from now on
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
