'use client'

import {  FiUpload } from 'react-icons/fi'
import { GiBrain } from "react-icons/gi";
import { RiQrScanLine } from "react-icons/ri";

const FeaturePreview = () => {
  return (
    <section
      id="features"
      className="py-20 bg-white dark:bg-black text-black dark:text-white"
    >
      <div className="container mx-auto px-6">
        {/* Título e descrição */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
     Learn with flashcards & quizzes.
          </p>
          <h2 className="text-4xl md:text-5xl font-medium mb-4">
       Drop your PDF, <br /> Quibly takes it from here.

          </h2>
        </div>

        {/* Cards principais */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {/* 1. Voice */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FiUpload className="text-2xl text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload your class material</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
         Your lesson goes in — PDF, slides, notes, anything.
            </p>
          </div>

          {/* 2. Transcription */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <RiQrScanLine  className="text-2xl text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quibly understands</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
          AI extracts the important stuff — no noise, only what matters.
            </p>
          </div>

          {/* 3. Secure */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <GiBrain  className="text-2xl text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">You learn</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
            Flashcards + quizzes generated instantly.
            </p>
          </div>
        </div>

        {/* Previews */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Preview 1 */}
          <div className="glass-dark rounded-2xl p-8 transition-transform duration-300 border border-blue-100 dark:border-blue-900">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg mb-6 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=450"
                alt="AI creating flashcards from your lessons - Quibly"
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">
           AI creating flashcards from your lessons
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
             Quibly identifies key concepts and generates flashcards — so you remember faster.
            </p>
          </div>

          {/* Preview 2 */}
          <div className="glass-dark rounded-2xl p-8 transition-transform duration-300 border border-blue-100 dark:border-blue-900">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg mb-6 flex items-center justify-center">
              <img
                src="https://plus.unsplash.com/premium_photo-1745835775085-866d65d92daf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                alt="  AI transforming your content into flashcards & quizzes"
                className="rounded-lg w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">
           AI transforming your content into flashcards & quizzes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Instant visual organization of complex topics — perfect for understanding the big picture.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturePreview
