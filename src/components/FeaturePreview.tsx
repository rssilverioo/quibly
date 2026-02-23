'use client'

import Image from 'next/image';
import { FiUpload } from 'react-icons/fi'
import { GiBrain } from "react-icons/gi";
import { RiQrScanLine } from "react-icons/ri";
import { useTranslations } from 'next-intl';

const FeaturePreview = () => {
  const tLearn = useTranslations('Landing.learn');
  const tSteps = useTranslations('Landing.steps');
  const tFeatures = useTranslations('Landing.features');

  return (
    <section
      id="features"
      className="py-20 bg-white dark:bg-black text-black dark:text-white"
    >
      <div className="container mx-auto px-6">
        {/* Título e descrição */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {tLearn('sectionLabel')}
          </p>
          <h2 className="text-4xl md:text-5xl font-medium mb-4">
            {tLearn('headline')}<br />{tLearn('headlineBreak')}
          </h2>
        </div>

        {/* Cards principais */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* 1. Upload */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FiUpload className="text-2xl text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{tSteps('step1Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {tSteps('step1Desc')}
            </p>
          </div>

          {/* 2. AI processes */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <RiQrScanLine className="text-2xl text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{tSteps('step2Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {tSteps('step2Desc')}
            </p>
          </div>

          {/* 3. You learn */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <GiBrain className="text-2xl text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{tSteps('step3Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {tSteps('step3Desc')}
            </p>
          </div>
        </div>

        {/* Previews */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Preview 1 */}
          <div className="glass-dark rounded-2xl p-8 transition-transform duration-300 border border-blue-100 dark:border-blue-900">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg mb-6 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=450"
                alt="AI creating flashcards from your lessons - Quibly"
                className="rounded-lg w-full h-full object-cover"
                width={800}
                height={450}
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              {tFeatures('card1Title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {tFeatures('card1Desc')}
            </p>
          </div>

          {/* Preview 2 */}
          <div className="glass-dark rounded-2xl p-8 transition-transform duration-300 border border-blue-100 dark:border-blue-900">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg mb-6 flex items-center justify-center">
              <Image
                src="https://plus.unsplash.com/premium_photo-1745835775085-866d65d92daf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                alt="AI transforming your content into quizzes - Quibly"
                className="rounded-lg w-full h-full object-cover"
                width={800}
                height={450}
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              {tFeatures('card2Title')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {tFeatures('card2Desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturePreview
