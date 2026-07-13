import * as React from 'npm:react@18.3.1'

// Registry of transactional email templates.
// Add templates by importing them and mapping a kebab-case key to the template object.

export interface TemplateEntry {
  component: (props: any) => React.ReactElement
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, any>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {}
