'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaApple } from 'react-icons/fa';
import { GrAndroid } from "react-icons/gr";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#dbeafe] via-white to-[#c7d2fe] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] text-black dark:text-white transition-colors"
    >
      {/* Efeitos de luz no fundo */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-[20%] top-[25%] w-[600px] h-[600px] bg-blue-300/40 dark:bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute right-[15%] bottom-[15%] w-[500px] h-[500px] bg-blue-400/30 dark:bg-blue-700/10 blur-[100px] rounded-full" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
   It’s already done.<br />
          <span className="text-gray-700 dark:text-gray-300">You just didn’t ask Quibly yet.</span>
        </h1>

        <p className="text-gray-700 dark:text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Turn any class PDF into learning materials,<br /> Flashcards and quizzes generated instantly — study smarter, not harder.

        </p>

        {/* Card com sombra e glow */}
        <div className="relative mx-auto w-fit p-6 rounded-2xl border bg-white/50 dark:bg-white/5 shadow-xl backdrop-blur-md border-gray-200 dark:border-white/10 transition-all">
          {/* Glow/background do card */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/60 to-white/0 dark:from-blue-400/10 dark:to-white/0 blur-xl z-[-1]" />

          {/* Botões */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 relative z-10">
         <Button
            size="lg"
            className="bg-black dark:bg-white text-white dark:text-black text-base md:text-lg rounded-full p-6 transform transition hover:-translate-y-1 hover:bg-opacity-90"
          >
            <FaApple className="mr-2 text-2xl" />
            Download for Apple
            <Badge className="ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              BETA
            </Badge>
          </Button>

          <Button
            size="lg"
            className="bg-black dark:bg-white text-white dark:text-black text-base md:text-lg rounded-full p-6 transform transition hover:-translate-y-1 hover:bg-opacity-90"
          >
            <GrAndroid  className="mr-2 text-2xl" />
            Download for Android
            <Badge className="ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              BETA
            </Badge>
          </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
