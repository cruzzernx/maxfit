import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePro } from '../../contexts/ProContext';
import Layout from '../../components/Layout';
import IMCWizard from '../../components/IMCWizard';
import UpgradeCard from '../../components/UpgradeCard';
import { api } from '../../utils/api';
import '../../components/Layout.css';

export default function UserDashboard() {
  const { auth } = useAuth();
  const { isPro } = usePro();
  const [myWorkouts, setMyWorkouts] = useState([]);
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  useEffect(() => {
    if (!auth?.id) return;
    api.planosTreino.list()
      .then(planos => setMyWorkouts(planos.filter(p => p.cliente?.id === auth.id)))
      .catch(() => {});
  }, [auth?.id]);

  const stats = [
    { label: 'Planos de Treino', value: myWorkouts.length },
    { label: 'Plano',            value: isPro ? 'PRO' : (auth?.plan || 'Basic') },
    { label: 'Membro desde',     value: auth?.joined, small: true },
  ];

  return (
    <Layout role="user">
      <div className="page-header">
        <h2>{auth?.name?.split(' ')[0]}<span style={{ fontWeight: 300 }}>, bem-vindo.</span></h2>
        <p style={{ textTransform: 'capitalize' }}>{today}</p>
      </div>

      <UpgradeCard />
      <IMCWizard userName={auth?.name} />

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-info">
              <p>{s.label}</p>
              <h3 style={s.small ? { fontSize: 16 } : undefined}>
                {s.value}
                {s.label === 'Plano' && isPro && (
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#D4AF37', border: '1px solid #D4AF37', padding: '1px 6px', borderRadius: 4, marginLeft: 8 }}>PRO</span>
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {myWorkouts.length > 0 && (
        <div className="card">
          <div className="card-header"><h3>SEUS PLANOS</h3></div>
          {myWorkouts.slice(0, 3).map(w => (
            <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{w.nome}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>{w.grupoMuscular || w.nivel || '—'}</span>
            </div>
          ))}
          {myWorkouts.length > 3 && (
            <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 10 }}>+{myWorkouts.length - 3} planos</p>
          )}
        </div>
      )}
    </Layout>
  );
}
