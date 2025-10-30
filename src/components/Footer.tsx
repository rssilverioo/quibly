'use client'

import Link from "next/link";

const Footer = () => {
  const productLinks = [
  { name: "Features", href: "/#features", isRoute: true },
    { name: "Download", href: "#hero", disabled: true },
    { name: "Pricing", href: "/pricing", isRoute: true },
    { name: "AI Modes", href: "#features", disabled: true },
  ];

  const companyLinks = [
    { name: "Manifesto", href: "/manifesto" },
    { name: "Careers", href: "/careers", disabled: true },
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
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
              The invisible AI that turns conversations into actionable insights.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-semibold text-black mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-semibold text-black mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-black mb-4">Contact</h3>
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
            © 2025 Quibly— All rights reserved.
          </p>
        </div>
  
      </div>
    </footer>
  );
};

export default Footer;
