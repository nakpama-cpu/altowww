/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Img,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Alto Whisky verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://altowhisky.com/__l5e/assets-v1/0e654173-6548-4cb5-8108-f18c2625b609/alto-logo-email.png" alt="Alto Whisky" width="140" style={logo} />
        <Heading style={h1}>Confirm your identity</Heading>
        <Text style={text}>Enter this code to continue:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          This code will expire shortly. If you didn't request it, you can
          safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const logo = { display: "block", margin: "0 0 32px", height: "auto" }
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
  margin: '0 0 16px',
}
const codeStyle = {
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: '28px',
  fontWeight: 600 as const,
  letterSpacing: '0.3em',
  color: 'hsl(220, 26%, 14%)',
  backgroundColor: 'hsl(40, 10%, 96%)',
  padding: '18px 24px',
  borderRadius: '2px',
  margin: '0 0 28px',
  display: 'inline-block',
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
