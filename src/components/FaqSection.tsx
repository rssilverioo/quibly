'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Mail } from 'lucide-react';

const FaqSection = () => {
const faqs = [
  {
    question: "How does Quibly's AI work?",
    answer:
      "Quibly uses advanced AI models to read and understand your study material. You can upload PDFs, slides, images, or typed notes — and Quibly instantly turns them into flashcards, summaries, and mind maps so you learn faster with less effort.",
  },
  {
    question: "Which file formats does Quibly support?",
    answer:
      "Quibly accepts PDFs, images (JPG/PNG), slides (PPT/PPTX), and typed notes. Soon, you’ll also be able to import notes from Notion, Google Docs, and Apple Notes.",
  },
  {
    question: "Does Quibly support multiple languages?",
    answer:
      "Yes! Quibly understands and generates content in more than 50 languages — including English, Portuguese, Spanish, French, and German.",
  },
  {
    question: "Is my data secure with Quibly?",
    answer:
      "Absolutely. Quibly applies end-to-end encryption and follows strict data privacy practices (GDPR and LGPD compliant). Your documents are private and never used to train any AI models.",
  },
  {
    question: "What are the differences between Free and Pro plans?",
    answer:
      "The Free plan includes a monthly limit of uploads and flashcard generations. The Pro plan unlocks unlimited uploads, advanced AI generation, mind maps, and priority processing.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes. You can cancel anytime, with no extra fees. After cancellation, you’ll keep your Pro benefits until the end of the billing cycle.",
  },
  {
    question: "Does Quibly integrate with other tools?",
    answer:
      "Right now, you can upload or drag-and-drop your files directly into Quibly. Soon, we'll integrate with Notion, Google Docs, Google Drive, and Apple Notes so your flashcards are generated automatically.",
  },
  {
    question: "Is there a limit to file size or number of pages?",
    answer:
      "For Free accounts, files up to 20MB and 50 pages are supported. Pro users can upload larger documents with no page limit.",
  },
];


  return (
    <section id="faq" className="py-20 bg-white dark:bg-black text-neutral-800 dark:text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Find answers to the most common questions about Quibly. Still need help?
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
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-neutral-100/50 dark:bg-gray-900/50 backdrop-blur-sm border border-neutral-300 dark:border-gray-800 rounded-2xl px-6 py-2 hover:bg-neutral-200/50 dark:hover:bg-gray-900/70 transition-all duration-300"
            >
              <AccordionTrigger className="text-left py-6 text-lg font-medium hover:text-black dark:hover:text-gray-300 transition-colors duration-200 [&[data-state=open]]:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-400 leading-relaxed pb-6 animate-accordion-down">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="text-center mt-12 p-8 bg-neutral-100/50 dark:bg-gray-900/30 backdrop-blur-sm border border-neutral-300 dark:border-gray-800 rounded-2xl">
          <h3 className="text-xl font-semibold mb-3">Still have questions?</h3>
          <p className="text-gray-700 dark:text-gray-400 mb-6">
            Our support team is here to help you get the most out of Quibly.
          </p>
          <a
            href="mailto:help@tryquibly.com"
            className="inline-flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
