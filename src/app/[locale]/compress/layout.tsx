import { Metadata } from "next";

export const metadata: Metadata = {
  title: "图片压缩 - AI 图片工具箱",
  description: "免费在线图片压缩工具，智能压缩图片大小，保持画质。支持 JPEG、PNG、WebP 等格式，完全在浏览器本地处理，保护隐私。",
  keywords: ["图片压缩", "在线压缩", "图片优化", "减小图片大小", "免费工具"],
};

export default function CompressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
