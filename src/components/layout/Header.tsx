"use client";

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Image as ImageIcon, Menu, X, Globe, DownloadCloud } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const NAV_LINKS = [
  { href: '/pricing', key: 'pricing' },
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

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
    <header className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none">
      <div className="mx-auto max-w-7xl glass rounded-2xl h-16 flex items-center justify-between px-6 pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/10 dark:border-white/5 relative overflow-hidden">
        {/* Subtle internal glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="flex items-center gap-8 relative z-10">
          <Link className="flex items-center space-x-2 group" href="/" onClick={closeMenu}>
            <div className="rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold tracking-tight sm:inline-block text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white group-hover:via-purple-500 transition-all duration-500">
              AI 图片工具箱
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_LINKS.slice(0, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-white/10 hover:text-primary relative group"
              >
                {t(link.key)}
                <span className="absolute inset-x-0 bottom-1 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors animate-pulse-slow"
            >
              <DownloadCloud className="h-4 w-4" />
              <span>Install App</span>
            </button>
          )}

          <button 
            onClick={handleLanguageSwitch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-primary transition-colors cursor-pointer"
          >
            <Globe className="h-4 w-4" />
            <span className="uppercase font-mono text-xs">{switchLocale}</span>
          </button>
          <ThemeToggle />
          <button
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-white/10 hover:text-accent-foreground lg:hidden focus:outline-none"
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
          <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full rounded-2xl glass p-4 lg:hidden animate-fade-in-up border border-white/10 shadow-2xl">
            <nav className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-center p-3 rounded-xl text-sm font-medium transition-all hover:bg-white/10 hover:text-primary text-muted-foreground border border-transparent hover:border-white/10"
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
