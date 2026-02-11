import { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "图片滤镜 - AI 图片工具箱",
  description: "免费在线图片滤镜工具，提供多种预设滤镜和参数调整（亮度、对比度、饱和度等），实时预览，一键美化图片。完全在浏览器本地处理，保护隐私。",
  keywords: ["图片滤镜", "在线滤镜", "图片美化", "照片编辑", "调整亮度", "调整对比度"],
};

export default async function FiltersLayout({
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
