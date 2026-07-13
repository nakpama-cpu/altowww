/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email to access the {siteName} portal</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>ALTO WHISKY</Text>
        <Heading style={h1}>Confirm your email</Heading>
        <Text style={text}>
          Thank you for registering with{' '}
          <Link href={siteUrl} style={link}>Alto Whisky</Link>. Please confirm
          the address <Link href={`mailto:${recipient}`} style={link}>{recipient}</Link>{' '}
          to complete your registration.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm Email
        </Button>
        <Text style={text}>
          Once confirmed, our team will review your account before granting
          access to the portfolio portal. You'll receive a follow-up email
          from us as soon as your account is approved.
        </Text>
        <Text style={footer}>
          If you didn't create an account with Alto Whisky, you can safely
          ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', Arial, sans-serif",
}
const container = { padding: '32px 28px', maxWidth: '560px' }
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
