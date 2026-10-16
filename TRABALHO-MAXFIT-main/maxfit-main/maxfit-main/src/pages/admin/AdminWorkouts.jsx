import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import { exportWorkoutPDF } from '../../utils/pdfExport';
import '../../components/Layout.css';
import { api } from '../../utils/api';

const emptyForm = { clienteId: '', personalId: '', nome: '', descricao: '', grupoMuscular: '', nivel: 'Iniciante', status: 'ATIVO', dataInicio: '', dataFim: '' };
const NIVEIS = ['Iniciante', 'Intermediário', 'Avançado'];

// Normaliza PlanoTreino da API para o formato que o front usa
function normalizePlano(p) {
  return {
    id:           p.id,
    name:         p.nome,
    descricao:    p.descricao,
    clienteId:    p.cliente?.id  || null,
    personalId:   p.personal?.id || null,
    clienteNome:  p.cliente?.nome  || 'Sem aluno',
    personalNome: p.personal?.nome || 'Sem personal',
    categoria:    p.grupoMuscular || '—',
    nivel:        p.nivel || '—',
    status:       p.status || 'ATIVO',
    dataInicio:   p.dataInicio || '',
    dataFim:      p.dataFim || '',
  };
}

export default function AdminWorkouts() {
  const { users, auth } = useAuth();
  const isPersonal = auth?.role === 'personal';

  const [workouts, setWorkouts] = useState([]);
  const [personais, setPersonais] = useState([]);
  const [allExercicios, setAllExercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [planExercicios, setPlanExercicios] = useState([]);
  const [selectedExercicioId, setSelectedExercicioId] = useState('');
  const [newExercicio, setNewExercicio] = useState({ nome: '', tipo: '' });
  // Se for personal, pré-seleciona ele mesmo no formulário
  const [form, setForm] = useState({ ...emptyForm, personalId: isPersonal ? (auth?.id || '') : '' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Todos');

  // Carrega planos de treino, personais e o catálogo de exercícios da API
  useEffect(() => {
    Promise.all([
      api.planosTreino.list(),
      api.personais.list().catch(() => []), // personal pode não ter permissão de listar todos
      api.exercicios.list().catch(() => []),
    ])
      .then(([planos, pers, exs]) => {
        setWorkouts(planos.map(normalizePlano));
        setPersonais(pers);
        setAllExercicios(exs);
      })
      .catch(() => toast.error('Erro ao carregar treinos. A API está rodando?'))
      .finally(() => setLoading(false));
  }, []);

  // Carrega os exercícios já anexados ao plano aberto no modal de visualização
  function openView(w) {
    setViewModal(w);
    setSelectedExercicioId('');
    setNewExercicio({ nome: '', tipo: '' });
    api.planosTreino.listExercicios(w.id)
      .then(setPlanExercicios)
      .catch(() => setPlanExercicios([]));
  }

  async function addExistingExercicio() {
    if (!selectedExercicioId) { toast.error('Selecione um exercício.'); return; }
    try {
      await api.planosTreino.addExercicio(viewModal.id, Number(selectedExercicioId));
      setPlanExercicios(await api.planosTreino.listExercicios(viewModal.id));
      setSelectedExercicioId('');
      toast.success('Exercício adicionado ao plano!');
    } catch (err) {
      toast.error(err.message || 'Erro ao adicionar exercício.');
    }
  }

  async function createAndAddExercicio() {
    if (!newExercicio.nome.trim()) { toast.error('Informe o nome do exercício.'); return; }
    try {
      const created = await api.exercicios.create({ nome: newExercicio.nome, tipo: newExercicio.tipo });
      setAllExercicios(prev => [...prev, created]);
      await api.planosTreino.addExercicio(viewModal.id, created.id);
      setPlanExercicios(await api.planosTreino.listExercicios(viewModal.id));
      setNewExercicio({ nome: '', tipo: '' });
      toast.success('Exercício criado e adicionado!');
    } catch (err) {
      toast.error(err.message || 'Erro ao criar exercício.');
    }
  }

  async function removeExercicioFromPlan(exercicioId) {
    try {
      await api.planosTreino.removeExercicio(viewModal.id, exercicioId);
      setPlanExercicios(prev => prev.filter(pe => pe.exercicio?.id !== exercicioId));
      toast.success('Exercício removido do plano.');
    } catch (err) {
      toast.error(err.message || 'Erro ao remover exercício.');
    }
  }

  // Atualiza o personalId no form quando auth carrega
  useEffect(() => {
    if (isPersonal && auth?.id) {
      setForm(prev => ({ ...prev, personalId: auth.id }));
    }
  }, [isPersonal, auth?.id]);

  const filtered = workouts.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.clienteNome.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'Todos' || w.categoria === catFilter;
    return matchSearch && matchCat;
  });

  function openNew() {
    setForm({ ...emptyForm, personalId: isPersonal ? (auth?.id || '') : '' });
    setEditId(null);
    setModal(true);
  }
  function openEdit(w) {
    setForm({
      clienteId:    w.clienteId  || '',
      personalId:   w.personalId || '',
      nome:         w.name,
      descricao:    w.descricao  || '',
      grupoMuscular: w.categoria || '',
      nivel:        w.nivel      || 'Iniciante',
      status:       w.status     || 'ATIVO',
      dataInicio:   w.dataInicio || '',
      dataFim:      w.dataFim    || '',
    });
    setEditId(w.id);
    setModal(true);
  }

  async function save() {
    if (!form.nome || !form.personalId) {
      toast.error('Preencha nome e personal.');
      return;
    }
    const payload = {
      nome:          form.nome,
      descricao:     form.descricao,
      grupoMuscular: form.grupoMuscular,
      nivel:         form.nivel,
      status:        form.status,
      dataInicio:    form.dataInicio || null,
      dataFim:       form.dataFim    || null,
      personalId:    Number(form.personalId),
      clienteId:     form.clienteId ? Number(form.clienteId) : null,
    };
    try {
      if (editId) {
        const updated = await api.planosTreino.update(editId, payload);
        setWorkouts(prev => prev.map(w => w.id === editId ? normalizePlano(updated) : w));
        toast.success('Treino atualizado!');
      } else {
        const created = await api.planosTreino.create(payload);
        setWorkouts(prev => [...prev, normalizePlano(created)]);
        toast.success('Treino cadastrado!');
      }
      setModal(false);
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar treino.');
    }
  }

  async function remove(id) {
    try {
      await api.planosTreino.remove(id);
      setWorkouts(prev => prev.filter(w => w.id !== id));
      toast.success('Treino removido.');
    } catch (err) {
      toast.error(err.message || 'Erro ao remover.');
    }
  }

  // Exportação — busca os exercícios do plano (já em cache se o modal de visualização estiver aberto)
  async function handleExport(w) {
    let exList = (viewModal?.id === w.id) ? planExercicios : [];
    if (viewModal?.id !== w.id) {
      try { exList = await api.planosTreino.listExercicios(w.id); } catch { exList = []; }
    }
    const fakeWorkout = {
      name:      w.name,
      category:  w.categoria,
      days:      [],
      exercises: exList.map(e => ({
        name:      e.exercicio?.nome || '—',
        sets:      '—',
        reps:      '—',
        rest:      '—',
        intensity: '—',
      })),
    };
    exportWorkoutPDF(fakeWorkout, w.clienteNome);
  }

  return (
    <Layout role="admin">
      <div className="page-header">
        <h2>Gestão de <span>Treinos</span></h2>
        <p>{workouts.length} planos cadastrados</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              style={{ maxWidth: 220 }}
              placeholder=" Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select style={{ maxWidth: 180 }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              <option value="Todos">Todos os grupos</option>
              <option>Peito</option>
              <option>Costas</option>
              <option>Pernas</option>
              <option>Ombros</option>
              <option>Braços</option>
              <option>Full Body</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ Novo Plano</button>
        </div>

        {loading ? (
          <div className="empty-state"><p>Carregando treinos...</p></div>
        ) : (
          <table>
            <thead>
              <tr><th>Plano</th><th>Aluno</th><th>Personal</th><th>Grupo Muscular</th><th>Nível</th><th>Status</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id}>
                  <td style={{ fontWeight: 600 }}>{w.name}</td>
                  <td style={{ color: 'var(--text-dim)' }}>{w.clienteNome}</td>
                  <td style={{ color: 'var(--text-dim)' }}>{w.personalNome}</td>
                  <td><span className="badge badge-green">{w.categoria}</span></td>
                  <td style={{ color: 'var(--text-dim)', fontSize: 13 }}>{w.nivel}</td>
                  <td>
                    <span className={`badge ${w.status === 'ATIVO' ? 'badge-green' : 'badge-red'}`}>
                      {w.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openView(w)}>👁️</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(w)}>✏️</button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleExport(w)}>📄 PDF</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(w.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <div className="empty-state"><div className="empty-icon"></div><p>Nenhum plano encontrado.</p></div>
        )}
      </div>

      {/* Modal de visualização */}
      {viewModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setViewModal(null)}>
          <div className="modal" style={{ maxWidth: 560 }}>
            <h3>🏋️ <span>{viewModal.name}</span></h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 8 }}>
              Aluno: {viewModal.clienteNome} · Personal: {viewModal.personalNome}
            </p>
            <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 16 }}>
              {viewModal.categoria} · {viewModal.nivel} · {viewModal.status}
            </p>
            {viewModal.descricao && (
              <p style={{ fontSize: 13, marginBottom: 16 }}>{viewModal.descricao}</p>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, marginBottom: 14 }}>
              <h4 style={{ fontSize: 13, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                Exercícios do Plano
              </h4>

              {planExercicios.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 12 }}>Nenhum exercício adicionado ainda.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px' }}>
                  {planExercicios.map(pe => (
                    <li key={pe.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-3)', borderRadius: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 13 }}>
                        <b>{pe.exercicio?.nome || '—'}</b> {pe.exercicio?.tipo && `· ${pe.exercicio.tipo}`}
                      </span>
                      <button className="btn btn-danger btn-sm" onClick={() => removeExercicioFromPlan(pe.exercicio?.id)}>✕</button>
                    </li>
                  ))}
                </ul>
              )}

              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <select style={{ flex: 1 }} value={selectedExercicioId} onChange={e => setSelectedExercicioId(e.target.value)}>
                  <option value="">Selecionar exercício existente...</option>
                  {allExercicios.map(ex => <option key={ex.id} value={ex.id}>{ex.nome}</option>)}
                </select>
                <button className="btn btn-secondary btn-sm" onClick={addExistingExercicio}>+ Adicionar</button>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  style={{ flex: 1 }}
                  placeholder="Novo exercício (nome)"
                  value={newExercicio.nome}
                  onChange={e => setNewExercicio(p => ({ ...p, nome: e.target.value }))}
                />
                <input
                  style={{ width: 120 }}
                  placeholder="Tipo"
                  value={newExercicio.tipo}
                  onChange={e => setNewExercicio(p => ({ ...p, tipo: e.target.value }))}
                />
                <button className="btn btn-secondary btn-sm" onClick={createAndAddExercicio}>+ Criar e Adicionar</button>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => handleExport(viewModal)}>📄 Exportar PDF</button>
              <button className="btn btn-secondary" onClick={() => setViewModal(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de criação/edição */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{ maxWidth: 580 }}>
            <h3>{editId ? ' Editar' : '➕ Novo'} <span>Plano de Treino</span></h3>
            <div className="form-grid">
              <div className="field-group full">
                <label>Nome do Plano</label>
                <input
                  value={form.nome}
                  onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                  placeholder="Ex: Plano Hipertrofia A"
                />
              </div>
              <div className="field-group full">
                <label>Descrição</label>
                <input
                  value={form.descricao}
                  onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
                  placeholder="Descrição opcional"
                />
              </div>
              <div className="field-group">
                <label>Aluno</label>
                <select value={form.clienteId} onChange={e => setForm(p => ({ ...p, clienteId: e.target.value }))}>
                  <option value="">Sem aluno (aberto)</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label>Personal *</label>
                {isPersonal ? (
                  <input value={auth?.name || 'Você'} disabled style={{ background: 'var(--surface-3)', color: 'var(--text-dim)' }} />
                ) : (
                  <select value={form.personalId} onChange={e => setForm(p => ({ ...p, personalId: e.target.value }))}>
                    <option value="">Selecionar...</option>
                    {personais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                  </select>
                )}
              </div>
              <div className="field-group">
                <label>Grupo Muscular</label>
                <input
                  value={form.grupoMuscular}
                  onChange={e => setForm(p => ({ ...p, grupoMuscular: e.target.value }))}
                  placeholder="Ex: Peito, Costas, Full Body"
                />
              </div>
              <div className="field-group">
                <label>Nível</label>
                <select value={form.nivel} onChange={e => setForm(p => ({ ...p, nivel: e.target.value }))}>
                  {NIVEIS.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                </select>
              </div>
              <div className="field-group">
                <label>Data de Início</label>
                <input
                  type="date"
                  value={form.dataInicio}
                  onChange={e => setForm(p => ({ ...p, dataInicio: e.target.value }))}
                />
              </div>
              <div className="field-group">
                <label>Data de Fim</label>
                <input
                  type="date"
                  value={form.dataFim}
                  onChange={e => setForm(p => ({ ...p, dataFim: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={save}>Salvar Plano</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
