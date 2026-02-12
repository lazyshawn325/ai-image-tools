"use client";

import { useState, useCallback } from "react";
import { Download, FileType, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { addToHistory } from "@/lib/historyUtils";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";

type ImageFormat = "png" | "jpeg" | "webp" | "gif";

interface ConvertedImage {
  original: File;
  converted: Blob;
  preview: string;
  format: ImageFormat;
}

interface ConvertPageProps {
  initialTarget?: string;
  titleOverride?: string;
  descriptionOverride?: string;
}

const formats: { value: ImageFormat; label: string; desc: string }[] = [
  { value: "png", label: "PNG", desc: "无损透明" },
  { value: "jpeg", label: "JPEG", desc: "高压缩比" },
  { value: "webp", label: "WebP", desc: "现代网页" },
  { value: "gif", label: "GIF", desc: "动态图" },
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

export default function ConvertPage({ initialTarget, titleOverride, descriptionOverride }: ConvertPageProps) {
  const t = useTranslations("Convert");
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>((initialTarget as ImageFormat) || "png");
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

        // Add to history
        addToHistory({
          tool: "convert",
          fileName: file.name,
          thumbnail: preview
        });
      }
      setResults(newResults);
      success(t("success_all_completed"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("error_convert_failed");
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
    <Container className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
          >
            {titleOverride || t("title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {descriptionOverride || t("description")}
          </motion.p>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FileUploader
            accept="image/*"
            multiple
            onFilesSelected={setFiles}
            onError={setError}
            className="glass-card !border-dashed !border-2 !border-blue-500/20 hover:!border-blue-500/40 transition-colors"
          />
        </motion.div>

        {/* Conversion Options */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6 mt-8">
                <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
                  <FileType className="w-5 h-5 text-blue-500" />
                  <h2>{t("options_title")}</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      {t("target_format")}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {formats.map((format) => (
                        <button
                          key={format.value}
                          onClick={() => setTargetFormat(format.value)}
                          className={clsx(
                            "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                            targetFormat === format.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-md shadow-blue-500/10"
                              : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted hover:border-border"
                          )}
                        >
                          <span className="font-bold text-lg">{format.label}</span>
                          {/* We could add format descriptions if available in translation */}
                          {targetFormat === format.value && (
                            <motion.div
                              layoutId="activeFormat"
                              className="absolute inset-0 border-2 border-blue-500 rounded-xl"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {targetFormat === "jpeg" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3 pt-2"
                    >
                      <label className="flex justify-between text-sm font-medium text-muted-foreground">
                        <span>{t("quality", { quality })}</span>
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={convertImages}
                    disabled={isConverting}
                    loading={isConverting}
                    size="lg"
                    className="w-full md:w-auto min-w-[200px]"
                  >
                    {isConverting ? t("converting") : t("start_convert")}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 mt-12"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <h2>{t("results_title")}</h2>
                </div>
                <Button onClick={downloadAll} variant="outline" size="sm" className="hover:bg-blue-50 text-blue-600 border-blue-200">
                  <Download className="w-4 h-4 mr-2" />
                  {t("download_all")}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-4 rounded-xl flex items-center gap-4 group hover:border-blue-500/30 transition-colors"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-border">
                      <img
                        src={result.preview}
                        alt={result.original.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                         <h3 className="font-medium text-foreground truncate max-w-[200px]">
                          {result.original.name}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <span className="font-bold text-blue-600 dark:text-blue-400 uppercase">
                          {result.format}
                        </span>
                      </div>
                     
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatSize(result.converted.size)}
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => downloadImage(result)}
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              <div className="pt-4">
                <ShareButtons />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-8">
           <RelatedTools currentTool="convert" />
        </div>
      </div>
    </Container>
  );
}
