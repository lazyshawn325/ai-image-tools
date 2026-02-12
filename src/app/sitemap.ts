import { MetadataRoute } from "next";
import { generateConvertPairs } from "@/config/seo-matrix";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-image-tools-h41u.vercel.app";
  const locales = routing.locales;
  const tools = [
    "",
    "compress",
    "convert",
    "resize",
    "upscale",
    "crop",
    "rotate",
    "filters",
    "remove-bg",
    "collage",
    "exif",
    "qrcode",
    "watermark",
    "about",
    "faq",
    "contact",
  ];

  const sitemaps: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    tools.forEach((tool) => {
      const isHome = tool === "";
      const path = isHome ? `/${locale}` : `/${locale}/${tool}`;
      sitemaps.push({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: isHome ? 1 : 0.8,
      });
    });
  });

  // Dynamic Convert Pairs
  const convertPairs = generateConvertPairs();
  locales.forEach((locale) => {
    convertPairs.forEach((pair) => {
      sitemaps.push({
        url: `${baseUrl}/${locale}/convert/${pair.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  });

  return sitemaps;
}
