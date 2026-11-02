/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props { firstName?: string }

const Email = ({ firstName = 'Mark' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your payment for invoice AW-2026-0202 has been received and processed.</Preview>
    <Body style={main}>
      <Section style={header}>
        <Img src="https://altowhisky.com/__l5e/assets-v1/0e654173-6548-4cb5-8108-f18c2625b609/alto-logo-email.png" alt="Alto Whisky" width="94" style={logo} />
      </Section>
      <Container style={container}>
        <Heading style={h1}>Payment received</Heading>
        <Text style={text}>Hi {firstName},</Text>
        <Text style={text}>I hope you’re well.</Text>
        <Text style={text}>I’m pleased to confirm that your payment of £23,310.00 for invoice <span style={bold}>AW-2026-0202</span> — your second pallet of six Blair Athol 2022 casks — has been received and processed. Please find your payment receipt attached.</Text>
        <Text style={text}>You will shortly receive a separate email with the invoice for your third pallet, six Lindores Abbey 2026 casks, along with the payment link.</Text>
        <Text style={text}>Once we’ve received payment for the full portfolio, we’ll arrange for your casks to be moved to ID Spirits in Perth and issue your cask ownership certificates.</Text>
        <Text style={text}>Thank you again, and please feel free to get in touch if you have any questions.</Text>
        <Text style={sigLead}>Warmest regards,</Text>
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
                  <div style={sigName}>Nicholas Akpama</div>
                  <div style={sigRoleWrap}>
                    <div style={sigRoleLine}>Director</div>
                    <div style={sigRoleLine}>Alto Whisky</div>
                  </div>
                  <div style={sigLine}>
                    <span style={sigLabel}>E</span>{' '}
                    <Link href="mailto:n.akpama@altowhisky.com" style={sigLink}>
                      n.akpama@altowhisky.com
                    </Link>
                  </div>
                  <div style={sigLine}>
                    <span style={sigLabel}>T</span>{' '}
                    <Link href="tel:+442045863717" style={sigLink}>
                      +44 20 4586 3717
                    </Link>
                  </div>
                  <div style={sigLine}>
                    <span style={sigLabel}>M</span>{' '}
                    <Link href="tel:+447446829841" style={sigLink}>
                      +44 7446 829841
                    </Link>
                  </div>
                  <div style={sigLine}>
                    <span style={sigLabel}>W</span>{' '}
                    <Link href="https://www.altowhisky.com" style={sigLink}>
                      www.altowhisky.com
                    </Link>
                  </div>
                  <div style={sigAddress}>{'71–75 Shelton Street, Covent Garden, London, WC2H 9JQ'.replace(/([,\s])/g, '$1⁠')}</div>
                </td>
                <td style={sigDividerCell} aria-hidden="true"></td>
                <td style={sigSpacerCell} aria-hidden="true"></td>
                <td style={sigLogoCell}>
                  <table
                    role="presentation"
                    cellPadding={0}
                    cellSpacing={0}
                    border={0}
                    width="112"
                    height="94"
                    style={{ borderCollapse: 'collapse' as const, backgroundColor: 'hsl(220, 26%, 14%)' }}
                  >
                    <tbody>
                      <tr>
                        <td align="center" valign="middle" width="112" height="94" style={{ padding: 0 }}>
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
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Hr style={signatureBottomLine} />
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Alto Whisky — Payment received (invoice AW-2026-0202)',
  displayName: 'Payment received — Mark’s Pallet 2 (Blair Athol)',
  previewData: { firstName: 'Mark' },
} satisfies TemplateEntry

const navy = 'hsl(220, 26%, 14%)'
const copper = 'hsl(24, 72%, 40%)'
const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '560px' }
const header = { backgroundColor: navy, padding: '24px', textAlign: 'center' as const }
const logo = { display: 'block', margin: '0 auto', height: 'auto' }
const h1 = { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '30px', fontWeight: 500 as const, color: navy, margin: '0 0 20px', lineHeight: '1.2' }
const text = { fontSize: '15px', color: 'hsl(0, 0%, 25%)', lineHeight: '1.6', margin: '0 0 18px' }
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
const signatureBottomLine = {
  border: 'none',
  borderTop: '1px solid hsl(0, 0%, 88%)',
  margin: '16px 0 0',
}
const sigLogoCell = {
  textAlign: 'center' as const,
  verticalAlign: 'middle' as const,
  padding: 0,
}
const sigDividerCell = {
  width: '1px',
  borderLeft: '1px solid hsl(24, 72%, 40%)',
  padding: 0,
}
const sigSpacerCell = {
  width: '14px',
  padding: 0,
}
const sigInfoCell = {
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
const sigRoleWrap = {
  margin: '4px 0 10px',
}
const sigRoleLine = {
  fontSize: '11px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: 'hsl(24, 72%, 40%)',
  lineHeight: '1.4',
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
