"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  ImageDown,
  FileImage,
  Maximize2,
  ZoomIn,
  QrCode,
  Wand2,
  Copyright,
  Crop,
  RotateCw,
  Palette,
  Info,
  LayoutGrid,
} from "lucide-react";

import { clsx } from "clsx";

const toolsConfig = [
  { key: 'compress', href: '/compress', icon: ImageDown, badge: '热门', size: 'large' },
  { key: 'upscale', href: '/upscale', icon: ZoomIn, badge: 'AI', size: 'medium' },
  { key: 'removeBg', href: '/remove-bg', icon: Wand2, badge: 'AI', size: 'large' },
  { key: 'convert', href: '/convert', icon: FileImage, size: 'small' },
  { key: 'resize', href: '/resize', icon: Maximize2, size: 'small' },
  { key: 'crop', href: '/crop', icon: Crop, size: 'small' },
  { key: 'rotate', href: '/rotate', icon: RotateCw, size: 'small' },
  { key: 'filters', href: '/filters', icon: Palette, size: 'medium' },
  { key: 'exif', href: '/exif', icon: Info, size: 'small' },
  { key: 'collage', href: '/collage', icon: LayoutGrid, size: 'medium' },
  { key: 'qrcode', href: '/qrcode', icon: QrCode, size: 'small' },
  { key: 'watermark', href: '/watermark', icon: Copyright, size: 'small' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function ToolsGrid() {
  const t = useTranslations('Tools');
  const tNav = useTranslations('Navigation');

  const tools = toolsConfig.map(config => ({
    title: tNav(config.key),
    description: t(`${config.key}_desc`),
    href: config.href,
    icon: <config.icon className={clsx(config.size === 'large' ? "w-10 h-10" : "w-6 h-6")} />,
    badge: config.badge,
    size: config.size,
  }));

  return (
    <section className="py-24 relative overflow-hidden" id="tools">
      {/* Background Decor */}
      <div className="absolute inset-0 mesh-gradient opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl mb-4"
          >
            {t('title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-muted-foreground font-light"
          >
            {t('subtitle')}
          </motion.p>
        </div>
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-4 auto-rows-[180px]"
        >
          {tools.map((tool, idx) => (
            <motion.div 
              key={tool.href} 
              variants={item} 
              className={clsx(
                "h-full border-trace rounded-2xl",
                tool.size === 'large' && "md:col-span-2 md:row-span-2",
                tool.size === 'medium' && "md:col-span-2 md:row-span-1",
                tool.size === 'small' && "md:col-span-1 md:row-span-1"
              )}
            >
              <SpotlightCard
                title={tool.title}
                description={tool.size !== 'small' ? tool.description : undefined}
                href={tool.href}
                icon={tool.icon}
                badge={tool.badge}
                className={clsx(
                  "h-full",
                  tool.size === 'large' ? "p-10" : "p-6"
                )}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
