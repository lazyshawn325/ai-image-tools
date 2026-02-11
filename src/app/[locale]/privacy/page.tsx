import { Container } from "@/components/layout/Container";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "隐私政策 - AI 图片工具箱",
  description: "AI 图片工具箱的隐私政策，说明我们如何保护您的数据和隐私。",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="py-12">
      <div className="max-w-3xl mx-auto prose prose-gray dark:prose-invert">
        <h1 className="text-3xl font-bold mb-8">隐私政策</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          最后更新日期：2024年12月
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. 概述</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            欢迎使用 AI 图片工具箱（以下简称&ldquo;本网站&rdquo;）。我们非常重视您的隐私保护。
            本隐私政策说明了我们如何收集、使用和保护您的个人信息。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. 数据处理方式</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>本地处理原则：</strong>本网站提供的所有图片处理功能（包括图片压缩、
            格式转换、尺寸调整、二维码生成、AI去背景、水印添加等）均在您的浏览器中
            本地完成。
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
            <li>您的图片不会被上传到我们的服务器</li>
            <li>所有图片处理完全在您的设备上进行</li>
            <li>处理完成后，原始图片和处理结果仅存在于您的设备中</li>
            <li>关闭浏览器页面后，所有临时数据将被清除</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. 我们收集的信息</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            我们可能通过以下方式收集有限的信息：
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
            <li>
              <strong>使用统计：</strong>我们可能使用 Google Analytics 等工具收集
              匿名的网站使用统计数据，如访问量、页面浏览量等。这些数据不包含任何
              可识别个人身份的信息。
            </li>
            <li>
              <strong>Cookies：</strong>我们可能使用 Cookies 来改善用户体验和
              提供广告服务。您可以在浏览器设置中选择禁用 Cookies。
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. 第三方服务</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            本网站可能使用以下第三方服务：
          </p>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
            <li>
              <strong>Google AdSense：</strong>用于展示广告。Google 可能会使用
              Cookies 来提供个性化广告。您可以访问 Google 的广告设置页面管理
              您的广告偏好。
            </li>
            <li>
              <strong>Google Analytics：</strong>用于分析网站流量和用户行为。
            </li>
            <li>
              <strong>Hugging Face：</strong>AI 去背景功能使用的模型托管在
              Hugging Face 上，在首次使用时会下载到您的浏览器中。
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. 数据安全</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            由于所有图片处理都在您的本地浏览器中进行，您的图片数据始终保留在您的
            设备上。我们不会访问、存储或处理您的任何图片内容。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. 未成年人隐私</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            本网站不会故意收集任何 16 岁以下未成年人的个人信息。如果您是家长或
            监护人，发现您的孩子向我们提供了个人信息，请与我们联系。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. 隐私政策更新</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，建议您
            定期查看以了解我们如何保护您的隐私。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. 联系我们</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            邮箱：contact@example.com
          </p>
        </section>
      </div>
    </Container>
  );
}
