import './Skeleton.css';

export function SkeletonRow({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}><div className="skeleton skeleton-text" /></td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <div className="skeleton skeleton-circle" />
      <div className="skeleton skeleton-text" style={{ width: '60%' }} />
      <div className="skeleton skeleton-text" style={{ width: '40%' }} />
    </div>
  );
}
