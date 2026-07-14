/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  clientCountry?: string
  signedUpAt?: string
  approveUrl?: string
  rejectUrl?: string
  adminUrl?: string
}

const Email = ({
  clientName = 'A new client',
  clientEmail = '',
  clientPhone = '',
  clientCountry = '',
  signedUpAt = '',
  approveUrl = '#',
  rejectUrl = '#',
  adminUrl = 'https://www.altowhisky.com/admin/clients',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New client awaiting approval: {clientName}</Preview>
    <Body style={main}>
      <Section style={header}>
        <Img src="https://altowhisky.com/__l5e/assets-v1/0e654173-6548-4cb5-8108-f18c2625b609/alto-logo-email.png" alt="Alto Whisky" width="140" style={logo} />
      </Section>
      <Container style={container}>
        <Heading style={h1}>New client awaiting approval</Heading>
        <Text style={text}>
          A new registration has come through the Alto Whisky portal and is waiting for review.
        </Text>

        <Section style={card}>
          <Text style={row}><span style={label}>Name</span>{clientName}</Text>
          <Text style={row}><span style={label}>Email</span><Link href={`mailto:${clientEmail}`} style={link}>{clientEmail}</Link></Text>
          {clientPhone ? <Text style={row}><span style={label}>Phone</span>{clientPhone}</Text> : null}
          {clientCountry ? <Text style={row}><span style={label}>Country</span>{clientCountry}</Text> : null}
          {signedUpAt ? <Text style={row}><span style={label}>Signed up</span>{signedUpAt}</Text> : null}
        </Section>

        <Section style={{ textAlign: 'center' as const, margin: '8px 0 24px' }}>
          <Button style={approveBtn} href={approveUrl}>Approve client</Button>
          <span style={{ display: 'inline-block', width: 12 }} />
          <Button style={rejectBtn} href={rejectUrl}>Reject</Button>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          You can also review all clients in the{' '}
          <Link href={adminUrl} style={link}>admin console</Link>. Approve and reject links are single-use and expire in 14 days.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Props) => `New client awaiting approval — ${d.clientName ?? ''}`.trim(),
  displayName: 'Admin: new signup',
  previewData: {
    clientName: 'Jane Doe',
    clientEmail: 'jane@example.com',
    clientPhone: '+44 7700 900123',
    clientCountry: 'United Kingdom',
    signedUpAt: new Date().toUTCString(),
    approveUrl: 'https://example.com/approve',
    rejectUrl: 'https://example.com/reject',
    adminUrl: 'https://www.altowhisky.com/admin/clients',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { backgroundColor: 'hsl(220, 26%, 14%)', padding: '36px 24px', textAlign: 'center' as const }
const logo = { display: 'block', margin: '0 auto', height: 'auto' }
const h1 = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '28px', fontWeight: 500 as const, color: 'hsl(220, 26%, 14%)', margin: '0 0 20px', lineHeight: '1.2' }
const text = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '15px', color: 'hsl(0, 0%, 25%)', lineHeight: '1.6', margin: '0 0 20px' }
const card = { backgroundColor: 'hsl(40, 10%, 96%)', padding: '20px 22px', borderRadius: '4px', margin: '0 0 28px' }
const row = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '14px', color: 'hsl(0, 0%, 20%)', margin: '0 0 8px', lineHeight: '1.5' }
const label = { display: 'inline-block', width: '90px', color: 'hsl(0, 0%, 45%)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' as const }
const link = { color: 'hsl(24, 72%, 40%)', textDecoration: 'underline' }
const approveBtn = { backgroundColor: 'hsl(24, 72%, 40%)', color: '#ffffff', fontFamily: "'Inter', Arial, sans-serif", fontSize: '12px', fontWeight: 600 as const, letterSpacing: '0.2em', textTransform: 'uppercase' as const, borderRadius: '2px', padding: '14px 24px', textDecoration: 'none', display: 'inline-block' }
const rejectBtn = { backgroundColor: 'transparent', color: 'hsl(220, 26%, 14%)', border: '1px solid hsl(220, 10%, 60%)', fontFamily: "'Inter', Arial, sans-serif", fontSize: '12px', fontWeight: 600 as const, letterSpacing: '0.2em', textTransform: 'uppercase' as const, borderRadius: '2px', padding: '13px 24px', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: 'hsl(0, 0%, 90%)', margin: '20px 0' }
const footer = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '12px', color: 'hsl(0, 0%, 45%)', lineHeight: '1.5', margin: '0' }
