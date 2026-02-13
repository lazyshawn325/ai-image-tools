import { notFound } from "next/navigation";
import ConvertPage from "../PageClient";
import { generateConvertPairs } from "@/config/seo-matrix";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const pairs = generateConvertPairs();
  return pairs.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const pairs = generateConvertPairs();
  const pair = pairs.find(p => p.slug === slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-image-tools-h41u.vercel.app";
  
  if (!pair) return {};

  const source = pair.source.toUpperCase();
  const target = pair.target.toUpperCase();
  
  const title = locale === 'zh' 
    ? `${source} 转 ${target} - 在线免费图片格式转换` 
    : `Convert ${source} to ${target} - Free Online Image Converter`;
    
  const desc = locale === 'zh'
    ? `免费在线将 ${source} 图片转换为 ${target} 格式。快速、高质量、无需上传服务器。`
    : `Free online tool to convert ${source} images to ${target} format. Fast, high quality, secure local processing.`;

  return {
    title,
    description: desc,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}/convert/${slug}`,
      languages: {
        'en': `/en/convert/${slug}`,
        'zh': `/zh/convert/${slug}`,
        'x-default': `/en/convert/${slug}`,
      },
    },
    openGraph: {
      title,
      description: desc,
      type: "article",
      url: `${baseUrl}/${locale}/convert/${slug}`,
    }
  };
}

export default async function ConvertSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  const pairs = generateConvertPairs();
  const pair = pairs.find(p => p.slug === slug);

  if (!pair) {
    notFound();
  }

  const source = pair.source.toUpperCase();
  const target = pair.target.toUpperCase();

  const title = locale === 'zh' 
    ? `${source} 转 ${target}`
    : `Convert ${source} to ${target}`;
    
  const desc = locale === 'zh'
    ? `最佳的在线 ${source} 转 ${target} 工具。批量转换，隐私保护。`
    : `Best online ${source} to ${target} converter. Batch processing, privacy protected.`;

  return (
    <ConvertPage 
      initialTarget={pair.target === "jpg" ? "jpeg" : pair.target}
      titleOverride={title}
      descriptionOverride={desc}
    />
  );
}
