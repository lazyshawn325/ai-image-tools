"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Card } from "@/components/ui/Card";
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

const toolsConfig = [
  { key: 'compress', href: '/compress', icon: ImageDown, badge: '热门' },
  { key: 'convert', href: '/convert', icon: FileImage },
  { key: 'resize', href: '/resize', icon: Maximize2 },
  { key: 'upscale', href: '/upscale', icon: ZoomIn, badge: 'AI' },
  { key: 'removeBg', href: '/remove-bg', icon: Wand2, badge: 'AI' },
  { key: 'crop', href: '/crop', icon: Crop },
  { key: 'rotate', href: '/rotate', icon: RotateCw },
  { key: 'filters', href: '/filters', icon: Palette },
  { key: 'exif', href: '/exif', icon: Info },
  { key: 'collage', href: '/collage', icon: LayoutGrid },
  { key: 'qrcode', href: '/qrcode', icon: QrCode },
  { key: 'watermark', href: '/watermark', icon: Copyright },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function ToolsGrid() {
  const t = useTranslations('Tools');
  const tNav = useTranslations('Navigation');

  const tools = toolsConfig.map(config => ({
    title: tNav(config.key),
    description: t(`${config.key}_desc`),
    href: config.href,
    icon: <config.icon className="w-6 h-6" />,
    badge: config.badge,
  }));

  return (
    <section className="py-24 relative" id="tools">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tools.map((tool) => (
            <motion.div key={tool.href} variants={item} className="h-full">
              <Card
                title={tool.title}
                description={tool.description}
                href={tool.href}
                icon={tool.icon}
                badge={tool.badge}
                className="h-full glass-card hover:bg-white/40 dark:hover:bg-zinc-800/40 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group !border-white/20 dark:!border-white/5"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
