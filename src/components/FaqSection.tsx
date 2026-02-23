'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

const FaqSection = () => {
  const t = useTranslations('Landing.faq');

  const faqKeys = [1, 2, 3, 4, 5, 6, 7, 8] as const;

  return (
    <section id="faq" className="py-20 bg-white dark:bg-black text-neutral-800 dark:text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('headline')}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            <Mail className="w-5 h-5" />
            <a
              href="mailto:help@tryquibly.com"
              className="hover:text-primary transition-colors underline underline-offset-4"
            >
              help@tryquibly.com
            </a>
          </div>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqKeys.map((num) => (
            <AccordionItem
              key={num}
              value={`item-${num}`}
              className="bg-neutral-100/50 dark:bg-gray-900/50 backdrop-blur-sm border border-neutral-300 dark:border-gray-800 rounded-2xl px-6 py-2 hover:bg-neutral-200/50 dark:hover:bg-gray-900/70 transition-all duration-300"
            >
              <AccordionTrigger className="text-left py-6 text-lg font-medium hover:text-black dark:hover:text-gray-300 transition-colors duration-200 [&[data-state=open]]:text-primary">
                {t(`q${num}`)}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-400 leading-relaxed pb-6 animate-accordion-down">
                {t(`a${num}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="text-center mt-12 p-8 bg-neutral-100/50 dark:bg-gray-900/30 backdrop-blur-sm border border-neutral-300 dark:border-gray-800 rounded-2xl">
          <h3 className="text-xl font-semibold mb-3">{t('stillHaveQuestions')}</h3>
          <p className="text-gray-700 dark:text-gray-400 mb-6">
            {t('supportText')}
          </p>
          <a
            href="mailto:help@tryquibly.com"
            className="inline-flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {t('contactSupport')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
