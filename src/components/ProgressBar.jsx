const STEPS = [
  { label: "Personal", code: "PSN" },
  { label: "Academic", code: "ACD" },
  { label: "Guardian", code: "GRD" },
];

function ProgressBar({ currentStep }) {
  return (
    <div className="mb-10">
      <div className="flex items-stretch overflow-hidden rounded-lg border border-navy-800/15 bg-white/60 shadow-stub">
        {STEPS.map((step, index) => {
          const isComplete = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={step.code} className="relative flex-1">
              <div
                className={`flex h-full flex-col items-center gap-1.5 px-3 py-4 text-center transition-colors ${
                  isActive ? "bg-navy-800 text-paper" : "bg-transparent"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs ${
                    isComplete
                      ? "border-approved bg-approved text-paper"
                      : isActive
                      ? "border-gold-400 bg-gold-500 text-navy-950"
                      : "border-navy-800/25 text-navy-800/50"
                  }`}
                >
                  {isComplete ? "✓" : index + 1}
                </span>
                <span
                  className={`text-xs font-semibold uppercase tracking-widest ${
                    isActive ? "text-paper" : "text-navy-800/70"
                  }`}
                >
                  {step.label}
                </span>
                <span
                  className={`font-mono text-[10px] tracking-widest ${
                    isActive ? "text-paper/60" : "text-navy-800/30"
                  }`}
                >
                  {step.code}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div className="perforated absolute right-0 top-0 z-10 h-full w-px" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;
