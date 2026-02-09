import { Metadata } from "next";

export const metadata: Metadata = {
  title: "图片水印 - 添加文字和图片水印 | AI 图片工具箱",
  description: "免费在线图片水印工具，支持添加文字水印和图片水印，可自定义位置、透明度、大小等参数，完全在浏览器运行。",
  keywords: ["图片水印", "添加水印", "文字水印", "图片水印", "水印工具", "在线水印"],
};

export default function WatermarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
