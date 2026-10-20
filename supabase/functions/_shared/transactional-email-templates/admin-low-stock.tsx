/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  state?: 'low' | 'out'
  distillery?: string
  specLine?: string
  available?: number
  stockQty?: number
  reservedQty?: number
  adminUrl?: string
}

const Email = ({
  state = 'low',
  distillery = 'Cask listing',
  specLine = '',
  available = 0,
  stockQty = 0,
  reservedQty = 0,
  adminUrl = 'https://www.altowhisky.com/admin/stock-alerts',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{state === 'out' ? `Out of stock: ${distillery}` : `Low stock: ${distillery} — ${available} left`}</Preview>
    <Body style={main}>
      <Section style={header}>
        <Img src="https://altowhisky.com/__l5e/assets-v1/0e654173-6548-4cb5-8108-f18c2625b609/alto-logo-email.png" alt="Alto Whisky" width="94" style={logo} />
      </Section>
      <Container style={container}>
        <Heading style={h1}>{state === 'out' ? 'A listing is out of stock' : 'A listing is running low'}</Heading>
        <Text style={text}>
          {state === 'out'
            ? 'The casks below are fully allocated. Clients can still see the listing but can no longer add it to a cart.'
            : 'The casks below are nearly sold out. Consider restocking or updating the listing.'}
        </Text>

        <Section style={card}>
          <Text style={row}><span style={label}>Cask</span>{distillery}</Text>
          {specLine ? <Text style={row}><span style={label}>Details</span>{specLine}</Text> : null}
          <Text style={row}><span style={label}>Available</span><strong>{available}</strong></Text>
          <Text style={row}><span style={label}>Stock</span>{stockQty}</Text>
          <Text style={row}><span style={label}>Reserved</span>{reservedQty}</Text>
        </Section>

        <Section style={{ textAlign: 'center' as const, margin: '8px 0 24px' }}>
          <Button style={btn} href={adminUrl}>View stock alerts</Button>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          You will receive one email per listing each time it moves into low stock or out of stock.{' '}
          <Link href={adminUrl} style={link}>Manage listings</Link>.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Props) =>
    d.state === 'out'
      ? `Out of stock — ${d.distillery ?? 'cask listing'}`
      : `Low stock — ${d.distillery ?? 'cask listing'} (${d.available ?? 0} left)`,
  displayName: 'Admin: low stock alert',
  previewData: {
    state: 'low',
    distillery: 'Glen Mhor',
    specLine: '2022  ·  Ex-Bourbon Hogshead 250L  ·  ABV 63.5% Approx',
    available: 2,
    stockQty: 14,
    reservedQty: 12,
    adminUrl: 'https://www.altowhisky.com/admin/stock-alerts',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { backgroundColor: 'hsl(220, 26%, 14%)', padding: '24px 24px', textAlign: 'center' as const }
const logo = { display: 'block', margin: '0 auto', height: 'auto' }
const h1 = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontWeight: 500 as const, color: 'hsl(220, 26%, 14%)', margin: '0 0 20px', lineHeight: '1.2' }
const text = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '15px', color: 'hsl(0, 0%, 25%)', lineHeight: '1.6', margin: '0 0 20px' }
const card = { backgroundColor: 'hsl(40, 10%, 96%)', padding: '20px 22px', borderRadius: '4px', margin: '0 0 28px' }
const row = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '14px', color: 'hsl(0, 0%, 20%)', margin: '0 0 8px', lineHeight: '1.5' }
const label = { display: 'inline-block', width: '90px', color: 'hsl(0, 0%, 45%)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' as const }
const link = { color: 'hsl(24, 72%, 40%)', textDecoration: 'underline' }
const btn = { backgroundColor: 'hsl(24, 72%, 40%)', color: '#ffffff', fontFamily: "'Inter', Arial, sans-serif", fontSize: '12px', fontWeight: 600 as const, letterSpacing: '0.2em', textTransform: 'uppercase' as const, borderRadius: '2px', padding: '14px 24px', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: 'hsl(0, 0%, 90%)', margin: '20px 0' }
const footer = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '12px', color: 'hsl(0, 0%, 45%)', lineHeight: '1.5', margin: '0' }
