import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-bg"><div className="home-overlay" /></div>
      <ThemeToggle variant="floating" />

      <nav className="home-nav">
        <div className="home-nav-logo">
          <span></span> MAX<span className="green">FIT</span>
        </div>
        <div className="home-nav-actions">
          <button className="btn-ghost" onClick={() => navigate('/login')}>Entrar</button>
          <button className="btn-cta" onClick={() => navigate('/register')}>Cadastrar</button>
        </div>
      </nav>

      <main className="home-main">
        <div className="home-hero">
          <span className="home-badge"> PLATAFORMA DE GESTÃO FITNESS</span>
          <h1 className="home-title">
            DISCIPLINA.<br />
            FORÇA.<br />
            <span className="green">RESULTADO.</span>
          </h1>
          <p className="home-subtitle">
            Gerencie treinos, acompanhe alunos e evolua com inteligência.
            A plataforma completa para academias e profissionais de educação física.
          </p>
          <div className="home-cta-group">
            <button className="btn-cta-lg" onClick={() => navigate('/register')}>
              Começar agora →
            </button>
            <button className="btn-ghost-lg" onClick={() => navigate('/login')}>
              Já tenho conta
            </button>
          </div>
        </div>

        <div className="home-features">
          {[
            { icon: '', title: 'Planos de Treino', desc: 'Crie e gerencie planos personalizados para cada aluno.' },
            { icon: '', title: 'Nutrição',          desc: 'Calcule TMB e monte dietas com controle de macros.' },
            { icon: '', title: 'Dashboard',          desc: 'Acompanhe a evolução dos alunos em tempo real.' },
            { icon: '', title: 'Loja',               desc: 'Venda suplementos e produtos direto pela plataforma.' },
          ].map(f => (
            <div key={f.title} className="home-feature-card">
              <div className="home-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="home-roles">
          <h2>Para cada perfil, uma experiência</h2>
          <div className="home-roles-grid">
            {[
              { role: 'Aluno',    icon: '', desc: 'Acesse seus treinos, dieta e evolução pessoal.',     action: () => navigate('/register'), label: 'Cadastrar como Aluno'    },
              { role: 'Personal', icon: '', desc: 'Gerencie alunos, crie planos e acompanhe resultados.', action: () => navigate('/register?tipo=personal'), label: 'Cadastrar como Personal' },
              { role: 'Admin',    icon: '',  desc: 'Controle total da academia: usuários, produtos e mais.', action: () => navigate('/register?tipo=admin'), label: 'Acesso Admin'            },
            ].map(r => (
              <div key={r.role} className="home-role-card">
                <span className="home-role-icon">{r.icon}</span>
                <h3>{r.role}</h3>
                <p>{r.desc}</p>
                <button className="btn-role" onClick={r.action}>{r.label}</button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <p>© 2027 MaxFit · Plataforma de gestão fitness</p>
      </footer>
    </div>
  );
}
