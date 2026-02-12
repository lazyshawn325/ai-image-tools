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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-7 h-full"
          >
            <SpotlightCard
              title={features[0].title}
              description={features[0].description}
              icon={features[0].icon}
              spotlightColor="rgba(34, 197, 94, 0.1)" // Green tint
              className="p-10"
            />
          </motion.div>
          
          <div className="md:col-span-5 flex flex-col gap-6">
            {features.slice(1).map((feature, index) => (
              <motion.div
                key={index + 1}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 1) * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <SpotlightCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  spotlightColor={index === 0 ? "rgba(234, 179, 8, 0.1)" : "rgba(59, 130, 246, 0.1)"}
                  className="p-8"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
