import { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "图片旋转与翻转 - AI 图片工具箱",
  description: "免费在线图片旋转与翻转工具，支持任意角度旋转、水平翻转、垂直翻转。完全在浏览器本地处理，保护隐私。",
  keywords: ["图片旋转", "图片翻转", "在线旋转", "图片编辑", "免费工具"],
};

export default async function RotateLayout({
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
