import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';
import '../../components/Layout.css';

const INITIAL = { nome: '', email: '', password: '', confirm: '' };

function validate(form) {
  const errors = {};
  if (!form.nome.trim()) errors.nome = 'Nome obrigatório.';
  else if (form.nome.trim().split(' ').length < 2) errors.nome = 'Informe nome e sobrenome.';
  if (!form.email.trim()) errors.email = 'Email obrigatório.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email inválido.';
  if (!form.password) errors.password = 'Senha obrigatória.';
  else if (form.password.length < 6) errors.password = 'Mínimo 6 caracteres.';
  if (form.confirm !== form.password) errors.confirm = 'As senhas não coincidem.';
  return errors;
}

export default function RegisterAdmin() {
  const [form, setForm]       = useState(INITIAL);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  function set(field, value) {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.admins.create({
        nome:     form.nome.trim(),
        email:    form.email.trim(),
        password: form.password,
      });
      toast.success(`Admin "${form.nome}" cadastrado com sucesso!`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Erro ao cadastrar administrador.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout role="admin">
      <div className="page-header">
        <h2>Cadastrar <span>Administrador</span></h2>
        <p>Novo usuário com acesso total ao sistema</p>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        <div style={{
          background: 'rgba(255,59,59,0.08)',
          border: '1px solid rgba(255,59,59,0.3)',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 20,
          fontSize: 13,
          color: 'var(--red)',
        }}>
           Administradores têm acesso total ao sistema. Cadastre com cautela.
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="field-group full">
              <label>Nome Completo *</label>
              <input
                value={form.nome}
                onChange={e => set('nome', e.target.value)}
                placeholder="Nome e sobrenome"
                className={errors.nome ? 'input-error' : ''}
              />
              {errors.nome && <span className="field-error">{errors.nome}</span>}
            </div>

            <div className="field-group full">
              <label>Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="admin@maxfit.com"
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="field-group">
              <label>Senha *</label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="field-group">
              <label>Confirmar Senha *</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
                placeholder="Repita a senha"
                className={errors.confirm ? 'input-error' : ''}
              />
              {errors.confirm && <span className="field-error">{errors.confirm}</span>}
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: 24 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/admin')}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Administrador'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
