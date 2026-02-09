interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI 图片工具箱",
    url: "https://ai-image-tools-h41u.vercel.app",
    description:
      "免费在线图片处理工具，包括图片压缩、格式转换、尺寸调整、二维码生成、AI去背景等。所有处理在浏览器本地完成，保护您的隐私。",
    inLanguage: "zh-CN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://ai-image-tools-h41u.vercel.app/?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={websiteData} />;
}

export function SoftwareApplicationJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const appData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CNY",
    },
  };

  return <JsonLd data={appData} />;
}

export function OrganizationJsonLd() {
  const orgData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI 图片工具箱",
    url: "https://ai-image-tools-h41u.vercel.app",
    logo: "https://ai-image-tools-h41u.vercel.app/favicon.ico",
    sameAs: ["https://github.com/lazyshawn325/ai-image-tools"],
  };

  return <JsonLd data={orgData} />;
}
