import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDiet } from '../../contexts/DietContext';
import Layout from '../../components/Layout';
import '../../components/Layout.css';
import { api } from '../../utils/api';

// Normaliza Dieta da API (nome, objetivo, calorias, refeicoes) para o formato usado nesta tela
function normalizeDieta(d) {
  return {
    name:     d.nome,
    goal:     d.objetivo,
    calories: d.calorias,
    protein:  d.proteina,
    carbs:    d.carboidratos,
    fat:      d.gorduras,
    meals: (d.refeicoes || []).map(r => ({
      time:     r.horario,
      name:     r.nome,
      foods:    r.alimentos || [],
      calories: r.calorias,
      protein:  r.proteina  || 0,
      carbs:    r.carboidratos || 0,
      fat:      r.gorduras  || 0,
    })),
  };
}

const MACRO_COLORS = {
  protein: '#4fc3f7',
  carbs:   '#ffb74d',
  fat:     '#f06292',
};

const CATEGORY_COLORS = [
  'var(--green)', '#4fc3f7', '#ffb74d', '#f06292', '#b39ddb', '#80cbc4',
];

function MacroBar({ label, value, max, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
        <span style={{ color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{value}g</span>
      </div>
      <div style={{ background: 'var(--surface-4)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function MealCard({ meal, index }) {
  const accent = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  const totalMacroKcal = meal.protein * 4 + meal.carbs * 4 + meal.fat * 9;

  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${accent}`,
      borderRadius: 'var(--radius)',
      padding: '20px 20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 2,
              color: accent, textTransform: 'uppercase',
            }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h4 style={{ fontSize: 15, fontWeight: 700, letterSpacing: 0.5 }}>{meal.name}</h4>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{meal.time}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: accent, lineHeight: 1 }}>
            {meal.calories ?? totalMacroKcal}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: 1, textTransform: 'uppercase' }}>kcal</div>
        </div>
      </div>

      {/* Alimentos */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {meal.foods.map((food, i) => (
          <span key={i} style={{
            background: 'var(--surface-3)',
            border: '1px solid var(--border)',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            color: 'var(--text-dim)',
          }}>
            {food}
          </span>
        ))}
      </div>

      {/* Macros inline */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8, paddingTop: 12,
        borderTop: '1px solid var(--border)',
      }}>
        {[
          { label: 'PROT', value: meal.protein, color: MACRO_COLORS.protein },
          { label: 'CARB', value: meal.carbs,   color: MACRO_COLORS.carbs   },
          { label: 'GORD', value: meal.fat,     color: MACRO_COLORS.fat     },
        ].map(m => (
          <div key={m.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.value}g</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: 1, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UserDiet() {
  const { auth } = useAuth();
  const { diet: contextDiet } = useDiet();
  const [apiDiet, setApiDiet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiet = auth?.id ? api.dietas.findByCliente(auth.id) : Promise.resolve([]);
    fetchDiet
      .then(list => setApiDiet(list.length > 0 ? normalizeDieta(list[0]) : null))
      .catch(() => setApiDiet(null))
      .finally(() => setLoading(false));
  }, [auth?.id]);

  // Prioridade: DietContext (gerado pelo IMC) → dieta cadastrada pelo personal na API
  const diet = contextDiet || apiDiet;

  if (loading) return (
    <Layout role="user">
      <div className="page-header">
        <h2>Minha <span>Dieta</span></h2>
        <p>Carregando...</p>
      </div>
    </Layout>
  );

  if (!diet) return (
    <Layout role="user">
      <div className="page-header">
        <h2>Minha <span>Dieta</span></h2>
        <p>Nenhum plano encontrado</p>
      </div>
      <div className="card">
        <div className="empty-state" style={{ padding: 40 }}>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Calcule seu IMC na tela inicial para gerar um plano automaticamente,
            ou aguarde seu personal cadastrar uma dieta.
          </p>
        </div>
      </div>
    </Layout>
  );

  const totalP = diet.meals.reduce((a, m) => a + (m.protein || 0), 0);
  const totalC = diet.meals.reduce((a, m) => a + (m.carbs   || 0), 0);
  const totalF = diet.meals.reduce((a, m) => a + (m.fat     || 0), 0);

  const source = contextDiet ? 'Gerado pelo IMC' : 'Plano do Personal';

  return (
    <Layout role="user">
      <div className="page-header">
        <h2>Minha <span>Dieta</span></h2>
        <p style={{ textTransform: 'capitalize' }}>{diet.name} · {diet.goal}</p>
      </div>

      {/* Resumo do dia */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12, marginBottom: 24,
      }}>
        {[
          { label: 'CALORIAS',     value: diet.calories, unit: 'kcal', color: 'var(--green)'       },
          { label: 'PROTEÍNA',     value: totalP,        unit: 'g',    color: MACRO_COLORS.protein  },
          { label: 'CARBOIDRATOS', value: totalC,        unit: 'g',    color: MACRO_COLORS.carbs    },
          { label: 'GORDURAS',     value: totalF,        unit: 'g',    color: MACRO_COLORS.fat      },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '18px 14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 3 }}>{s.unit}</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: 'var(--text-dim)', marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16, alignItems: 'start' }}>

        {/* Cards de refeições */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {diet.meals.map((meal, i) => (
            <MealCard key={i} meal={meal} index={i} />
          ))}
        </div>

        {/* Painel lateral de macros */}
        <div style={{
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: 20, position: 'sticky', top: 20,
        }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
              Distribuição
            </h3>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
              color: 'var(--green)', border: '1px solid var(--green)',
              padding: '2px 8px', borderRadius: 4,
            }}>
              {source.toUpperCase()}
            </span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--green)', lineHeight: 1 }}>{diet.calories}</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4, letterSpacing: 1 }}>KCAL / DIA</div>
          </div>

          <MacroBar label="Proteína"     value={totalP} max={diet.protein || totalP} color={MACRO_COLORS.protein} />
          <MacroBar label="Carboidratos" value={totalC} max={diet.carbs   || totalC} color={MACRO_COLORS.carbs}   />
          <MacroBar label="Gorduras"     value={totalF} max={diet.fat     || totalF} color={MACRO_COLORS.fat}     />

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>
              Por Macronutriente
            </div>
            {[
              { label: 'Proteína',     g: totalP, kcal: totalP * 4, color: MACRO_COLORS.protein },
              { label: 'Carboidratos', g: totalC, kcal: totalC * 4, color: MACRO_COLORS.carbs   },
              { label: 'Gorduras',     g: totalF, kcal: totalF * 9, color: MACRO_COLORS.fat     },
            ].map(m => (
              <div key={m.label} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 8, fontSize: 13,
              }}>
                <span style={{ color: m.color, fontWeight: 600 }}>{m.label}</span>
                <span style={{ color: 'var(--text-dim)' }}>{m.g}g · {m.kcal} kcal</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
