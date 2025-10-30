'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function OneToolSection() {
  return (
    <section className="w-full py-24 px-6 md:px-12 relative overflow-hidden
      bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]
      dark:from-[#dbeafe] dark:via-zinc-400 dark:to-[#c7d2fe] text-white dark:text-black"
    >
      {/* Orbs animadas de fundo */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute top-1/4 left-1/2 w-[600px] h-[600px] rounded-full bg-[#00ffe1] blur-[120px] opacity-30"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-[60%] left-[30%] w-[400px] h-[400px] rounded-full bg-[#0087ff] blur-[100px] opacity-20"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
        />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-100 dark:text-gray-900 drop-shadow-md dark:drop-shadow-none">
          One Tool. Any Class.
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-16">
          {/* Texto lateral */}
          <div className="flex-1 max-w-lg text-center md:text-left">
            <p className="text-gray-300 dark:text-gray-700 text-lg md:text-xl leading-relaxed">
             Quibly works with everything you study.
Upload a PDF, slides, screenshots, or typed notes — our AI transforms it into flashcards and mind maps instantly.
              <br /><br />
            No setup, no integrations, no friction.
            </p>
          </div>

          {/* Grid de ícones */}
          {/* <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4 max-w-md mx-auto">
            <GridIcon src="/assets/icons/pdf.png" alt="PDF" className="row-span-2" />
            <GridIcon src="/assets/icons/googlemeet.svg" alt="Google Meet" className="col-span-2" />
            <GridIcon src="/assets/icons/zoom.svg" alt="Zoom" className="col-span-2" />
            <GridIcon src="/assets/icons/teams.svg" alt="Teams" />
            <GridIcon src="/assets/icons/discord.svg" alt="Discord" />
          </div> */}
        </div>
      </div>
    </section>
  )
}

function GridIcon({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      className={`bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-center shadow-md hover:shadow-blue-500/20 transition-all ${className}`}
    >
      <Image src={src} alt={alt} width={40} height={40} />
    </motion.div>
  )
}
