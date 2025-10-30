'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaApple } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { GrAndroid } from "react-icons/gr";

const DownloadSection = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      const card = document.getElementById('notealy-card');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', updateMouse);
    return () => window.removeEventListener('mousemove', updateMouse);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 dark:from-gray-400 dark:via-white dark:to-gray-400">
      {/* Fundo com gradientes */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-black/10 dark:bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Card */}
          <div
            id="notealy-card"
            className="relative overflow-hidden bg-black/20 dark:bg-white/30 backdrop-blur-lg border border-white/10 dark:border-black/10 rounded-3xl p-12 text-center"
          >
            {/* Luz que segue o mouse */}
            <div
              className="absolute w-96 h-96 rounded-full pointer-events-none transition-all duration-300 bg-white/10 dark:bg-black/10 blur-3xl"
              style={{ top: position.y - 200, left: position.x - 200 }}
            />

            {/* Textos */}
            <div className="mb-12 relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-black mb-6 leading-tight">
             Level up your study routine with Quibly.
              </h2>
              <p className="text-xl text-gray-300 dark:text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Turn your content into flashcards and quizzes — zero effort, maximum learning. — powered by{' '}
                <span className="font-semibold text-white dark:text-black">Quibly</span>. Try it free today.
              </p>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto relative z-10">
              <div className="relative">
                <Button className="bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 border border-white/20 dark:border-black/20 text-white dark:text-black px-8 py-6 rounded-2xl text-lg font-medium transition-all duration-300 backdrop-blur-sm min-w-[200px] flex items-center gap-3">
                  <FaApple className="w-6 h-6" />
                  Apple
                </Button>
                <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  beta
                </Badge>
              </div>

              <div className="relative">
                <Button className="bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 border border-white/20 dark:border-black/20 text-white dark:text-black px-8 py-6 rounded-2xl text-lg font-medium transition-all duration-300 backdrop-blur-sm min-w-[200px] flex items-center gap-3">
                  <GrAndroid  className="w-6 h-6" />
                  Android
                </Button>
                <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  beta
                </Badge>
              </div>
            </div>

            {/* Rodapé */}
            <p className="text-gray-400 dark:text-gray-600 text-sm mt-8 relative z-10">
              Free trial • No credit card required • Available on all platforms
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
