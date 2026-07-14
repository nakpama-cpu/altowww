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
}

export function CountrySelect({ value, onChange, required = true }: CountrySelectProps) {
  return (
    <div>
      <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5">
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
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const typeBuf = useRef<{ text: string; ts: number }>({ text: "", ts: 0 });

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Focus the list and preselect current value when opening
  useEffect(() => {
    if (!open) return;
    const idx = value ? countries.findIndex((c) => c.dialingCode === value) : 0;
    setActiveIdx(idx >= 0 ? idx : 0);
    // focus the list so keyboard events land here
    requestAnimationFrame(() => listRef.current?.focus());
  }, [open, value]);

  // Scroll active item into view
  useEffect(() => {
    if (!open || activeIdx < 0) return;
    itemRefs.current[activeIdx]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIdx]);

  const commit = (idx: number) => {
    const c = countries[idx];
    if (!c) return;
    onChange(c.dialingCode);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(countries.length - 1, (i < 0 ? -1 : i) + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, (i < 0 ? 1 : i) - 1));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActiveIdx(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setActiveIdx(countries.length - 1);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) commit(activeIdx);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    // Typeahead: single letters/digits build a buffer that resets after 700ms
    if (e.key.length === 1 && /\S/.test(e.key)) {
      e.preventDefault();
      const now = Date.now();
      const buf = now - typeBuf.current.ts > 700 ? "" : typeBuf.current.text;
      const next = (buf + e.key).toLowerCase();
      typeBuf.current = { text: next, ts: now };
      // If buffer is a single repeated letter, cycle through matches
      const startsWith = (name: string) => name.toLowerCase().startsWith(next);
      let idx = countries.findIndex(startsWith);
      if (next.length === 1) {
        // cycle when repeating the same first letter
        const from = activeIdx + 1;
        const rel = countries
          .slice(from)
          .findIndex((c) => c.name.toLowerCase().startsWith(next));
        if (rel >= 0) idx = from + rel;
      }
      if (idx >= 0) setActiveIdx(idx);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-transparent border-b border-border py-1.5 font-body text-sm focus:outline-none focus:border-primary"
      >
        <span className={value ? "" : "text-muted-foreground"}>{value || "Code"}</span>
        <svg className="w-3 h-3 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <ul
          ref={listRef}
          tabIndex={-1}
          role="listbox"
          onKeyDown={onKeyDown}
          className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-auto bg-card border border-border shadow-lg min-w-[240px] focus:outline-none"
        >
          {countries.map((c, i) => (
            <li key={c.code}>
              <button
                ref={(el) => (itemRefs.current[i] = el)}
                type="button"
                role="option"
                aria-selected={i === activeIdx}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => commit(i)}
                className={`w-full flex justify-between gap-3 px-3 py-2 text-left font-body text-xs ${
                  i === activeIdx ? "bg-muted" : "hover:bg-muted"
                }`}
              >
                <span className="truncate">{c.name}</span>
                <span className="text-muted-foreground shrink-0">{c.dialingCode}</span>
              </button>
            </li>
          ))}
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
      <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5">
        Phone
      </label>
      <div className="grid grid-cols-[110px_1fr] gap-3 items-end">
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
          className={`w-full bg-transparent border-b py-1.5 font-body text-sm focus:outline-none ${
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
