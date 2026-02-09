import Link from 'next/link';
import { Image as ImageIcon } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <ImageIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              AI 图片工具箱
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/compress"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              图片压缩
            </Link>
            <Link
              href="/convert"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              格式转换
            </Link>
            <Link
              href="/resize"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              尺寸调整
            </Link>
            <Link
              href="/remove-bg"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              AI 去背景
            </Link>
            <Link
              href="/watermark"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              水印工具
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Add theme toggle or github link here if needed */}
        </div>
      </div>
    </header>
  );
}
