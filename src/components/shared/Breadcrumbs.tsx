"use client";

import Link from "next/link";
import { usePathname } from "@/i18n/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const locale = useLocale();
  
  if (pathname === "/") return null;

  const pathWithoutQuery = pathname.split("?")[0];
  const segments = pathWithoutQuery.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const getSegmentTitle = (segment: string) => {
    const toolKeyMap: Record<string, string> = {
      "compress": "compress",
      "convert": "convert",
      "resize": "resize",
      "upscale": "upscale",
      "remove-bg": "removeBg",
      "crop": "crop",
      "rotate": "rotate",
      "filters": "filters",
      "collage": "collage",
      "exif": "exif",
      "qrcode": "qrcode",
      "watermark": "watermark",
      "about": "about",
      "contact": "contact",
      "faq": "faq",
      "privacy": "privacy",
      "terms": "terms"
    };

    if (toolKeyMap[segment]) {
      return t(toolKeyMap[segment]);
    }

    if (segment.includes("-to-")) {
      const parts = segment.split("-to-");
      if (parts.length === 2) {
        if (locale === 'zh') {
          return `${parts[0].toUpperCase()} 转 ${parts[1].toUpperCase()}`;
        }
        return `${parts[0].toUpperCase()} to ${parts[1].toUpperCase()}`;
      }
    }

    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
      <nav className="flex text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link href="/" className="inline-flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Home className="w-4 h-4 mr-2" />
              {t("home")}
            </Link>
          </li>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            const title = getSegmentTitle(segment);

            return (
              <li key={href}>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  {isLast ? (
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {title}
                    </span>
                  ) : (
                    <Link href={href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {title}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
