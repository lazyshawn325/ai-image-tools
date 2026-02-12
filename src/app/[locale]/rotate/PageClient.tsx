"use client";

import { useState, useCallback, useRef } from "react";
import { Download, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, RefreshCw, CheckCircle2 } from "lucide-react";
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

export default function RotatePage() {
  const t = useTranslations("Rotate");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      setFiles(newFiles);
      setPreviewUrl(URL.createObjectURL(newFiles[0]));
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
    }
  };

  const downloadImage = async () => {
    if (!imageRef.current) return;
    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context failed");

      // Calculate new dimensions after rotation
      const angleInRad = (rotation * Math.PI) / 180;
      const absCos = Math.abs(Math.cos(angleInRad));
      const absSin = Math.abs(Math.sin(angleInRad));
      const newWidth = img.naturalWidth * absCos + img.naturalHeight * absSin;
      const newHeight = img.naturalWidth * absSin + img.naturalHeight * absCos;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(angleInRad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `rotated_${files[0].name}`;
      a.click();

      addToHistory({
        tool: "rotate",
        fileName: files[0].name,
        thumbnail: dataUrl
      });
      success(t("success_download"));
    } catch (err) {
      toastError(t("error_failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-5xl mx-auto space-y-8">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="text-center space-y-4">
          <motion.div initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} className="inline-flex p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-2">
            <RotateCw className="w-8 h-8" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500">
            {t("title")}
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("description")}</p>
        </div>

        {!files.length ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <FileUploader
              accept="image/*"
              onFilesSelected={handleFileSelect}
              className="glass-card !border-dashed !border-2 !border-indigo-500/20 hover:!border-indigo-500/40 transition-colors"
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-4 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
               <div className="glass-card p-6 rounded-2xl space-y-6">
                  <div className="space-y-4">
                     <label className="text-sm font-medium text-muted-foreground">{t("rotation_angle")}</label>
                     <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center bg-muted/50 p-3 rounded-xl">
                           <button onClick={() => setRotation(r => (r - 90) % 360)} className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all shadow-sm">
                              <RotateCcw className="w-5 h-5" />
                           </button>
                           <span className="font-bold text-xl">{rotation}°</span>
                           <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all shadow-sm">
                              <RotateCw className="w-5 h-5" />
                           </button>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={rotation}
                          onChange={(e) => setRotation(Number(e.target.value))}
                          className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-sm font-medium text-muted-foreground">翻转</label>
                     <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setFlipH(!flipH)}
                          className={clsx(
                            "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
                            flipH ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700" : "border-transparent bg-muted/50 text-muted-foreground"
                          )}
                        >
                          <FlipHorizontal className="w-5 h-5 mb-1" />
                          <span className="text-xs font-medium">{t("flip_h")}</span>
                        </button>
                        <button
                          onClick={() => setFlipV(!flipV)}
                          className={clsx(
                            "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
                            flipV ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700" : "border-transparent bg-muted/50 text-muted-foreground"
                          )}
                        >
                          <FlipVertical className="w-5 h-5 mb-1" />
                          <span className="text-xs font-medium">{t("flip_v")}</span>
                        </button>
                     </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => { setRotation(0); setFlipH(false); setFlipV(false); }} className="w-full">
                     {t("reset")}
                  </Button>
               </div>

               <div className="flex flex-col gap-3">
                  <Button onClick={downloadImage} loading={isProcessing} className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
                     <Download className="w-4 h-4 mr-2" />
                     {t("download")}
                  </Button>
                  <Button variant="ghost" onClick={() => { setFiles([]); setPreviewUrl(""); }} className="w-full text-muted-foreground">
                     <RefreshCw className="w-4 h-4 mr-2" />
                     {t("reupload")}
                  </Button>
               </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-3">
               <div className="glass-card p-8 rounded-2xl min-h-[500px] flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 border border-border overflow-hidden relative">
                  <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/30" />
                  <motion.img
                    ref={imageRef}
                    src={previewUrl}
                    animate={{
                      rotate: rotation,
                      scaleX: flipH ? -1 : 1,
                      scaleY: flipV ? -1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="max-h-[600px] max-w-full rounded-lg shadow-2xl relative z-10"
                    alt="Preview"
                  />
               </div>
               <div className="mt-6">
                 <ShareButtons />
               </div>
            </div>
          </motion.div>
        )}

        <div className="pt-8">
          <RelatedTools currentTool="rotate" />
        </div>
      </div>
    </Container>
  );
}
