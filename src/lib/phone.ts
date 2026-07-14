import { parsePhoneNumberFromString } from "libphonenumber-js";
import { countries } from "@/data/countries";

/**
 * Validates and normalizes a phone number to E.164 format.
 * Returns { valid: true, e164 } when the combined dialling code + national
 * number parses as a valid international phone number, or { valid: false, error }.
 */
export function validateE164(dialingCode: string, nationalNumber: string):
  | { valid: true; e164: string }
  | { valid: false; error: string } {
  const code = (dialingCode || "").trim();
  const number = (nationalNumber || "").trim();

  if (!code) return { valid: false, error: "Please select a dialling code." };
  if (!number) return { valid: false, error: "Please enter a phone number." };
  if (!/^\+\d/.test(code)) return { valid: false, error: "Invalid dialling code." };

  // Strip any non-digit characters from the national portion; libphonenumber
  // is lenient but we want a predictable E.164 result.
  const cleanedNational = number.replace(/[^\d]/g, "");
  if (!cleanedNational) return { valid: false, error: "Please enter a phone number." };

  // dialingCode may include a sub-region hint like "+1-242"; keep only the
  // leading country calling code digits for parsing.
  const callingCode = code.replace(/[^\d]/g, "");
  const candidate = `+${callingCode}${cleanedNational}`;

  const parsed = parsePhoneNumberFromString(candidate);
  if (!parsed || !parsed.isValid()) {
    return { valid: false, error: "Please enter a valid phone number for the selected country." };
  }
  return { valid: true, e164: parsed.number };
}

/**
 * Format a stored phone value for display. Accepts either a full E.164 string
 * (preferred, e.g. "+442079460958") or a legacy dialling-code + national pair.
 * Returns the international format ("+44 20 7946 0958") when parseable, or a
 * best-effort fallback so we never render an empty cell.
 */
export function formatPhoneDisplay(phone?: string | null, dialingCode?: string | null): string {
  const raw = (phone ?? "").trim();
  if (!raw) return "";

  const candidate = raw.startsWith("+")
    ? raw
    : `+${(dialingCode ?? "").replace(/[^\d]/g, "")}${raw.replace(/[^\d]/g, "")}`;

  const parsed = parsePhoneNumberFromString(candidate);
  if (parsed && parsed.isValid()) return parsed.formatInternational();

  const cc = (dialingCode ?? "").trim();
  return cc ? `${cc} ${raw}` : raw;
}

/**
 * Split a stored E.164 phone into the `{ dialingCode, nationalNumber }` pair
 * used by the signup / account form inputs. Falls back to the provided
 * dialling code and raw number when parsing fails (legacy rows).
 */
export function splitStoredPhone(
  phone?: string | null,
  dialingCode?: string | null,
): { dialingCode: string; nationalNumber: string } {
  const raw = (phone ?? "").trim();
  const fallbackCode = (dialingCode ?? "").trim();

  if (raw.startsWith("+")) {
    const parsed = parsePhoneNumberFromString(raw);
    if (parsed) {
      const cc = `+${parsed.countryCallingCode}`;
      // Prefer the exact stored dialling code when it matches (handles "+1-242" style).
      const preferred = fallbackCode && fallbackCode.replace(/[^\d]/g, "") === String(parsed.countryCallingCode)
        ? fallbackCode
        : cc;
      // Match back to our countries list so the dropdown value stays consistent.
      const known = countries.find((c) => c.dialingCode === preferred);
      return {
        dialingCode: known?.dialingCode ?? preferred,
        nationalNumber: parsed.nationalNumber ?? "",
      };
    }
  }

  return { dialingCode: fallbackCode, nationalNumber: raw };
}
