"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <div className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl opacity-50 animate-pulse-slow mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-3xl opacity-40 animate-float mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[400px] bg-blue-500/20 rounded-full blur-3xl opacity-40 animate-float mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: "2s" }} />
      </div>

      <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6">
            ✨ 全新的 AI 图片工具箱
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 dark:text-white">
            让您的图片 <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              焕发新生
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            免费、快速、隐私安全。所有处理均在浏览器本地完成，
            无需上传服务器，让创作更自由。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#tools">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40">
                浏览工具
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2">
                了解更多
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
