"use client";

import { useState, useCallback } from "react";
import { Download, Sparkles, CheckCircle2, Maximize2, Loader2, Info } from "lucide-react";
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
import { SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { SEOContent } from "@/components/seo/SEOContent";

interface UpscaleResult {
  original: string;
  upscaled: string;
  fileName: string;
  originalWidth: number;
  originalHeight: number;
  newWidth: number;
  newHeight: number;
}

export default function UpscalePage() {
  const t = useTranslations("Upscale");
  const [files, setFiles] = useState<File[]>([]);
  const [scale, setScale] = useState(2);
  const [algorithm, setAlgorithm] = useState<"smooth" | "sharp">("sharp");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<UpscaleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  const seoData = {
    title: t("SEO.title"),
    description: t("SEO.description"),
    features: t.raw("SEO.features"),
    howToUse: t.raw("SEO.howToUse"),
    faq: t.raw("SEO.faq")
  };

  const processUpscale = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const file = files[0];
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
      if (!ctx) throw new Error(t("error_canvas_context"));

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;
      canvas.width = newWidth;
      canvas.height = newHeight;

      if (algorithm === "smooth") {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
      } else {
        // Sharp upscale using multiple steps
        ctx.imageSmoothingEnabled = false;
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        if (!tempCtx) throw new Error(t("error_temp_canvas"));

        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        tempCtx.imageSmoothingEnabled = false;
        tempCtx.drawImage(img, 0, 0, newWidth, newHeight);
        ctx.drawImage(tempCanvas, 0, 0);
      }

      const upscaledUrl = canvas.toDataURL("image/png", 1.0);
      const upscaleResult = {
        original: img.src,
        upscaled: upscaledUrl,
        fileName: file.name,
        originalWidth: img.width,
        originalHeight: img.height,
        newWidth,
        newHeight,
      };

      setResult(upscaleResult);
      addToHistory({
        tool: "upscale",
        fileName: file.name,
        thumbnail: upscaledUrl
      });
      success(t("success_completed"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("error_failed");
      setError(msg);
      toastError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <SoftwareApplicationJsonLd
        name={t("title")}
        description={t("description")}
        url="https://ai-image-tools-h41u.vercel.app/upscale"
      />
      <Container className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto space-y-8">
          <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />

          <div className="text-center space-y-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex p-3 rounded-2xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-2">
              <Maximize2 className="w-8 h-8" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500">
              {t("title")}
            </motion.h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("description")}</p>
          </div>

          {!result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <FileUploader
                accept="image/*"
                onFilesSelected={(f) => { setFiles(f); setResult(null); }}
                className="glass-card !border-dashed !border-2 !border-violet-500/20 hover:!border-violet-500/40 transition-colors"
              />
            </motion.div>
          )}

          <AnimatePresence>
            {files.length > 0 && !result && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="glass-card p-6 md:p-8 rounded-2xl space-y-8 mt-4">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-muted-foreground">{t("scale_factor")}</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[2, 3, 4].map((s) => (
                          <button
                            key={s}
                            onClick={() => setScale(s)}
                            className={clsx(
                              "py-3 rounded-xl border-2 transition-all font-bold",
                              scale === s ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700" : "border-transparent bg-muted/50 text-muted-foreground"
                            )}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-muted-foreground">{t("algorithm")}</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(["smooth", "sharp"] as const).map((algo) => (
                          <button
                            key={algo}
                            onClick={() => setAlgorithm(algo)}
                            className={clsx(
                              "py-3 px-4 rounded-xl border-2 transition-all text-sm font-medium text-left",
                              algorithm === algo ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700" : "border-transparent bg-muted/50 text-muted-foreground"
                            )}
                          >
                            <div className="font-bold">{t(`algo_${algo}`)}</div>
                            <div className="text-[10px] opacity-70 leading-tight mt-0.5">{t(`algo_${algo}_desc`)}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col items-center gap-4 border-t border-border/50">
                    <Button onClick={processUpscale} disabled={isProcessing} loading={isProcessing} size="lg" className="w-full md:w-auto min-w-[240px] bg-violet-600 hover:bg-violet-700 shadow-xl shadow-violet-500/20">
                      {isProcessing ? t("processing") : t("start_upscale")}
                    </Button>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="w-3 h-3" /> {t("preview_hint")}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
              <div className="glass-card overflow-hidden rounded-3xl border-2 border-violet-500/20 shadow-2xl">
                 <div className="p-4 bg-muted/30 border-b border-border flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">{t("drag_compare")}</span>
                    <div className="flex gap-2">
                       <span className="px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-600 text-xs font-bold">{scale}x Upscaled</span>
                    </div>
                 </div>
                 <div className="relative aspect-video bg-slate-900 overflow-hidden group">
                    <img src={result.upscaled} alt="Upscaled" className="w-full h-full object-contain" />
                    {/* Simplified Comparison for Prototype - In a real app we'd use a slider component */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-medium">
                       {result.newWidth} x {result.newHeight} px
                    </div>
                 </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                 <div className="flex gap-4">
                    <Button onClick={() => {
                       const a = document.createElement("a");
                       a.href = result.upscaled;
                       a.download = `upscaled_${result.fileName}`;
                       a.click();
                    }} size="lg" className="min-w-[200px] shadow-xl shadow-violet-500/20">
                       <Download className="w-5 h-5 mr-2" /> {t("download_image")}
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => { setResult(null); setFiles([]); }}>
                       {t("process_new")}
                    </Button>
                 </div>
                 <ShareButtons />
              </div>
            </motion.div>
          )}

          <div className="pt-12">
            <RelatedTools currentTool="upscale" />
          </div>
        </div>
      </Container>
      <SEOContent {...seoData} />
    </>
  );
}
