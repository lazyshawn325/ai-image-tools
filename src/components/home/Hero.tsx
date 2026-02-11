"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <div className="relative isolate pt-14 overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-[100px] animate-aurora mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-full h-full bg-gradient-to-tl from-blue-500/10 via-teal-500/5 to-transparent blur-[100px] animate-aurora animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-pulse-slow"></div>
      </div>
      
      <div className="py-24 sm:py-32 lg:pb-40 relative">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl animate-float delay-100 hidden lg:block"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-float delay-700 hidden lg:block"></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <div className="rounded-full px-4 py-1.5 text-sm font-medium ring-1 ring-inset ring-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-sm hover:bg-indigo-500/10 transition-colors cursor-default">
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  {t('badge')}
                </span>
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl mb-8 drop-shadow-sm"
            >
              {t('title_prefix')}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy bg-[length:200%_200%] pb-2">
                {t('title_suffix')}
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto"
            >
              {t('description')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"
            >
              <Link href="#tools" className="w-full sm:w-auto">
                <Button size="lg" className="relative overflow-hidden w-full sm:w-auto rounded-full px-8 py-6 text-lg font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 transition-all group">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  {t('cta_primary')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                 <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800 hover:bg-white/80 dark:hover:bg-zinc-800/80">
                  {t('cta_secondary')}
                </Button>
              </Link>
            </motion.div>

            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.8, delay: 0.5 }}
               className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>{t('feature_privacy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>{t('feature_speed')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <span>{t('feature_free')}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
    </div>
  );
}
