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
