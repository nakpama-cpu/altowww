import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('supabase/functions/_shared/transactional-email-templates/invoice-pallet-3-card-payment.tsx', 'utf8');
const defaultNumber = (name: string) => Number(source.match(new RegExp(`\\b${name} = (\\d+)`))?.[1]);

describe('Mark’s third pallet invoice email', () => {
  it('covers six casks at £2,498 each, totalling £14,988', () => {
    expect(defaultNumber('quantity')).toBe(6);
    expect(defaultNumber('unitPrice')).toBe(2498);
    expect(defaultNumber('total')).toBe(14988);
    expect(defaultNumber('quantity') * defaultNumber('unitPrice')).toBe(14988);
  });
  it('applies £1,212 discount without deducting the first pallet’s deposit again', () => {
    expect(defaultNumber('subtotal')).toBe(16200);
    expect(defaultNumber('discountAmount')).toBe(1212);
    expect(defaultNumber('subtotal') - defaultNumber('discountAmount')).toBe(14988);
    expect(defaultNumber('depositAmount')).toBe(0);
  });
  it('does not reuse an earlier pallet payment link while awaiting the new one', () => {
    expect(source.match(/paymentUrl = '([^']*)'/)?.[1]).toBe('');
    expect(source).not.toContain('buy.stripe.com/');
  });
});