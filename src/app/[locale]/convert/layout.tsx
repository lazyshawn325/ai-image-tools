import { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "格式转换 - AI 图片工具箱",
  description: "免费在线图片格式转换工具，支持 PNG、JPEG、WebP、GIF 等格式互转。完全在浏览器本地处理，无需上传服务器。",
  keywords: ["格式转换", "PNG转JPG", "图片转换", "WebP转换", "免费工具"],
};

export default async function ConvertLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return children;
}
