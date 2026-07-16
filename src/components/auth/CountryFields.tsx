import { useEffect, useRef, useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { countries, countryByCode } from "@/data/countries";

export function isValidPhone(dialingCode: string, phone: string): boolean {
  if (!dialingCode || !phone.trim()) return false;
  const parsed = parsePhoneNumberFromString(`${dialingCode}${phone.trim()}`);
  return !!parsed?.isValid();
}

interface CountrySelectProps {
  value: string;
  onChange: (code: string, dialingCode: string) => void;
  required?: boolean;
  dense?: boolean;
}

export function CountrySelect({ value, onChange, required = true, dense = false }: CountrySelectProps) {
  return (
    <div>
      <label className={`block font-body text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-muted-foreground ${dense ? "mb-0.5 sm:mb-1" : "mb-1"}`}>
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
        className={`w-full bg-transparent border-b border-border font-body text-xs sm:text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer ${dense ? "h-8 sm:h-9 py-0.5" : "py-1"}`}
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
}

function PhoneCountryCodeSelect({ value, onChange }: PhoneCountryCodeSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer text-transparent [&>option]:text-foreground"
      >
        <option value="" disabled>
          Code
        </option>
        {countries.map((c) => (
          <option key={c.code} value={c.dialingCode}>
            {c.name} {c.dialingCode}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-0 flex items-center font-body text-sm text-foreground">
        {value || <span className="text-muted-foreground">Code</span>}
      </span>
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [touched, setTouched] = useState(false);

  const hasInput = phone.trim().length > 0;
  const missingCode = hasInput && !countryCode;
  const invalidFormat = hasInput && !!countryCode && !isValidPhone(countryCode, phone);
  const showError = touched && (missingCode || invalidFormat);
  const errorMsg = missingCode
    ? "Select a dialling code."
    : invalidFormat
    ? "Enter a valid phone number for the selected country."
    : "";

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (!hasInput) {
      el.setCustomValidity(required ? "" : "");
      return;
    }
    if (missingCode || invalidFormat) {
      el.setCustomValidity(missingCode ? "Select a dialling code." : "Enter a valid phone number for the selected country.");
    } else {
      el.setCustomValidity("");
    }
  }, [countryCode, phone, hasInput, missingCode, invalidFormat, required]);

  return (
    <div>
      <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">
        Phone
      </label>
      <div className="grid grid-cols-[4rem_1fr] gap-3 items-end">
        <PhoneCountryCodeSelect value={countryCode} onChange={onCountryCodeChange} />
        <input
          ref={inputRef}
          type="tel"
          required={required}
          maxLength={30}
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value.replace(/[^\d\s\-()]/g, ""))}
          onBlur={() => setTouched(true)}
          inputMode="tel"
          placeholder="Phone number"
          className={`w-full bg-transparent border-b py-1 font-body text-sm focus:outline-none ${
            showError ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
          }`}
        />
      </div>
      {showError && (
        <p className="mt-1 font-body text-[10px] text-destructive">{errorMsg}</p>
      )}
    </div>
  );
}
