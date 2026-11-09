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
import { template as invoicePallet3CardPayment } from './invoice-pallet-3-card-payment.tsx'
import { template as invoicePallet4CardPayment } from './invoice-pallet-4-card-payment.tsx'
import { template as paymentReceivedPallet2 } from './payment-received-pallet-2.tsx'
import { template as paymentReceivedPallet3 } from './payment-received-pallet-3.tsx'
import { template as invoicePallet5CardPayment } from './invoice-pallet-5-card-payment.tsx'
import { template as paymentReceivedPallet4 } from './payment-received-pallet-4.tsx'
import { template as invoicePallet6CardPayment } from './invoice-pallet-6-card-payment.tsx'
import { template as paymentReceivedPallet5 } from './payment-received-pallet-5.tsx'

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
  'invoice-pallet-3-card-payment': invoicePallet3CardPayment,
  'invoice-pallet-4-card-payment': invoicePallet4CardPayment,
  'payment-received-pallet-2': paymentReceivedPallet2,
  'payment-received-pallet-3': paymentReceivedPallet3,
  'invoice-pallet-5-card-payment': invoicePallet5CardPayment,
  'payment-received-pallet-4': paymentReceivedPallet4,
  'invoice-pallet-6-card-payment': invoicePallet6CardPayment,
  'payment-received-pallet-5': paymentReceivedPallet5,
}
