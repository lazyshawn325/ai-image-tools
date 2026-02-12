"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";
import { useRef } from "react";

export function Hero() {
  const t = useTranslations('Hero');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative isolate min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 -z-20 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-1000" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)] pointer-events-none" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card inline-flex items-center rounded-full px-4 py-1.5 mb-8 border border-indigo-500/30 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]"
        >
          <span className="flex items-center gap-2 technical-badge text-indigo-600 dark:text-indigo-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            {t('badge')} <Sparkles className="w-3.5 h-3.5 ml-1 text-yellow-500" />
          </span>
        </motion.div>

        <motion.h1
          style={{ y: textY }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-8xl font-black tracking-tighter text-foreground mb-6 drop-shadow-sm"
        >
          {t('title_prefix')}
          <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400 glow-text leading-[1.1] pb-2">
            {t('title_suffix')}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-xl sm:text-2xl leading-8 text-muted-foreground max-w-3xl mx-auto font-light"
        >
          {t('description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="#tools" className="w-full sm:w-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500 animate-tilt"></div>
            <Button size="lg" className="relative w-full sm:w-auto rounded-full px-10 py-7 text-lg font-bold bg-background text-foreground border border-border/50 hover:bg-background/90 transition-all focus-glow">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 group-hover:text-foreground transition-all">
                {t('cta_primary')}
              </span> 
              <ArrowRight className="ml-2 h-5 w-5 text-indigo-500 group-hover:text-foreground transition-colors" />
            </Button>
          </Link>
          <Link href="/about" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto rounded-full px-10 py-7 text-lg glass-button hover:bg-white/20 dark:hover:bg-white/10 text-foreground focus-glow">
              {t('cta_secondary')}
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-[10px] technical-badge text-muted-foreground"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>{t('feature_privacy')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>{t('feature_speed')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/5 hover:bg-white/10 transition-colors">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>{t('feature_free')}</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </div>
  );
}
