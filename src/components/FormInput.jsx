import { useState } from "react";

function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  as = "input",
  options = [],
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const baseClasses =
    "w-full rounded-md border bg-white/70 px-3 py-2.5 text-ink placeholder:text-ink/30 transition-colors focus:bg-white focus:outline-none";
  const borderClasses = error
    ? "border-rejected focus:border-rejected"
    : "border-navy-800/15 focus:border-gold-500";

  const inputType = type === "password" && passwordVisible ? "text" : type;

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-800">
        {label}
      </span>

      {as === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${borderClasses}`}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${baseClasses} ${borderClasses} ${
              type === "password" ? "pr-16" : ""
            }`}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={() => setPasswordVisible((visible) => !visible)}
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              aria-pressed={passwordVisible}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-navy-800"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          )}
        </div>
      )}

      {error && (
        <span className="mt-1 block text-xs font-medium text-rejected">
          {error}
        </span>
      )}
    </label>
  );
}

export default FormInput;
