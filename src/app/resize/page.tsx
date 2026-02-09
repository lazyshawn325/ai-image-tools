"use client";

import { useState, useCallback, useEffect } from "react";
import { Download, Link, Unlink } from "lucide-react";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";

interface ResizedImage {
  original: File;
  resized: Blob;
  preview: string;
  width: number;
  height: number;
}

interface PresetSize {
  name: string;
  width: number;
  height: number;
}

const presets: PresetSize[] = [
  { name: "微信头像", width: 132, height: 132 },
  { name: "微博封面", width: 980, height: 300 },
  { name: "淘宝主图", width: 800, height: 800 },
  { name: "1080P", width: 1920, height: 1080 },
  { name: "4K", width: 3840, height: 2160 },
];

function resizeImage(
  file: File,
  width: number,
  height: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("调整失败"))),
        "image/png"
      );
    };

    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = URL.createObjectURL(file);
  });
}

export default function ResizePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState(800);
  const [targetHeight, setTargetHeight] = useState(600);
  const [keepRatio, setKeepRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const [results, setResults] = useState<ResizedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Get original image dimensions
  useEffect(() => {
    if (files.length > 0) {
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        setAspectRatio(img.width / img.height);
      };
      img.src = URL.createObjectURL(files[0]);
    }
  }, [files]);

  const handleWidthChange = (newWidth: number) => {
    setTargetWidth(newWidth);
    if (keepRatio && aspectRatio > 0) {
      setTargetHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setTargetHeight(newHeight);
    if (keepRatio && aspectRatio > 0) {
      setTargetWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const applyPreset = (preset: PresetSize) => {
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
    setKeepRatio(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const resizeImages = useCallback(async () => {
    if (files.length === 0) return;

    setIsResizing(true);
    setError(null);
    const newResults: ResizedImage[] = [];

    try {
      for (const file of files) {
        const resizedBlob = await resizeImage(file, targetWidth, targetHeight);
        const preview = URL.createObjectURL(resizedBlob);

        newResults.push({
          original: file,
          resized: resizedBlob,
          preview,
          width: targetWidth,
          height: targetHeight,
        });
      }
      setResults(newResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "调整失败");
    } finally {
      setIsResizing(false);
    }
  }, [files, targetWidth, targetHeight]);

  const downloadImage = (result: ResizedImage) => {
    const url = URL.createObjectURL(result.resized);
    const a = document.createElement("a");
    a.href = url;
    const originalName = result.original.name.replace(/\.[^/.]+$/, "");
    a.download = `${originalName}_${result.width}x${result.height}.png`;
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
          尺寸调整
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          调整图片尺寸，支持预设尺寸和自定义尺寸
        </p>

        {/* Upload Area */}
        <FileUploader
          accept="image/*"
          multiple
          onFilesSelected={setFiles}
          onError={setError}
          className="mb-6"
        />

        {/* Resize Options */}
        {files.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              尺寸设置
            </h2>

            {/* Original Size */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              原始尺寸: {originalSize.width} x {originalSize.height} px
            </p>

            {/* Presets */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                预设尺寸
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300"
                  >
                    {preset.name} ({preset.width}x{preset.height})
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Size */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  宽度 (px)
                </label>
                <input
                  type="number"
                  value={targetWidth}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => setKeepRatio(!keepRatio)}
                  className={`p-2 rounded-lg transition-colors ${
                    keepRatio
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                  }`}
                  title={keepRatio ? "锁定宽高比" : "解锁宽高比"}
                >
                  {keepRatio ? (
                    <Link className="w-5 h-5" />
                  ) : (
                    <Unlink className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  高度 (px)
                </label>
                <input
                  type="number"
                  value={targetHeight}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <Button
              onClick={resizeImages}
              disabled={isResizing}
              loading={isResizing}
              className="mt-6"
            >
              {isResizing ? "调整中..." : "开始调整"}
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
                调整结果
              </h2>
              <Button onClick={downloadAll} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                全部下载
              </Button>
            </div>
            <div className="space-y-4">
              {results.map((result, index) => (
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
                      {result.width} x {result.height} px •{" "}
                      {formatSize(result.resized.size)}
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
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
