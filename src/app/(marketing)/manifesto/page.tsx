

import ManifestoSection from '@/components/ManifestoSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manifesto | Quibly',
  description: 'Quibly is redefining productivity by capturing, understanding, and summarizing your meetings in real-time with AI. Discover why effort is no longer enough — clarity and leverage are the new edge.',
  openGraph: {
    title: 'Manifesto | Quibly',
    description: 'Discover our vision to rethink productivity. Quibly helps you focus on what matters — while we handle the rest.',
    url: 'https://quibly.com/manifesto',
    siteName: 'Quibly',
    images: [
      {
        url: '/og/manifesto.png',
        width: 1200,
        height: 630,
        alt: 'Quibly Manifesto Banner',
      },
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manifesto | Quibly',
    description: 'AI is not replacing you. It’s enabling you. Read our manifesto.',
    images: ['/og/manifesto.png'],
    creator: "@usequibly",

  },
}

const Manifesto = () => {
  return (
    <ManifestoSection />
  )
}

export default Manifesto
