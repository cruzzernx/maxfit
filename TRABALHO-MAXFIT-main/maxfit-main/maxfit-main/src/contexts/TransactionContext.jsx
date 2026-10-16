import { createContext, useContext, useState } from 'react';

const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [logs, setLogs] = useState([]);

  function addLog(product) {
    setLogs(prev => [{
      id: Date.now(),
      product: product.name,
      price: product.price,
      at: new Date().toLocaleString('pt-BR'),
    }, ...prev]);
  }

  return (
    <TransactionContext.Provider value={{ logs, addLog }}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);
