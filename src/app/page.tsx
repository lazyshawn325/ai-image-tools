import Link from "next/link";
import {
  ImageDown,
  FileImage,
  Maximize2,
  ZoomIn,
  QrCode,
  Wand2,
  Copyright,
  Shield,
  Zap,
  Infinity,
  Crop,
  RotateCw,
  Palette,
  Info,
  LayoutGrid,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";

const tools = [
  {
    title: "图片压缩",
    description: "智能压缩图片，大幅减小文件体积，保持画质",
    href: "/compress",
    icon: ImageDown,
  },
  {
    title: "格式转换",
    description: "支持 PNG、JPEG、WebP、GIF 等格式互转",
    href: "/convert",
    icon: FileImage,
  },
  {
    title: "尺寸调整",
    description: "自定义图片尺寸，支持预设常用规格",
    href: "/resize",
    icon: Maximize2,
  },
  {
    title: "无损放大",
    description: "AI 智能放大图片，保持清晰度，支持 2x/3x/4x",
    href: "/upscale",
    icon: ZoomIn,
  },
  {
    title: "图片裁剪",
    description: "自由裁剪图片，支持多种预设比例",
    href: "/crop",
    icon: Crop,
  },
  {
    title: "旋转翻转",
    description: "旋转任意角度，支持水平/垂直翻转",
    href: "/rotate",
    icon: RotateCw,
  },
  {
    title: "图片滤镜",
    description: "调整亮度、对比度、饱和度，应用复古/黑白效果",
    href: "/filters",
    icon: Palette,
  },
  {
    title: "EXIF 查看",
    description: "查看图片元数据，支持一键清除隐私信息",
    href: "/exif",
    icon: Info,
  },
  {
    title: "图片拼图",
    description: "将多张图片拼接成一张，支持多种布局模板",
    href: "/collage",
    icon: LayoutGrid,
  },
  {
    title: "二维码生成",
    description: "生成个性化二维码，支持自定义颜色和尺寸",
    href: "/qrcode",
    icon: QrCode,
  },
  {
    title: "AI 去背景",
    description: "一键智能抠图，自动移除图片背景",
    href: "/remove-bg",
    icon: Wand2,
  },
  {
    title: "水印工具",
    description: "添加文字或图片水印，保护作品版权",
    href: "/watermark",
    icon: Copyright,
  },
];

const features = [
  {
    title: "隐私保护",
    description: "所有图片处理完全在您的浏览器中进行，图片不会上传到任何服务器",
    icon: Shield,
  },
  {
    title: "完全免费",
    description: "无需注册，无隐藏收费，所有功能永久免费使用",
    icon: Zap,
  },
  {
    title: "无限次使用",
    description: "没有任何次数限制，随时随地处理您的图片",
    icon: Infinity,
  },
];

export default function Home() {
  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Container className="py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
            免费 AI 图片工具箱
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in-up delay-100">
            一站式图片处理，完全在浏览器运行，保护您的隐私
          </p>
          <Link href="/compress" className="inline-block animate-fade-in-up delay-200">
            <Button size="lg">开始使用</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {tools.map((tool, index) => (
            <Card
              key={tool.href}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              icon={<tool.icon className="w-6 h-6" />}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg animate-fade-in-up delay-300">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            为什么选择我们？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          </div>
        </Container>
      </div>
    </>
  );
}
