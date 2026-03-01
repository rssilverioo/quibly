'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const HeroSection = () => {
  const t = useTranslations('Landing.hero');

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#dbeafe] via-white to-[#c7d2fe] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] text-black dark:text-white transition-colors"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-[20%] top-[25%] w-[600px] h-[600px] bg-blue-300/40 dark:bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute right-[15%] bottom-[15%] w-[500px] h-[500px] bg-blue-400/30 dark:bg-blue-700/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          {t('headlineTop')}<br />
          <span className="text-gray-700 dark:text-gray-300">{t('headlineBottom')}</span>
        </h1>

        <p className="text-gray-700 dark:text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="relative mx-auto w-fit p-6 rounded-2xl border bg-white/50 dark:bg-white/5 shadow-xl backdrop-blur-md border-gray-200 dark:border-white/10 transition-all">
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/60 to-white/0 dark:from-blue-400/10 dark:to-white/0 blur-xl z-[-1]" />

          <div className="flex flex-col md:flex-row justify-center items-center gap-4 relative z-10">
            <Link href="/en/register">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg rounded-full p-6 transform transition hover:-translate-y-1"
              >
                {t('startLearning')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
