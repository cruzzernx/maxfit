/**
 * buildPlanFromMacros(macros)
 *
 * Recebe os macros calculados (protein, carbs, fat, kcal) e retorna
 * um objeto { workout, diet } pronto para mapear nos componentes do Dashboard.
 *
 * @param {{ protein: number, carbs: number, fat: number, kcal: number }} macros
 * @returns {{ workout: object, diet: object }}
 *
 * Exemplo de uso:
 *   const plan = buildPlanFromMacros({ protein: 266, carbs: 303, fat: 97, kcal: 3097 });
 *   plan.workout.exercises  → array de exercícios
 *   plan.diet.meals         → array de 6 refeições
 */
export function buildPlanFromMacros({ protein = 266, carbs = 303, fat = 97, kcal = 3097 }) {
  const workout = buildWorkout();
  const diet    = buildDiet({ protein, carbs, fat, kcal });
  return { workout, diet };
}

// ─── Treino ──────────────────────────────────────────────────────────────────

function buildWorkout() {
  return {
    name: 'Full Body — Dashboard',
    category: 'Condicionamento',
    days: ['Segunda', 'Quarta', 'Sexta'],
    exercises: [
      { name: 'Esteira',           sets: 1, reps: '30 min', rest: '—',   category: 'Cardio',  intensity: 'Moderada', obs: 'Velocidade 6–8 km/h'  },
      { name: 'Agachamento Livre', sets: 4, reps: '12',     rest: '60s', category: 'Pernas',  intensity: 'Alta',     obs: 'Joelhos alinhados'    },
      { name: 'Flexão de Braço',   sets: 4, reps: '15',     rest: '45s', category: 'Peito',   intensity: 'Moderada', obs: 'Amplitude completa'   },
      { name: 'Remada Curvada',    sets: 4, reps: '12',     rest: '60s', category: 'Costas',  intensity: 'Alta',     obs: 'Costas retas'         },
      { name: 'Prancha Abdominal', sets: 4, reps: '45s',    rest: '30s', category: 'Core',    intensity: 'Moderada', obs: 'Respiração contínua'  },
      { name: 'Burpee',            sets: 3, reps: '12',     rest: '60s', category: 'Cardio',  intensity: 'Alta',     obs: 'Explosão no salto'    },
      { name: 'Afundo',            sets: 3, reps: '12',     rest: '45s', category: 'Pernas',  intensity: 'Moderada', obs: '6 reps cada perna'    },
      { name: 'Mountain Climber',  sets: 3, reps: '40s',    rest: '30s', category: 'Core',    intensity: 'Alta',     obs: 'Quadril nivelado'     },
    ],
  };
}

// ─── Dieta ───────────────────────────────────────────────────────────────────

/**
 * Plano de 6 refeições que totaliza exatamente os macros informados.
 * Distribuição por refeição (% do total):
 *   Café        20% P | 18% C | 15% G
 *   Lanche 1    12% P | 10% C |  8% G
 *   Almoço      25% P | 28% C | 22% G
 *   Pré-Treino  13% P | 22% C |  8% G
 *   Jantar      22% P | 18% C | 30% G
 *   Ceia         8% P |  4% C | 17% G
 *
 * Os valores são arredondados e o resíduo é absorvido pelo Almoço.
 */
function buildDiet({ protein, carbs, fat, kcal }) {
  const dist = [
    { pct: [0.20, 0.18, 0.15] },
    { pct: [0.12, 0.10, 0.08] },
    { pct: [0.25, 0.28, 0.22] },
    { pct: [0.13, 0.22, 0.08] },
    { pct: [0.22, 0.18, 0.30] },
    { pct: [0.08, 0.04, 0.17] },
  ];

  const templates = [
    {
      time: '07:00', name: 'Café da Manhã',
      foods: ['4 ovos mexidos (200g)', '80g aveia com leite desnatado', '1 banana média (100g)', '200ml leite desnatado'],
    },
    {
      time: '10:00', name: 'Lanche da Manhã',
      foods: ['1 scoop whey protein (30g)', '150g iogurte grego natural', '30g granola sem açúcar'],
    },
    {
      time: '13:00', name: 'Almoço',
      foods: ['200g frango grelhado', '150g arroz integral cozido', '100g feijão carioca', '100g batata doce cozida', 'Salada verde à vontade'],
    },
    {
      time: '16:30', name: 'Pré-Treino',
      foods: ['1 scoop whey protein (30g)', '1 banana média (100g)', '40g aveia em flocos', '200ml água de coco'],
    },
    {
      time: '20:00', name: 'Jantar',
      foods: ['180g patinho moído grelhado', '120g batata doce assada', '2 ovos cozidos', 'Legumes refogados no azeite (150g)'],
    },
    {
      time: '22:30', name: 'Ceia',
      foods: ['200g cottage light', '30g castanha-do-pará (4 unidades)', '1 colher de pasta de amendoim (15g)'],
    },
  ];

  const meals = templates.map((tpl, i) => {
    const [pp, pc, pf] = dist[i].pct;
    const p = Math.round(protein * pp);
    const c = Math.round(carbs   * pc);
    const f = Math.round(fat     * pf);
    return {
      time:     tpl.time,
      name:     tpl.name,
      foods:    tpl.foods,
      protein:  p,
      carbs:    c,
      fat:      f,
      calories: Math.round(p * 4 + c * 4 + f * 9),
    };
  });

  // Ajuste de resíduo no Almoço (índice 2) para bater o total exato
  const sumP = meals.reduce((a, m) => a + m.protein, 0);
  const sumC = meals.reduce((a, m) => a + m.carbs,   0);
  const sumF = meals.reduce((a, m) => a + m.fat,     0);
  meals[2].protein += protein - sumP;
  meals[2].carbs   += carbs   - sumC;
  meals[2].fat     += fat     - sumF;
  meals[2].calories = Math.round(meals[2].protein * 4 + meals[2].carbs * 4 + meals[2].fat * 9);

  return {
    name:    'Plano Gerado — Dashboard',
    goal:    'Condicionamento',
    calories: kcal,
    protein,
    carbs,
    fat,
    meals,
  };
}
