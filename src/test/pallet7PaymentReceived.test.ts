import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('supabase/functions/_shared/transactional-email-templates/payment-received-pallet-7.tsx', 'utf8');
const registry = readFileSync('supabase/functions/_shared/transactional-email-templates/registry.ts', 'utf8');

describe('Mark’s Pallet 7 payment received email', () => {
  it('confirms £16,500.00 for invoice AW-2026-0207 paid on 11 November 2026', () => {
    expect(source).toContain('£16,500.00 for invoice <span style={bold}>AW-2026-0207</span>');
    expect(source).toContain('11 November 2026');
  });
  it('is registered alongside, not instead of, the Pallet 6 receipt', () => {
    expect(registry).toContain("'payment-received-pallet-6': paymentReceivedPallet6");
    expect(registry).toContain("'payment-received-pallet-7': paymentReceivedPallet7");
  });
});
