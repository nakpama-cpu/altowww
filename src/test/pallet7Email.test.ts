import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('supabase/functions/_shared/transactional-email-templates/invoice-pallet-7-card-payment.tsx', 'utf8');
const number = (name: string) => Number(source.match(new RegExp(`\\b${name} = (\\d+)`))?.[1]);

describe('Mark’s seventh pallet invoice (Speyburn)', () => {
  it('charges £16,500 for six casks at £2,750 each', () => {
    expect(number('quantity')).toBe(6);
    expect(number('unitPrice')).toBe(2750);
    expect(number('total')).toBe(16500);
    expect(number('quantity') * number('unitPrice')).toBe(16500);
  });
  it('lists £3,200 per cask and deducts the £2,700 pallet saving', () => {
    expect(number('listPrice')).toBe(3200);
    expect(number('subtotal')).toBe(19200);
    expect(number('discountAmount')).toBe(2700);
    expect(number('subtotal') - number('discountAmount')).toBe(16500);
    expect(number('depositAmount')).toBe(0);
  });
  it('uses invoice AW-2026-0207', () => {
    expect(source.match(/invoiceNumber = '([^']*)'/)?.[1]).toBe('AW-2026-0207');
  });
});
