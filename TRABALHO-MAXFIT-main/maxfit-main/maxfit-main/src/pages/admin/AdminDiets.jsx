import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import ProgressBar from '../../components/ProgressBar';
import { exportDietPDF } from '../../utils/pdfExport';
import '../../components/Layout.css';
import { api } from '../../utils/api';

const emptyForm = { userId: '', name: '', goal: 'Ganho de Massa', calories: '', protein: '', carbs: '', fat: '', meals: [] };
const emptyMeal = { time: '', name: '', foods: '', calories: '', protein: '', carbs: '', fat: '' };

// Normaliza Dieta da API (nome, objetivo, calorias, cliente, refeicoes) para o formato do front
function normalizeDieta(d) {
  return {
    id:       d.id,
    userId:   d.cliente?.id ?? null,
    name:     d.nome,
    goal:     d.objetivo,
    calories: d.calorias,
    protein:  d.proteina ?? '',
    carbs:    d.carboidratos ?? '',
    fat:      d.gorduras ?? '',
    meals: (d.refeicoes || []).map(r => ({
      time:     r.horario,
      name:     r.nome,
      foods:    r.alimentos || [],
      calories: r.calorias ?? '',
      protein:  r.proteina ?? '',
      carbs:    r.carboidratos ?? '',
      fat:      r.gorduras ?? '',
    })),
  };
}

// Converte o formulário do front para o formato esperado pela API (DietaRequest)
function toPayload(form) {
  return {
    nome:         form.name,
    objetivo:     form.goal,
    calorias:     Number(form.calories),
    proteina:     form.protein ? Number(form.protein) : null,
    carboidratos: form.carbs   ? Number(form.carbs)   : null,
    gorduras:     form.fat     ? Number(form.fat)      : null,
    clienteId:    Number(form.userId),
    refeicoes: form.meals.map(m => ({
      horario:      m.time,
      nome:         m.name,
      alimentos:    typeof m.foods === 'string' ? m.foods.split(',').map(f => f.trim()) : m.foods,
      calorias:     m.calories ? Number(m.calories) : null,
      proteina:     m.protein  ? Number(m.protein)  : null,
      carboidratos: m.carbs    ? Number(m.carbs)    : null,
      gorduras:     m.fat      ? Number(m.fat)       : null,
    })),
  };
}

// Harris-Benedict
function calcTMB({ weight, height, age, sex, activity }) {
  const base = sex === 'M'
    ? 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age
    : 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;
  const factors = { sedentario: 1.2, leve: 1.375, moderado: 1.55, intenso: 1.725, muito_intenso: 1.9 };
  return Math.round(base * (factors[activity] || 1.55));
}

export default function AdminDiets() {
  const { users } = useAuth();
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [mealForm, setMealForm] = useState(emptyMeal);
  const [tmbForm, setTmbForm] = useState({ weight: '', height: '', age: '', sex: 'M', activity: 'moderado' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  useEffect(() => {
    api.dietas.list()
      .then(list => setDiets(list.map(normalizeDieta)))
      .catch(err => toast.error(err.message || 'Erro ao carregar dietas.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = diets.filter(d => {
    const name = getUserName(d.userId).toLowerCase();
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || name.includes(search.toLowerCase());
    const matchGoal = statusFilter === 'Todos' || d.goal === statusFilter;
    return matchSearch && matchGoal;
  });

  const mealTotals = form.meals.reduce((acc, m) => ({
    calories: acc.calories + Number(m.calories || 0),
    protein: acc.protein + Number(m.protein || 0),
    carbs: acc.carbs + Number(m.carbs || 0),
    fat: acc.fat + Number(m.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  function openNew() { setForm(emptyForm); setEditId(null); setMealForm(emptyMeal); setModal(true); }
  function openEdit(d) {
    setForm({ userId: d.userId, name: d.name, goal: d.goal, calories: d.calories, protein: d.protein || '', carbs: d.carbs || '', fat: d.fat || '', meals: d.meals.map(m => ({ ...m, foods: Array.isArray(m.foods) ? m.foods.join(', ') : m.foods })) });
    setEditId(d.id); setMealForm(emptyMeal); setModal(true);
  }

  function applyTMB() {
    const result = calcTMB(tmbForm);
    if (!result || isNaN(result)) { toast.error('Preencha todos os campos da TMB.'); return; }
    setForm(p => ({ ...p, calories: result }));
    toast.success(`TMB calculada: ${result} kcal/dia`);
  }

  function addMeal() {
    if (!mealForm.name || !mealForm.foods) { toast.error('Preencha nome e alimentos.'); return; }
    setForm(p => ({ ...p, meals: [...p.meals, { ...mealForm }] }));
    setMealForm(emptyMeal);
  }

  function removeMeal(i) { setForm(p => ({ ...p, meals: p.meals.filter((_, idx) => idx !== i) })); }

  async function save() {
    if (!form.name || !form.userId) { toast.error('Preencha nome e aluno.'); return; }
    try {
      const payload = toPayload(form);
      if (editId) {
        const updated = await api.dietas.update(editId, payload);
        setDiets(prev => prev.map(d => d.id === editId ? normalizeDieta(updated) : d));
        toast.success('Dieta atualizada!');
      } else {
        const created = await api.dietas.create(payload);
        setDiets(prev => [...prev, normalizeDieta(created)]);
        toast.success('Dieta cadastrada!');
      }
      setModal(false);
    } catch (err) {
      toast.error(err.message || 'Erro ao salvar dieta.');
    }
  }

  async function remove(id) {
    try {
      await api.dietas.remove(id);
      setDiets(prev => prev.filter(d => d.id !== id));
      toast.success('Dieta removida.');
    } catch (err) {
      toast.error(err.message || 'Erro ao remover dieta.');
    }
  }
  function getUserName(id) { return users.find(u => u.id === id)?.name || 'Desconhecido'; }

  return (
    <Layout role="admin">
      <div className="page-header">
        <h2>Gestão de <span>Dietas</span></h2>
        <p>{diets.length} dietas cadastradas</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input style={{ maxWidth: 220 }} placeholder="🔍 Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
            <select style={{ maxWidth: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="Todos">Todos os objetivos</option>
              <option>Ganho de Massa</option>
              <option>Perda de Gordura</option>
              <option>Manutenção</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ Nova Dieta</button>
        </div>
        <table>
          <thead>
            <tr><th>Dieta</th><th>Aluno</th><th>Objetivo</th><th>Calorias</th><th>Refeições</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600 }}>{d.name}</td>
                <td style={{ color: 'var(--text-dim)' }}>{getUserName(d.userId)}</td>
                <td><span className="badge badge-green">{d.goal}</span></td>
                <td style={{ color: 'var(--green)', fontWeight: 700 }}>{d.calories} kcal</td>
                <td>{d.meals.length}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setViewModal(d)}>👁️</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(d)}>✏️</button>
                    <button className="btn btn-primary btn-sm" onClick={() => exportDietPDF(d, getUserName(d.userId))}>📄 PDF</button>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(d.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="empty-state"><p>Carregando dietas...</p></div>}
        {!loading && filtered.length === 0 && <div className="empty-state"><div className="empty-icon">🥗</div><p>Nenhuma dieta encontrada.</p></div>}
      </div>

      {viewModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setViewModal(null)}>
          <div className="modal" style={{ maxWidth: 560 }}>
            <h3>🥗 <span>{viewModal.name}</span></h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 16 }}>
              {getUserName(viewModal.userId)} · {viewModal.goal} · {viewModal.calories} kcal/dia
            </p>
            {viewModal.meals.map((m, i) => (
              <div key={i} style={{ background: 'var(--surface-3)', borderRadius: 8, padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <b style={{ fontSize: 14 }}>{m.name}</b>
                  <span style={{ color: 'var(--green)', fontSize: 13 }}>{m.time}</span>
                </div>
                <ul style={{ paddingLeft: 16 }}>
                  {(Array.isArray(m.foods) ? m.foods : m.foods.split(',')).map((f, j) => (
                    <li key={j} style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 2 }}>{f.trim()}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => exportDietPDF(viewModal, getUserName(viewModal.userId))}>📄 Exportar PDF</button>
              <button className="btn btn-secondary" onClick={() => setViewModal(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{ maxWidth: 600 }}>
            <h3>{editId ? ' Editar' : '➕ Nova'} <span>Dieta</span></h3>

            {/* Calculadora TMB */}
            <div style={{ background: 'var(--surface-3)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, marginBottom: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>🧮 Calculadora TMB (Harris-Benedict)</h4>
              <div className="form-grid">
                <div className="field-group">
                  <label>Peso (kg)</label>
                  <input type="number" value={tmbForm.weight} onChange={e => setTmbForm(p => ({ ...p, weight: e.target.value }))} placeholder="Ex: 80" />
                </div>
                <div className="field-group">
                  <label>Altura (cm)</label>
                  <input type="number" value={tmbForm.height} onChange={e => setTmbForm(p => ({ ...p, height: e.target.value }))} placeholder="Ex: 175" />
                </div>
                <div className="field-group">
                  <label>Idade</label>
                  <input type="number" value={tmbForm.age} onChange={e => setTmbForm(p => ({ ...p, age: e.target.value }))} placeholder="Ex: 25" />
                </div>
                <div className="field-group">
                  <label>Sexo</label>
                  <select value={tmbForm.sex} onChange={e => setTmbForm(p => ({ ...p, sex: e.target.value }))}>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
                <div className="field-group full">
                  <label>Nível de Atividade</label>
                  <select value={tmbForm.activity} onChange={e => setTmbForm(p => ({ ...p, activity: e.target.value }))}>
                    <option value="sedentario">Sedentário</option>
                    <option value="leve">Levemente ativo</option>
                    <option value="moderado">Moderadamente ativo</option>
                    <option value="intenso">Muito ativo</option>
                    <option value="muito_intenso">Extremamente ativo</option>
                  </select>
                </div>
                <div className="field-group full">
                  <button className="btn btn-secondary" onClick={applyTMB}>Calcular e aplicar TMB</button>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="field-group full">
                <label>Nome da Dieta</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Dieta Bulking" />
              </div>
              <div className="field-group">
                <label>Aluno</label>
                <select value={form.userId} onChange={e => setForm(p => ({ ...p, userId: e.target.value }))}>
                  <option value="">Selecionar...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label>Objetivo</label>
                <select value={form.goal} onChange={e => setForm(p => ({ ...p, goal: e.target.value }))}>
                  <option>Ganho de Massa</option>
                  <option>Perda de Gordura</option>
                  <option>Manutenção</option>
                </select>
              </div>
              <div className="field-group">
                <label>Meta Calórica (kcal)</label>
                <input type="number" value={form.calories} onChange={e => setForm(p => ({ ...p, calories: e.target.value }))} placeholder="Ex: 2500" />
              </div>
              <div className="field-group">
                <label>Meta Proteína (g)</label>
                <input type="number" value={form.protein} onChange={e => setForm(p => ({ ...p, protein: e.target.value }))} placeholder="Ex: 180" />
              </div>
              <div className="field-group">
                <label>Meta Carboidratos (g)</label>
                <input type="number" value={form.carbs} onChange={e => setForm(p => ({ ...p, carbs: e.target.value }))} placeholder="Ex: 300" />
              </div>
              <div className="field-group">
                <label>Meta Gorduras (g)</label>
                <input type="number" value={form.fat} onChange={e => setForm(p => ({ ...p, fat: e.target.value }))} placeholder="Ex: 70" />
              </div>
            </div>

            {/* Progress bars de macros */}
            {(form.calories || form.protein || form.carbs || form.fat) && (
              <div style={{ marginTop: 16, padding: 14, background: 'var(--surface-3)', borderRadius: 8 }}>
                <h4 style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Progresso das Refeições</h4>
                {form.calories > 0 && <ProgressBar label="Calorias (kcal)" value={mealTotals.calories} max={Number(form.calories)} />}
                {form.protein > 0 && <ProgressBar label="Proteínas (g)" value={mealTotals.protein} max={Number(form.protein)} color="#4fc3f7" />}
                {form.carbs > 0 && <ProgressBar label="Carboidratos (g)" value={mealTotals.carbs} max={Number(form.carbs)} color="#ffb74d" />}
                {form.fat > 0 && <ProgressBar label="Gorduras (g)" value={mealTotals.fat} max={Number(form.fat)} color="#f06292" />}
              </div>
            )}

            <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <h4 style={{ marginBottom: 12, fontSize: 14, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>Refeições</h4>
              {form.meals.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-3)', borderRadius: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 13 }}><b>{m.time}</b> · {m.name} {m.calories ? `· ${m.calories}kcal` : ''}</span>
                  <button className="btn btn-danger btn-sm" onClick={() => removeMeal(i)}>✕</button>
                </div>
              ))}
              <div className="form-grid" style={{ marginTop: 10 }}>
                <div className="field-group">
                  <input value={mealForm.time} onChange={e => setMealForm(p => ({ ...p, time: e.target.value }))} placeholder="Horário (07:00)" />
                </div>
                <div className="field-group">
                  <input value={mealForm.name} onChange={e => setMealForm(p => ({ ...p, name: e.target.value }))} placeholder="Nome (Café da Manhã)" />
                </div>
                <div className="field-group full">
                  <input value={mealForm.foods} onChange={e => setMealForm(p => ({ ...p, foods: e.target.value }))} placeholder="Alimentos separados por vírgula" />
                </div>
                <div className="field-group">
                  <input type="number" value={mealForm.calories} onChange={e => setMealForm(p => ({ ...p, calories: e.target.value }))} placeholder="Calorias (kcal)" />
                </div>
                <div className="field-group">
                  <input type="number" value={mealForm.protein} onChange={e => setMealForm(p => ({ ...p, protein: e.target.value }))} placeholder="Proteína (g)" />
                </div>
                <div className="field-group">
                  <input type="number" value={mealForm.carbs} onChange={e => setMealForm(p => ({ ...p, carbs: e.target.value }))} placeholder="Carboidratos (g)" />
                </div>
                <div className="field-group">
                  <input type="number" value={mealForm.fat} onChange={e => setMealForm(p => ({ ...p, fat: e.target.value }))} placeholder="Gorduras (g)" />
                </div>
                <div className="field-group full">
                  <button className="btn btn-secondary" onClick={addMeal}>+ Adicionar Refeição</button>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={save}>Salvar Dieta</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
