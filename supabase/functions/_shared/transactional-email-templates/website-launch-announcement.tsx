/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
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
  senderRole?: string
  senderEmail?: string
  senderPhone?: string
  senderMobile?: string
  senderAddress?: string
  siteUrl?: string
  portalUrl?: string
  newsUrl?: string
  offerCode?: string
  offerExpiry?: string
}

const Email = ({
  firstName = 'there',
  senderName = 'Nicholas Akpama',
  senderRole = 'Director',
  senderEmail = 'n.akpama@altowhisky.com',
  senderPhone = '+44 20 4586 3717',
  senderMobile = '+44 7446 829841',
  senderAddress = '71–75 Shelton Street, Covent Garden, London, WC2H 9JQ',
  siteUrl = 'https://www.altowhisky.com',
  portalUrl = 'https://www.altowhisky.com/portal/signup',
  newsUrl = 'https://www.altowhisky.com/news',
  offerCode = 'ALTO15',
  offerExpiry = 'Tuesday 21 July',
}: Props) => {
  const telHref = (n: string) => `tel:${n.replace(/[^+\d]/g, '')}`
  return (
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
          As a thank you to our existing clients, please find your exclusive
          client discount below.
        </Text>

        {/* Discount ticket */}
        <Section style={ticketWrap}>
          <table
            role="presentation"
            cellPadding={0}
            cellSpacing={0}
            border={0}
            width="100%"
            style={ticketTable}
          >
            <tbody>
              <tr>
                <td style={ticketStub}>
                  <div style={ticketStubLabel}>ALTO</div>
                  <div style={ticketStubBig}>15%</div>
                  <div style={ticketStubSmall}>OFF</div>
                </td>
                <td style={ticketPerf} aria-hidden="true"></td>
                <td style={ticketBody}>
                  <div style={ticketEyebrow}>Client Reward</div>
                  <div style={ticketHeadline}>Fifteen percent off</div>
                  <div style={ticketMeta}>
                    Use code{' '}
                    <span style={ticketCode}>{offerCode}</span>
                  </div>
                  <div style={ticketExpiry}>
                    Valid until {offerExpiry}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Text style={text}>
          If you have any trouble registering, just reply to this email and
          we'll sort it out.
        </Text>

        <Text style={sigLead}>Best regards,</Text>

        {/* Signature */}
        <Section style={sigWrap}>
          <table
            role="presentation"
            cellPadding={0}
            cellSpacing={0}
            border={0}
            style={{ borderCollapse: 'collapse' as const }}
          >
            <tbody>
              <tr>
                <td style={sigInfoCell}>
                  <div style={sigName}>{senderName}</div>
                  <div style={sigRole}>{senderRole} · Alto Whisky</div>
                  <div style={sigLine}>
                    <span style={sigLabel}>E</span>{' '}
                    <Link href={`mailto:${senderEmail}`} style={sigLink}>
                      {senderEmail}
                    </Link>
                  </div>
                  <div style={sigLine}>
                    <span style={sigLabel}>T</span>{' '}
                    <Link href={telHref(senderPhone)} style={sigLink}>
                      {senderPhone}
                    </Link>
                    <span style={sigSep}> · </span>
                    <span style={sigLabel}>M</span>{' '}
                    <Link href={telHref(senderMobile)} style={sigLink}>
                      {senderMobile}
                    </Link>
                  </div>
                  <div style={sigLine}>
                    <span style={sigLabel}>W</span>{' '}
                    <Link href={siteUrl} style={sigLink}>
                      www.altowhisky.com
                    </Link>
                  </div>
                  <div style={sigAddress}>{senderAddress}</div>
                </td>
                <td style={sigDividerCell} aria-hidden="true"></td>
                <td style={sigSpacerCell} aria-hidden="true"></td>
                <td style={sigLogoCell}>
                  <Img
                    src="https://altowhisky.com/__l5e/assets-v1/0e654173-6548-4cb5-8108-f18c2625b609/alto-logo-email.png"
                    alt="Alto Whisky"
                    width="94"
                    style={{ display: 'block', height: 'auto', margin: '0 auto' }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          Alto Whisky · <Link href={siteUrl} style={link}>www.altowhisky.com</Link>
        </Text>
      </Container>
    </Body>
  </Html>
  )
}

export const template = {
  component: Email,
  subject: 'Our new Alto Whisky website and client portal are live',
  displayName: 'Website launch announcement',
  previewData: {
    firstName: 'Jane',
    senderName: 'Nicholas Akpama',
    senderRole: 'Director',
    senderEmail: 'n.akpama@altowhisky.com',
    senderPhone: '+44 20 4586 3717',
    senderMobile: '+44 7446 829841',
    senderAddress: '71–75 Shelton Street, Covent Garden, London, WC2H 9JQ',
    siteUrl: 'https://www.altowhisky.com',
    portalUrl: 'https://www.altowhisky.com/portal/signup',
    newsUrl: 'https://www.altowhisky.com/news',
    offerCode: 'ALTO15',
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

/* Discount ticket */
const ticketWrap = {
  margin: '8px 0 28px',
}
const ticketTable = {
  borderCollapse: 'separate' as const,
  border: '1px solid hsl(24, 72%, 40%)',
  borderRadius: '4px',
  overflow: 'hidden' as const,
  backgroundColor: 'hsl(40, 30%, 97%)',
}
const ticketStub = {
  width: '110px',
  backgroundColor: 'hsl(220, 26%, 14%)',
  color: '#ffffff',
  padding: '18px 10px',
  textAlign: 'center' as const,
  verticalAlign: 'middle' as const,
  fontFamily: "'Inter', Arial, sans-serif",
}
const ticketStubLabel = {
  fontSize: '10px',
  letterSpacing: '0.28em',
  color: 'hsl(24, 72%, 55%)',
  marginBottom: '4px',
}
const ticketStubBig = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '38px',
  lineHeight: '1',
  fontWeight: 500 as const,
  color: '#ffffff',
}
const ticketStubSmall = {
  fontSize: '11px',
  letterSpacing: '0.32em',
  marginTop: '2px',
  color: 'hsl(40, 20%, 85%)',
}
const ticketPerf = {
  width: '1px',
  borderLeft: '2px dashed hsl(24, 72%, 40%)',
  padding: 0,
}
const ticketBody = {
  padding: '18px 20px',
  verticalAlign: 'middle' as const,
  fontFamily: "'Inter', Arial, sans-serif",
}
const ticketEyebrow = {
  fontSize: '10px',
  letterSpacing: '0.28em',
  textTransform: 'uppercase' as const,
  color: 'hsl(24, 72%, 40%)',
  marginBottom: '4px',
}
const ticketHeadline = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '20px',
  color: 'hsl(220, 26%, 14%)',
  marginBottom: '8px',
}
const ticketMeta = {
  fontSize: '13px',
  color: 'hsl(0, 0%, 25%)',
  marginBottom: '4px',
}
const ticketCode = {
  display: 'inline-block',
  fontFamily: "'Courier New', monospace",
  fontSize: '13px',
  fontWeight: 700 as const,
  letterSpacing: '0.12em',
  color: 'hsl(220, 26%, 14%)',
  backgroundColor: '#ffffff',
  border: '1px dashed hsl(24, 72%, 40%)',
  padding: '3px 8px',
  borderRadius: '2px',
  marginLeft: '2px',
}
const ticketExpiry = {
  fontSize: '12px',
  color: 'hsl(0, 0%, 45%)',
}

/* Signature */
const sigLead = {
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '15px',
  color: 'hsl(0, 0%, 25%)',
  margin: '24px 0 12px',
}
const sigWrap = {
  borderTop: '1px solid hsl(0, 0%, 88%)',
  paddingTop: '16px',
  margin: '0 0 8px',
}
const sigLogoCell = {
  width: '110px',
  height: '110px',
  backgroundColor: 'hsl(220, 26%, 14%)',
  textAlign: 'center' as const,
  verticalAlign: 'middle' as const,
  padding: 0,
}
const sigDividerCell = {
  width: '1px',
  height: '110px',
  borderLeft: '1px solid hsl(24, 72%, 40%)',
  padding: 0,
}
const sigSpacerCell = {
  width: '14px',
  height: '110px',
  padding: 0,
}
const sigInfoCell = {
  height: '110px',
  verticalAlign: 'middle' as const,
  paddingRight: '12px',
  fontFamily: "'Inter', Arial, sans-serif",
}
const sigName = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: '18px',
  color: 'hsl(220, 26%, 14%)',
  lineHeight: '1.2',
}
const sigRole = {
  fontSize: '11px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: 'hsl(24, 72%, 40%)',
  margin: '4px 0 10px',
}
const sigLine = {
  fontSize: '12px',
  color: 'hsl(0, 0%, 25%)',
  lineHeight: '1.6',
}
const sigLabel = {
  display: 'inline-block',
  width: '14px',
  color: 'hsl(0, 0%, 55%)',
  fontSize: '10px',
  letterSpacing: '0.1em',
}
const sigSep = {
  color: 'hsl(0, 0%, 65%)',
}
const sigLink = {
  color: 'hsl(24, 72%, 40%)',
  textDecoration: 'none',
}
const sigAddress = {
  fontSize: '11px',
  color: 'hsl(0, 0%, 45%)',
  marginTop: '8px',
  lineHeight: '1.5',
}

const hr = {
  border: 'none',
  borderTop: '1px solid hsl(0, 0%, 90%)',
  margin: '20px 0 12px',
}
const footer = {
  fontFamily: "'Inter', Arial, sans-serif",
  fontSize: '11px',
  color: 'hsl(0, 0%, 45%)',
  lineHeight: '1.5',
  margin: '0',
}
