import type { Metadata } from 'next'
import TermsOfUseSection from '@/components/TermsOfUseSection'

export const metadata: Metadata = {
  title: 'Terms of Use – Quibly',
  description: 'Review the terms and conditions for using Quibly. Transparency and trust matter.',
  openGraph: {
    title: 'Terms of Use – Quibly',
    description: 'Review the terms and conditions for using Quibly. Transparency and trust matter.',
    url: 'https://tryquibly.com/terms',
    siteName: 'Quibly',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Quibly Terms of Use',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Use – Quibly',
    description: 'Review the terms and conditions for using Quibly.',
    images: ['/og-image.png'],
    creator: '@usequibly',
  },
}

export default function TermsPage() {
  return <TermsOfUseSection />
}
