import { countries, countryByCode } from "@/data/countries";

interface CountrySelectProps {
  value: string;
  onChange: (code: string, dialingCode: string) => void;
  required?: boolean;
}

export function CountrySelect({ value, onChange, required = true }: CountrySelectProps) {
  return (
    <div>
      <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
        Country
      </label>
      <select
        required={required}
        value={value}
        onChange={(e) => {
          const code = e.target.value;
          const country = countryByCode.get(code);
          onChange(code, country?.dialingCode ?? "");
        }}
        className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
      >
        <option value="" disabled>
          Select country
        </option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

interface PhoneCountryCodeSelectProps {
  value: string;
  onChange: (dialingCode: string) => void;
  required?: boolean;
}

export function PhoneCountryCodeSelect({ value, onChange, required = true }: PhoneCountryCodeSelectProps) {
  return (
    <div>
      <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
        Code
      </label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
      >
        <option value="" disabled>
          Code
        </option>
        {countries.map((c) => (
          <option key={c.code} value={c.dialingCode}>
            {c.name} ({c.dialingCode})
          </option>
        ))}
      </select>
    </div>
  );
}

interface PhoneFieldProps {
  countryCode: string;
  onCountryCodeChange: (dialingCode: string) => void;
  phone: string;
  onPhoneChange: (phone: string) => void;
  required?: boolean;
}

export function PhoneField({
  countryCode,
  onCountryCodeChange,
  phone,
  onPhoneChange,
  required = true,
}: PhoneFieldProps) {
  return (
    <div>
      <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
        Phone
      </label>
      <div className="grid grid-cols-[1fr_2fr] gap-4">
        <PhoneCountryCodeSelect
          value={countryCode}
          onChange={onCountryCodeChange}
          required={required}
        />
        <input
          type="tel"
          required={required}
          maxLength={30}
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Phone number"
          className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}
