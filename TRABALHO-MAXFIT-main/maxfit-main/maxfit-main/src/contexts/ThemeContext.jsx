import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export const ACCENT_COLORS = [
  { id: 'green',  label: 'Verde',    hex: '#10B981', dark: '#059669', dim: 'rgba(16,185,129,0.12)'  },
  { id: 'blue',   label: 'Azul',     hex: '#3b9eff', dark: '#2280d6', dim: 'rgba(59,158,255,0.12)'  },
  { id: 'red',    label: 'Vermelho', hex: '#ff3b3b', dark: '#d62222', dim: 'rgba(255,59,59,0.12)'   },
  { id: 'purple', label: 'Roxo',     hex: '#b44fff', dark: '#9333d6', dim: 'rgba(180,79,255,0.12)'  },
  { id: 'orange', label: 'Laranja',  hex: '#ff8c00', dark: '#d67200', dim: 'rgba(255,140,0,0.12)'   },
];

function applyAccent({ hex, dark, dim }) {
  const root = document.documentElement;
  root.style.setProperty('--green',      hex);
  root.style.setProperty('--green-dark', dark);
  root.style.setProperty('--green-dim',  dim);
}

function avatarKey(userId) {
  return userId ? `mf-avatar-${userId}` : 'mf-avatar';
}

export function ThemeProvider({ children }) {
  const [theme] = useState('dark'); // dark mode fixo
  const [accentId, setAccentId] = useState(() => localStorage.getItem('mf-accent') || 'green');
  const [userId, setUserId] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_user'))?.id || null; } catch { return null; }
  });
  const [avatar, setAvatar] = useState(() => {
    try {
      const uid = JSON.parse(localStorage.getItem('auth_user'))?.id || null;
      return localStorage.getItem(avatarKey(uid)) || null;
    } catch { return null; }
  });

  // Recarrega o avatar quando o userId muda (troca de perfil/login)
  useEffect(() => {
    const stored = localStorage.getItem(avatarKey(userId));
    setAvatar(stored || null);
  }, [userId]);

  // Sincroniza userId com auth_user no localStorage via storage event (cross-tab)
  // e também via polling leve para detectar mudanças na mesma aba
  useEffect(() => {
    function syncUser() {
      try {
        const uid = JSON.parse(localStorage.getItem('auth_user'))?.id || null;
        setUserId(prev => prev !== uid ? uid : prev);
      } catch { /* ignora */ }
    }
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  // Aplica dark fixo
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Aplica cor de acento
  useEffect(() => {
    const color = ACCENT_COLORS.find(c => c.id === accentId) || ACCENT_COLORS[0];
    applyAccent(color);
    localStorage.setItem('mf-accent', accentId);
  }, [accentId]);

  function changeAccent(id) { setAccentId(id); }

  function changeAvatar(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target.result;
      localStorage.setItem(avatarKey(userId), result);
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  }

  // Chamado pelo AuthContext ao fazer login/logout para sincronizar userId
  function setAvatarUserId(uid) {
    setUserId(uid);
  }

  return (
    <ThemeContext.Provider value={{ theme, accentId, changeAccent, avatar, changeAvatar, setAvatarUserId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
