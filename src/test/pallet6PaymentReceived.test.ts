import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('supabase/functions/_shared/transactional-email-templates/payment-received-pallet-6.tsx', 'utf8');
const registry = readFileSync('supabase/functions/_shared/transactional-email-templates/registry.ts', 'utf8');

describe('Mark’s Pallet 6 payment received email', () => {
  it('confirms £14,706.00 for invoice AW-2026-0206 paid on 9 November 2026', () => {
    expect(source).toContain('£14,706.00 for invoice <span style={bold}>AW-2026-0206</span>');
    expect(source).toContain('9 November 2026');
  });
  it('does not promise a further invoice after the final pallet', () => {
    expect(source).not.toContain('separate email with the invoice');
  });
  it('is registered alongside, not instead of, the Pallet 5 receipt', () => {
    expect(registry).toContain("'payment-received-pallet-5': paymentReceivedPallet5");
    expect(registry).toContain("'payment-received-pallet-6': paymentReceivedPallet6");
  });
});
