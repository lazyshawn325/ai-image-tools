import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们 - AI 图片工具箱",
  description: "了解 AI 图片工具箱的使命、技术优势和我们提供的免费在线图片处理服务。我们致力于提供安全、高效、无需上传服务器的本地化图片处理解决方案。",
};

export default function AboutPage() {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            关于我们
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            AI 图片工具箱是一个专注于提供高效、安全、便捷的在线图片处理服务的平台。
          </p>
        </div>

        <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            我们的使命
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            在这个数字化时代，图片处理已成为日常需求。我们的使命是打破专业软件的壁垒，
            利用先进的 Web 技术，为每一位用户提供<strong>免费、安全、高效</strong>的图片处理工具。
            无论您是设计师、开发者还是普通用户，都能在这里轻松完成工作，无需担心隐私泄露或复杂的安装过程。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            核心优势
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
                本地处理，隐私无忧
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                所有图片处理均在您的浏览器中完成，无需上传至服务器。您的数据永远不会离开您的设备，彻底杜绝隐私泄露风险。
              </p>
            </div>

            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                完全免费，无隐形消费
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                我们承诺所有基础功能永久免费。没有付费墙，没有限制次数，让优质的工具服务于每一个人。
              </p>
            </div>

            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">
                无需注册，即开即用
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                告别繁琐的注册登录流程。打开网站即可直接使用所有功能，最大程度节省您的时间，提高工作效率。
              </p>
            </div>

            <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
              <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-300 mb-2">
                极速体验，告别等待
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                得益于 WebAssembly 技术，图像处理速度媲美本地软件。无需等待文件上传下载，毫秒级响应。
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            技术说明
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              AI 图片工具箱采用了最前沿的前端技术栈，以确保最佳的性能和用户体验：
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0 mt-4">
              <li className="flex items-start">
                <span className="mr-2 font-bold text-blue-600 dark:text-blue-400">01.</span>
                <span>
                  <strong>WebAssembly (Wasm)：</strong>
                  将高性能代码直接在浏览器中运行，实现接近原生的处理速度。
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-blue-600 dark:text-blue-400">02.</span>
                <span>
                  <strong>ONNX Runtime Web：</strong>
                  在浏览器端直接运行 AI 模型，实现实时的智能去背景等功能，无需依赖后端 API。
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-blue-600 dark:text-blue-400">03.</span>
                <span>
                  <strong>Modern Web Workers：</strong>
                  利用多线程技术，确保在处理大图片时页面依然流畅不卡顿。
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-blue-600 dark:text-blue-400">04.</span>
                <span>
                  <strong>PWA 支持：</strong>
                  支持离线访问和安装到桌面，提供原生应用般的使用体验。
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            功能列表
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: "图片压缩", desc: "智能压缩，保持画质" },
              { title: "格式转换", desc: "支持多种常见格式互转" },
              { title: "尺寸调整", desc: "快速调整图片长宽" },
              { title: "二维码生成", desc: "个性化二维码制作" },
              { title: "AI 去背景", desc: "一键智能抠图" },
              { title: "水印添加", desc: "保护您的图片版权" },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}
