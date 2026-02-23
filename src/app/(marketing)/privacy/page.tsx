import type { Metadata } from 'next'
import PrivacyPolicySection from '@/components/PrivacyPolicySection'

export const metadata: Metadata = {
  title: 'Privacy Policy – Quibly',
  description: 'Understand how Quibly collects, uses, and protects your data. Your privacy is our priority.',
  openGraph: {
    title: 'Privacy Policy – Quibly',
    description: 'Understand how Quibly collects, uses, and protects your data. Your privacy is our priority.',
    url: 'https://tryquibly.com/privacy',
    siteName: 'Quibly',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Quibly Privacy Policy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy – Quibly',
    description: 'Understand how Quibly collects, uses, and protects your data.',
    images: ['/og-image.png'],
    creator: '@usequibly',
  },
}

export default function PrivacyPage() {
  return <PrivacyPolicySection />
}
