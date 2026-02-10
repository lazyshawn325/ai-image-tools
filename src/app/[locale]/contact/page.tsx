import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";
import { Mail, Github, MessageCircle, HelpCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "联系我们 - AI 图片工具箱",
  description: "有任何问题、建议或反馈？欢迎联系 AI 图片工具箱团队。我们可以通过邮件或 GitHub 接收您的反馈。",
};

export default function ContactPage() {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            联系我们
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            我们非常重视您的反馈。无论是功能建议、Bug 报告，还是单纯的问候，
            我们都乐意听到您的声音。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              邮箱联系
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              直接发送邮件给我们
            </p>
            <a
              href="mailto:contact@ai-image-tools.com"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium break-all"
            >
              contact@ai-image-tools.com
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4">
              <Github className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              GitHub
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              查看源码或贡献代码
            </p>
            <a
              href="https://github.com/lazyshawn325/ai-image-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              访问 GitHub 仓库
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              反馈建议
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              提交 Bug 或功能请求
            </p>
            <a
              href="https://github.com/lazyshawn325/ai-image-tools/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              去 GitHub 提 Issue
            </a>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
              <HelpCircle className="w-6 h-6 text-purple-500" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                遇到常见问题？
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                查看常见问题解答，快速找到帮助。
              </p>
            </div>
          </div>
          <Link
            href="/faq"
            className="px-6 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium rounded-md shadow-sm border border-gray-200 dark:border-gray-600 transition-colors"
          >
            查看 FAQ
          </Link>
        </div>
      </div>
    </Container>
  );
}
