"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  style?: React.CSSProperties;
}

export function AdBanner({
  slot,
  format = "auto",
  className = "",
  style,
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    // 避免重复加载
    if (isLoaded.current || isDev) return;

    try {
      // 确保 adsbygoogle 数组存在
      if (typeof window !== "undefined") {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        isLoaded.current = true;
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [isDev]);

  // 开发环境显示占位符
  if (isDev) {
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center text-gray-500 dark:text-gray-400 ${className}`}
        style={style}
      >
        <p className="text-sm">广告位 ({slot || "default"})</p>
        <p className="text-xs mt-1">生产环境会显示真实广告</p>
      </div>
    );
  }

  // 如果没有配置广告位，不显示任何内容
  if (!slot) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// 横幅广告 - 适合页面顶部/底部
export function AdBannerHorizontal({
  slot,
  className = "",
}: {
  slot?: string;
  className?: string;
}) {
  return (
    <AdBanner
      slot={slot}
      format="horizontal"
      className={`my-4 min-h-[90px] ${className}`}
    />
  );
}

// 方形广告 - 适合侧边栏
export function AdBannerRectangle({
  slot,
  className = "",
}: {
  slot?: string;
  className?: string;
}) {
  return (
    <AdBanner
      slot={slot}
      format="rectangle"
      className={`my-4 min-h-[250px] ${className}`}
    />
  );
}

// 自适应广告 - 推荐使用
export function AdBannerAuto({
  slot,
  className = "",
}: {
  slot?: string;
  className?: string;
}) {
  return <AdBanner slot={slot} format="auto" className={`my-4 ${className}`} />;
}
