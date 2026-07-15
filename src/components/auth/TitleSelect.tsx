export const TITLE_OPTIONS = ["Mr", "Mrs", "Miss", "Ms", "Mx", "Dr", "Prof"] as const;

interface TitleSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  compact?: boolean;
}

export function TitleSelect({ value, onChange, required = true, compact = false }: TitleSelectProps) {
  const labelClass = compact
    ? "block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5"
    : "block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2";
  const selectClass = compact
    ? "w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary"
    : "w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary";
  return (
    <div>
      <label className={labelClass}>Title</label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        <option value="" disabled>Select</option>
        {TITLE_OPTIONS.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}
