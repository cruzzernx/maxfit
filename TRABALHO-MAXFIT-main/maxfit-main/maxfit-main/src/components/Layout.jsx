import './Layout.css';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children, role: roleProp }) {
  const { auth } = useAuth();
  // Usa o role real do usuário logado; o prop é fallback
  const role = auth?.role || roleProp;
  return (
    <div className="layout">
      <Sidebar role={role} />
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}
