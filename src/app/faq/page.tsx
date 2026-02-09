import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "常见问题 - AI 图片工具箱",
  description: "AI 图片工具箱常见问题解答 (FAQ)。了解图片压缩原理、隐私安全、支持格式、文件大小限制及 AI 去背景功能。",
  keywords: ["常见问题", "FAQ", "图片压缩原理", "AI去背景", "隐私安全", "图片格式转换", "WebP"],
};

const faqs = [
  {
    question: "图片压缩是如何工作的？会影响画质吗？",
    answer: "我们的智能压缩算法通过优化图片编码和移除冗余元数据来减小文件体积。对于有损压缩，我们会在尽可能保持肉眼不可见的范围内减少数据量；对于无损压缩，画质完全不会受影响。"
  },
  {
    question: "我的图片会被上传到服务器吗？",
    answer: "不会。我们承诺所有图片处理均在您的浏览器本地进行（Local Processing）。您的图片数据从未离开过您的设备，确保了 100% 的隐私安全。"
  },
  {
    question: "支持哪些图片格式？",
    answer: "目前我们支持常见的 JPG, PNG, WebP, AVIF, GIF 等格式的压缩和相互转换。具体支持的格式取决于您使用的具体工具功能。"
  },
  {
    question: "上传图片有文件大小限制吗？",
    answer: "由于所有处理都在本地浏览器进行，理论上没有严格的大小限制，主要取决于您设备的内存容量。一般建议单张图片不超过 50MB 以保证浏览器流畅运行。"
  },
  {
    question: "AI 去背景功能是如何实现的？",
    answer: "我们使用先进的计算机视觉模型（如 RMBG 或 U2Net），在浏览器端直接运行 AI 推理。模型能自动识别图片中的主体并将其与背景分离，实现发丝级的精细抠图。"
  },
  {
    question: "可以批量处理图片吗？",
    answer: "是的，我们支持批量处理模式。您可以一次性选择多张图片进行压缩、格式转换或调整大小，系统会依次处理并允许一键打包下载。"
  },
  {
    question: "这个工具是免费的吗？",
    answer: "是的，AI 图片工具箱的所有基础功能目前完全免费开放使用，无需注册账号，也没有隐藏收费。"
  },
  {
    question: "断网后可以使用吗？",
    answer: "可以。我们的网站采用 PWA (Progressive Web App) 技术，只要您曾经访问过并加载了资源，即使在离线状态下，大部分本地处理功能依然可以正常使用。"
  },
  {
    question: "压缩后的图片可以用于打印吗？",
    answer: "这取决于您的压缩设置。如果您选择“高质量”或“无损”模式，压缩后的图片完全可以用于打印。如果是用于网页展示的极高压缩率模式，建议仅在屏幕上使用。"
  },
  {
    question: "为什么处理大图时速度会变慢？",
    answer: "因为所有计算都在您的设备 CPU/GPU 上进行。处理高分辨率图片需要大量的计算资源，速度取决于您电脑或手机的性能。"
  },
  {
    question: "为什么要使用 WebP 格式？",
    answer: "WebP 是 Google 推出的一种现代图片格式，相比 JPG 和 PNG，它能在保持同等画质的情况下减少 20%-30% 的文件体积，非常适合提升网站加载速度。"
  },
  {
    question: "压缩后会保留相机的 EXIF 信息吗？",
    answer: "默认情况下，为了最大程度减小体积和保护隐私，我们会移除 EXIF 信息（如拍摄地点、相机参数）。如果您需要保留，可以在设置中开启相关选项（如果功能支持）。"
  },
  {
    question: "支持哪些浏览器？",
    answer: "我们推荐使用最新版本的 Chrome, Edge, Firefox 或 Safari。由于使用了 WebAssembly 和最新的 Web API，过旧的浏览器（如 IE）可能无法正常运行部分功能。"
  },
  {
    question: "手机上能用吗？",
    answer: "可以。我们的网站采用了响应式设计，完美适配 iOS 和 Android 设备的浏览器，您可以随时随地在手机上处理图片。"
  }
];

export default function FAQPage() {
  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">常见问题解答</h1>
          <p className="text-gray-600 dark:text-gray-400">
            这里汇集了关于 AI 图片工具箱最常见的问题。如果您找不到答案，请随时联系我们。
          </p>
        </header>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="group border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-shadow hover:shadow-md"
            >
              <summary className="flex justify-between items-center cursor-pointer p-5 font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors list-none [&::-webkit-details-marker]:hidden select-none">
                <span className="text-lg pr-4">{faq.question}</span>
                <span className="text-gray-400 dark:text-gray-500 transition-transform duration-300 group-open:rotate-180 flex-shrink-0">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-transparent group-open:border-gray-100 dark:group-open:border-gray-700/50 group-open:pt-4 transition-all">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </Container>
  );
}
