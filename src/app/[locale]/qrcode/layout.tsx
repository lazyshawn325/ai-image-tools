import type { Metadata } from 'next';

import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: '二维码生成器 - 在线制作个性化二维码 | AI Image Tools',
  description: '免费在线二维码生成工具，支持自定义颜色、尺寸、容错率，提供 SVG 和 PNG 高清下载。快速生成网址、文本二维码。',
  keywords: '二维码生成器, 在线二维码, 二维码制作, QRCode Generator, 自定义二维码',
};

export default async function QRCodeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <>{children}</>;
}
