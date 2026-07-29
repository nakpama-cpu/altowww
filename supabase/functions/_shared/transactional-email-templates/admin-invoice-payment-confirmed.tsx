/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Img, Preview, Row, Column, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Item { title?: string; quantity?: number; lineTotal?: number }

interface Props {
  invoiceNumber?: string
  paymentReference?: string
  clientName?: string
  clientEmail?: string
  currency?: string
  total?: number
  note?: string
  confirmedAt?: string
  items?: Item[]
  adminUrl?: string
}

const money = (n = 0) => `£${Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const Email = ({
  invoiceNumber = 'AW-2026-0001',
  paymentReference = 'AW260001',
  clientName = '',
  clientEmail = '',
  total = 0,
  note = '',
  confirmedAt = '',
  items = [],
  adminUrl = 'https://www.altowhisky.com/admin/invoices',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Bank transfer confirmed for invoice {invoiceNumber}</Preview>
    <Body style={main}>
      <Section style={header}>
        <Img src="https://altowhisky.com/__l5e/assets-v1/0e654173-6548-4cb5-8108-f18c2625b609/alto-logo-email.png" alt="Alto Whisky" width="94" style={logo} />
      </Section>
      <Container style={container}>
        <Heading style={h1}>Client has confirmed payment</Heading>
        <Text style={text}>
          {clientName || 'A client'} has confirmed a bank transfer for invoice{' '}
          <strong>{invoiceNumber}</strong>. Please check the account and mark the invoice as paid.
        </Text>

        <Section style={box}>
          <Row><Column style={k}><Text style={kt}>Invoice</Text></Column><Column><Text style={vt}>{invoiceNumber}</Text></Column></Row>
          <Row><Column style={k}><Text style={kt}>Reference</Text></Column><Column><Text style={vt}>{paymentReference}</Text></Column></Row>
          <Row><Column style={k}><Text style={kt}>Amount</Text></Column><Column><Text style={vt}>{money(total)}</Text></Column></Row>
          <Row><Column style={k}><Text style={kt}>Client</Text></Column><Column><Text style={vt}>{clientName}</Text></Column></Row>
          <Row><Column style={k}><Text style={kt}>Email</Text></Column><Column><Text style={vt}>{clientEmail}</Text></Column></Row>
          <Row><Column style={k}><Text style={kt}>Confirmed</Text></Column><Column><Text style={vt}>{confirmedAt}</Text></Column></Row>
        </Section>

        {items.length > 0 && (
          <>
            <Text style={label}>CASKS</Text>
            {items.map((it, i) => (
              <Row key={i}>
                <Column><Text style={itemTitle}>{it.title} {it.quantity && it.quantity > 1 ? `×${it.quantity}` : ''}</Text></Column>
                <Column style={{ textAlign: 'right' as const }}><Text style={itemTitle}>{money(it.lineTotal)}</Text></Column>
              </Row>
            ))}
            <Hr style={hr} />
          </>
        )}

        {note && (
          <>
            <Text style={label}>CLIENT NOTE</Text>
            <Text style={text}>{note}</Text>
          </>
        )}

        <Section style={{ textAlign: 'center' as const, margin: '10px 0 24px' }}>
          <Button style={button} href={adminUrl}>Open invoices</Button>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Props) => `Payment confirmed by client — invoice ${d?.invoiceNumber ?? ''}`,
  displayName: 'Admin — bank transfer confirmed',
  previewData: {
    invoiceNumber: 'AW-2026-0001',
    paymentReference: 'AW260001',
    clientName: 'Jane Smith',
    clientEmail: 'jane@example.com',
    total: 22200,
    confirmedAt: '28/07/2026, 14:03',
    note: 'Sent this morning from my Barclays account.',
    items: [{ title: 'Blair Athol', quantity: 6, lineTotal: 22200 }],
    adminUrl: 'https://www.altowhisky.com/admin/invoices',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { backgroundColor: 'hsl(220, 26%, 14%)', padding: '24px 24px', textAlign: 'center' as const }
const logo = { display: 'block', margin: '0 auto', height: 'auto' }
const h1 = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontWeight: 500 as const, color: 'hsl(220, 26%, 14%)', margin: '0 0 20px', lineHeight: '1.2' }
const text = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '15px', color: 'hsl(0, 0%, 25%)', lineHeight: '1.6', margin: '0 0 18px' }
const label = { fontSize: '10px', letterSpacing: '0.22em', color: 'hsl(24, 72%, 40%)', margin: '0 0 8px', fontWeight: 600 as const }
const box = { backgroundColor: 'hsl(40, 10%, 96%)', borderLeft: '3px solid hsl(24, 72%, 40%)', padding: '14px 18px', margin: '0 0 22px' }
const k = { width: '110px' }
const kt = { fontSize: '12px', color: 'hsl(0, 0%, 45%)', margin: '3px 0' }
const vt = { fontSize: '13px', color: 'hsl(220, 26%, 14%)', margin: '3px 0', fontWeight: 600 as const }
const itemTitle = { fontSize: '13px', color: 'hsl(220, 26%, 14%)', margin: '3px 0' }
const hr = { borderColor: 'hsl(0, 0%, 90%)', margin: '14px 0' }
const button = { backgroundColor: 'hsl(24, 72%, 40%)', color: '#ffffff', fontSize: '12px', fontWeight: 600 as const, letterSpacing: '0.2em', textTransform: 'uppercase' as const, borderRadius: '2px', padding: '14px 28px', textDecoration: 'none', display: 'inline-block' }
