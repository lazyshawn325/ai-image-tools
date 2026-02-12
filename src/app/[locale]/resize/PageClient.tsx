"use client";

import { useState, useCallback, useEffect } from "react";
import { Download, Maximize, CheckCircle2, Lock, Unlock, Settings2 } from "lucide-react";
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

interface ResizedImage {
  original: File;
  resized: Blob;
  preview: string;
  width: number;
  height: number;
}

const PRESETS = [
  { label: "WeChat Avatar", width: 500, height: 500, key: "preset_wechat" },
  { label: "Weibo Cover", width: 920, height: 300, key: "preset_weibo" },
  { label: "Taobao Main", width: 800, height: 800, key: "preset_taobao" },
  { label: "HD 1080p", width: 1920, height: 1080, key: "hd_1080p" },
];

export default function ResizePage() {
  const t = useTranslations("Resize");
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [originalRatio, setOriginalRatio] = useState<number>(1);
  const [lockRatio, setLockRatio] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [results, setResults] = useState<ResizedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (files.length > 0 && width === 0) {
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalRatio(img.width / img.height);
      };
      img.src = URL.createObjectURL(files[0]);
    }
  }, [files, width]);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (lockRatio) {
      setHeight(Math.round(newWidth / originalRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (lockRatio) {
      setWidth(Math.round(newHeight * originalRatio));
    }
  };

  const applyPreset = (pWidth: number, pHeight: number) => {
    setWidth(pWidth);
    setHeight(pHeight);
    if (!lockRatio) {
      // If applying a preset, usually user wants that specific size
    }
  };

  const resizeImage = async (file: File): Promise<ResizedImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const preview = URL.createObjectURL(blob);
            resolve({
              original: file,
              resized: blob,
              preview,
              width,
              height,
            });
          } else {
            reject(new Error("Resize failed"));
          }
        }, file.type);
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleResize = useCallback(async () => {
    if (files.length === 0) return;
    setIsResizing(true);
    setError(null);
    const newResults: ResizedImage[] = [];

    try {
      for (const file of files) {
        const result = await resizeImage(file);
        newResults.push(result);
        
        addToHistory({
          tool: "resize",
          fileName: file.name,
          thumbnail: result.preview
        });
      }
      setResults(newResults);
      success(t("success_all_completed"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("error_resize_failed");
      setError(msg);
      toastError(msg);
    } finally {
      setIsResizing(false);
    }
  }, [files, width, height, success, toastError, t]);

  const downloadImage = (result: ResizedImage) => {
    const url = URL.createObjectURL(result.resized);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resized_${result.original.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <FileUploader
            accept="image/*"
            multiple
            onFilesSelected={(newFiles) => {
              setFiles(newFiles);
              setResults([]);
              setWidth(0); // Reset to trigger re-calculation
            }}
            onError={setError}
            className="glass-card !border-dashed !border-2 !border-teal-500/20 hover:!border-teal-500/40 transition-colors"
          />
        </motion.div>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="glass-card p-6 md:p-8 rounded-2xl space-y-8 mt-4">
                <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
                  <Settings2 className="w-5 h-5 text-teal-500" />
                  <h2>{t("settings_title")}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">{t("width_px")}</label>
                        <input
                          type="number"
                          value={width || ""}
                          onChange={(e) => handleWidthChange(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2 relative">
                        <label className="text-sm font-medium text-muted-foreground">{t("height_px")}</label>
                        <input
                          type="number"
                          value={height || ""}
                          onChange={(e) => handleHeightChange(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                        />
                        <button 
                          onClick={() => setLockRatio(!lockRatio)}
                          className={clsx(
                            "absolute -left-3 top-9 p-1.5 rounded-full border bg-background shadow-sm transition-colors",
                            lockRatio ? "text-teal-600 border-teal-200" : "text-muted-foreground border-border"
                          )}
                        >
                          {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-muted-foreground">{t("presets_title")}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESETS.map((preset) => (
                        <button
                          key={preset.key}
                          onClick={() => applyPreset(preset.width, preset.height)}
                          className="px-3 py-2 text-xs font-medium rounded-lg border border-border hover:border-teal-500/50 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-all text-left"
                        >
                          <div className="text-foreground">{t(preset.key)}</div>
                          <div className="text-muted-foreground opacity-70">{preset.width} x {preset.height}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-border/50">
                  <Button
                    onClick={handleResize}
                    disabled={isResizing}
                    loading={isResizing}
                    size="lg"
                    className="w-full md:w-auto min-w-[200px] bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/20"
                  >
                    {isResizing ? t("resizing") : t("start_resize")}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mt-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <h2>{t("results_title")}</h2>
                </div>
                <Button onClick={() => results.forEach(downloadImage)} variant="outline" size="sm" className="text-teal-600 border-teal-200 hover:bg-teal-50">
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
                    className="glass-card p-4 rounded-xl flex items-center gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-border">
                      <img src={result.preview} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{result.original.name}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Maximize className="w-3.5 h-3.5" />
                        <span>{result.width} x {result.height} px</span>
                      </div>
                    </div>
                    <Button onClick={() => downloadImage(result)} variant="ghost" size="icon" className="hover:text-teal-600">
                      <Download className="w-5 h-5" />
                    </Button>
                  </motion.div>
                ))}
              </div>
              <ShareButtons />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-8">
          <RelatedTools currentTool="resize" />
        </div>
      </div>
    </Container>
  );
}
