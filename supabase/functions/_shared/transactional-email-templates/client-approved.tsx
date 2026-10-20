/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Img, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  firstName?: string
  loginUrl?: string
}

const Email = ({ firstName = 'there', loginUrl = 'https://www.altowhisky.com/portal/login' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Alto Whisky portal is ready</Preview>
    <Body style={main}>
      <Section style={header}>
        <Img src="https://altowhisky.com/__l5e/assets-v1/0e654173-6548-4cb5-8108-f18c2625b609/alto-logo-email.png" alt="Alto Whisky" width="94" style={logo} />
      </Section>
      <Container style={container}>
        <Heading style={h1}>Welcome to Alto Whisky</Heading>
        <Text style={text}>Hello {firstName},</Text>
        <Text style={text}>
          Your account has been approved. You now have full access to your Alto Whisky
          portal, including live cask availability, your portfolio, and secure checkout.
        </Text>
        <Section style={{ textAlign: 'center' as const, margin: '4px 0 28px' }}>
          <Button style={button} href={loginUrl}>Sign in to your portal</Button>
        </Section>
        <Text style={text}>
          If you have any questions, simply reply to this email — we're always happy
          to help.
        </Text>
        <Text style={sig}>
          Warm regards,<br />
          The Alto Whisky Team
        </Text>
        <Text style={footer}>
          <Link href={loginUrl} style={link}>{loginUrl}</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your Alto Whisky portal is ready',
  displayName: 'Client approved',
  previewData: { firstName: 'Jane', loginUrl: 'https://www.altowhisky.com/portal/login' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { backgroundColor: 'hsl(220, 26%, 14%)', padding: '24px 24px', textAlign: 'center' as const }
const logo = { display: 'block', margin: '0 auto', height: 'auto' }
const h1 = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '30px', fontWeight: 500 as const, color: 'hsl(220, 26%, 14%)', margin: '0 0 20px', lineHeight: '1.2' }
const text = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '15px', color: 'hsl(0, 0%, 25%)', lineHeight: '1.6', margin: '0 0 18px' }
const sig = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '15px', color: 'hsl(0, 0%, 25%)', lineHeight: '1.6', margin: '24px 0 24px' }
const button = { backgroundColor: 'hsl(24, 72%, 40%)', color: '#ffffff', fontFamily: "'Inter', Arial, sans-serif", fontSize: '12px', fontWeight: 600 as const, letterSpacing: '0.2em', textTransform: 'uppercase' as const, borderRadius: '2px', padding: '14px 28px', textDecoration: 'none', display: 'inline-block' }
const link = { color: 'hsl(24, 72%, 40%)', textDecoration: 'underline' }
const footer = { fontFamily: "'Inter', Arial, sans-serif", fontSize: '12px', color: 'hsl(0, 0%, 45%)', lineHeight: '1.5', margin: '24px 0 0', borderTop: '1px solid hsl(0, 0%, 90%)', paddingTop: '18px' }
