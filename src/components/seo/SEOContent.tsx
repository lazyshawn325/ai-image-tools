"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { HelpCircle, BookOpen, Star, Info } from "lucide-react";

interface SEOContentProps {
  namespace: string;
}

export function SEOContent({ namespace }: SEOContentProps) {
  const t = useTranslations(namespace);
  
  // Check if SEO data exists for this namespace
  const hasSEO = t.raw("SEO") !== undefined;
  if (!hasSEO) return null;

  const features = t.raw("SEO.features") as string[];
  const howToUse = t.raw("SEO.howToUse") as string[];
  const faq = t.raw("SEO.faq") as { question: string; answer: string }[];

  return (
    <div className="mt-20 space-y-16 pb-20 border-t border-border/40 pt-16">
      {/* Description Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl"
      >
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Info className="w-5 h-5 text-indigo-500" />
          {t("SEO.title")}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed font-light">
          {t("SEO.description")}
        </p>
      </motion.section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Features List */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            核心功能
          </h3>
          <ul className="space-y-4">
            {features.map((item, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5" />
                {item}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* How to use */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-500" />
            使用指南
          </h3>
          <div className="space-y-4">
            {howToUse.map((item, i) => (
              <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-muted/30 border border-border/50">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white dark:bg-white/5 border border-border flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* FAQ Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <h3 className="text-xl font-bold flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-500" />
          常见问题 (FAQ)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faq.map((item, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl">
              <h4 className="font-bold mb-2 text-foreground">{item.question}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">{item.answer}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
