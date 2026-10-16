import { createContext, useContext, useEffect, useState } from 'react';

const ProContext = createContext(null);

const GOLD = {
  hex:  '#D4AF37',
  dark: '#B8960C',
  dim:  'rgba(212,175,55,0.12)',
};

function applyProTheme() {
  const r = document.documentElement;
  r.style.setProperty('--green',      GOLD.hex);
  r.style.setProperty('--green-dark', GOLD.dark);
  r.style.setProperty('--green-dim',  GOLD.dim);
  r.setAttribute('data-pro', 'true');
}

function removeProTheme() {
  const r = document.documentElement;
  r.style.removeProperty('--green');
  r.style.removeProperty('--green-dark');
  r.style.removeProperty('--green-dim');
  r.removeAttribute('data-pro');
}

export function ProProvider({ children }) {
  const [isPro, setIsPro] = useState(() => localStorage.getItem('planStatus') === 'Pro');

  useEffect(() => {
    if (isPro) applyProTheme();
    else removeProTheme();
  }, [isPro]);

  function upgradeToPro() {
    localStorage.setItem('planStatus', 'Pro');
    setIsPro(true);
  }

  function downgrade() {
    localStorage.setItem('planStatus', 'Basic');
    setIsPro(false);
  }

  return (
    <ProContext.Provider value={{ isPro, upgradeToPro, downgrade }}>
      {children}
    </ProContext.Provider>
  );
}

export const usePro = () => useContext(ProContext);
