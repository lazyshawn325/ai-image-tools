"use client";

import { useState, useCallback } from "react";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";
import { useTranslations } from "next-intl";

type ImageFormat = "png" | "jpeg" | "webp" | "gif";

interface ConvertedImage {
  original: File;
  converted: Blob;
  preview: string;
  format: ImageFormat;
}

const formats: { value: ImageFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
  { value: "gif", label: "GIF" },
];

function convertImage(
  file: File,
  targetFormat: ImageFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Convert failed"))),
        `image/${targetFormat}`,
        quality
      );
    };

    img.onerror = () => reject(new Error("Image load failed"));
    img.src = URL.createObjectURL(file);
  });
}

export default function ConvertPage() {
  const t = useTranslations("Convert");
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("png");
  const [quality, setQuality] = useState(90);
  const [isConverting, setIsConverting] = useState(false);
  const [results, setResults] = useState<ConvertedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const convertImages = useCallback(async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setError(null);
    const newResults: ConvertedImage[] = [];

    try {
      for (const file of files) {
        const convertedBlob = await convertImage(
          file,
          targetFormat,
          quality / 100
        );
        const preview = URL.createObjectURL(convertedBlob);

        newResults.push({
          original: file,
          converted: convertedBlob,
          preview,
          format: targetFormat,
        });
      }
      setResults(newResults);
      success(t("success_all_completed"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("error_convert_failed");
      // Translate known errors
      const displayMsg = msg === "Convert failed" ? t("error_convert_failed") : 
                         msg === "Image load failed" ? t("error_load_failed") : msg;
      
      setError(displayMsg);
      toastError(displayMsg);
    } finally {
      setIsConverting(false);
    }
  }, [files, targetFormat, quality, success, toastError, t]);

  const downloadImage = (result: ConvertedImage) => {
    const url = URL.createObjectURL(result.converted);
    const a = document.createElement("a");
    a.href = url;
    const originalName = result.original.name.replace(/\.[^/.]+$/, "");
    a.download = `${originalName}.${result.format}`;
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
          {t("title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t("description")}
        </p>

        {/* Upload Area */}
        <FileUploader
          accept="image/*"
          multiple
          onFilesSelected={setFiles}
          onError={setError}
          className="mb-6"
        />

        {/* Conversion Options */}
        {files.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {t("options_title")}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("target_format")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {formats.map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setTargetFormat(format.value)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        targetFormat === format.value
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>

              {targetFormat === "jpeg" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("quality", { quality })}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full max-w-xs"
                  />
                </div>
              )}
            </div>
            <Button
              onClick={convertImages}
              disabled={isConverting}
              loading={isConverting}
              className="mt-6"
            >
              {isConverting ? t("converting") : t("start_convert")}
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
                {t("results_title")}
              </h2>
              <Button onClick={downloadAll} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {t("download_all")}
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
                      {result.original.name.replace(/\.[^/.]+$/, "")}.
                      {result.format}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatSize(result.converted.size)}
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
