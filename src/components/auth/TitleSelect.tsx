interface TitleSelectProps {
  value: string;
  onChange: (title: string) => void;
  required?: boolean;
}

export const TITLE_OPTIONS = ["Mr", "Mrs", "Miss", "Ms", "Mx", "Dr", "Prof", "Sir", "Dame", "Lady", "Lord", "Other"];

export function TitleSelect({ value, onChange, required = true }: TitleSelectProps) {
  return (
    <div>
      <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">
        Title
      </label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-border py-1.5 font-body text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
      >
        <option value="" disabled>
          Select title
        </option>
        {TITLE_OPTIONS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );
}
