export function Field({
  id,
  label,
  hint,
  error,
  as = "input",
  className = "",
  ...props
}) {
  const Control = as;

  return (
    <label className="block space-y-1.5" htmlFor={id}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <Control
        id={id}
        className={`w-full rounded-xl border bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-ember focus:ring-2 focus:ring-ember/20 ${
          error ? "border-red-400" : "border-line"
        } ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
      {!error && hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}
