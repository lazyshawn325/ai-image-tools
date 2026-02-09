"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Image as ImageIcon, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const NAV_LINKS = [
  { href: '/compress', label: '图片压缩' },
  { href: '/convert', label: '格式转换' },
  { href: '/resize', label: '尺寸调整' },
  { href: '/upscale', label: '无损放大' },
  { href: '/crop', label: '裁剪' },
  { href: '/rotate', label: '旋转' },
  { href: '/filters', label: '滤镜' },
  { href: '/exif', label: 'EXIF' },
  { href: '/remove-bg', label: 'AI 去背景' },
  { href: '/watermark', label: '水印工具' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <Link className="mr-6 flex items-center space-x-2" href="/" onClick={closeMenu}>
            <ImageIcon className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              AI 图片工具箱
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground/60 hover:bg-accent hover:text-foreground md:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute left-0 top-14 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden animate-[fade-in_0.2s_ease-out]">
            <nav className="container flex flex-col space-y-4 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-primary text-foreground/80"
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
