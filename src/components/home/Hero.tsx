"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";
import { useRef, useEffect } from "react";

export function Hero() {
  const t = useTranslations('Hero');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  
  // Mouse tracking for orbs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth - 0.5) * 50);
      mouseY.set((clientY / innerHeight - 0.5) * 50);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={ref} className="relative isolate min-h-screen flex items-center justify-center overflow-hidden mesh-gradient">
      {/* Dynamic Background Orbs */}
      <motion.div 
        style={{ y: backgroundY, x: springX, rotate: springY }}
        className="absolute inset-0 -z-20 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/30 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-500/30 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-1000" />
      </motion.div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass inline-flex items-center rounded-full px-4 py-1.5 mb-12 border border-white/10 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]"
        >
          <span className="flex items-center gap-2 technical-badge text-indigo-400">
             <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            {t('badge')}
          </span>
        </motion.div>

        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-7xl sm:text-[10rem] font-black tracking-tighter leading-[0.85] text-foreground mb-8">
            <span className="block">{t('title_prefix')}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-200 to-indigo-500 drop-shadow-2xl">
              {t('title_suffix')}
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-xl sm:text-3xl leading-relaxed text-muted-foreground max-w-4xl mx-auto font-extralight tracking-tight"
        >
          {t('description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <Link href="#tools" className="w-full sm:w-auto group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-40 group-hover:opacity-100 transition duration-700 animate-pulse"></div>
            <Button size="lg" className="relative w-full sm:w-auto rounded-full px-12 py-8 text-xl font-black bg-white text-black dark:bg-white dark:text-black hover:scale-105 transition-transform duration-500 focus-glow">
              {t('cta_primary')}
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
            </Button>
          </Link>
          <Link href="/about" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto rounded-full px-12 py-8 text-xl glass-button text-foreground hover:bg-white/10 focus-glow">
              {t('cta_secondary')}
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 flex flex-wrap items-center justify-center gap-x-16 gap-y-8 text-[12px] technical-badge text-muted-foreground"
        >
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="w-5 h-5 text-green-400" />
            </div>
            <span>{t('feature_privacy')}</span>
          </div>
          <div className="flex items-center gap-3 group cursor-default">
             <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <span>{t('feature_speed')}</span>
          </div>
          <div className="flex items-center gap-3 group cursor-default">
             <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <span>{t('feature_free')}</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background to-transparent z-10" />
    </div>
  );
}
