"use client";

import { useState, useCallback } from "react";
import { Download, FileType, CheckCircle2, ArrowRight, Image as ImageIcon, Sparkles } from "lucide-react";
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

const formats: { value: ImageFormat; label: string; color: string }[] = [
  { value: "png", label: "PNG", color: "from-blue-500 to-cyan-500" },
  { value: "jpeg", label: "JPEG", color: "from-orange-500 to-red-500" },
  { value: "webp", label: "WebP", color: "from-green-500 to-emerald-500" },
  { value: "gif", label: "GIF", color: "from-purple-500 to-pink-500" },
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
      setError(msg);
      toastError(msg);
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
    <Container className="py-12 md:py-20 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-12">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-4 rounded-3xl bg-blue-500/10 text-blue-500 mb-2"
          >
             <FileType className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black tracking-tight"
          >
            {titleOverride || t("title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto font-light"
          >
            {descriptionOverride || t("description")}
          </motion.p>
        </div>

        {/* Upload Section */}
        <AnimatePresence mode="wait">
          {!files.length ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FileUploader
                accept="image/*"
                multiple
                onFilesSelected={setFiles}
                onError={setError}
                className="glass-card !border-dashed !border-2 !border-blue-500/20 hover:!border-blue-500/40 transition-colors py-20"
              />
            </motion.div>
          ) : (
            <motion.div
              key="process"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
               {/* Left: Format Selection */}
               <div className="lg:col-span-8 space-y-8">
                  <div className="glass-card p-8 rounded-3xl">
                     <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        {t("target_format")}
                     </h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formats.map((format) => (
                           <button
                             key={format.value}
                             onClick={() => setTargetFormat(format.value)}
                             className={clsx(
                               "relative group overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 border-2",
                               targetFormat === format.value
                                 ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                 : "border-transparent bg-muted/30 hover:bg-muted/50"
                             )}
                           >
                              <div className={clsx(
                                 "absolute inset-0 opacity-0 transition-opacity duration-300 bg-gradient-to-br",
                                 format.color,
                                 targetFormat === format.value ? "opacity-10" : "group-hover:opacity-5"
                              )} />
                              <span className={clsx(
                                 "relative block text-2xl font-black mb-1",
                                 targetFormat === format.value ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                              )}>
                                 {format.label}
                              </span>
                              {targetFormat === format.value && (
                                 <motion.div layoutId="check" className="absolute top-4 right-4 text-blue-500">
                                    <CheckCircle2 className="w-5 h-5" />
                                 </motion.div>
                              )}
                           </button>
                        ))}
                     </div>

                     {targetFormat === "jpeg" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-8 pt-6 border-t border-border">
                           <div className="flex justify-between mb-4">
                              <label className="font-semibold">{t("quality")}</label>
                              <span className="font-mono text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md text-sm">{quality}%</span>
                           </div>
                           <input
                              type="range"
                              min="10"
                              max="100"
                              value={quality}
                              onChange={(e) => setQuality(Number(e.target.value))}
                              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
                           />
                        </motion.div>
                     )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                     <Button 
                       onClick={() => { setFiles([]); setResults([]); }} 
                       variant="outline" 
                       className="h-14 px-8 rounded-2xl border-2"
                     >
                        {t("reupload")}
                     </Button>
                     <Button 
                       onClick={convertImages} 
                       loading={isConverting}
                       className="flex-1 h-14 rounded-2xl text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20"
                     >
                        {isConverting ? t("converting") : t("start_convert")}
                     </Button>
                  </div>
               </div>

               {/* Right: File Queue */}
               <div className="lg:col-span-4">
                  <div className="glass-card p-6 rounded-3xl h-full min-h-[400px] flex flex-col">
                     <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-xs">
                        <ImageIcon className="w-4 h-4" />
                        Queue ({files.length})
                     </h3>
                     
                     <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 max-h-[500px]">
                        {results.length > 0 ? (
                           results.map((result, idx) => (
                              <motion.div 
                                 key={idx}
                                 initial={{ opacity: 0, x: 20 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: idx * 0.1 }}
                                 className="bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-3 rounded-xl flex items-center gap-3"
                              >
                                 <img src={result.preview} className="w-10 h-10 rounded-lg object-cover" />
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{result.original.name}</p>
                                    <p className="text-xs text-green-600 font-bold">{result.format.toUpperCase()}</p>
                                 </div>
                                 <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => downloadImage(result)}>
                                    <Download className="w-4 h-4" />
                                 </Button>
                              </motion.div>
                           ))
                        ) : (
                           files.map((file, idx) => (
                              <div key={idx} className="bg-muted/30 border border-border p-3 rounded-xl flex items-center gap-3 opacity-70">
                                 <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                    <FileType className="w-5 h-5 text-muted-foreground" />
                                 </div>
                                 <p className="text-sm font-medium truncate flex-1">{file.name}</p>
                              </div>
                           ))
                        )}
                     </div>

                     {results.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                           <Button onClick={downloadAll} className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20">
                              <Download className="w-4 h-4 mr-2" />
                              {t("download_all")}
                           </Button>
                        </div>
                     )}
                  </div>
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
