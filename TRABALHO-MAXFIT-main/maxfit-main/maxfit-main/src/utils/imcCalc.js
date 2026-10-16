// Classificação IMC
export function calcIMC(weight, height) {
  const h = height / 100;
  return +(weight / (h * h)).toFixed(1);
}

export function imcLabel(imc) {
  if (imc < 18.5) return { label: 'Abaixo do peso', color: '#4fc3f7' };
  if (imc < 25)   return { label: 'Peso normal',    color: '#39ff14' };
  if (imc < 30)   return { label: 'Sobrepeso',      color: '#ffb74d' };
  return               { label: 'Obesidade',        color: '#ff5252' };
}

// Gera sugestão completa baseada no IMC + objetivo
export function buildSuggestion(weight, height, goal) {
  const imc = calcIMC(weight, height);
  const info = imcLabel(imc);

  // TMB simplificada (Mifflin-St Jeor neutro) × fator moderado
  const tmb = Math.round((10 * weight + 6.25 * height - 5 * 30) * 1.55);

  const isLoss = goal === 'loss';

  const kcal    = isLoss ? tmb - 500  : tmb + 400;
  const protein = isLoss ? Math.round(weight * 2.2) : Math.round(weight * 2.0);
  const carbs   = isLoss ? Math.round(weight * 2.5) : Math.round(weight * 4.5);
  const fat     = Math.round(weight * 0.8);

  const workoutFocus = isLoss
    ? { label: 'Déficit + Cardio', icon: '🏃', color: '#ff7043',
        tips: ['30–45 min de cardio moderado (3–4x/semana)', 'Treino de força para preservar músculo (2–3x/semana)', 'Caminhada de 8.000 passos/dia', 'Evite carboidratos simples à noite'] }
    : { label: 'Força + Hipertrofia', icon: '🏋️', color: '#39ff14',
        tips: ['Treino de força pesado (4–5x/semana)', 'Foco em compostos: Supino, Agachamento, Levantamento Terra', 'Cardio leve apenas 1–2x/semana', 'Priorize sono de 8h para recuperação'] };

  return { imc, info, kcal, protein, carbs, fat, workoutFocus, tmb };
}

// Gera lista de exercícios para salvar em meusTreinos
export function buildWorkoutPlan(goal) {
  const isLoss = goal === 'loss';
  return isLoss
    ? [
        { name: 'Esteira',             sets: 1,  reps: '30 min',  rest: '—',   category: 'Cardio'     },
        { name: 'Agachamento Livre',   sets: 3,  reps: '15',      rest: '45s', category: 'Pernas'     },
        { name: 'Flexão de Braço',     sets: 3,  reps: '12',      rest: '45s', category: 'Peito'      },
        { name: 'Remada Curvada',      sets: 3,  reps: '12',      rest: '45s', category: 'Costas'     },
        { name: 'Prancha Abdominal',   sets: 3,  reps: '40s',     rest: '30s', category: 'Core'       },
        { name: 'Burpee',              sets: 3,  reps: '10',      rest: '60s', category: 'Cardio'     },
        { name: 'Afundo',              sets: 3,  reps: '12',      rest: '45s', category: 'Pernas'     },
        { name: 'Mountain Climber',    sets: 3,  reps: '30s',     rest: '30s', category: 'Core'       },
      ]
    : [
        { name: 'Supino Reto',         sets: 4,  reps: '8-12',    rest: '90s', category: 'Peito'      },
        { name: 'Agachamento Livre',   sets: 4,  reps: '8-10',    rest: '90s', category: 'Pernas'     },
        { name: 'Levantamento Terra',  sets: 3,  reps: '6-8',     rest: '120s',category: 'Posterior'  },
        { name: 'Puxada Frontal',      sets: 4,  reps: '8-12',    rest: '90s', category: 'Costas'     },
        { name: 'Desenvolvimento',     sets: 3,  reps: '10-12',   rest: '75s', category: 'Ombros'     },
        { name: 'Rosca Direta',        sets: 3,  reps: '10-12',   rest: '60s', category: 'Bíceps'     },
        { name: 'Tríceps Corda',       sets: 3,  reps: '12-15',   rest: '60s', category: 'Tríceps'    },
        { name: 'Leg Press',           sets: 4,  reps: '10-12',   rest: '90s', category: 'Pernas'     },
      ];
}
