import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy – Quibly',
  description: 'Understand how Quibly collects, uses, and protects your data. Your privacy is our priority.',
  openGraph: {
    title: 'Privacy Policy – Quibly',
    description: 'Understand how Quibly collects, uses, and protects your data. Your privacy is our priority.',
    url: 'https://quibly.com/privacy',
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
    creator: '@quibly_app',
  },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-background text-black dark:text-white transition-colors duration-300 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-3xl space-y-6 prose dark:prose-invert">
        <h1>Privacy Policy</h1>

        <p>This Privacy Policy explains how Quibly collects, uses, and protects your information.</p>

        <h2>Information We Collect</h2>
        <p>
          We collect data you provide directly (e.g., email, meeting recordings) and usage data (device info, interactions).
        </p>

        <h2>How We Use It</h2>
        <p>
          We use your data to operate, improve, and personalize our services, including AI summarization and recommendations.
        </p>

        <h2>Sharing</h2>
        <p>
          We do not sell your data. We may share it with trusted providers to help us operate our services (e.g., cloud, AI models).
        </p>

        <h2>Data Retention</h2>
        <p>
          We keep your data only as long as needed for service provision, or as required by law.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may access, update, or delete your data by contacting us at <a href="mailto:support@quibly.com">support@quibly.com</a>.
        </p>

        <p>Last updated: July 7, 2025</p>
      </div>
    </main>
  )
}
