"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function PricingCards() {
  const t = useTranslations("Pricing");

  const plans = [
    {
      key: "free",
      icon: <Zap className="w-6 h-6 text-gray-400" />,
      popular: false,
    },
    {
      key: "pro",
      icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
      popular: true,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className={`relative p-8 rounded-3xl border backdrop-blur-xl ${
            plan.popular
              ? "bg-white/5 border-indigo-500/50 shadow-2xl shadow-indigo-500/10"
              : "bg-white/5 border-white/10"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              {t("popular")}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-2xl ${plan.popular ? "bg-indigo-500/20" : "bg-white/10"}`}>
              {plan.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold">{t(`plans.${plan.key}.name`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`plans.${plan.key}.desc`)}</p>
            </div>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-black">{t(`plans.${plan.key}.price`)}</span>
            <span className="text-muted-foreground">{t("monthly")}</span>
          </div>

          <ul className="space-y-4 mb-8">
            {/* Features are array in JSON, but we can't map complex objects easily with simple useTranslations if structure varies. 
                We'll assume strict structure or manually map known length if dynamic isn't possible easily with types.
                Actually, we can use getTranslations on server, but here we are client.
                We'll just access keys 0-4 safely.
             */}
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <div className={`rounded-full p-1 ${plan.popular ? "bg-green-500/20 text-green-500" : "bg-white/10 text-gray-400"}`}>
                   <Check className="w-3 h-3" />
                </div>
                <span>{t(`plans.${plan.key}.features.${i}`)}</span>
              </li>
            ))}
          </ul>

          <Link href={plan.popular ? "/checkout" : "/"} className="block">
            <Button
              size="lg"
              variant={plan.popular ? "default" : "secondary"}
              className={`w-full rounded-xl py-6 text-lg font-bold ${
                plan.popular 
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25" 
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {t("get_started")}
            </Button>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
