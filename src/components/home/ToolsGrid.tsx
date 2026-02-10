"use client";

import { motion } from "framer-motion";
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

const tools = [
  {
    title: "图片压缩",
    description: "智能压缩图片，大幅减小文件体积，保持画质",
    href: "/compress",
    icon: <ImageDown className="w-8 h-8" />,
    badge: "热门",
  },
  {
    title: "格式转换",
    description: "支持 PNG、JPEG、WebP、GIF 等格式互转",
    href: "/convert",
    icon: <FileImage className="w-8 h-8" />,
  },
  {
    title: "尺寸调整",
    description: "自定义图片尺寸，支持预设常用规格",
    href: "/resize",
    icon: <Maximize2 className="w-8 h-8" />,
  },
  {
    title: "无损放大",
    description: "AI 智能放大图片，保持清晰度，支持 2x/3x/4x",
    href: "/upscale",
    icon: <ZoomIn className="w-8 h-8" />,
    badge: "AI",
  },
  {
    title: "AI 去背景",
    description: "一键智能抠图，自动移除图片背景",
    href: "/remove-bg",
    icon: <Wand2 className="w-8 h-8" />,
    badge: "AI",
  },
  {
    title: "图片裁剪",
    description: "自由裁剪图片，支持多种预设比例",
    href: "/crop",
    icon: <Crop className="w-8 h-8" />,
  },
  {
    title: "旋转翻转",
    description: "旋转任意角度，支持水平/垂直翻转",
    href: "/rotate",
    icon: <RotateCw className="w-8 h-8" />,
  },
  {
    title: "图片滤镜",
    description: "调整亮度、对比度、饱和度，应用复古/黑白效果",
    href: "/filters",
    icon: <Palette className="w-8 h-8" />,
  },
  {
    title: "EXIF 查看",
    description: "查看图片元数据，支持一键清除隐私信息",
    href: "/exif",
    icon: <Info className="w-8 h-8" />,
  },
  {
    title: "图片拼图",
    description: "将多张图片拼接成一张，支持多种布局模板",
    href: "/collage",
    icon: <LayoutGrid className="w-8 h-8" />,
  },
  {
    title: "二维码生成",
    description: "生成个性化二维码，支持自定义颜色和尺寸",
    href: "/qrcode",
    icon: <QrCode className="w-8 h-8" />,
  },
  {
    title: "水印工具",
    description: "添加文字或图片水印，保护作品版权",
    href: "/watermark",
    icon: <Copyright className="w-8 h-8" />,
  },
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
  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900/50" id="tools">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            强大的图片处理工具
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            涵盖您日常所需的各类图片处理功能
          </p>
        </div>
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {tools.map((tool) => (
            <motion.div key={tool.href} variants={item}>
              <Card
                title={tool.title}
                description={tool.description}
                href={tool.href}
                icon={tool.icon}
                badge={tool.badge}
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
