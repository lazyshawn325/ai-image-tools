"use client";

import { useTranslations } from "next-intl";
import { Coffee } from "lucide-react";
import { motion } from "framer-motion";

export function DonationButton({ variant = "default" }: { variant?: "default" | "minimal" | "floating" }) {
  const t = useTranslations("Navigation");
  const donationUrl = "https://www.buymeacoffee.com/andojbk7"; 

  if (variant === "minimal") {
    return (
      <a
        href={donationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
      >
        <Coffee className="w-4 h-4" />
        <span>{t("coffee_title")}</span>
      </a>
    );
  }

  if (variant === "floating") {
    return (
      <motion.a
        href={donationUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer hover:shadow-xl"
        title={t("coffee_title")}
      >
        <Coffee className="w-6 h-6" />
      </motion.a>
    );
  }

  return (
    <motion.a
      href={donationUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
        alt="Buy Me A Coffee" 
        style={{ height: '60px', width: '217px' }}
      />
    </motion.a>
  );
}
