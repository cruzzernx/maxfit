const BASE = 'http://localhost:8080/api/v1';

// Recupera o token salvo no localStorage
function getToken() {
  return localStorage.getItem('access_token');
}

// Monta os headers padrão, incluindo JWT quando disponível
function headers(extra = {}) {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: headers(),
    ...options,
  });

  if (res.status === 204) return null; // No Content

  if (!res.ok) {
    let msg = `Erro ${res.status}`;
    try {
      const body = await res.json();
      // Backend usa formatos diferentes: "erro" (handlers de segurança),
      // "messages" (ControllerAdvice), "message"/"error" (genérico)
      msg = body.message || body.error || body.erro
        || (Array.isArray(body.messages) ? body.messages.join(' ') : null)
        || msg;
    } catch { /* ignora parse error */ }
    throw new Error(msg);
  }

  return res.json();
}

export const api = {

  // ── Autenticação ─────────────────────────────────────────────────
  auth: {
    // POST /api/v1/auth/authenticate → { access_token, refresh_token }
    login: (email, password) =>
      req('/auth/authenticate', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    // POST /api/v1/clientes → cadastra aluno e já retorna token
    registerCliente: (data) =>
      req('/clientes', {
        method: 'POST',
        body: JSON.stringify({
          nome: data.name,          // API usa "nome", não "name"
          email: data.email,
          password: data.password,
        }),
      }),

    // POST /api/v1/personals → cadastra personal (requer código de convite validado antes)
    registerPersonal: (data) =>
      req('/personals', {
        method: 'POST',
        body: JSON.stringify({ nome: data.nome, email: data.email, password: data.password }),
      }),

    // POST /api/v1/admins → cadastra admin (requer código de convite validado antes)
    registerAdmin: (data) =>
      req('/admins', {
        method: 'POST',
        body: JSON.stringify({ nome: data.nome, email: data.email, password: data.password }),
      }),

    // POST /api/v1/convite/validar → valida código de convite
    validarConvite: (tipo, codigo) =>
      req('/convite/validar', {
        method: 'POST',
        body: JSON.stringify({ tipo, codigo }),
      }),
  },

  // ── Clientes (alunos) ─────────────────────────────────────────────
  clientes: {
    list:   ()           => req('/clientes'),
    findById: (id)       => req(`/clientes/${id}`),
    create: (data)       => req('/clientes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)   => req(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id)         => req(`/clientes/${id}`, { method: 'DELETE' }),
  },

  // ── Admins ────────────────────────────────────────────────────────
  admins: {
    list:   ()           => req('/admins'),
    findById: (id)       => req(`/admins/${id}`),
    create: (data)       => req('/admins', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)   => req(`/admins/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id)         => req(`/admins/${id}`, { method: 'DELETE' }),
  },

  // ── Personais ─────────────────────────────────────────────────────
  personais: {
    list:   ()           => req('/personals'),
    findById: (id)       => req(`/personals/${id}`),
    create: (data)       => req('/personals', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)   => req(`/personals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id)         => req(`/personals/${id}`, { method: 'DELETE' }),
  },

  // ── Exercícios ────────────────────────────────────────────────────
  exercicios: {
    list:   ()           => req('/exercicios'),
    findById: (id)       => req(`/exercicios/${id}`),
    create: (data)       => req('/exercicios', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)   => req(`/exercicios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id)         => req(`/exercicios/${id}`, { method: 'DELETE' }),
  },

  // ── Planos de Treino ──────────────────────────────────────────────
  planosTreino: {
    list:      ()              => req('/planotreinos'),
    findById:  (id)            => req(`/planotreinos/${id}`),
    create:    (data)          => req('/planotreinos', { method: 'POST', body: JSON.stringify(data) }),
    update:    (id, data)      => req(`/planotreinos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove:    (id)            => req(`/planotreinos/${id}`, { method: 'DELETE' }),
    // Exercícios dentro do plano
    addExercicio:    (planoId, exercicioId) =>
      req(`/planotreinos/${planoId}/exercicios/${exercicioId}`, { method: 'POST' }),
    removeExercicio: (planoId, exercicioId) =>
      req(`/planotreinos/${planoId}/exercicios/${exercicioId}`, { method: 'DELETE' }),
    listExercicios:  (planoId) =>
      req(`/planotreinos/${planoId}/exercicios`),
  },

  // ── Funcionários ──────────────────────────────────────────────────
  funcionarios: {
    list:     ()           => req('/funcionarios'),
    findById: (id)         => req(`/funcionarios/${id}`),
    create:   (data)       => req('/funcionarios', { method: 'POST', body: JSON.stringify(data) }),
    update:   (id, data)   => req(`/funcionarios/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove:   (id)         => req(`/funcionarios/${id}`, { method: 'DELETE' }),
  },

  // ── Dietas ────────────────────────────────────────────────────────
  dietas: {
    list:        ()           => req('/dietas'),
    findById:    (id)         => req(`/dietas/${id}`),
    findByCliente: (clienteId) => req(`/dietas/cliente/${clienteId}`),
    create:      (data)       => req('/dietas', { method: 'POST', body: JSON.stringify(data) }),
    update:      (id, data)   => req(`/dietas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove:      (id)         => req(`/dietas/${id}`, { method: 'DELETE' }),
  },

  // ── Produtos ──────────────────────────────────────────────────────
  produtos: {
    list:     ()           => req('/produtos'),
    findById: (id)         => req(`/produtos/${id}`),
    create:   (data)       => req('/produtos', { method: 'POST', body: JSON.stringify(data) }),
    update:   (id, data)   => req(`/produtos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove:   (id)         => req(`/produtos/${id}`, { method: 'DELETE' }),
  },
};
