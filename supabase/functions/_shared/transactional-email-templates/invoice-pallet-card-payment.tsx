/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Row, Column, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  firstName?: string
  originalInvoiceNumber?: string
  invoiceNumber?: string
  palletNumber?: number
  dueDate?: string
  caskTitle?: string
  caskDetail?: string
  distilled?: string
  quantity?: number
  listPrice?: number
  unitPrice?: number
  subtotal?: number
  discountAmount?: number
  depositAmount?: number
  total?: number
  paymentUrl?: string
}

const money = (n = 0) => `£${Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const whole = (n = 0) => `£${Number(n).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`

const Email = ({
  firstName = 'there',
  originalInvoiceNumber = 'AW-2026-0185',
  invoiceNumber = 'AW-2026-0201',
  palletNumber = 1,
  dueDate = '30 October 2026',
  caskTitle = 'Ardmore New Make Whisky Cask',
  caskDetail = '2024  ·  Refill Barrel  ·  ABV 63.7% Approx',
  distilled = 'Distilled at Ardmore Distillery',
  quantity = 6,
  listPrice = 2960,
  unitPrice = 2738,
  subtotal = 17760,
  discountAmount = 1332,
  depositAmount = 2480,
  total = 13948,
  paymentUrl = 'https://buy.stripe.com/fZueVe7G4dl48yJ9b3co000',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Invoice {invoiceNumber} — Pallet {palletNumber}, balance {whole(total)}</Preview>
    <Body style={main}>
      <Section style={header}>
        <Img src="https://altowhisky.com/__l5e/assets-v1/0e654173-6548-4cb5-8108-f18c2625b609/alto-logo-email.png" alt="Alto Whisky" width="94" style={logo} />
      </Section>
      <Container style={container}>
        <Heading style={h1}>Your invoice</Heading>
        <Text style={text}>Hello {firstName},</Text>
        <Text style={text}>
          Thank you for your time earlier today. I’m pleased to hear you’ve decided to go ahead with the portfolio option.
        </Text>
        <Text style={text}>
          I have now split the original invoice, <strong>{originalInvoiceNumber}</strong>, into separate invoices for each
          pallet. The invoice for your first pallet, <strong>{invoiceNumber}</strong>, is attached to this email for your
          personal records.
        </Text>
        <Text style={text}>
          The {whole(depositAmount)} deposit you have already paid has been deducted from this invoice, leaving a balance
          of {whole(total)}. Once payment for this invoice has been processed, I will send the invoices for the remaining
          individual pallets.
        </Text>
        <Text style={text}>
          The invoice shows a settlement date of {dueDate}. As before, if you require any additional time, please let me
          know and I’ll apply an extension to this invoice.
        </Text>

        <Text style={label}>PALLET {palletNumber} · YOUR PURCHASE</Text>
        <Row style={itemRow}>
          <Column>
            <Text style={itemTitle}>{caskTitle}</Text>
            <Text style={itemDetail}>{caskDetail}</Text>
            <Text style={itemDetail}>{distilled}</Text>
            <Text style={itemDetail}>
              Qty {quantity} · Unit price <s style={strike}>{money(listPrice)}</s>{' '}
              <span style={copperText}>{money(unitPrice)}</span>
            </Text>
          </Column>
          <Column style={{ textAlign: 'right' as const, width: '110px' }}>
            <Text style={itemStrikeAmount}>{money(listPrice * quantity)}</Text>
            <Text style={itemAmountCopper}>{money(unitPrice * quantity)}</Text>
          </Column>
        </Row>
        <Hr style={hr} />
        <Row>
          <Column><Text style={totalLabel}>Subtotal</Text></Column>
          <Column style={{ textAlign: 'right' as const }}><Text style={totalLabel}>{money(subtotal)}</Text></Column>
        </Row>
        <Row>
          <Column><Text style={discount}>Discount</Text></Column>
          <Column style={{ textAlign: 'right' as const }}><Text style={discount}>−{money(discountAmount)}</Text></Column>
        </Row>
        <Row>
          <Column><Text style={discount}>Deposit received</Text></Column>
          <Column style={{ textAlign: 'right' as const }}><Text style={discount}>−{money(depositAmount)}</Text></Column>
        </Row>
        <Row>
          <Column><Text style={grandLabel}>Total due</Text></Column>
          <Column style={{ textAlign: 'right' as const }}><Text style={grandValue}>{money(total)}</Text></Column>
        </Row>

        <Section style={{ textAlign: 'center' as const, margin: '24px 0 8px' }}>
          <Button style={button} href={paymentUrl}>Pay {whole(total)} securely</Button>
        </Section>

        <Section style={payBox}>
          <Text style={label}>PAYMENT BY CARD</Text>
          <Text style={payLine}>
            Use the button above to pay the {whole(total)} balance securely through Stripe Checkout. The payment link
            supports payments by card, Apple Pay, Google Pay and Onelink.
          </Text>
        </Section>

        <Text style={text}>
          If you have any questions or experience any issues with payment, please do feel free to contact me.
        </Text>
        <Text style={text}>Warmest regards,</Text>

        <Section style={sigBlock}>
          <Text style={sigName}>Nicholas Akpama</Text>
          <Text style={sigRole}>DIRECTOR · ALTO WHISKY</Text>
          <Text style={sigLine}>
            E <Link href="mailto:n.akpama@altowhisky.com" style={sigLink}>n.akpama@altowhisky.com</Link><br />
            T <Link href="tel:+442045863717" style={sigLink}>+44 20 4586 3717</Link><br />
            M <Link href="tel:+447446829841" style={sigLink}>+44 7446 829841</Link><br />
            W <Link href="https://www.altowhisky.com" style={sigLink}>www.altowhisky.com</Link>
          </Text>
          <Text style={sigAddress}>71–75 Shelton Street, Covent Garden, London, WC2H 9JQ</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Props) => `Alto Whisky invoice ${d?.invoiceNumber ?? 'AW-2026-0201'} — Pallet ${d?.palletNumber ?? 1}`,
  displayName: 'Invoice — pallet card payment',
  previewData: { firstName: 'Mark' },
} satisfies TemplateEntry

const navy = 'hsl(220, 26%, 14%)'
const copper = 'hsl(24, 72%, 40%)'
const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { backgroundColor: navy, padding: '24px', textAlign: 'center' as const }
const logo = { display: 'block', margin: '0 auto', height: 'auto' }
const h1 = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '30px', fontWeight: 500 as const, color: navy, margin: '0 0 20px', lineHeight: '1.2' }
const text = { fontSize: '15px', color: 'hsl(0, 0%, 25%)', lineHeight: '1.6', margin: '0 0 18px' }
const label = { fontSize: '10px', letterSpacing: '0.22em', color: copper, margin: '0 0 10px', fontWeight: 600 as const }
const itemRow = { borderBottom: '1px solid hsl(0, 0%, 92%)', paddingBottom: '6px' }
const itemTitle = { fontSize: '15px', color: navy, margin: '8px 0 2px', fontWeight: 600 as const }
const itemDetail = { fontSize: '12px', color: 'hsl(0, 0%, 45%)', margin: '0 0 8px' }
const strike = { color: 'hsl(0, 0%, 55%)', textDecoration: 'line-through' }
const copperText = { color: copper }
const itemStrikeAmount = { fontSize: '13px', color: 'hsl(0, 0%, 55%)', textDecoration: 'line-through', margin: '0' }
const itemAmountCopper = { fontSize: '15px', color: copper, margin: '0' }
const hr = { borderColor: 'hsl(0, 0%, 90%)', margin: '14px 0' }
const totalLabel = { fontSize: '13px', color: 'hsl(0, 0%, 35%)', margin: '2px 0' }
const discount = { fontSize: '13px', color: copper, margin: '2px 0' }
const grandLabel = { fontSize: '15px', color: navy, margin: '10px 0 0', fontWeight: 600 as const }
const grandValue = { fontSize: '18px', color: copper, margin: '10px 0 0', fontWeight: 600 as const }
const button = { backgroundColor: copper, color: '#ffffff', fontSize: '12px', fontWeight: 600 as const, letterSpacing: '0.2em', textTransform: 'uppercase' as const, borderRadius: '2px', padding: '14px 28px', textDecoration: 'none', display: 'inline-block' }
const payBox = { backgroundColor: 'hsl(40, 10%, 96%)', borderLeft: `3px solid ${copper}`, padding: '18px 20px', margin: '20px 0 26px' }
const payLine = { fontSize: '13px', color: 'hsl(0, 0%, 35%)', margin: 0, lineHeight: '1.5' }
const sigBlock = { backgroundColor: navy, padding: '20px 22px', margin: '8px 0 0' }
const sigName = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '22px', color: '#ffffff', margin: '0 0 2px' }
const sigRole = { fontSize: '10px', letterSpacing: '0.22em', color: copper, margin: '0 0 12px', fontWeight: 600 as const }
const sigLine = { fontSize: '12px', color: 'hsl(40, 10%, 85%)', lineHeight: '1.8', margin: '0 0 8px' }
const sigLink = { color: '#ffffff', textDecoration: 'none' }
const sigAddress = { fontSize: '11px', color: 'hsl(40, 10%, 70%)', margin: 0 }
