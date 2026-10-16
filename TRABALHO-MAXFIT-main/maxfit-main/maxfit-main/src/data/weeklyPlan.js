/**
 * Rotina semanal com os exercícios do dashboard MaxFit.
 * Dois formatos disponíveis: ABC (3 dias distintos) e Full Body (3x/semana).
 * Cada exercício segue o schema usado em UserWorkouts e db.json.
 */

export const ABC_PLAN = {
  id: 'abc-plan',
  name: 'Rotina ABC',
  category: 'Condicionamento',
  days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
  sessions: [
    {
      label: 'A',
      days: ['Segunda', 'Quinta'],
      focus: 'Cardio + Core',
      exercises: [
        { name: 'Esteira',           sets: 1, reps: '30 min', rest: '—',   category: 'Cardio',  intensity: 'Moderada', obs: 'Velocidade 6–8 km/h' },
        { name: 'Burpee',            sets: 4, reps: '12',     rest: '60s', category: 'Cardio',  intensity: 'Alta',     obs: 'Explosão no salto'  },
        { name: 'Mountain Climber',  sets: 4, reps: '40s',    rest: '30s', category: 'Core',    intensity: 'Alta',     obs: 'Quadril nivelado'   },
        { name: 'Prancha Abdominal', sets: 4, reps: '45s',    rest: '30s', category: 'Core',    intensity: 'Moderada', obs: 'Respiração contínua' },
      ],
    },
    {
      label: 'B',
      days: ['Terça', 'Sexta'],
      focus: 'Membros Inferiores',
      exercises: [
        { name: 'Agachamento Livre', sets: 4, reps: '12',  rest: '60s', category: 'Pernas', intensity: 'Alta',     obs: 'Joelhos alinhados'  },
        { name: 'Afundo',            sets: 3, reps: '12',  rest: '45s', category: 'Pernas', intensity: 'Moderada', obs: '6 reps cada perna'  },
        { name: 'Prancha Abdominal', sets: 3, reps: '40s', rest: '30s', category: 'Core',   intensity: 'Leve',     obs: 'Finalizador'        },
        { name: 'Mountain Climber',  sets: 3, reps: '30s', rest: '30s', category: 'Core',   intensity: 'Moderada', obs: 'Finalizador'        },
      ],
    },
    {
      label: 'C',
      days: ['Quarta'],
      focus: 'Membros Superiores',
      exercises: [
        { name: 'Flexão de Braço',   sets: 4, reps: '15',  rest: '45s', category: 'Peito',  intensity: 'Moderada', obs: 'Amplitude completa' },
        { name: 'Remada Curvada',    sets: 4, reps: '12',  rest: '60s', category: 'Costas', intensity: 'Alta',     obs: 'Costas retas'       },
        { name: 'Burpee',            sets: 3, reps: '10',  rest: '60s', category: 'Cardio', intensity: 'Máxima',   obs: 'Finalizador HIIT'   },
        { name: 'Prancha Abdominal', sets: 3, reps: '45s', rest: '30s', category: 'Core',   intensity: 'Leve',     obs: 'Finalizador'        },
      ],
    },
  ],
};

export const FULL_BODY_PLAN = {
  id: 'fullbody-plan',
  name: 'Full Body',
  category: 'Condicionamento',
  days: ['Segunda', 'Quarta', 'Sexta'],
  sessions: [
    {
      label: 'Full',
      days: ['Segunda', 'Quarta', 'Sexta'],
      focus: 'Corpo Inteiro',
      exercises: [
        { name: 'Esteira',           sets: 1, reps: '20 min', rest: '—',   category: 'Cardio',  intensity: 'Leve',     obs: 'Aquecimento'        },
        { name: 'Agachamento Livre', sets: 3, reps: '15',     rest: '60s', category: 'Pernas',  intensity: 'Moderada', obs: 'Joelhos alinhados'  },
        { name: 'Flexão de Braço',   sets: 3, reps: '12',     rest: '45s', category: 'Peito',   intensity: 'Moderada', obs: 'Amplitude completa' },
        { name: 'Remada Curvada',    sets: 3, reps: '12',     rest: '60s', category: 'Costas',  intensity: 'Moderada', obs: 'Costas retas'       },
        { name: 'Afundo',            sets: 3, reps: '10',     rest: '45s', category: 'Pernas',  intensity: 'Moderada', obs: '5 reps cada perna'  },
        { name: 'Prancha Abdominal', sets: 3, reps: '40s',    rest: '30s', category: 'Core',    intensity: 'Leve',     obs: 'Respiração contínua'},
        { name: 'Burpee',            sets: 3, reps: '10',     rest: '60s', category: 'Cardio',  intensity: 'Alta',     obs: 'Explosão no salto'  },
        { name: 'Mountain Climber',  sets: 3, reps: '30s',    rest: '30s', category: 'Core',    intensity: 'Alta',     obs: 'Quadril nivelado'   },
      ],
    },
  ],
};
