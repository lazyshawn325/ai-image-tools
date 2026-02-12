"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Infinity } from "lucide-react";
import { useTranslations } from "next-intl";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function Features() {
  const t = useTranslations("Features");

  const features = [
    {
      title: t("privacy_title"),
      description: t("privacy_desc"),
      icon: <Shield className="w-8 h-8" />,
    },
    {
      title: t("speed_title"),
      description: t("speed_desc"),
      icon: <Zap className="w-8 h-8" />,
    },
    {
      title: t("free_title"),
      description: t("free_desc"),
      icon: <Infinity className="w-8 h-8" />,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden" id="features">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <SpotlightCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                spotlightColor="rgba(168, 85, 247, 0.15)" // Purple tint
                className="h-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
