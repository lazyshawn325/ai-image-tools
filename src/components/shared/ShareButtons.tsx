"use client";

import { useTranslations } from "next-intl";
import { Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function ShareButtons({ url, title }: { url?: string; title?: string }) {
  const t = useTranslations("Navigation");
  const [copied, setCopied] = useState(false);
  
  const currentUrl = typeof window !== "undefined" ? (url || window.location.href) : "";
  const shareTitle = title || "AI Image Tools - Free Online Image Processor";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      icon: Twitter,
      color: "hover:bg-[#1DA1F2] hover:text-white",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`,
      label: "Twitter"
    },
    {
      icon: Facebook,
      color: "hover:bg-[#4267B2] hover:text-white",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      label: "Facebook"
    },
    {
      icon: Linkedin,
      color: "hover:bg-[#0077b5] hover:text-white",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareTitle)}`,
      label: "LinkedIn"
    }
  ];

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {t("share_title")}
      </p>
      <div className="flex gap-3">
        {shareLinks.map((item) => (
          <motion.a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 transition-colors ${item.color}`}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
          </motion.a>
        ))}
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-500 hover:text-white transition-colors relative"
          title="Copy Link"
        >
          {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
          {copied && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded whitespace-nowrap">
              {t("share_copied")}
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
