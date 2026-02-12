"use client";

import { useTranslations } from "next-intl";
import { Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { DonationModal } from "./DonationModal";

export function DonationButton({ variant = "default" }: { variant?: "default" | "minimal" | "floating" }) {
  const t = useTranslations("Navigation");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  if (variant === "minimal") {
    return (
      <>
        <button
          onClick={openModal}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
        >
          <Coffee className="w-4 h-4" />
          <span>{t("coffee_title")}</span>
        </button>
        <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  if (variant === "floating") {
    return (
      <>
        <motion.button
          onClick={openModal}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center text-white cursor-pointer hover:shadow-xl"
          title={t("coffee_title")}
        >
          <Coffee className="w-6 h-6" />
        </motion.button>
        <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div className="relative inline-block">
        <motion.button
          onClick={openModal}
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
        </motion.button>
        <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
}
