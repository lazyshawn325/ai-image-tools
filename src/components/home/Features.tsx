"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Infinity } from "lucide-react";

const features = [
  {
    title: "隐私优先",
    description: "所有图片处理完全在您的浏览器中进行，图片不会上传到任何服务器，确保数据绝对安全。",
    icon: Shield,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    title: "极速处理",
    description: "利用 WebAssembly 和现代浏览器技术，实现毫秒级图片处理，无需等待上传下载。",
    icon: Zap,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    title: "完全免费",
    description: "无需注册，无隐藏收费，所有功能永久免费使用，致力于提供最优质的工具体验。",
    icon: Infinity,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            为什么选择我们？
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            专注于提供安全、高效、便捷的图片处理服务
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${feature.color}`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
