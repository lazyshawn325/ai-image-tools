import { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "图片裁剪 - AI 图片工具箱",
  description: "免费在线图片裁剪工具，支持自由裁剪、固定比例裁剪（1:1, 4:3, 16:9等）。完全在浏览器本地处理，保护隐私。",
  keywords: ["图片裁剪", "在线裁剪", "图片编辑", "截图工具", "免费工具"],
};

export default async function CropLayout({
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
