import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { api } from '../utils/api';
import './Login.css';
import './Register.css';

// ── Tipos de cadastro disponíveis ─────────────────────────────────
const TIPOS = [
  { key: 'aluno',    label: ' Aluno',    desc: 'Acesse seus treinos e dieta' },
  { key: 'personal', label: ' Personal', desc: 'Gerencie alunos e treinos'   },
  { key: 'admin',    label: ' Admin',     desc: 'Acesso total ao sistema'       },
];

const GOALS = [
  { value: 'Hipertrofia',    label: ' Hipertrofia',    desc: 'Ganho de massa muscular' },
  { value: 'Emagrecimento',  label: ' Emagrecimento',  desc: 'Perda de gordura'        },
  { value: 'Definição',      label: ' Definição',      desc: 'Tonificação e definição' },
  { value: 'Condicionamento',label: ' Condicionamento',desc: 'Resistência e saúde'     },
];

const INIT_ALUNO    = { name: '', email: '', password: '', confirm: '', weight: '', height: '', goal: '' };
const INIT_STAFF    = { nome: '', email: '', password: '', confirm: '', convite: '' };

// ── Validações ────────────────────────────────────────────────────
function validateAluno(f, step) {
  const e = {};
  if (step === 1) {
    if (!f.name.trim()) e.name = 'Nome obrigatório.';
    else if (f.name.trim().split(' ').length < 2) e.name = 'Informe nome e sobrenome.';
    if (!f.email.trim()) e.email = 'Email obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Email inválido.';
    if (!f.password) e.password = 'Senha obrigatória.';
    else if (f.password.length < 6) e.password = 'Mínimo 6 caracteres.';
    if (f.confirm !== f.password) e.confirm = 'Senhas não coincidem.';
  }
  return e;
}

function validateStaff(f, tipo) {
  const e = {};
  if (!f.nome.trim()) e.nome = 'Nome obrigatório.';
  else if (f.nome.trim().split(' ').length < 2) e.nome = 'Informe nome e sobrenome.';
  if (!f.email.trim()) e.email = 'Email obrigatório.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Email inválido.';
  if (!f.password) e.password = 'Senha obrigatória.';
  else if (f.password.length < 6) e.password = 'Mínimo 6 caracteres.';
  if (f.confirm !== f.password) e.confirm = 'Senhas não coincidem.';
  // Código de convite só é exigido para Admin
  if (tipo === 'admin' && !f.convite.trim()) e.convite = 'Código de convite obrigatório.';
  return e;
}

export default function Register() {
  const [searchParams]  = useSearchParams();
  const tipoInicial     = searchParams.get('tipo') || 'aluno';
  const tipoValido      = TIPOS.find(t => t.key === tipoInicial)?.key || 'aluno';

  const [tipo, setTipo]         = useState(tipoValido);
  const [step, setStep]         = useState(1);
  const [form, setForm]         = useState(tipo === 'aluno' ? INIT_ALUNO : INIT_STAFF);
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const { register }            = useAuth();
  const navigate                = useNavigate();

  // Reseta o formulário ao trocar de aba
  useEffect(() => {
    setForm(tipo === 'aluno' ? INIT_ALUNO : INIT_STAFF);
    setErrors({});
    setApiError('');
    setStep(1);
  }, [tipo]);

  function set(field, value) {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  }

  // ── Envio do formulário de Aluno ──────────────────────────────────
  function handleStep1Aluno(e) {
    e.preventDefault();
    const errs = validateAluno(form, 1);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(2);
  }

  async function handleSubmitAluno(e) {
    e.preventDefault();
    setLoading(true);
    setApiError('');
    try {
      await register(form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setApiError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // ── Envio do formulário de Personal/Admin ─────────────────────────
  async function handleSubmitStaff(e) {
    e.preventDefault();
    const errs = validateStaff(form, tipo);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      // Código de convite só é necessário para Admin
      if (tipo === 'admin') {
        const { valido } = await api.auth.validarConvite(tipo, form.convite);
        if (!valido) {
          setErrors(p => ({ ...p, convite: 'Código de convite inválido.' }));
          setLoading(false);
          return;
        }
      }
      // Cria o usuário
      if (tipo === 'personal') {
        await api.auth.registerPersonal(form);
      } else {
        await api.auth.registerAdmin(form);
      }
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setApiError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg"><div className="login-overlay" /></div>
      <ThemeToggle variant="floating" />

      <div className="login-card register-card">
        <div className="login-logo">
          <span className="logo-icon"></span>
          <h1>MAX<span>FIT</span></h1>
          <p>Criar conta</p>
        </div>

        {/* Seletor de tipo */}
        <div className="register-tipo-grid">
          {TIPOS.map(t => (
            <button
              key={t.key}
              type="button"
              className={`register-tipo-btn ${tipo === t.key ? 'active' : ''}`}
              onClick={() => setTipo(t.key)}
            >
              <span className="tipo-label">{t.label}</span>
              <span className="tipo-desc">{t.desc}</span>
            </button>
          ))}
        </div>

        {/* ── Formulário de ALUNO ── */}
        {tipo === 'aluno' && (
          <>
            <div className="register-steps">
              <div className={`register-step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-dot">{step > 1 ? '✓' : '1'}</div>
                <span>Acesso</span>
              </div>
              <div className="register-step-line" />
              <div className={`register-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-dot">2</div>
                <span>Perfil</span>
              </div>
            </div>

            {step === 1 && (
              <form onSubmit={handleStep1Aluno} noValidate>
                <div className="field">
                  <label>Nome Completo</label>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Nome e sobrenome" className={errors.name ? 'input-error' : ''} />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="seu@email.com" className={errors.email ? 'input-error' : ''} />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="field">
                  <label>Senha</label>
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                    placeholder="Mínimo 6 caracteres" className={errors.password ? 'input-error' : ''} />
                  {errors.password && <span className="field-error">{errors.password}</span>}
                  {form.password && !errors.password && (
                    <div className="password-strength">
                      <div className={`strength-bar ${form.password.length >= 10 ? 'strong' : form.password.length >= 6 ? 'medium' : 'weak'}`} />
                      <span>{form.password.length >= 10 ? 'Forte' : form.password.length >= 6 ? 'Média' : 'Fraca'}</span>
                    </div>
                  )}
                </div>
                <div className="field">
                  <label>Confirmar Senha</label>
                  <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                    placeholder="Repita a senha" className={errors.confirm ? 'input-error' : ''} />
                  {errors.confirm && <span className="field-error">{errors.confirm}</span>}
                </div>
                <button type="submit" className="btn-login" style={{ marginTop: 8 }}>CONTINUAR →</button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmitAluno} noValidate>
                <p className="register-step-hint">Opcional — ajuda a personalizar seus treinos.</p>
                <div className="register-row">
                  <div className="field">
                    <label>Peso (kg)</label>
                    <input type="number" value={form.weight} onChange={e => set('weight', e.target.value)}
                      placeholder="Ex: 75" min="30" max="300" />
                  </div>
                  <div className="field">
                    <label>Altura (cm)</label>
                    <input type="number" value={form.height} onChange={e => set('height', e.target.value)}
                      placeholder="Ex: 175" min="100" max="250" />
                  </div>
                </div>
                <div className="field">
                  <label>Objetivo Principal</label>
                  <div className="goal-grid">
                    {GOALS.map(g => (
                      <button key={g.value} type="button"
                        className={`goal-card ${form.goal === g.value ? 'selected' : ''}`}
                        onClick={() => set('goal', g.value)}>
                        <span className="goal-label">{g.label}</span>
                        <span className="goal-desc">{g.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {apiError && <p className="login-error">{apiError}</p>}
                <div className="register-actions">
                  <button type="button" className="btn-back" onClick={() => setStep(1)}>← Voltar</button>
                  <button type="submit" className="btn-login" disabled={loading}>
                    {loading ? 'CRIANDO...' : 'CRIAR CONTA'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* ── Formulário de PERSONAL ou ADMIN ── */}
        {(tipo === 'personal' || tipo === 'admin') && (
          <form onSubmit={handleSubmitStaff} noValidate>
            <div className="field">
              <label>Nome Completo</label>
              <input type="text" value={form.nome} onChange={e => set('nome', e.target.value)}
                placeholder="Nome e sobrenome" className={errors.nome ? 'input-error' : ''} />
              {errors.nome && <span className="field-error">{errors.nome}</span>}
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder={tipo === 'admin' ? 'admin@maxfit.com' : 'personal@maxfit.com'}
                className={errors.email ? 'input-error' : ''} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="field">
              <label>Senha</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                placeholder="Mínimo 6 caracteres" className={errors.password ? 'input-error' : ''} />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="field">
              <label>Confirmar Senha</label>
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                placeholder="Repita a senha" className={errors.confirm ? 'input-error' : ''} />
              {errors.confirm && <span className="field-error">{errors.confirm}</span>}
            </div>
            {/* Código de convite apenas para Admin */}
            {tipo === 'admin' && (
              <div className="field">
                <label>Código de Convite</label>
                <input type="text" value={form.convite} onChange={e => set('convite', e.target.value)}
                  placeholder="Código exclusivo de acesso administrativo"
                  className={errors.convite ? 'input-error' : ''} />
                {errors.convite && <span className="field-error">{errors.convite}</span>}
                <span style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, display: 'block' }}>
                  Código exclusivo de acesso administrativo.
                </span>
              </div>
            )}
            {apiError && <p className="login-error">{apiError}</p>}
            <button type="submit" className="btn-login" style={{ marginTop: 8 }} disabled={loading}>
              {loading ? 'CRIANDO...' : `CRIAR CONTA ${tipo.toUpperCase()}`}
            </button>
          </form>
        )}

        <p className="login-register-link" style={{ marginTop: 20 }}>
          Já tem conta? <Link to="/login">Fazer login</Link>
        </p>
      </div>
    </div>
  );
}
