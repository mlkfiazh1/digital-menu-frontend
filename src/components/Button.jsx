import { Spinner } from "./Spinner";

export function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled,
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-ember text-paper hover:bg-ember-dark shadow-[0_8px_20px_-10px_rgba(196,92,38,0.8)]",
    secondary: "bg-ink text-cream hover:bg-ink-soft",
    ghost: "bg-transparent text-ink border border-line hover:bg-white/70",
    light: "bg-paper text-ink hover:bg-white border border-line",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? <Spinner className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
