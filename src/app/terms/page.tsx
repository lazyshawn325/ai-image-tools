import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "使用条款 - AI 图片工具箱",
  description: "AI 图片工具箱的使用条款和服务协议。",
};

export default function TermsPage() {
  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
        <h1 className="text-3xl font-bold mb-8">使用条款</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          最后更新日期：2024年12月
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. 服务说明</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            AI 图片工具箱（以下简称&ldquo;本网站&rdquo;）是一个免费的在线图片处理工具集合，
            提供图片压缩、格式转换、尺寸调整、二维码生成、AI去背景、水印添加等功能。
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            所有图片处理均在您的浏览器中本地完成，我们不会上传、存储或访问您的图片。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. 使用条件</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            使用本网站即表示您同意遵守以下条款：
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
            <li>您必须遵守所有适用的法律法规</li>
            <li>您不得将本服务用于任何非法或未经授权的目的</li>
            <li>您不得尝试破坏、禁用或干扰本网站的正常运行</li>
            <li>您对使用本服务处理的所有内容承担全部责任</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. 知识产权</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            本网站的所有内容，包括但不限于文字、图形、徽标、按钮图标、图像、
            音频片段、软件和代码，均受版权法和其他知识产权法的保护。
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            您处理的图片的知识产权归您或原作者所有。您应确保您有权处理所上传的图片，
            并对可能产生的任何侵权行为负责。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. 免责声明</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            本网站按&ldquo;现状&rdquo;和&ldquo;可用&rdquo;的基础提供，不提供任何明示或暗示的保证。
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
            <li>我们不保证服务不会中断或无错误</li>
            <li>我们不对处理结果的准确性、完整性或适用性作出保证</li>
            <li>AI 去背景等功能可能无法在所有情况下产生完美结果</li>
            <li>我们不对因使用本服务而导致的任何直接或间接损失负责</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. 服务变更</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            我们保留随时修改或终止服务（或其任何部分）的权利，恕不另行通知。
            我们可能会添加新功能、修改现有功能或删除某些功能。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. 广告</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            本网站可能会展示第三方广告。这些广告由第三方广告网络提供，
            广告内容由广告商负责。我们不对广告内容的准确性或适当性负责。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. 隐私保护</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            您的隐私对我们很重要。请查阅我们的
            <a href="/privacy" className="text-blue-600 hover:underline mx-1">
              隐私政策
            </a>
            了解我们如何收集、使用和保护您的信息。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. 条款修改</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            我们保留随时修改这些条款的权利。修改后的条款将在本页面发布时生效。
            继续使用本网站即表示您接受修改后的条款。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. 适用法律</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            本条款受中华人民共和国法律管辖，并按其解释。任何因本条款引起的争议
            应提交至有管辖权的人民法院解决。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. 联系方式</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            如果您对本使用条款有任何疑问，请联系我们：
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            邮箱：contact@example.com
          </p>
        </section>
      </div>
    </Container>
  );
}
