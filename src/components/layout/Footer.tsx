"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';
import { Github, Heart } from "lucide-react";
import { DonationButton } from "@/components/shared/DonationButton";
import { HistoryPanel } from "@/components/shared/HistoryPanel";

export function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Navigation');
  const currentYear = new Date().getFullYear();

  const aboutLinks = [
    { href: "/about", key: "about" },
    { href: "/faq", key: "faq" },
    { href: "/contact", key: "contact" },
  ];

  const legalLinks = [
    { href: "/privacy", key: "privacy" },
    { href: "/terms", key: "terms" },
  ];

  return (
    <footer className="border-t border-border/40 bg-muted/20 backdrop-blur-sm mt-auto relative">
      <HistoryPanel />
      <DonationButton variant="floating" />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
              AI 图片工具箱
            </h3>
            <p className="text-sm leading-6 text-muted-foreground max-w-xs">
              {t('description')}
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://github.com/lazyshawn325/ai-image-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-foreground transition-all"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <Link href="/contact" className="rounded-full p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-foreground transition-all">
                <Heart className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="pt-4">
              <DonationButton />
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">{t('about')}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {aboutLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors block py-1">
                        {tNav(item.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">{t('legal')}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {legalLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors block py-1">
                        {tNav(item.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-border/40 pt-8 sm:mt-20 lg:mt-24 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs leading-5 text-muted-foreground text-center">
            &copy; {currentYear} AI 图片工具箱. {t('copyright')}
          </p>
          <p className="text-xs leading-5 text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" /> by LazyShawn
          </p>
        </div>
      </div>
    </footer>
  );
}

