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

export default function CompressPage() {
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
  );
}
