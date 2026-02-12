"use client";

import { useState, useCallback } from "react";
import { Download, Settings2, CheckCircle2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { useToast } from "@/components/ui/Toast";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface CompressedImage {
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
  preview: string;
}

import { SEOContent } from "@/components/seo/SEOContent";

export default function CompressPage() {
  const t = useTranslations("Compress");
  
  const seoData = {
    title: t("SEO.title"),
    description: t("SEO.description"),
    features: t.raw("SEO.features"),
    howToUse: t.raw("SEO.howToUse"),
    faq: t.raw("SEO.faq")
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

        // Add to history
        addToHistory({
          tool: "compress",
          fileName: file.name,
          thumbnail: preview
        });
      }
      setResults(newResults);
      success(t("success_all_completed"));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("error_compress_failed");
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setIsCompressing(false);
    }
  }, [files, quality, maxWidth, maxHeight, success, toastError, t]);

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
    <Container className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          >
            {t("title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t("description")}
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
            className="mb-8 glass-card !border-dashed !border-2 !border-indigo-500/20 hover:!border-indigo-500/40 transition-colors"
          />
        </motion.div>

        {/* Compression Options */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
                <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
                  <Settings2 className="w-5 h-5 text-indigo-500" />
                  <h2>{t("settings_title")}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="flex justify-between text-sm font-medium text-muted-foreground">
                      <span>{t("quality")}</span>
                      <span className="text-indigo-600 font-bold">{quality}%</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground/60">
                      <span>{t("smaller_size")}</span>
                      <span>{t("better_quality")}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">
                      {t("max_width")}
                    </label>
                    <input
                      type="number"
                      value={maxWidth}
                      onChange={(e) => setMaxWidth(Number(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-muted-foreground">
                      {t("max_height")}
                    </label>
                    <input
                      type="number"
                      value={maxHeight}
                      onChange={(e) => setMaxHeight(Number(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background/50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={compressImages}
                    disabled={isCompressing}
                    loading={isCompressing}
                    size="lg"
                    className="w-full md:w-auto min-w-[200px]"
                  >
                    {isCompressing ? t("processing") : t("start_compress")}
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
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <h2>{t("results_title", { count: results.length })}</h2>
                </div>
                <Button onClick={downloadAll} variant="outline" size="sm" className="hover:bg-indigo-50 text-indigo-600 border-indigo-200">
                  <Download className="w-4 h-4 mr-2" />
                  {t("download_all")}
                </Button>
              </div>
              <ShareButtons />
              
              <div className="grid grid-cols-1 gap-4">
                {results.map((result, index) => {
                  const savings = (
                    ((result.originalSize - result.compressedSize) /
                      result.originalSize) *
                    100
                  ).toFixed(1);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-4 rounded-xl flex items-center gap-4 group hover:border-indigo-500/30 transition-colors"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-border">
                        <img
                          src={result.preview}
                          alt={result.original.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate pr-4">
                          {result.original.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="line-through opacity-60">{formatSize(result.originalSize)}</span>
                          <span className="text-indigo-500">→</span>
                          <span className="font-semibold text-foreground">{formatSize(result.compressedSize)}</span>
                          <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">
                            -{savings}%
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => downloadImage(result)}
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      >
                        <Download className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <RelatedTools currentTool="compress" />
      </div>
    </Container>
  );
}
