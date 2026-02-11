"use client";

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Image as ImageIcon, Menu, X, Globe } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const NAV_LINKS = [
  { href: '/compress', key: 'compress' },
  { href: '/convert', key: 'convert' },
  { href: '/resize', key: 'resize' },
  { href: '/upscale', key: 'upscale' },
  { href: '/crop', key: 'crop' },
  { href: '/rotate', key: 'rotate' },
  { href: '/filters', key: 'filters' },
  { href: '/collage', key: 'collage' },
  { href: '/exif', key: 'exif' },
  { href: '/remove-bg', key: 'removeBg' },
  { href: '/watermark', key: 'watermark' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const switchLocale = locale === 'zh' ? 'en' : 'zh';

  const handleLanguageSwitch = () => {
    // Force update the locale cookie to prevent middleware from redirecting back based on old cookie
    // This is crucial for 'as-needed' strategy where the default locale has no prefix
    document.cookie = `NEXT_LOCALE=${switchLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.replace(pathname, { locale: switchLocale });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link className="flex items-center space-x-2 group" href="/" onClick={closeMenu}>
            <div className="rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold tracking-tight sm:inline-block text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white">
              AI 图片工具箱
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.slice(0, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-primary relative group"
              >
                {t(link.key)}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleLanguageSwitch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-primary transition-colors cursor-pointer"
          >
            <Globe className="h-4 w-4" />
            <span className="uppercase">{switchLocale}</span>
          </button>
          <ThemeToggle />
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
          <div className="absolute left-0 top-16 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 lg:hidden animate-fade-in-up">
            <nav className="container grid grid-cols-2 gap-2 p-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-center p-3 rounded-xl text-sm font-medium transition-all hover:bg-accent hover:text-primary text-muted-foreground border border-transparent hover:border-border/50 hover:shadow-sm"
                  onClick={closeMenu}
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
