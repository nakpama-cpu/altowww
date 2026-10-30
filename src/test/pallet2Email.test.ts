import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('supabase/functions/_shared/transactional-email-templates/invoice-pallet-2-card-payment.tsx', 'utf8');
const defaultNumber = (name: string) => Number(source.match(new RegExp(`${name} = (\\d+)`))?.[1]);

describe('Mark’s second pallet invoice email', () => {
  it('covers six casks at £3,885 each, totalling £23,310', () => {
    expect(defaultNumber('quantity')).toBe(6);
    expect(defaultNumber('unitPrice')).toBe(3885);
    expect(defaultNumber('total')).toBe(23310);
    expect(defaultNumber('quantity') * defaultNumber('unitPrice')).toBe(defaultNumber('total'));
  });
  it('does not deduct the first pallet’s deposit again', () => {
    expect(defaultNumber('depositAmount')).toBe(0);
    expect(defaultNumber('subtotal') - defaultNumber('discountAmount')).toBe(23310);
  });
  it('uses only the supplied second-pallet Stripe link', () => {
    const paymentUrl = source.match(/paymentUrl = '([^']+)'/)?.[1];
    expect(paymentUrl).toBe('https://buy.stripe.com/8x200kbWk6WG16h2MFco001');
  });
});