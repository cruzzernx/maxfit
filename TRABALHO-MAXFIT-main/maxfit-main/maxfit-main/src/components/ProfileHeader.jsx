import { useRef } from 'react';
import { useTheme, ACCENT_COLORS } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePro } from '../contexts/ProContext';
import './ProfileHeader.css';

/** Mapeia o role técnico para um label legível em PT-BR */
function roleLabel(role) {
  switch (role) {
    case 'admin':      return 'Administrador';
    case 'personal':   return 'Personal Trainer';
    case 'funcionario': return 'Funcionário';
    default:           return 'Aluno';
  }
}

export default function ProfileHeader() {
  const { avatar, changeAvatar, accentId, changeAccent } = useTheme();
  const { auth } = useAuth();
  const { isPro } = usePro();
  const inputRef = useRef(null);

  const initials = auth?.name
    ? auth.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const currentRole = auth?.role || 'user';
  const currentRoleLabel = roleLabel(currentRole);

  return (
    <div className="profile-header">
      {/* Foto de perfil */}
      <div className="profile-avatar-wrap" onClick={() => inputRef.current.click()} title="Clique para trocar a foto">
        {avatar
          ? <img src={avatar} alt="Foto de perfil" className="profile-avatar-img" />
          : <div className="profile-avatar-initials">{initials}</div>
        }
        <div className="profile-avatar-overlay">📷</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => changeAvatar(e.target.files[0])}
        />
      </div>

      <div className="profile-info">
        <p className="profile-name">{auth?.name}</p>
        {isPro
          ? <span className="profile-pro-badge">MEMBRO PRO</span>
          : <p className={`profile-role profile-role--${currentRole}`}>{currentRoleLabel}</p>
        }
      </div>

      {/* Seletor de cor de acento — oculto no PRO */}
      {!isPro && (
        <div className="accent-picker" title="Cor do tema">
          {ACCENT_COLORS.map(color => (
            <button
              key={color.id}
              className={`accent-dot ${accentId === color.id ? 'accent-dot--active' : ''}`}
              style={{ '--dot-color': color.hex }}
              onClick={() => changeAccent(color.id)}
              title={color.label}
              aria-label={`Tema ${color.label}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
