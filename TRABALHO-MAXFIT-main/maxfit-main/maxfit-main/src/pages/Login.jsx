import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import IntroScreen from '../components/IntroScreen';
import './Login.css';

const TABS = [
  { key: 'user',     label: 'Aluno',    placeholder: 'seu@email.com',         hint: null },
  { key: 'personal', label: 'Personal', placeholder: 'personal@maxfit.com',   hint: null },
  { key: 'admin',    label: 'Admin',    placeholder: 'admin@maxfit.com',       hint: null },
];

export default function Login() {
  const [tab, setTab]         = useState('user');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [intro, setIntro]     = useState(null);
  const { login, logout } = useAuth();
  const navigate              = useNavigate();
  const location              = useLocation();
  const justRegistered        = location.state?.registered;

  function switchTab(t) {
    setTab(t);
    setEmail('');
    setPassword('');
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result) { setError('Email ou senha inválidos.'); return; }

      // Valida se o papel do usuário bate com a aba selecionada
      const roleMap = { user: 'user', personal: 'personal', admin: 'admin' };
      if (result.role !== roleMap[tab]) {
        logout(); // limpa o token que foi salvo
        setError(`Esta conta não é do tipo "${TABS.find(t2 => t2.key === tab)?.label}". Use a aba correta.`);
        return;
      }

      setIntro({ name: result.name, role: result.role });
    } catch (err) {
      setError(err.message || 'Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  const handleIntroDone = useCallback(() => {
    if (intro?.role === 'admin')    navigate('/admin');
    else if (intro?.role === 'personal') navigate('/admin/workouts');
    else navigate('/dashboard');
  }, [intro, navigate]);

  if (intro) {
    return <IntroScreen userName={intro.name} onDone={handleIntroDone} />;
  }

  const currentTab = TABS.find(t => t.key === tab);

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-overlay" />
      </div>
      <ThemeToggle variant="floating" />

      <div className="login-card">
        <div className="login-logo">
          <span className="logo-icon"></span>
          <h1>MAX<span>FIT</span></h1>
          <p>Disciplina. Força. Resultado.</p>
        </div>

        {justRegistered && (
          <div className="login-success">
             Conta criada! Faça login para continuar.
          </div>
        )}

        {/* Abas de tipo de usuário */}
        <div className="login-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={tab === t.key ? 'active' : ''}
              onClick={() => switchTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder={currentTab?.placeholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        {/* Link de cadastro apenas para aluno */}
        {tab === 'user' && (
          <p className="login-register-link">
            Não tem conta? <Link to="/register">Criar conta de aluno</Link>
          </p>
        )}
      </div>
    </div>
  );
}
