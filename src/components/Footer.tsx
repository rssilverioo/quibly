'use client'

import Link from "next/link";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations('Landing.footer');

  const productLinks = [
    { name: t('features'), href: "/#features", isRoute: true },
    { name: t('download'), href: "#hero", disabled: true },
    { name: t('pricing'), href: "/pricing", isRoute: true },
    { name: t('aiModes'), href: "#features", disabled: true },
  ];

  const companyLinks = [
    { name: t('manifesto'), href: "/manifesto" },
    { name: t('careers'), href: "/careers", disabled: true },
    { name: t('terms'), href: "/terms" },
    { name: t('privacy'), href: "/privacy-policy" },
  ];

  const renderLink = (link: any) => {
    const commonClasses = "text-sm transition-colors";
    if (link.disabled) {
      return (
        <span
          key={link.name}
          className={`${commonClasses} text-gray-400 cursor-not-allowed line-through`}
        >
          {link.name}
        </span>
      );
    }

    if (link.isRoute) {
      return (
        <Link
          key={link.name}
          href={link.href}
          className={`${commonClasses} text-gray-600 hover:text-black`}
        >
          {link.name}
        </Link>
      );
    }

    return (
      <a
        key={link.name}
        href={link.href}
        className={`${commonClasses} text-gray-600 hover:text-black`}
      >
        {link.name}
      </a>
    );
  };

  return (
    <footer id="footer" className="bg-white border-t border-gray-200 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-black mb-4 block">
              Quibly
            </Link>
            <p className="text-gray-600 text-sm">
              {t('tagline')}
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-semibold text-black mb-4">{t('product')}</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-semibold text-black mb-4">{t('company')}</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-black mb-4">{t('contact')}</h3>
            <a
              href="mailto:support@tryquibly.com"
              className="text-gray-600 hover:text-black transition-colors text-sm"
            >
              support@tryquibly.com
            </a>
          </div>

        </div>
        <div className=" w-full border-t border-gray-200 p-4 mt-6 text-start">
          <p className="text-gray-400 text-xs">
            {t('copyright')}
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
