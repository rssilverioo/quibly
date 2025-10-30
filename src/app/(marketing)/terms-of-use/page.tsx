import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service – Quibly',
  description: 'Review the terms and conditions for using Quibly. Transparency and trust matter.',
  openGraph: {
    title: 'Terms of Service – Quibly',
    description: 'Review the terms and conditions for using Quibly. Transparency and trust matter.',
    url: 'https://quibly.com/terms',
    siteName: 'Quibly',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Quibly Terms',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service – Quibly',
    description: 'Review the terms and conditions for using Quibly.',
    images: ['/og-image.png'],
    creator: '@quibly_app',
  },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-background text-black dark:text-white transition-colors duration-300 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-3xl space-y-6 prose dark:prose-invert">
        <h1>Terms of Service</h1>

        <p>By accessing or using Quibly, you agree to be bound by these Terms of Service. If you do not agree, you may not access or use the platform.</p>

        <h2>Use of the Service</h2>
        <p>
          You must be at least 13 years old to use Quibly. You agree not to misuse the service or help anyone else do so.
        </p>

        <h2>Accounts</h2>
        <p>
          You are responsible for safeguarding your account and any activities under your login. We are not liable for losses or damages due to unauthorized use.
        </p>

        <h2>Content</h2>
        <p>
          You retain ownership of your content. However, you grant Quibly a limited license to use, store, and process your data to provide the service.
        </p>

        <h2>Termination</h2>
        <p>
          We may suspend or terminate access to the service at any time, with or without cause or notice.
        </p>

        <h2>Changes</h2>
        <p>
          We reserve the right to update these Terms at any time. Continued use after changes means you accept the revised terms.
        </p>

        <p>Last updated: July 7, 2025</p>
      </div>
    </main>
  )
}
