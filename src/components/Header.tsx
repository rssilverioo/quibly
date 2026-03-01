'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { FaArrowCircleRight } from 'react-icons/fa'
import LogoQuibly from '@/app/assets/logo-quibly-white'
import Link from 'next/link'
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from 'next/navigation'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const locale = useLocale();
  const route = useRouter();
  const t = useTranslations('Landing.header');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Bloqueia scroll ao abrir menu mobile
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileOpen])

  const menuItems = [
    { href: '/home/#features', label: t('howItWorks') },
    { href: '/pricing', label: t('pricing') },
{ href: '/home/#faq', label: t('faq') },
    { href: '/careers', label: t('careers'), disabled: true },
  ]

  const textColor = isScrolled ? 'text-black dark:text-white' : 'text-black dark:text-white'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div
        className={`relative max-w-7xl mx-auto transition-all duration-300 rounded-full px-6 py-3 ${
          isScrolled
            ? 'bg-white/5 dark:bg-white/5 shadow-xl backdrop-blur-md border border-black/10 dark:border-white/10'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="absolute -inset-[1px] rounded-full bg-gradient-to-br from-white/60 to-white/0 dark:from-blue-400/10 dark:to-white/0 blur-xl z-[-1]" />

        <div className="flex items-center justify-between relative z-10">
          <Link href="/">
            <LogoQuibly width={150} />
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map(({ href, label, disabled }) =>
              disabled ? (
                <span
                  key={label}
                  className="text-sm text-gray-400 cursor-not-allowed line-through"
                >
                  {label}
                </span>
              ) : (
                <Link
                  key={label}
                  href={href}
                  className="text-sm font-medium transition hover:-translate-y-1 text-black hover:text-neutral-800 dark:text-white dark:hover:text-neutral-300"
                >
                  {label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href={`/${locale}/login`}
              className="text-sm font-medium transition hover:-translate-y-1 text-black hover:text-neutral-800 dark:text-white dark:hover:text-neutral-300"
            >
              {t('login')}
            </Link>
            <Button onClick={() =>  route.push(`/${locale}/register`)}  className="cursor- transition font-medium text-sm px-6 py-2 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
              {t('signup')} <FaArrowCircleRight className="ml-2 -rotate-45" />
            </Button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden z-50 relative">
            <button onClick={() => setIsMobileOpen((prev) => !prev)} aria-label="Toggle menu">
              {isMobileOpen ? (
                <X size={28} className={textColor} />
              ) : (
                <Menu size={28} className={textColor} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu full screen */}
      <div
        className={`fixed inset-0 bg-white dark:bg-black z-40 transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } flex flex-col items-center justify-center space-y-6`}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
          className="absolute top-6 right-6 text-black dark:text-white z-50"
        >
          <X size={32} />
        </button>

        {menuItems.map(({ href, label, disabled }) =>
          disabled ? (
            <span key={label} className="text-lg text-gray-400 line-through">
              {label}
            </span>
          ) : (
            <Link
              key={label}
              href={href}
              onClick={() => setIsMobileOpen(false)}
              className="text-lg font-medium text-black hover:text-neutral-800 dark:text-white dark:hover:text-gray-300"
            >
              {label}
            </Link>
          )
        )}

        <div className="flex flex-col items-center gap-4 mt-4">
          <Link
            href={`/${locale}/login`}
            onClick={() => setIsMobileOpen(false)}
            className="text-sm text-black dark:text-white hover:text-neutral-800 dark:hover:text-gray-300"
          >
            {t('login')}
          </Link>
          <Button
            onClick={() =>  route.push(`/${locale}/register`)}
            className="bg-black  text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-6 py-2 rounded-full text-sm"
          >
            {t('signup')} →
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
