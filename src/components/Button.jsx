const variants = {
  primary:
    "bg-navy-800 text-paper hover:bg-navy-900 disabled:bg-navy-800/40",
  gold: "bg-gold-500 text-navy-950 hover:bg-gold-400 disabled:bg-gold-500/40",
  ghost:
    "bg-transparent text-navy-800 border border-navy-800/20 hover:bg-navy-800/5",
  danger: "bg-rejected text-paper hover:bg-rejected/85 disabled:bg-rejected/40",
};

function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
