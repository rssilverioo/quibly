import type { Metadata } from 'next'
import { FaApple, FaGooglePlay } from 'react-icons/fa'

type Props = {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params

  return {
    title: 'Join a League on Quibly',
    description: 'You were invited to compete in study challenges. Download Quibly and join!',
    openGraph: {
      title: 'Join a League on Quibly',
      description: 'You were invited to compete in study challenges. Download Quibly and join!',
      url: `https://tryquibly.com/join/${code}`,
      siteName: 'Quibly',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Quibly League Invite',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Join a League on Quibly',
      description: 'You were invited to compete in study challenges. Download Quibly and join!',
      images: ['/og-image.png'],
    },
  }
}

export default async function JoinPage({ params }: Props) {
  const { code } = await params

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-white to-[#c7d2fe] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] text-black dark:text-white flex items-center justify-center px-6 py-20">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-300/40 dark:bg-blue-900/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-blue-400/30 dark:bg-blue-700/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Card */}
        <div className="bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-xl">
          {/* Trophy icon */}
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">&#127942;</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight text-black dark:text-white">
            You&apos;ve been invited<br />to a league!
          </h1>

          <p className="text-gray-400 mb-6">
            Someone wants to compete with you on study challenges. Download Quibly and join the league.
          </p>

          {/* Invite code */}
          <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-6 py-4 mb-8">
            <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">Invite Code</p>
            <p className="text-2xl font-mono font-bold tracking-widest text-blue-400">{code}</p>
          </div>

          {/* Download buttons */}
          <div className="space-y-3 mb-6">
            <a
              href="https://play.google.com/store/apps/details?id=com.quibly.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-4 rounded-2xl text-lg hover:bg-neutral-800 dark:hover:bg-gray-100 transition-colors"
            >
              <FaGooglePlay className="text-xl" />
              Download on Google Play
            </a>

            <a
              href="#"
              className="flex items-center justify-center gap-3 w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-4 rounded-2xl text-lg hover:bg-neutral-800 dark:hover:bg-gray-100 transition-colors"
            >
              <FaApple className="text-2xl" />
              Download on App Store
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs text-gray-500 uppercase">Already have the app?</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>

          {/* Deep link button */}
          <a
            href={`quibly://league/join/${code}`}
            className="flex items-center justify-center gap-2 w-full border border-gray-300 dark:border-white/20 text-black dark:text-white font-medium py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Open in Quibly
          </a>
        </div>

        {/* Footer */}
        <p className="text-gray-500 dark:text-gray-600 text-xs mt-8">
          Free to download &bull; No credit card required &bull; iOS &amp; Android
        </p>
      </div>
    </main>
  )
}
