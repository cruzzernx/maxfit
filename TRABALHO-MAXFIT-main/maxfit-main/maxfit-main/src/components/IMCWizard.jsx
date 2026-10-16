import { useState } from 'react';
import { calcIMC, imcLabel, buildSuggestion, buildWorkoutPlan } from '../utils/imcCalc';
import { buildPlanFromMacros } from '../utils/planBuilder';
import { useDiet } from '../contexts/DietContext';
import './IMCWizard.css';

const STORAGE_KEY    = 'mf-imc-result';
const WORKOUTS_KEY   = 'meusTreinos';

export default function IMCWizard({ userName }) {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; } })();

  const [step, setStep]     = useState(saved ? 'result' : 'form');
  const [weight, setWeight] = useState(saved?.weight || '');
  const [height, setHeight] = useState(saved?.height || '');
  const [goal, setGoal]     = useState(saved?.goal   || '');
  const [result, setResult] = useState(saved || null);
  const [error, setError]   = useState('');

  const { saveDiet } = useDiet();

  function handleCalc() {
    const w = Number(weight), h = Number(height);
    if (!w || !h || !goal)          { setError('Preencha todos os campos.'); return; }
    if (w < 30 || w > 300)          { setError('Peso inválido.'); return; }
    if (h < 100 || h > 250)         { setError('Altura inválida.'); return; }
    setError('');
    const data = { ...buildSuggestion(w, h, goal), weight: w, height: h, goal };
    setResult(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Salva plano de treinos em meusTreinos
    const plan = buildWorkoutPlan(goal);
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(plan));
    // Persiste dieta gerada no DietContext → disponível em /dashboard/diet
    const { diet } = buildPlanFromMacros({ protein: data.protein, carbs: data.carbs, fat: data.fat, kcal: data.kcal });
    saveDiet(diet);
    setStep('result');
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WORKOUTS_KEY);
    setStep('form'); setResult(null); setWeight(''); setHeight(''); setGoal('');
  }

  // ── Formulário ────────────────────────────────────────────────
  if (step === 'form') return (
    <div className="imc-wizard imc-wizard--form">
      <div className="imc-wizard__header">
        <span className="imc-wizard__icon">📊</span>
        <div>
          <h3>Calculadora de IMC</h3>
          <p>Receba um plano personalizado para você, {userName?.split(' ')[0]}</p>
        </div>
      </div>

      <div className="imc-wizard__fields">
        <div className="imc-field">
          <label>Peso</label>
          <div className="imc-input-wrap">
            <input type="number" placeholder="Ex: 80" value={weight} onChange={e => setWeight(e.target.value)} min="30" max="300" />
            <span>kg</span>
          </div>
        </div>
        <div className="imc-field">
          <label>Altura</label>
          <div className="imc-input-wrap">
            <input type="number" placeholder="Ex: 175" value={height} onChange={e => setHeight(e.target.value)} min="100" max="250" />
            <span>cm</span>
          </div>
        </div>
      </div>

      <div className="imc-wizard__goals">
        <p className="imc-goals-label">Qual é o seu objetivo?</p>
        <div className="imc-goals-row">
          <button className={`imc-goal-btn ${goal === 'loss' ? 'active' : ''}`} onClick={() => setGoal('loss')}>
            <span>🏃</span> Perder Peso
          </button>
          <button className={`imc-goal-btn ${goal === 'gain' ? 'active' : ''}`} onClick={() => setGoal('gain')}>
            <span>🏋️</span> Ganhar Massa
          </button>
        </div>
      </div>

      {error && <p className="imc-error">{error}</p>}

      <button className="imc-calc-btn" onClick={handleCalc}>
        Calcular e ver meu plano →
      </button>
    </div>
  );

  // ── Resultado ─────────────────────────────────────────────────
  const { imc, info, kcal, protein, carbs, fat, workoutFocus } = result;
  const savedPlan = (() => { try { return JSON.parse(localStorage.getItem(WORKOUTS_KEY)) || []; } catch { return []; } })();

  return (
    <div className="imc-wizard imc-wizard--result">

      {/* Cabeçalho do resultado */}
      <div className="imc-result-header">
        <div className="imc-result-title">
          <span className="imc-wizard__icon">{workoutFocus.icon}</span>
          <div>
            <h3>Seu Plano Personalizado</h3>
            <p>Baseado no seu IMC e objetivo</p>
          </div>
        </div>
        <button className="imc-reset-btn" onClick={reset} title="Recalcular">↺ Recalcular</button>
      </div>

      {/* IMC */}
      <div className="imc-score-row">
        <div className="imc-score-card">
          <div className="imc-score-value" style={{ color: info.color }}>{imc}</div>
          <div className="imc-score-label">IMC</div>
          <span className="imc-badge" style={{ background: info.color + '22', color: info.color }}>{info.label}</span>
        </div>

        {/* Régua visual do IMC */}
        <div className="imc-ruler-wrap">
          <div className="imc-ruler">
            <div className="imc-ruler-fill" style={{ '--imc-pct': `${Math.min(100, ((imc - 10) / 30) * 100)}%`, '--imc-color': info.color }} />
            <div className="imc-ruler-marker" style={{ left: `${Math.min(96, ((imc - 10) / 30) * 100)}%` }} />
          </div>
          <div className="imc-ruler-labels">
            <span>Abaixo</span><span>Normal</span><span>Sobrepeso</span><span>Obesidade</span>
          </div>
        </div>
      </div>

      {/* Calorias e macros */}
      <div className="imc-macros-grid">
        <div className="imc-macro-card imc-macro-card--kcal">
          <div className="imc-macro-value">{kcal}</div>
          <div className="imc-macro-label">kcal / dia</div>
        </div>
        <div className="imc-macro-card">
          <div className="imc-macro-value" style={{ color: '#4fc3f7' }}>{protein}g</div>
          <div className="imc-macro-label">Proteína</div>
        </div>
        <div className="imc-macro-card">
          <div className="imc-macro-value" style={{ color: '#ffb74d' }}>{carbs}g</div>
          <div className="imc-macro-label">Carboidratos</div>
        </div>
        <div className="imc-macro-card">
          <div className="imc-macro-value" style={{ color: '#f06292' }}>{fat}g</div>
          <div className="imc-macro-label">Gorduras</div>
        </div>
      </div>

      {/* Foco do treino */}
      <div className="imc-workout-focus" style={{ borderColor: workoutFocus.color + '44' }}>
        <div className="imc-workout-focus-title" style={{ color: workoutFocus.color }}>
          {workoutFocus.icon} Foco: {workoutFocus.label}
        </div>
        <ul className="imc-tips">
          {workoutFocus.tips.map((tip, i) => (
            <li key={i}><span style={{ color: workoutFocus.color }}>✓</span> {tip}</li>
          ))}
        </ul>
      </div>

      {/* Lista de exercícios gerados */}
      <div className="imc-plan-section">
        <div className="imc-plan-header">
          <span style={{ color: workoutFocus.color }}>🗒️ Plano de Treinos Gerado</span>
          <span className="imc-plan-hint">Visível em &quot;Meus Treinos&quot;</span>
        </div>
        <ul className="imc-plan-list">
          {savedPlan.map((ex, i) => (
            <li key={i} className="imc-plan-item">
              <span className="imc-plan-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="imc-plan-name">{ex.name}</span>
              <span className="imc-plan-detail">{ex.sets}x{ex.reps}</span>
              <span className="imc-plan-cat" style={{ color: workoutFocus.color }}>{ex.category}</span>
              <span className="imc-plan-rest">{ex.rest}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
