import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import { SkeletonRow } from '../../components/Skeleton';
import '../../components/Layout.css';
import '../../components/Skeleton.css';

const empty = { name: '', email: '', password: '', plan: 'Basic', status: 'active' };
const emptyEdit = { name: '', email: '', plan: 'Basic', status: 'active' };
const PAGE_SIZE = 8;

export default function AdminUsers() {
  const { users, addUser, updateUser, removeUser } = useAuth();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || (statusFilter === 'Ativo' ? u.status === 'active' : u.status === 'inactive');
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openNew() { setForm(empty); setEditId(null); setModal(true); }
  function openEdit(u) { setForm({ name: u.name, email: u.email, plan: u.plan, status: u.status }); setEditId(u.id); setModal(true); }

  async function save() {
    if (!form.name || !form.email) { toast.error('Preencha nome e email.'); return; }
    if (!editId && !form.password) { toast.error('Informe a senha para novo aluno.'); return; }
    setLoading(true);
    try {
      if (editId) {
        await updateUser(editId, form);
        toast.success('Aluno atualizado!');
      } else {
        const initials = form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        await addUser({ ...form, role: 'user', joined: new Date().toISOString().slice(0, 10), avatar: initials });
        toast.success('Aluno cadastrado!');
      }
      setModal(false);
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar. A API está rodando?');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    try {
      await removeUser(id);
      toast.success('Aluno removido.');
    } catch {
      toast.error('Erro ao remover.');
    }
  }

  async function toggleStatus(id) {
    const user = users.find(u => u.id === id);
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await updateUser(id, { status: newStatus });
      toast.success('Status atualizado.');
    } catch {
      toast.error('Erro ao atualizar status.');
    }
  }

  return (
    <Layout role="admin">
      <div className="page-header">
        <h2>Gestão de <span>Usuários</span></h2>
        <p>{users.length} alunos cadastrados</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input style={{ maxWidth: 240 }} placeholder=" Buscar aluno..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            <select style={{ maxWidth: 160 }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="Todos">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ Novo Aluno</button>
        </div>

        <table>
          <thead>
            <tr><th>Aluno</th><th>Email</th><th>Plano</th><th>Cadastro</th><th>Status</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
              : paginated.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{u.avatar}</div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-dim)' }}>{u.email}</td>
                  <td><span className="badge badge-gray">{u.plan}</span></td>
                  <td style={{ color: 'var(--text-dim)', fontSize: 13 }}>{u.joined}</td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-red'}`} style={{ cursor: 'pointer' }} onClick={() => toggleStatus(u.id)} title="Clique para alternar">
                      {u.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}> Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(u.id)}></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>

        {filtered.length === 0 && <div className="empty-state"><div className="empty-icon">👥</div><p>Nenhum aluno encontrado.</p></div>}

        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', padding: '16px 0' }}>
            <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹ Anterior</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="btn btn-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Próximo ›</button>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <h3>{editId ? '✏️ Editar' : '➕ Novo'} <span>Aluno</span></h3>
            <div className="form-grid">
              <div className="field-group full">
                <label>Nome Completo</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nome do aluno" />
              </div>
              <div className="field-group full">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@exemplo.com" />
              </div>
              <div className="field-group">
                <label>Senha {editId ? '(não alterável aqui)' : '*'}</label>
                {!editId && (
                  <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••" />
                )}
                {editId && (
                  <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Para alterar a senha, o aluno deve usar a opção de recuperação de conta.</p>
                )}
              </div>
              <div className="field-group">
                <label>Plano</label>
                <select value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))}>
                  <option>Basic</option>
                  <option>Premium</option>
                </select>
              </div>
              <div className="field-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={save}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
