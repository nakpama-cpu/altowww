import { useEffect, useRef, useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { countries, countryByCode, countryByDialingCode } from "@/data/countries";


export function isValidPhone(dialingCode: string, phone: string): boolean {
  if (!dialingCode || !phone.trim()) return false;
  const parsed = parsePhoneNumberFromString(`${dialingCode}${phone.trim()}`);
  return !!parsed?.isValid();
}

interface CountrySelectProps {
  value: string;
  onChange: (code: string, dialingCode: string) => void;
  required?: boolean;
}

export function CountrySelect({ value, onChange, required = true }: CountrySelectProps) {
  return (
    <div>
      <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">
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
        className="w-full bg-transparent border-b border-border py-1.5 font-body text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
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
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const display = value || "Code";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-transparent border-b border-border py-1.5 font-body text-sm text-left focus:outline-none focus:border-primary cursor-pointer"
      >
        <span className={value ? "" : "text-muted-foreground"}>{display}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" className="ml-2 opacity-60" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 left-0 right-0 min-w-[240px] max-h-64 overflow-auto bg-card border border-border shadow-lg font-body text-sm"
        >
          {countries.map((c) => {
            const selected = c.dialingCode === value;
            return (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(c.dialingCode);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between text-left px-3 py-2 hover:bg-muted ${
                    selected ? "bg-muted" : ""
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-muted-foreground ml-3">{c.dialingCode}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
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
      <div className="grid grid-cols-[minmax(140px,45%)_1fr] gap-3 items-end">
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
