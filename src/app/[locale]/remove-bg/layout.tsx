import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 去背景 - 智能抠图工具 | AI 图片工具箱",
  description: "免费 AI 图片去背景工具，一键智能抠图，完全在浏览器运行，保护您的隐私。支持人物、产品、物体等多种场景。",
  keywords: ["AI去背景", "智能抠图", "去除背景", "背景移除", "在线抠图", "免费抠图"],
};

export default function RemoveBgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
