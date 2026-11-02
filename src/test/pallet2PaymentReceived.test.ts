import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const src = readFileSync(
  resolve(__dirname, '../../supabase/functions/_shared/transactional-email-templates/payment-received-pallet-2.tsx'),
  'utf8',
)
const registry = readFileSync(
  resolve(__dirname, '../../supabase/functions/_shared/transactional-email-templates/registry.ts'),
  'utf8',
)

describe('payment-received-pallet-2 email template', () => {
  it('quotes the Pallet 2 invoice number and amount', () => {
    expect(src).toContain('AW-2026-0202')
    expect(src).toContain('£23,310.00')
  })

  it('tells Mark the Pallet 3 invoice email is coming shortly', () => {
    expect(src).toContain('third pallet')
    expect(src).toContain('Lindores Abbey 2026')
  })

  it('is registered in the template registry', () => {
    expect(registry).toContain("'payment-received-pallet-2'")
  })
})
