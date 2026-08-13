const STYLES = {
  Pending: {
    text: "text-pending",
    border: "border-pending",
    rotate: "-rotate-2",
  },
  Approved: {
    text: "text-approved",
    border: "border-approved",
    rotate: "rotate-1",
  },
  Rejected: {
    text: "text-rejected",
    border: "border-rejected",
    rotate: "-rotate-1",
  },
};

function StatusBadge({ status, size = "md" }) {
  const style = STYLES[status] || STYLES.Pending;
  const sizeClasses =
    size === "lg" ? "px-5 py-2 text-base" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-block rounded border-2 border-dashed font-display font-semibold uppercase tracking-widest ${style.text} ${style.border} ${style.rotate} ${sizeClasses}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
