import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('supabase/functions/_shared/transactional-email-templates/invoice-pallet-6-card-payment.tsx', 'utf8');
const number = (name: string) => Number(source.match(new RegExp(`\\b${name} = (\\d+)`))?.[1]);

describe('Mark’s sixth pallet invoice', () => {
  it('charges £14,706 for six casks at £2,451 each', () => {
    expect(number('quantity')).toBe(6);
    expect(number('unitPrice')).toBe(2451);
    expect(number('total')).toBe(14706);
    expect(number('quantity') * number('unitPrice')).toBe(14706);
  });
  it('deducts £1,194 discount and no previous deposit', () => {
    expect(number('subtotal')).toBe(15900);
    expect(number('discountAmount')).toBe(1194);
    expect(number('subtotal') - number('discountAmount')).toBe(14706);
    expect(number('depositAmount')).toBe(0);
  });
  it('uses the supplied Pallet 6 payment destination', () => {
    expect(source.match(/paymentUrl = '([^']*)'/)?.[1]).toBe('https://buy.stripe.com/eVq28s8K83Ku3epgDvco005');
  });
});