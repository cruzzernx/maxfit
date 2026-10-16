import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import { api } from '../../utils/api';
import '../../components/Layout.css';

const INTENSITY_COLORS = { Leve: '#4fc3f7', Moderada: '#ffb74d', Alta: '#ff7043', Máxima: '#f44336' };

function readSavedPlan() {
  try { return JSON.parse(localStorage.getItem('meusTreinos')) || []; }
  catch { return []; }
}

export default function UserWorkouts() {
  const { auth } = useAuth();
  const [myWorkouts, setMyWorkouts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const savedPlan = readSavedPlan();
  const hasSavedPlan = savedPlan.length > 0;

  // Busca todos os planos de treino e filtra pelo clienteId do usuário logado
  useEffect(() => {
    api.planosTreino.list()
      .then(planos => {
        const meus = planos.filter(p => p.cliente?.id === auth?.id);
        setMyWorkouts(meus);
        if (meus.length > 0) {
          setSelected(meus[0]);
        }
      })
      .catch(() => setMyWorkouts([]))
      .finally(() => setLoading(false));
  }, [auth?.id]);

  // Busca os exercícios do plano selecionado
  useEffect(() => {
    if (!selected?.id) { setExercicios([]); return; }
    api.planosTreino.listExercicios(selected.id)
      .then(setExercicios)
      .catch(() => setExercicios([]));
  }, [selected?.id]);

  return (
    <Layout role="user">
      <div className="page-header">
        <h2>Meus <span>Treinos</span></h2>
        <p>
          {loading
            ? 'Carregando...'
            : myWorkouts.length > 0
              ? `${myWorkouts.length} plano(s) no seu cadastro`
              : hasSavedPlan
                ? `${savedPlan.length} exercícios gerados pelo seu IMC`
                : 'Nenhum treino cadastrado'}
        </p>
      </div>

      {/* ── Plano gerado pelo IMC ── */}
      {hasSavedPlan && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <h3>🗒️ Plano Gerado pelo <span style={{ color: 'var(--green)' }}>IMC</span></h3>
            <span className="badge badge-green">gerado localmente</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {savedPlan.map((ex, i) => (
              <li key={i} style={{
                display: 'grid',
                gridTemplateColumns: '28px 1fr 80px 100px 55px',
                alignItems: 'center',
                gap: 10,
                padding: '12px 4px',
                borderBottom: i < savedPlan.length - 1 ? '1px solid var(--border)' : 'none',
                fontSize: 14,
              }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 12 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontWeight: 600 }}>{ex.name}</span>
                <span style={{ background: 'var(--green-dim)', color: 'var(--green)', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, textAlign: 'center' }}>
                  {ex.sets}x{ex.reps}
                </span>
                <span style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', padding: '2px 10px', borderRadius: 20, fontSize: 11, color: 'var(--text-dim)', textAlign: 'center' }}>
                  {ex.category}
                </span>
                <span style={{ color: 'var(--text-dim)', fontSize: 12, textAlign: 'right' }}>
                  {ex.rest}
                </span>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            💡 Recalcule seu IMC para atualizar este plano.
          </p>
        </div>
      )}

      {/* ── Planos do personal ── */}
      {loading ? (
        <div className="card">
          <div className="empty-state"><p>Carregando treinos...</p></div>
        </div>
      ) : myWorkouts.length === 0 && !hasSavedPlan ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🏋️</div>
            <p>Nenhum treino cadastrado ainda. Fale com seu personal!</p>
          </div>
        </div>
      ) : myWorkouts.length > 0 && (
        <>
          <div className="card-header" style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>📋 Planos do Personal</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
            {/* Lista de planos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myWorkouts.map(w => (
                <div
                  key={w.id}
                  onClick={() => setSelected(w)}
                  style={{
                    background: selected?.id === w.id ? 'var(--green-dim)' : 'var(--surface-2)',
                    border: `1px solid ${selected?.id === w.id ? 'var(--green)' : 'var(--border)'}`,
                    borderLeft: `3px solid ${selected?.id === w.id ? 'var(--green)' : 'transparent'}`,
                    borderRadius: 'var(--radius)', padding: 16, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: 14, color: selected?.id === w.id ? 'var(--green)' : 'var(--text)' }}>{w.nome}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>{w.grupoMuscular || '—'}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>{w.nivel || '—'}</p>
                </div>
              ))}
            </div>

            {/* Detalhe do plano selecionado */}
            {selected && (
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>{selected.nome}</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 4 }}>
                      <span className="badge badge-green" style={{ marginRight: 8 }}>{selected.grupoMuscular || '—'}</span>
                      {selected.nivel}
                      {selected.dataInicio && ` · Início: ${selected.dataInicio}`}
                    </p>
                  </div>
                </div>

                {selected.descricao && (
                  <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 16 }}>{selected.descricao}</p>
                )}

                {exercicios.length > 0 ? (
                  <table>
                    <thead>
                      <tr><th>#</th><th>Exercício</th><th>Tipo</th><th>Descrição</th></tr>
                    </thead>
                    <tbody>
                      {exercicios.map((item, i) => {
                        const ex = item.exercicio || item;
                        return (
                          <tr key={i}>
                            <td style={{ color: 'var(--green)', fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</td>
                            <td style={{ fontWeight: 600 }}>{ex.nome || '—'}</td>
                            <td><span className="badge badge-green">{ex.tipo || '—'}</span></td>
                            <td style={{ color: 'var(--text-dim)', fontSize: 13 }}>{ex.descricao || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state" style={{ padding: 24 }}>
                    <p style={{ fontSize: 13 }}>Nenhum exercício adicionado a este plano ainda.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
