export function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-navy-800/70">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy-800/20 border-t-navy-800" />
      <span className="font-mono text-sm tracking-wide">{label}</span>
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-md border border-rejected/40 bg-rejected/10 px-4 py-3">
      <p className="text-sm font-medium text-rejected">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 text-xs font-semibold uppercase tracking-wide text-rejected underline underline-offset-2"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-navy-800/20 bg-white/50 px-6 py-16 text-center">
      <p className="font-display text-lg text-navy-800">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm text-navy-800/60">
          {description}
        </p>
      )}
    </div>
  );
}
