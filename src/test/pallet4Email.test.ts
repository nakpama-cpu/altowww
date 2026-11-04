import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('supabase/functions/_shared/transactional-email-templates/invoice-pallet-4-card-payment.tsx', 'utf8');
const defaultNumber = (name: string) => Number(source.match(new RegExp(`\\b${name} = (\\d+)`))?.[1]);

describe('Mark’s fourth pallet invoice email', () => {
  it('covers six casks at £2,733 each, totalling £16,398', () => {
    expect(defaultNumber('quantity')).toBe(6);
    expect(defaultNumber('unitPrice')).toBe(2733);
    expect(defaultNumber('total')).toBe(16398);
    expect(defaultNumber('quantity') * defaultNumber('unitPrice')).toBe(16398);
  });
  it('applies £1,332 discount without deducting the deposit again', () => {
    expect(defaultNumber('subtotal')).toBe(17730);
    expect(defaultNumber('discountAmount')).toBe(1332);
    expect(defaultNumber('subtotal') - defaultNumber('discountAmount')).toBe(16398);
    expect(defaultNumber('depositAmount')).toBe(0);
  });
  it('uses Nicholas’s supplied Pallet 4 payment link', () => {
    expect(source.match(/paymentUrl = '([^']*)'/)?.[1]).toBe('https://buy.stripe.com/7sYcN69Oc4OydT3bjbco003');
  });
});