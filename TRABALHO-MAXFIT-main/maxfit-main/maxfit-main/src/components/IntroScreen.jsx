import { useEffect, useState } from 'react';
import { ACCENT_COLORS } from '../contexts/ThemeContext';
import './IntroScreen.css';

export default function IntroScreen({ userName, onDone }) {
  const [phase, setPhase] = useState('enter'); // 'enter' | 'exit'

  // Lê a cor salva ANTES do React montar qualquer contexto
  const accentId = localStorage.getItem('mf-accent') || 'green';
  const accent = ACCENT_COLORS.find(c => c.id === accentId) || ACCENT_COLORS[0];

  useEffect(() => {
    // 2.8s visível → inicia fade-out → 0.6s depois chama onDone
    const exitTimer  = setTimeout(() => setPhase('exit'), 2800);
    const doneTimer  = setTimeout(onDone, 3400);
    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div className={`intro ${phase}`} style={{ '--accent': accent.hex, '--accent-dim': accent.dim }}>
      {/* Glow radial na cor do tema */}
      <div className="intro-glow" />

      {/* Logotipo */}
      <div className="intro-logo">
        <span className="intro-bolt">⚡</span>
        <span>MAX<b>FIT</b></span>
      </div>

      {/* Saudação */}
      <h1 className="intro-welcome">
        Bem-vindo,&nbsp;<span className="intro-name">{userName}</span>
      </h1>

      {/* Spinner */}
      <div className="intro-spinner-wrap">
        <div className="intro-spinner" />
        <p className="intro-loading-text">Carregando seu perfil...</p>
      </div>

      {/* Barra de progresso */}
      <div className="intro-bar-track">
        <div className="intro-bar-fill" />
      </div>
    </div>
  );
}
