"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coffee, Heart, ExternalLink } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const t = useTranslations("Donation");
  const [activeTab, setActiveTab] = useState<"international" | "china">("international");

  if (typeof window !== "undefined") {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden relative"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
                  <Coffee className="text-yellow-500" />
                  {t("title")}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
                  aria-label={t("close")}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex border-b border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab("international")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === "international"
                      ? "text-orange-500"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {t("tab_international")}
                  {activeTab === "international" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("china")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === "china"
                      ? "text-purple-500"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {t("tab_china")}
                  {activeTab === "china" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                    />
                  )}
                </button>
              </div>

              <div className="p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xs mx-auto">
                  {t("desc")}
                </p>

                <AnimatePresence mode="wait">
                  {activeTab === "international" ? (
                    <motion.div
                      key="international"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="w-full flex flex-col items-center gap-6"
                    >
                      <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-2">
                        <Coffee className="w-12 h-12 text-yellow-500" />
                      </div>
                      
                      <a
                        href="https://www.buymeacoffee.com/andojbk7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-6 bg-[#FFDD00] hover:bg-[#FFEA00] text-black font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
                      >
                        <Coffee className="w-5 h-5" />
                        {t("bmc_button")}
                        <ExternalLink size={16} className="opacity-50" />
                      </a>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="china"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="w-full flex flex-col items-center gap-6"
                    >
                      <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative shadow-inner border border-gray-200 dark:border-gray-600">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://pic1.afdiancdn.com/static/img/welcome/qrcode.png"
                          alt="Afdian QR Code"
                          className="w-full h-full object-cover p-2"
                        />
                      </div>
                      
                      <div className="space-y-3 w-full">
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                          <Heart size={14} className="text-red-500 fill-red-500" />
                          {t("afdian_desc")}
                        </p>
                        
                        <a
                          href="https://afdian.com/a/your-username"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
                        >
                          {t("afdian_button")}
                          <ExternalLink size={16} className="opacity-70" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
