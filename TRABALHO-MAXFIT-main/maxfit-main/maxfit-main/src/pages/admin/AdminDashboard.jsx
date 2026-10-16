import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import Layout from '../../components/Layout';
import { SkeletonCard } from '../../components/Skeleton';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import '../../components/Layout.css';
import '../../components/Skeleton.css';
import './AdminDashboard.css';

const ENROLLMENT_DATA = [
  { mes: 'Jan', alunos: 12 }, { mes: 'Fev', alunos: 19 }, { mes: 'Mar', alunos: 25 },
  { mes: 'Abr', alunos: 31 }, { mes: 'Mai', alunos: 38 }, { mes: 'Jun', alunos: 44 },
];

/* ── Ícones SVG inline ─────────────────────────────────────────── */
const IcoUsers = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IcoUserCheck = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <polyline points="17 11 19 13 23 9"/>
  </svg>
);

const IcoDumbbell = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 9h12M6 15h12"/>
  </svg>
);

const IcoBox = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"/>
    <rect x="1" y="3" width="22" height="5"/>
    <line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
);

/* ── Componente ────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const { users }   = useAuth();
  const navigate    = useNavigate();
  const [loading, setLoading]       = useState(true);
  const [totalPlanos, setTotalPlanos] = useState(0);
  const [products, setProducts]     = useState([]);

  useEffect(() => {
    Promise.all([
      api.planosTreino.list().catch(() => []),
      api.produtos.list().catch(() => []),
    ]).then(([planos, produtos]) => {
      setTotalPlanos(planos.length);
      setProducts(produtos.map(p => ({ id: p.id, name: p.nome, stock: p.estoque })));
    }).finally(() => setTimeout(() => setLoading(false), 800));
  }, []);

  const activeUsers = users.filter(u => u.status === 'active').length;
  const lowStock    = products.filter(p => p.stock < 10);
  const recentUsers = [...users].slice(-4).reverse();

  const stats = [
    { icon: <IcoUsers />,     label: 'Total de Alunos',  value: users.length,    highlight: true  },
    { icon: <IcoUserCheck />, label: 'Alunos Ativos',    value: activeUsers,     highlight: false },
    { icon: <IcoDumbbell />,  label: 'Planos de Treino', value: totalPlanos,     highlight: false },
    { icon: <IcoBox />,       label: 'Produtos',         value: products.length, highlight: false },
  ];

  return (
    <Layout role="admin">
      <div className="dashboard-wrap">

        <div className="page-header">
          <h2>Painel <span>Administrativo</span></h2>
          <p>Visao geral do sistema MaxFit</p>
        </div>

        <div className="dash-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/admin/register/personal')}>
            Cadastrar Personal
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/register/admin')}>
            Cadastrar Administrador
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/users')}>
            Gerenciar Alunos
          </button>
        </div>

        {/* Stat cards */}
        <div className="dash-stats">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : stats.map(s => (
              <div key={s.label} className={`dash-stat${s.highlight ? ' dash-stat--highlight' : ''}`}>
                <div className="dash-stat-top">
                  <span className="dash-stat-label">{s.label}</span>
                  <div className="dash-stat-icon">{s.icon}</div>
                </div>
                <div className="dash-stat-bottom">
                  <span className="dash-stat-value">{s.value}</span>
                  {s.highlight && <span className="dash-stat-sub">cadastrados</span>}
                </div>
              </div>
            ))
          }
        </div>

        {/* Alerta de estoque critico */}
        {lowStock.length > 0 && (
          <div className="dash-alert">
            <h3>
              Estoque Critico
              <span style={{ color: '#F87171', fontWeight: 400 }}> — abaixo de 10 unidades</span>
            </h3>
            <div className="dash-alert-tags">
              {lowStock.map(p => (
                <span key={p.id} className="dash-alert-tag">
                  {p.name} <b>{p.stock} un.</b>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Grafico — largura total */}
        <div className="dash-chart-card">
          <div className="card-header">
            <h3>Crescimento de Matriculas</h3>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={ENROLLMENT_DATA} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="mes"
                tick={{ fill: '#4b5a6e', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#4b5a6e', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#0c1118',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 8,
                  color: '#dde3ec',
                  fontSize: 13,
                }}
                cursor={{ stroke: 'rgba(16,185,129,0.12)', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="alunos"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#10B981', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grid inferior */}
        <div className="dash-bottom">
          <div className="dash-bottom-card">
            <div className="card-header"><h3>Alunos Recentes</h3></div>
            <table>
              <thead>
                <tr><th>Nome</th><th>Plano</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{u.avatar}</div>
                        {u.name}
                      </div>
                    </td>
                    <td><span className="badge badge-gray">{u.plan}</span></td>
                    <td>
                      <span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                        {u.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dash-bottom-card">
            <div className="card-header"><h3>Planos de Treino</h3></div>
            <div className="dash-plans-count">
              <div className="dash-plans-number">{totalPlanos}</div>
              <div className="dash-plans-label">planos cadastrados</div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
