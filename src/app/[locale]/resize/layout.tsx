import { Metadata } from "next";

export const metadata: Metadata = {
  title: "尺寸调整 - AI 图片工具箱",
  description: "免费在线图片尺寸调整工具，支持自定义尺寸和预设规格（微信头像、淘宝主图等）。完全在浏览器本地处理。",
  keywords: ["图片尺寸", "调整大小", "图片缩放", "微信头像", "免费工具"],
};

export default function ResizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
