export default function ProgressBar({ value, max, label, color = 'var(--green)' }) {
  const pct = Math.min(100, Math.round((value / max) * 100)) || 0;
  const over = pct >= 100;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: 'var(--text-dim)' }}>
        <span>{label}</span>
        <span style={{ color: over ? 'var(--green)' : 'var(--text-dim)' }}>{value} / {max} ({pct}%)</span>
      </div>
      <div style={{ background: 'var(--surface-3)', borderRadius: 4, height: 8 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: over ? 'var(--green)' : color, borderRadius: 4, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}
