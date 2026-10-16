import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import ProfileHeader from './ProfileHeader';
import './Sidebar.css';

const adminLinks = [
  { to: '/admin',          label: 'Dashboard' },
  { to: '/admin/users',    label: 'Usuarios'  },
  { to: '/admin/workouts', label: 'Treinos'   },
  { to: '/admin/diets',    label: 'Dietas'    },
  { to: '/admin/products', label: 'Produtos'  },
];

const personalLinks = [
  { to: '/admin/workouts', label: 'Planos de Treino' },
  { to: '/admin/diets',    label: 'Dietas'           },
  { to: '/admin/users',    label: 'Meus Alunos'      },
];

const userLinks = [
  { to: '/dashboard',          label: 'Inicio'       },
  { to: '/dashboard/workouts', label: 'Meus Treinos' },
  { to: '/dashboard/diet',     label: 'Minha Dieta'  },
  { to: '/dashboard/store',    label: 'Loja'         },
];

export default function Sidebar({ role }) {
  const { logout, auth } = useAuth();
  const navigate = useNavigate();

  const links = role === 'admin'
    ? adminLinks
    : role === 'personal'
      ? personalLinks
      : userLinks;

  const [open, setOpen] = useState(false);

  function handleLogout() { logout(); navigate('/'); }

  return (
    <>
      <button className="sidebar-hamburger" onClick={() => setOpen(true)} aria-label="Abrir menu">☰</button>
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}
      <aside className={`sidebar${open ? ' sidebar-open' : ''}`}>
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">&#9889;</span>
        <span>MAX<b>FIT</b></span>
      </div>

      <ProfileHeader key={`${auth?.id}-${auth?.role}`} />

      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/admin' || l.to === '/dashboard'} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <ThemeToggle />
      <button className="btn-logout" onClick={handleLogout}>Sair</button>
    </aside>
    </>
  );
}
