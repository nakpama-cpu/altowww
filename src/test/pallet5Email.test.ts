import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('supabase/functions/_shared/transactional-email-templates/invoice-pallet-5-card-payment.tsx', 'utf8');
const number = (name: string) => Number(source.match(new RegExp(`\\b${name} = (\\d+)`))?.[1]);

describe('Mark’s fifth pallet invoice', () => {
  it('charges £16,650 for six casks at £2,775 each', () => {
    expect(number('quantity')).toBe(6);
    expect(number('unitPrice')).toBe(2775);
    expect(number('total')).toBe(16650);
    expect(number('quantity') * number('unitPrice')).toBe(16650);
  });
  it('deducts £1,350 discount and no previous deposit', () => {
    expect(number('subtotal')).toBe(18000);
    expect(number('discountAmount')).toBe(1350);
    expect(number('subtotal') - number('discountAmount')).toBe(16650);
    expect(number('depositAmount')).toBe(0);
  });
  it('uses the supplied Pallet 5 payment destination', () => {
    expect(source.match(/paymentUrl = '([^']*)'/)?.[1]).toBe('https://buy.stripe.com/00w8wQ0dC4Oy3epbjbco004');
  });
});