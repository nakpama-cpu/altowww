/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Img,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteUrl, confirmationUrl }: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to the Alto Whisky portal</Preview>
    <Body style={main}>
      <Section style={header}>
        <Img src="https://altowhisky.com/__l5e/assets-v1/0e654173-6548-4cb5-8108-f18c2625b609/alto-logo-email.png" alt="Alto Whisky" width="94" style={logo} />
      </Section>
      <Container style={container}>
        
        <Heading style={h1}>You've been invited</Heading>
        <Text style={text}>
          You've been invited to join the{' '}
          <Link href={siteUrl} style={link}>Alto Whisky</Link> portfolio
          portal. Accept your invitation below to set up your account.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Accept Invitation
        </Button>
        <Text style={footer}>
          If you weren't expecting this invitation, you can safely ignore
          this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { backgroundColor: 'hsl(220, 26%, 14%)', padding: '24px 24px', textAlign: 'center' as const }
const logo = { display: 'block', margin: '0 auto', height: 'auto' }
const brand = {
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '11px',
  letterSpacing: '0.3em',
  color: 'hsl(24, 72%, 40%)',
  margin: '0 0 32px',
  fontWeight: 600 as const,
}
const h1 = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '30px',
  fontWeight: 500 as const,
  color: 'hsl(220, 26%, 14%)',
  margin: '0 0 24px',
  lineHeight: '1.2',
}
const text = {
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '15px',
  color: 'hsl(0, 0%, 25%)',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const link = { color: 'hsl(24, 72%, 40%)', textDecoration: 'underline' }
const button = {
  backgroundColor: 'hsl(24, 72%, 40%)',
  color: '#ffffff',
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '12px',
  fontWeight: 600 as const,
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  borderRadius: '2px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '4px 0 28px',
}
const footer = {
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '12px',
  color: 'hsl(0, 0%, 45%)',
  lineHeight: '1.5',
  margin: '32px 0 0',
  borderTop: '1px solid hsl(0, 0%, 90%)',
  paddingTop: '20px',
}
