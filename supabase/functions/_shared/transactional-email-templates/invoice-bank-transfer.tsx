/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Row, Column, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Item {
  title?: string
  detail?: string
  distilled?: string
  quantity?: number
  listPrice?: number
  unitPrice?: number
  lineTotal?: number
}

interface Props {
  firstName?: string
  invoiceNumber?: string
  paymentReference?: string
  dueDate?: string
  currency?: string
  subtotal?: number
  discountAmount?: number
  total?: number
  items?: Item[]
  invoiceUrl?: string
  confirmUrl?: string
  bankAccountName?: string
  bankName?: string
  sortCode?: string
  accountNumber?: string
}

const money = (n = 0) => `£${Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const Email = ({
  firstName = 'there',
  invoiceNumber = 'AW-2026-0001',
  paymentReference = 'AW260001',
  dueDate = '',
  subtotal = 0,
  discountAmount = 0,
  total = 0,
  items = [],
  invoiceUrl = 'https://www.altowhisky.com',
  confirmUrl = 'https://www.altowhisky.com',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Invoice {invoiceNumber} — payment by bank transfer</Preview>
    <Body style={main}>
      <Section style={header}>
        <Img src="https://altowhisky.com/__l5e/assets-v1/0e654173-6548-4cb5-8108-f18c2625b609/alto-logo-email.png" alt="Alto Whisky" width="94" style={logo} />
      </Section>
      <Container style={container}>
        <Heading style={h1}>Your invoice</Heading>
        <Text style={text}>Hello {firstName},</Text>
        <Text style={text}>
          Thank you for your cask reservation. Invoice <strong>{invoiceNumber}</strong> is below,
          payable by bank transfer. Your casks are reserved until <strong>{dueDate}</strong>.
        </Text>

        <Section style={{ textAlign: 'center' as const, margin: '4px 0 24px' }}>
          <Button style={button} href={invoiceUrl}>View &amp; download invoice</Button>
        </Section>

        <Text style={label}>YOUR PURCHASE</Text>
        {items.map((it, idx) => {
          const qty = it.quantity ?? 1
          const unit = it.unitPrice ?? (it.lineTotal ?? 0) / (qty || 1)
          const list = it.listPrice ?? unit
          const discounted = list > unit
          return (
            <Row key={idx} style={itemRow}>
              <Column>
                <Text style={itemTitle}>{it.title}</Text>
                {it.detail ? <Text style={itemDetail}>{it.detail}</Text> : null}
                {it.distilled ? <Text style={itemDetail}>{it.distilled}</Text> : null}
                <Text style={itemDetail}>
                  Qty {qty} · Unit price{' '}
                  {discounted ? <s style={strike}>{money(list)}</s> : null}{' '}
                  <span style={discounted ? copperText : undefined}>{money(unit)}</span>
                </Text>
              </Column>
              <Column style={{ textAlign: 'right' as const, width: '110px' }}>
                {discounted ? <Text style={itemStrikeAmount}>{money(list * qty)}</Text> : null}
                <Text style={discounted ? itemAmountCopper : itemAmount}>{money(it.lineTotal)}</Text>
              </Column>
            </Row>
          )
        })}
        <Hr style={hr} />
        <Row>
          <Column><Text style={totalLabel}>Subtotal</Text></Column>
          <Column style={{ textAlign: 'right' as const }}><Text style={totalLabel}>{money(subtotal)}</Text></Column>
        </Row>
        {discountAmount > 0 && (
          <Row>
            <Column><Text style={discount}>Discount</Text></Column>
            <Column style={{ textAlign: 'right' as const }}><Text style={discount}>−{money(discountAmount)}</Text></Column>
          </Row>
        )}
        <Row>
          <Column><Text style={grandLabel}>Total due</Text></Column>
          <Column style={{ textAlign: 'right' as const }}><Text style={grandValue}>{money(total)}</Text></Column>
        </Row>

        <Section style={bankBox}>
          <Text style={label}>PAYMENT BY BANK TRANSFER</Text>
          <Text style={bankLine}>
            Full bank details are shown on your invoice. Please quote the reference below so we can
            match your payment.
          </Text>
          <Text style={reference}>{paymentReference}</Text>
        </Section>

        <Text style={text}>
          Once you have made the transfer, please let us know so we can release your casks and issue
          your certificates.
        </Text>
        <Section style={{ textAlign: 'center' as const, margin: '4px 0 28px' }}>
          <Button style={button} href={confirmUrl}>I&apos;ve made the payment</Button>
        </Section>

        <Text style={sig}>
          Warm regards,<br />
          The Alto Whisky Team
        </Text>
        <Text style={footer}>
          <Link href={invoiceUrl} style={link}>{invoiceUrl}</Link><br />
          Cask whisky held under bond is not subject to VAT while in bonded warehouse.
          Cask whisky is an unregulated asset; values can fall as well as rise.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Props) => `Alto Whisky invoice ${d?.invoiceNumber ?? ''} — payment by bank transfer`,
  displayName: 'Invoice — bank transfer',
  previewData: {
    firstName: 'Jane',
    invoiceNumber: 'AW-2026-0001',
    paymentReference: 'AW260001',
    dueDate: '31 July 2026',
    subtotal: 24000,
    discountAmount: 1800,
    total: 22200,
    items: [
      {
        title: 'Blair Athol Whisky Cask',
        detail: '2022  ·  Ex-Bourbon Barrel 200L  ·  ABV 63.5% Approx',
        distilled: 'Distilled at Blair Athol Distillery',
        quantity: 6,
        listPrice: 4000,
        unitPrice: 3700,
        lineTotal: 22200,
      },
    ],
    invoiceUrl: 'https://www.altowhisky.com/invoice/preview',
    confirmUrl: 'https://www.altowhisky.com/invoice/preview?confirm=1',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { backgroundColor: 'hsl(220, 26%, 14%)', padding: '24px 24px', textAlign: 'center' as const }
const logo = { display: 'block', margin: '0 auto', height: 'auto' }
const h1 = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '30px', fontWeight: 500 as const, color: 'hsl(220, 26%, 14%)', margin: '0 0 20px', lineHeight: '1.2' }
const text = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '15px', color: 'hsl(0, 0%, 25%)', lineHeight: '1.6', margin: '0 0 18px' }
const label = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '10px', letterSpacing: '0.22em', color: 'hsl(24, 72%, 40%)', margin: '0 0 10px', fontWeight: 600 as const }
const itemRow = { borderBottom: '1px solid hsl(0, 0%, 92%)', paddingBottom: '6px' }
const itemTitle = { fontSize: '15px', color: 'hsl(220, 26%, 14%)', margin: '8px 0 2px', fontWeight: 600 as const }
const itemDetail = { fontSize: '12px', color: 'hsl(0, 0%, 45%)', margin: '0 0 8px' }
const itemAmount = { fontSize: '14px', color: 'hsl(220, 26%, 14%)', margin: '8px 0' }
const hr = { borderColor: 'hsl(0, 0%, 90%)', margin: '14px 0' }
const totalLabel = { fontSize: '13px', color: 'hsl(0, 0%, 35%)', margin: '2px 0' }
const discount = { fontSize: '13px', color: 'hsl(24, 72%, 40%)', margin: '2px 0' }
const grandLabel = { fontSize: '15px', color: 'hsl(220, 26%, 14%)', margin: '10px 0 0', fontWeight: 600 as const }
const grandValue = { fontSize: '18px', color: 'hsl(24, 72%, 40%)', margin: '10px 0 0', fontWeight: 600 as const }
const bankBox = { backgroundColor: 'hsl(40, 10%, 96%)', borderLeft: '3px solid hsl(24, 72%, 40%)', padding: '18px 20px', margin: '26px 0' }
const bankLine = { fontSize: '13px', color: 'hsl(0, 0%, 35%)', margin: '0 0 10px', lineHeight: '1.5' }
const reference = { fontSize: '20px', letterSpacing: '0.12em', color: 'hsl(220, 26%, 14%)', margin: 0, fontWeight: 700 as const }
const sig = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '15px', color: 'hsl(0, 0%, 25%)', lineHeight: '1.6', margin: '24px 0 24px' }
const button = { backgroundColor: 'hsl(24, 72%, 40%)', color: '#ffffff', fontFamily: "'Inter', Arial, sans-serif", fontSize: '12px', fontWeight: 600 as const, letterSpacing: '0.2em', textTransform: 'uppercase' as const, borderRadius: '2px', padding: '14px 28px', textDecoration: 'none', display: 'inline-block' }
const link = { color: 'hsl(24, 72%, 40%)', textDecoration: 'underline' }
const footer = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '12px', color: 'hsl(0, 0%, 45%)', lineHeight: '1.5', margin: '24px 0 0', borderTop: '1px solid hsl(0, 0%, 90%)', paddingTop: '18px' }
const strike = { color: 'hsl(0, 0%, 55%)', textDecoration: 'line-through' }
const copperText = { color: 'hsl(24, 72%, 40%)' }
const itemStrikeAmount = { fontSize: '13px', color: 'hsl(0, 0%, 55%)', textDecoration: 'line-through', margin: '0' }
const itemAmountCopper = { fontSize: '15px', color: 'hsl(24, 72%, 40%)', margin: '0' }
