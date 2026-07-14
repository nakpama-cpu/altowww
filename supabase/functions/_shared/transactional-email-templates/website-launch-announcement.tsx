/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  firstName?: string
  senderName?: string
  siteUrl?: string
  portalUrl?: string
  newsUrl?: string
  offerExpiry?: string
}

const Email = ({
  firstName = 'there',
  senderName = '',
  siteUrl = 'https://www.altowhisky.com',
  portalUrl = 'https://www.altowhisky.com/portal/signup',
  newsUrl = 'https://www.altowhisky.com/news',
  offerExpiry = 'Tuesday 21 July',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Our new website and client portal are now live</Preview>
    <Body style={main}>
      <Section style={header}>
        <Img
          src="https://altowhisky.com/__l5e/assets-v1/0e654173-6548-4cb5-8108-f18c2625b609/alto-logo-email.png"
          alt="Alto Whisky"
          width="94"
          style={logo}
        />
      </Section>
      <Container style={container}>
        <Heading style={h1}>Our new website is live</Heading>
        <Text style={text}>Hi {firstName},</Text>
        <Text style={text}>
          I'm pleased to let you know that our new website is now live at{' '}
          <Link href={siteUrl} style={link}>www.altowhisky.com</Link>.
        </Text>
        <Text style={text}>
          Alongside the new site, we've launched a client portal where you'll be
          able to view your cask holdings in one place. To get set up, please
          register using the same email address we hold on file for you — that
          lets our admin team match your records and begin onboarding your
          portfolio to the platform straight away.
        </Text>
        <Section style={{ textAlign: 'center' as const, margin: '4px 0 28px' }}>
          <Button style={button} href={portalUrl}>
            Register for the portal
          </Button>
        </Section>
        <Text style={text}>
          You'll also find our latest market commentary and industry news here:{' '}
          <Link href={newsUrl} style={link}>www.altowhisky.com/news</Link>
        </Text>
        <Text style={text}>
          As a thank you to our existing clients, we're offering 15% off until{' '}
          {offerExpiry}.
        </Text>
        <Text style={text}>
          If you have any trouble registering, just reply to this email and
          we'll sort it out.
        </Text>
        <Text style={sig}>
          Best regards,
          <br />
          <br />
          {senderName ? <>{senderName}<br /><br /></> : null}
          Alto Whisky
        </Text>
        <Text style={footer}>
          <Link href={siteUrl} style={link}>{siteUrl}</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Our new Alto Whisky website and client portal are live',
  displayName: 'Website launch announcement',
  previewData: {
    firstName: 'Jane',
    senderName: 'Sarah',
    siteUrl: 'https://www.altowhisky.com',
    portalUrl: 'https://www.altowhisky.com/portal/signup',
    newsUrl: 'https://www.altowhisky.com/news',
    offerExpiry: 'Tuesday 21 July',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Inter', Arial, sans-serif",
}
const container = {
  padding: '32px 28px',
  maxWidth: '560px',
}
const header = {
  backgroundColor: 'hsl(220, 26%, 14%)',
  padding: '24px 24px',
  textAlign: 'center' as const,
}
const logo = {
  display: 'block',
  margin: '0 auto',
  height: 'auto',
}
const h1 = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '28px',
  fontWeight: 500 as const,
  color: 'hsl(220, 26%, 14%)',
  margin: '0 0 20px',
  lineHeight: '1.2',
}
const text = {
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '15px',
  color: 'hsl(0, 0%, 25%)',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const link = {
  color: 'hsl(24, 72%, 40%)',
  textDecoration: 'underline',
}
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
}
const sig = {
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '15px',
  color: 'hsl(0, 0%, 25%)',
  lineHeight: '1.6',
  margin: '24px 0 24px',
}
const footer = {
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '12px',
  color: 'hsl(0, 0%, 45%)',
  lineHeight: '1.5',
  margin: '24px 0 0',
  borderTop: '1px solid hsl(0, 0%, 90%)',
  paddingTop: '18px',
}
