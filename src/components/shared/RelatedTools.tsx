"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { 
  ImageIcon, Minimize2, FileType, Scaling, 
  Crop, RotateCw, Wand2, Layout, 
  QrCode, Camera, Eraser, Stamp 
} from "lucide-react";
import { AdBannerAuto } from "@/components/ads/AdBanner";

interface RelatedToolsProps {
  currentTool: string;
}

const ALL_TOOLS = [
  { id: "compress", icon: Minimize2, path: "/compress" },
  { id: "convert", icon: FileType, path: "/convert" },
  { id: "resize", icon: Scaling, path: "/resize" },
  { id: "upscale", icon: ImageIcon, path: "/upscale" },
  { id: "removeBg", icon: Eraser, path: "/remove-bg" },
  { id: "crop", icon: Crop, path: "/crop" },
  { id: "rotate", icon: RotateCw, path: "/rotate" },
  { id: "filters", icon: Wand2, path: "/filters" },
  { id: "collage", icon: Layout, path: "/collage" },
  { id: "exif", icon: Camera, path: "/exif" },
  { id: "qrcode", icon: QrCode, path: "/qrcode" },
  { id: "watermark", icon: Stamp, path: "/watermark" },
];

export function RelatedTools({ currentTool }: RelatedToolsProps) {
  const t = useTranslations("Navigation");
  const tDesc = useTranslations("Tools");

  const related = ALL_TOOLS
    .filter(t => {
        return !t.path.includes(currentTool) && t.id !== currentTool;
    })
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <section className="mt-20 border-t border-gray-100 dark:border-gray-800 pt-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t("more_tools")}
        </h2>
      </div>

      <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} className="mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((tool) => (
          <Link 
            key={tool.id} 
            href={tool.path}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-left block"
          >
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <tool.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {t(tool.id)}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {tDesc(`${tool.id}_desc`)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
