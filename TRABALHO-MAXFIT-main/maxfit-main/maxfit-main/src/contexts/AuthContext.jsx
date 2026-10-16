import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useTheme } from './ThemeContext';

const AuthContext = createContext(null);

// Decodifica o payload do JWT sem biblioteca externa
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// Determina o papel do usuário a partir do payload JWT
// A API serializa o enum TipoUsuario no campo "role" como string (ex: "ADMIN", "CLIENTE")
function getRoleFromToken(token) {
  const payload = parseJwt(token);
  if (!payload) return 'user';
  // O campo pode vir como string ou como objeto { "name": "ADMIN" }
  const tipo = typeof payload.role === 'object'
    ? (payload.role?.name || '')
    : (payload.role || '');
  const upper = tipo.toString().toUpperCase();
  if (upper === 'ADMIN') return 'admin';
  if (upper === 'PERSONAL') return 'personal';
  if (upper === 'FUNCIONARIO') return 'funcionario';
  return 'user'; // CLIENTE
}

// Extrai o id numérico do usuário do payload JWT
function getIdFromToken(token) {
  const payload = parseJwt(token);
  if (!payload) return null;
  return payload.id ?? null;
}

// Recupera sessão salva (token + dados básicos do usuário)
function loadSession() {
  try {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('auth_user');
    if (token && userData) {
      return { token, user: JSON.parse(userData) };
    }
  } catch { /* ignora */ }
  return null;
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const session = loadSession();
    return session ? session.user : null;
  });
  const { setAvatarUserId } = useTheme();

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Carrega lista de clientes quando já estiver autenticado como admin/personal
  useEffect(() => {
    if (auth?.role === 'admin' || auth?.role === 'personal') {
      setLoadingUsers(true);
      api.clientes.list()
        .then(lista => {
          // Normaliza o campo "nome" da API para "name" usado no front
          setUsers(lista.map(normalizeUser));
        })
        .catch(() => setUsers([]))
        .finally(() => setLoadingUsers(false));
    }
  }, [auth?.role]);

  // Converte a nomenclatura da API (nome, codStatus...) para o padrão do frontend
  function normalizeUser(u) {
    return {
      id:     u.id,
      name:   u.nome,
      email:  u.email,
      role:   'user',
      plan:   'Basic',
      status: u.codStatus ? 'active' : 'inactive',
      joined: u.createdAt?.slice(0, 10) || '',
      avatar: (u.nome || '').trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    };
  }

  // ── Login ─────────────────────────────────────────────────────────
  async function login(email, password) {
    const response = await api.auth.login(email, password);
    // response = { access_token, refresh_token }
    const { access_token, refresh_token } = response;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    const role = getRoleFromToken(access_token);
    const payload = parseJwt(access_token);

    const userData = {
      email,
      role,
      name: payload?.nome || payload?.sub || email,
      id:   getIdFromToken(access_token),
    };

    localStorage.setItem('auth_user', JSON.stringify(userData));
    setAuth(userData);
    setAvatarUserId(userData.id);

    return { role, name: userData.name };
  }

  // ── Registro (apenas clientes, pelo fluxo público) ────────────────
  async function register(data) {
    // Chama a API — ela cria o cliente e retorna token, mas NÃO fazemos login automático
    // O usuário é redirecionado para a tela de login com mensagem de sucesso
    await api.auth.registerCliente(data);
    return { success: true };
  }

  // ── Atualiza dados do usuário logado reativamente ─────────────────
  function updateAuth(patch) {
    setAuth(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem('auth_user', JSON.stringify(next));
      return next;
    });
  }

  // ── Logout ────────────────────────────────────────────────────────
  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    setAuth(null);
    setUsers([]);
    setAvatarUserId(null);
  }

  // ── CRUD de alunos (usado pelo AdminUsers) ────────────────────────
  async function addUser(data) {
    // Cadastra como cliente via API
    const res = await api.clientes.create({
      nome:     data.name,
      email:    data.email,
      password: data.password,
    });
    // registerCliente retorna token, mas precisamos dos dados do cliente criado
    // Recarrega a lista para pegar o novo registro
    const lista = await api.clientes.list();
    const novaLista = lista.map(normalizeUser);
    setUsers(novaLista);
    return novaLista[novaLista.length - 1];
  }

  async function updateUser(id, data) {
    const payload = {};
    if (data.name)   payload.nome      = data.name;
    if (data.email)  payload.email     = data.email;
    if (data.status) payload.codStatus = data.status === 'active';
    const updated = await api.clientes.update(id, payload);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...normalizeUser(updated) } : u));
    return normalizeUser(updated);
  }

  async function removeUser(id) {
    await api.clientes.remove(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  return (
    <AuthContext.Provider value={{
      auth,
      login,
      logout,
      register,
      updateAuth,
      users,
      setUsers,
      addUser,
      updateUser,
      removeUser,
      loadingUsers,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
