"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';
import { Github, Heart, MessageCircle, ShieldCheck } from "lucide-react";
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
    <footer className="border-t border-border/40 bg-muted/20 backdrop-blur-sm mt-auto relative overflow-hidden">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      
      <HistoryPanel />
      <DonationButton variant="floating" />

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 relative z-10">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              AI 图片工具箱
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs font-light">
              {t('description')}
            </p>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/lazyshawn325/ai-image-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-2xl p-3 bg-white dark:bg-white/5 border border-border/50 hover:border-indigo-500/50 transition-all duration-300 shadow-sm"
                  aria-label="GitHub"
                >
                  <Github className="h-6 w-6 text-foreground group-hover:text-indigo-500 transition-colors" />
                </a>
                <Link 
                  href="/contact" 
                  className="group relative rounded-2xl p-3 bg-white dark:bg-white/5 border border-border/50 hover:border-pink-500/50 transition-all duration-300 shadow-sm"
                >
                  <Heart className="h-6 w-6 text-foreground group-hover:text-pink-500 transition-colors" />
                </Link>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-indigo-500/20 bg-indigo-500/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> 支持此项目
                </h4>
                <p className="text-xs text-muted-foreground mb-4 font-light leading-relaxed">
                  你的赞助能帮助我们维持服务器开销，并持续开发更多免费工具。
                </p>
                <DonationButton />
              </div>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-6">{t('about')}</h3>
                <ul role="list" className="space-y-4">
                  {aboutLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors block py-1 font-light">
                        {tNav(item.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-6">{t('legal')}</h3>
                <ul role="list" className="space-y-4">
                  {legalLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-sm text-muted-foreground hover:text-indigo-500 transition-colors block py-1 font-light">
                        {tNav(item.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="glass-card p-8 rounded-3xl flex flex-col justify-center items-center text-center">
               <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-indigo-500" />
               </div>
               <h4 className="font-bold mb-2">需要帮助？</h4>
               <p className="text-xs text-muted-foreground font-light mb-4">
                  遇到问题或有建议？欢迎随时联系我们。
               </p>
               <Link href="/contact" className="text-sm font-bold text-indigo-500 hover:underline">
                  立即反馈
               </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-border/40 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            &copy; {currentYear} AI 图片工具箱. MADE WITH PRECISION.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-light">
              Crafted by <span className="font-bold text-foreground">LazyShawn</span>
            </span>
            <div className="h-4 w-px bg-border/40" />
            <div className="flex items-center gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
