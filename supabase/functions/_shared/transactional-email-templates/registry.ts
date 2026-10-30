import * as React from 'npm:react@18.3.1'
import { template as adminNewSignup } from './admin-new-signup.tsx'
import { template as clientApproved } from './client-approved.tsx'
import { template as websiteLaunchAnnouncement } from './website-launch-announcement.tsx'
import { template as invoiceBankTransfer } from './invoice-bank-transfer.tsx'
import { template as adminInvoicePaymentConfirmed } from './admin-invoice-payment-confirmed.tsx'
import { template as adminLowStock } from './admin-low-stock.tsx'
import { template as invoicePalletCardPayment } from './invoice-pallet-card-payment.tsx'
import { template as paymentReceivedPortfolio } from './payment-received-portfolio.tsx'
import { template as invoicePallet2CardPayment } from './invoice-pallet-2-card-payment.tsx'

export interface TemplateEntry {
  component: (props: any) => React.ReactElement
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, any>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'admin-new-signup': adminNewSignup,
  'client-approved': clientApproved,
  'website-launch-announcement': websiteLaunchAnnouncement,
  'invoice-bank-transfer': invoiceBankTransfer,
  'admin-invoice-payment-confirmed': adminInvoicePaymentConfirmed,
  'admin-low-stock': adminLowStock,
  'invoice-pallet-card-payment': invoicePalletCardPayment,
  'payment-received-portfolio': paymentReceivedPortfolio,
  'invoice-pallet-2-card-payment': invoicePallet2CardPayment,
}
