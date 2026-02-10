"use client";

import { useState, useCallback } from "react";
import { Download } from "lucide-react";
import imageCompression from "browser-image-compression";
import { useToast } from "@/components/ui/Toast";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";

interface CompressedImage {
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
  preview: string;
}

import { SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { SEOContent } from "@/components/seo/SEOContent";

export default function CompressPage() {
  const seoData = {
    title: "图片压缩 - 免费在线图片压缩工具",
    description: "专业的在线图片压缩工具，支持 JPG、PNG、WebP 等格式。使用浏览器本地压缩技术，无需上传服务器，保护您的隐私安全。支持批量处理，可自定义压缩质量和尺寸，一键打包下载。",
    features: [
      "🛡️ 隐私安全：所有处理均在浏览器本地完成，图片无需上传服务器",
      "⚡️ 极速处理：利用 WebAssembly 技术，压缩速度快，即开即用",
      "📦 批量操作：支持同时选择多张图片进行压缩，大大提高效率",
      "🎛️ 自定义参数：可自由调节压缩质量、最大宽度和高度，满足不同场景需求",
      "💾 一键下载：支持单张下载或打包为 ZIP 文件下载"
    ],
    howToUse: [
      "点击上传区域或直接拖拽图片到网页中",
      "根据需求调整压缩质量（Quality）和尺寸限制",
      "点击“开始压缩”按钮，等待处理完成",
      "预览压缩效果，点击“下载”保存单张图片，或“全部下载”保存所有结果"
    ],
    faq: [
      {
        question: "图片会被上传到服务器吗？",
        answer: "不会。本工具使用浏览器本地压缩技术，所有图片处理都在您的设备上完成，绝对安全。"
      },
      {
        question: "支持哪些图片格式？",
        answer: "支持常见的图片格式，包括 JPG、JPEG、PNG、WebP、BMP 等。"
      },
      {
        question: "压缩后的图片清晰度如何？",
        answer: "您可以通过调节“质量”参数来平衡清晰度和文件大小。通常 80% 的质量可以在肉眼几乎看不出区别的情况下大幅减小体积。"
      }
    ]
  };

  const [files, setFiles] = useState<File[]>([]);

  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [isCompressing, setIsCompressing] = useState(false);
  const [results, setResults] = useState<CompressedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const compressImages = useCallback(async () => {
    if (files.length === 0) return;

    setIsCompressing(true);
    setError(null);
    const newResults: CompressedImage[] = [];

    try {
      for (const file of files) {
        const options = {
          maxSizeMB: 10,
          maxWidthOrHeight: Math.max(maxWidth, maxHeight),
          useWebWorker: true,
          initialQuality: quality / 100,
        };

        const compressedBlob = await imageCompression(file, options);
        const preview = URL.createObjectURL(compressedBlob);

        newResults.push({
          original: file,
          compressed: compressedBlob,
          originalSize: file.size,
          compressedSize: compressedBlob.size,
          preview,
        });
      }
      setResults(newResults);
      success("所有图片压缩完成");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "压缩失败";
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setIsCompressing(false);
    }
  }, [files, quality, maxWidth, maxHeight, success, toastError]);

  const downloadImage = (result: CompressedImage) => {
    const url = URL.createObjectURL(result.compressed);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed_${result.original.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    results.forEach((result) => downloadImage(result));
  };

  return (
    <>
      <SoftwareApplicationJsonLd
        name="图片压缩工具"
        description="免费在线图片压缩工具，支持批量处理，保护隐私"
        url="https://ai-image-tools-h41u.vercel.app/compress"
      />
      <Container className="py-8">

      <div className="max-w-4xl mx-auto">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          图片压缩
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          在浏览器中压缩图片，保护隐私，无需上传服务器
        </p>

        {/* Upload Area */}
        <FileUploader
          accept="image/*"
          multiple
          onFilesSelected={setFiles}
          onError={setError}
          className="mb-6"
        />

        {/* Compression Options */}
        {files.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              压缩选项
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  质量: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  最大宽度 (px)
                </label>
                <input
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  最大高度 (px)
                </label>
                <input
                  type="number"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <Button
              onClick={compressImages}
              disabled={isCompressing}
              loading={isCompressing}
              className="mt-6"
            >
              {isCompressing ? "压缩中..." : "开始压缩"}
            </Button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                压缩结果
              </h2>
              <Button onClick={downloadAll} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                全部下载
              </Button>
            </div>
            <div className="space-y-4">
              {results.map((result, index) => {
                const savings = (
                  ((result.originalSize - result.compressedSize) /
                    result.originalSize) *
                  100
                ).toFixed(1);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src={result.preview}
                      alt={result.original.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {result.original.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatSize(result.originalSize)} →{" "}
                        {formatSize(result.compressedSize)}
                        <span className="ml-2 text-green-600 dark:text-green-400">
                          (-{savings}%)
                        </span>
                      </p>
                    </div>
                    <Button
                      onClick={() => downloadImage(result)}
                      variant="secondary"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      </Container>
      <SEOContent {...seoData} />
    </>
  );
}

