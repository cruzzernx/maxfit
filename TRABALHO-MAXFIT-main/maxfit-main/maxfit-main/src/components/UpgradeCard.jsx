import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePro } from '../contexts/ProContext';
import './UpgradeCard.css';

export default function UpgradeCard() {
  const { isPro, upgradeToPro, downgrade } = usePro();
  const [modal, setModal]   = useState(false);
  const [banner, setBanner] = useState(false); // true | 'out'
  const navigate = useNavigate();

  useEffect(() => {
    if (!banner) return;
    // 1.4s visível → inicia saída
    const outTimer = setTimeout(() => setBanner('out'), 1400);
    // 2.0s → remove do DOM e navega
    const endTimer = setTimeout(() => {
      setBanner(false);
      // Garante body limpo antes de navegar
      document.body.style.overflow = '';
      navigate('/dashboard');
    }, 2000);
    return () => { clearTimeout(outTimer); clearTimeout(endTimer); };
  }, [banner, navigate]);

  function confirm() {
    upgradeToPro();
    setModal(false);
    setBanner(true);
  }

  if (isPro) return (
    <div className="upgrade-card upgrade-card--active">
      <div className="upgrade-card__left">
        <span className="pro-seal">PRO</span>
        <div>
          <p className="upgrade-card__title">MAXFIT PRO — ATIVO</p>
          <p className="upgrade-card__sub">Acesso completo a protocolos de elite e suporte avançado.</p>
        </div>
      </div>
      <button className="upgrade-btn upgrade-btn--cancel" onClick={downgrade}>
        Cancelar assinatura
      </button>
    </div>
  );

  return (
    <>
      {/* Banner de sucesso flutuante — não bloqueia o dashboard */}
      {banner && (
        <div className={`pro-banner ${banner === 'out' ? 'pro-banner--out' : ''}`}>
          <span className="pro-banner__check">&#10003;</span>
          <div>
            <p className="pro-banner__title">MAXFIT PRO ATIVADO</p>
            <p className="pro-banner__sub">Obrigado pela sua compra. Preparando seu acesso...</p>
          </div>
        </div>
      )}

      <div className="upgrade-card">
        <div className="upgrade-card__left">
          <div className="upgrade-card__badge">PRO</div>
          <div>
            <p className="upgrade-card__title">MAXFIT PRO</p>
            <p className="upgrade-card__sub">
              Acesse protocolos de elite e suporte avançado por{' '}
              <strong>R$ 19,90 mensais</strong>
            </p>
          </div>
        </div>
        <button className="upgrade-btn" onClick={() => setModal(true)}>
          ASSINAR
        </button>
      </div>

      {modal && (
        <div className="upgrade-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="upgrade-modal">
            <p className="upgrade-modal__label">CONFIRMAÇÃO DE ASSINATURA</p>
            <h2 className="upgrade-modal__title">MAXFIT PRO</h2>

            <div className="upgrade-modal__price">
              <span className="upgrade-modal__currency">R$</span>
              <span className="upgrade-modal__amount">19</span>
              <span className="upgrade-modal__cents">,90<span>/mês</span></span>
            </div>

            <ul className="upgrade-modal__features">
              <li><span className="feature-check">+</span> Macros detalhados: Proteína, Carboidrato, Gordura</li>
              <li><span className="feature-check">+</span> Divisão de treino atleta A/B/C/D/E</li>
              <li><span className="feature-check">+</span> Protocolos de periodização avançada</li>
              <li><span className="feature-check">+</span> Suporte prioritário com instrutor</li>
              <li><span className="feature-check">+</span> Paleta PRO — Preto Fosco e Dourado</li>
            </ul>

            <div className="upgrade-modal__divider" />

            <p className="upgrade-modal__disclaimer">
              Simulação de checkout. Nenhuma cobrança real será efetuada.
              O status será salvo em <code>localStorage → planStatus</code>.
            </p>

            <div className="upgrade-modal__actions">
              <button className="upgrade-btn upgrade-btn--ghost" onClick={() => setModal(false)}>
                CANCELAR
              </button>
              <button className="upgrade-btn upgrade-btn--confirm" onClick={confirm}>
                CONFIRMAR ASSINATURA
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
