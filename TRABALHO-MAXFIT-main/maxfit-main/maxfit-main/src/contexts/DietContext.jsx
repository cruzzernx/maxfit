import { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'mf-diet-plan';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; }
  catch { return null; }
}

const DietContext = createContext(null);

export function DietProvider({ children }) {
  const [diet, setDiet] = useState(load);

  function saveDiet(data) {
    setDiet(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function clearDiet() {
    setDiet(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <DietContext.Provider value={{ diet, saveDiet, clearDiet }}>
      {children}
    </DietContext.Provider>
  );
}

export const useDiet = () => useContext(DietContext);
