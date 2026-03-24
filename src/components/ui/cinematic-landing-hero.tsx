'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import { FaApple } from 'react-icons/fa';
import { GrAndroid } from 'react-icons/gr';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

/* ── Phone Frame ─────────────────────────────────────── */
function PhoneFrame({
  children,
  size = 'md',
  className = '',
}: {
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const w = size === 'sm' ? 'w-[220px] md:w-[240px]' : 'w-[260px] md:w-[300px]';
  const minH = size === 'sm' ? 'min-h-[400px] md:min-h-[440px]' : 'min-h-[480px] md:min-h-[540px]';
  return (
    <div className={`${w} bg-black rounded-[40px] p-3 shadow-2xl border border-gray-700/50 ${className}`}>
      <div className="relative bg-[#0A0A0F] rounded-[32px] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10" />
        <div className={`${minH} flex flex-col`}>{children}</div>
      </div>
    </div>
  );
}

/* ── Quiz Screen Mockup ──────────────────────────────── */
function QuizMockup() {
  const opts = [
    { letter: 'A', text: 'A localized regional conflict' },
    { letter: 'B', text: 'A hypothetical global conflict' },
    { letter: 'C', text: 'A historical event from the 20th century' },
    { letter: 'D', text: 'A period of economic prosperity' },
  ];

  return (
    <div className="w-full h-full px-4 pt-12 pb-4 flex flex-col">
      <div className="flex items-center justify-center mb-3 relative">
        <span className="text-white/50 text-xs absolute left-0">&larr;</span>
        <span className="text-white text-xs font-semibold">WW3</span>
      </div>
      <div className="flex gap-1 justify-center mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
        ))}
      </div>
      <p className="text-[10px] text-white/40 font-medium tracking-wider mb-1">
        QUESTION 1 OF 15
      </p>
      <p className="text-white font-bold text-sm leading-snug mb-4">
        World War III is primarily described as what type of event?
      </p>
      <div className="space-y-2 flex-1">
        {opts.map((opt) => (
          <div
            key={opt.letter}
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
          >
            <span className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-bold text-white/50 shrink-0">
              {opt.letter}
            </span>
            <span className="text-white/80 text-[11px] leading-tight">
              {opt.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Flashcard Screen Mockup ─────────────────────────── */
function FlashcardMockup() {
  return (
    <div className="w-full h-full px-4 pt-12 pb-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-xs">&larr;</span>
          <span className="text-white text-xs font-semibold">Mitochondria</span>
        </div>
        <span className="text-white/40 text-[10px]">14 of 25</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full mb-auto">
        <div className="h-full w-[56%] bg-blue-500 rounded-full" />
      </div>
      <div className="flex-1 flex items-center justify-center py-6">
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col min-h-[200px]">
          <span className="text-[10px] text-white/30 font-medium tracking-wider mb-auto">
            FRONT
          </span>
          <p className="text-white font-semibold text-base text-center my-auto leading-snug">
            How does ATP synthase produce ATP?
          </p>
          <div />
        </div>
      </div>
      <p className="text-white/30 text-xs text-center">Tap to flip</p>
    </div>
  );
}

/* ── Streak Screen Mockup ────────────────────────────── */
function StreakMockup() {
  const streakDays = [3, 9, 11, 13];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="w-full h-full px-4 pt-12 pb-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white font-bold text-sm">Study Streak</span>
        <span className="text-white/40 text-xs">&times;</span>
      </div>
      <div className="flex rounded-xl border border-white/10 bg-white/[0.03] mb-4">
        <div className="flex-1 text-center py-2.5 border-r border-white/10">
          <p className="text-sm">🔥</p>
          <p className="text-white font-bold text-lg leading-none">15</p>
          <p className="text-[9px] text-white/40 tracking-wider mt-0.5">
            CURRENT
          </p>
        </div>
        <div className="flex-1 text-center py-2.5">
          <p className="text-sm">🔥</p>
          <p className="text-white font-bold text-lg leading-none">15</p>
          <p className="text-[9px] text-white/40 tracking-wider mt-0.5">
            LONGEST
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/30 text-[10px]">&lsaquo;</span>
        <span className="text-white text-xs font-semibold">March 2026</span>
        <span className="text-white/30 text-[10px]">&rsaquo;</span>
      </div>
      <div className="grid grid-cols-7 gap-y-1.5 mb-1">
        {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((d) => (
          <span
            key={d}
            className="text-[8px] text-white/30 text-center font-medium"
          >
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const isStreak = streakDays.includes(day);
          const isToday = day === 13;
          return (
            <div key={day} className="flex items-center justify-center h-6">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium ${
                  isStreak
                    ? 'bg-blue-500 text-white'
                    : isToday
                      ? 'border border-white/40 text-white'
                      : 'text-white/40'
                }`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-auto flex rounded-xl border border-white/10 bg-white/[0.03]">
        <div className="flex-1 text-center py-2 border-r border-white/10">
          <p className="text-white font-bold text-sm">3</p>
          <p className="text-[9px] text-white/40">Days studied</p>
        </div>
        <div className="flex-1 text-center py-2">
          <p className="text-white font-bold text-sm">0h 17m</p>
          <p className="text-[9px] text-white/40">Total time</p>
        </div>
      </div>
    </div>
  );
}

/* ── Cinematic Landing Hero ──────────────────────────── */
export function CinematicLandingHero() {
  const t = useTranslations('Landing.cinematic');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Load animation (plays immediately, no scroll) ──
      const intro = gsap.timeline({ delay: 0.2 });
      intro.fromTo(
        '.ch-badge',
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
      );
      intro.fromTo(
        '.ch-title-1',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.3'
      );
      intro.fromTo(
        '.ch-title-gradient',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      );
      intro.fromTo(
        '.ch-subtitle',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      );
      intro.fromTo(
        '.ch-cta-buttons',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      );

      // ── Scroll animation ──
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
        },
        (context) => {
          const { isDesktop } = context.conditions!;
          const scrollLength = isDesktop ? 4000 : 2800;

          gsap.set(wrapperRef.current, { height: scrollLength + 'px' });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top top',
              end: `+=${scrollLength}`,
              pin: pinRef.current,
              scrub: 1,
              anticipatePin: 1,
            },
          });

          // Phase 1: Text shrinks and shifts up, phones + glass panel rise
          tl.to(
            '.ch-hero-text',
            { y: isDesktop ? -80 : -50, scale: 0.88, duration: 2, ease: 'power2.inOut' },
            0
          );
          tl.fromTo(
            '.ch-glass-panel',
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
            0.5
          );
          tl.fromTo(
            '.ch-phone-center',
            { opacity: 0, y: 150 },
            { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' },
            0.8
          );
          if (isDesktop) {
            tl.fromTo(
              '.ch-phone-left',
              { opacity: 0, y: 120, rotate: -12 },
              { opacity: 1, y: 0, rotate: -6, duration: 1.5, ease: 'power3.out' },
              1.1
            );
            tl.fromTo(
              '.ch-phone-right',
              { opacity: 0, y: 120, rotate: 12 },
              { opacity: 1, y: 0, rotate: 6, duration: 1.5, ease: 'power3.out' },
              1.3
            );
          }

          // Phase 2: Floating badges pop in
          tl.fromTo(
            '.ch-floating-badge',
            { opacity: 0, scale: 0 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: 0.3,
              ease: 'back.out(2.5)',
            },
            2.5
          );

          // Phase 3: Everything shifts up, hero text fades, bottom CTA enters
          tl.to(
            '.ch-hero-text',
            { opacity: 0, y: isDesktop ? -140 : -80, duration: 1.5, ease: 'power2.in' },
            3.8
          );
          tl.to(
            '.ch-phones-area',
            { y: isDesktop ? -220 : -140, scale: isDesktop ? 0.85 : 0.8, duration: 2.5, ease: 'power2.inOut' },
            4.0
          );
          tl.fromTo(
            '.ch-bottom-cta',
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 2, ease: 'power3.out' },
            5.5
          );

          // Continuous floating for phones
          gsap.to('.ch-phone-center', {
            y: '+=10',
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.5,
          });
          if (isDesktop) {
            gsap.to('.ch-phone-left', {
              y: '+=8',
              duration: 4,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: 1.8,
            });
            gsap.to('.ch-phone-right', {
              y: '+=8',
              duration: 4,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: 2.1,
            });
          }
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative z-10">
      <div
        ref={pinRef}
        className="relative w-full h-screen overflow-hidden bg-[#050508]"
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-blue-400/15 rounded-full blur-[80px] animate-pulse [animation-delay:2s]" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[90px] animate-pulse [animation-delay:4s]" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-start pt-28 md:pt-32 px-4">
          {/* Hero Text Block */}
          <div className="ch-hero-text text-center max-w-3xl mx-auto mb-8 md:mb-12">
            {/* Badge */}
            <div className="ch-badge opacity-0 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/[0.06] border border-white/[0.08] text-blue-200 backdrop-blur-sm">
                ⚡ {t('badge')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6">
              <span className="ch-title-1 block text-white opacity-0">
                {t('title1')}
              </span>
              <span className="ch-title-gradient block bg-gradient-to-r from-blue-300 via-blue-200 to-white bg-clip-text text-transparent opacity-0">
                {t('titleGradient')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="ch-subtitle opacity-0 text-lg md:text-xl text-blue-200/60 max-w-2xl mx-auto mb-8">
              {t('subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="ch-cta-buttons opacity-0 flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-6 rounded-2xl text-lg font-medium transition-all duration-300 min-w-[200px] flex items-center gap-3 shadow-lg shadow-blue-500/25">
                <FaApple className="w-5 h-5" />
                {t('ctaAppStore')}
              </Button>
              <Button className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] text-white px-8 py-6 rounded-2xl text-lg font-medium transition-all duration-300 backdrop-blur-sm min-w-[200px] flex items-center gap-3">
                <GrAndroid className="w-5 h-5" />
                {t('ctaGooglePlay')}
              </Button>
            </div>
          </div>

          {/* Phones Area */}
          <div className="ch-phones-area relative w-full max-w-5xl mx-auto flex-1 flex items-end md:items-center justify-center">
            {/* Liquid glass backdrop (desktop) */}
            <div className="ch-glass-panel opacity-0 absolute inset-x-8 lg:inset-x-16 top-0 bottom-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl hidden md:block" />

            {/* Floating badges */}
            <div className="ch-floating-badge absolute top-8 left-4 md:left-12 lg:left-24 z-30 opacity-0">
              <div className="bg-[#0A0A0F]/90 border border-white/10 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-semibold text-orange-400">
                  {t('badgeStreak')}
                </span>
              </div>
            </div>
            <div className="ch-floating-badge absolute top-20 right-4 md:right-12 lg:right-24 z-30 opacity-0">
              <div className="bg-[#0A0A0F]/90 border border-white/10 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm flex items-center gap-2">
                <span className="text-lg">🎓</span>
                <span className="text-sm font-semibold text-blue-400">
                  {t('badgeLevelUp')}
                </span>
              </div>
            </div>
            <div className="ch-floating-badge absolute bottom-16 left-8 md:left-20 lg:left-32 z-30 opacity-0">
              <div className="bg-[#0A0A0F]/90 border border-white/10 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span className="text-sm font-semibold text-yellow-400">
                  {t('badgeXp')}
                </span>
              </div>
            </div>

            {/* Phone trio */}
            <div className="relative flex items-end justify-center gap-3 lg:gap-6 px-2 z-20">
              {/* Quiz — left (desktop only) */}
              <div className="ch-phone-left opacity-0 hidden md:block -rotate-6 mb-8">
                <PhoneFrame size="sm">
                  <QuizMockup />
                </PhoneFrame>
              </div>

              {/* Flashcard — center (raised, larger) */}
              <div className="ch-phone-center opacity-0 z-10">
                <PhoneFrame>
                  <FlashcardMockup />
                </PhoneFrame>
              </div>

              {/* Streak — right (desktop only) */}
              <div className="ch-phone-right opacity-0 hidden md:block rotate-6 mb-8">
                <PhoneFrame size="sm">
                  <StreakMockup />
                </PhoneFrame>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="ch-bottom-cta opacity-0 absolute bottom-0 left-0 right-0 z-40 text-center pb-10 px-4 bg-gradient-to-t from-[#050508] from-40% via-[#050508]/95 via-70% to-transparent pt-32">
            <h3 className="text-xl md:text-3xl font-bold text-white mb-3 leading-tight max-w-2xl mx-auto">
              {t('ctaHeading')}
            </h3>
            <p className="text-blue-200/50 text-sm md:text-base mb-5 max-w-xl mx-auto">
              {t('ctaSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <div className="relative">
                <Button className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white px-7 py-5 rounded-2xl text-base font-medium transition-all duration-300 backdrop-blur-sm min-w-[180px] flex items-center gap-3">
                  <FaApple className="w-5 h-5" />
                  {t('ctaAppStore')}
                </Button>
                <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  beta
                </Badge>
              </div>
              <div className="relative">
                <Button className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white px-7 py-5 rounded-2xl text-base font-medium transition-all duration-300 backdrop-blur-sm min-w-[180px] flex items-center gap-3">
                  <GrAndroid className="w-5 h-5" />
                  {t('ctaGooglePlay')}
                </Button>
                <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  beta
                </Badge>
              </div>
            </div>
            <p className="text-white/30 text-xs mt-4">{t('ctaTrust')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
