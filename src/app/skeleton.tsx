export function SkeletonCard({ lines = 2 }: { lines?: number }) {
  return (
    <div className="apple-card px-5 py-4 space-y-2 animate-pulse">
      <div className="h-3 bg-[var(--color-divider-soft)] rounded w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-2.5 bg-[var(--color-divider-soft)] rounded"
          style={{ width: `${50 + Math.random() * 40}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3, lines = 2 }: { count?: number; lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={lines} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2.5">
          <div className="h-4 w-4 bg-[var(--color-divider-soft)] rounded" />
          <div className="h-3 bg-[var(--color-divider-soft)] rounded flex-1" />
          <div className="h-3 w-20 bg-[var(--color-divider-soft)] rounded" />
          <div className="h-3 w-32 bg-[var(--color-divider-soft)] rounded" />
        </div>
      ))}
    </div>
  );
}
