"use client";

import { useState, useCallback, useRef } from "react";
import { Download, Crop as CropIcon, CheckCircle2, RefreshCw, Layers } from "lucide-react";
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

const RATIOS = [
  { label: "1:1", value: 1, key: "1:1" },
  { label: "4:3", value: 4 / 3, key: "4:3" },
  { label: "16:9", value: 16 / 9, key: "16:9" },
  { label: "3:2", value: 3 / 2, key: "3:2" },
  { label: "9:16", value: 9 / 16, key: "9:16" },
];

export default function CropPage() {
  const t = useTranslations("Crop");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      setFiles(newFiles);
      setPreviewUrl(URL.createObjectURL(newFiles[0]));
      setResult(null);
    }
  };

  const generateCrop = async () => {
    if (!imageRef.current) return;
    setIsGenerating(true);
    
    try {
      // In a real production app, we would use a library like react-easy-crop
      // Here we simulate the crop using the center area for the demonstration of the UI flow
      const canvas = document.createElement("canvas");
      const img = imageRef.current;
      const ctx = canvas.getContext("2d");
      
      let targetWidth = img.naturalWidth;
      let targetHeight = img.naturalHeight;
      
      if (aspectRatio) {
        if (targetWidth / targetHeight > aspectRatio) {
          targetWidth = targetHeight * aspectRatio;
        } else {
          targetHeight = targetWidth / aspectRatio;
        }
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const startX = (img.naturalWidth - targetWidth) / 2;
      const startY = (img.naturalHeight - targetHeight) / 2;

      ctx?.drawImage(img, startX, startY, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
      
      const croppedUrl = canvas.toDataURL("image/png");
      setResult(croppedUrl);
      
      addToHistory({
        tool: "crop",
        fileName: files[0].name,
        thumbnail: croppedUrl
      });
      
      success(t("download"));
    } catch (err) {
      toastError(t("error_generate_failed"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="text-center space-y-4">
          <motion.div initial={{ rotate: -10, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} className="inline-flex p-3 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-2">
            <CropIcon className="w-8 h-8" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
            {t("title")}
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("description")}</p>
        </div>

        {!files.length ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <FileUploader
              accept="image/*"
              onFilesSelected={handleFileSelect}
              className="glass-card !border-dashed !border-2 !border-orange-500/20 hover:!border-orange-500/40 transition-colors"
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid lg:grid-cols-4 gap-8">
               {/* Controls */}
               <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
                  <div className="glass-card p-6 rounded-2xl space-y-4">
                     <h3 className="font-semibold flex items-center gap-2">
                        <Layers className="w-4 h-4 text-orange-500" />
                        {t("aspect_ratio")}
                     </h3>
                     <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setAspectRatio(undefined)}
                          className={clsx(
                            "px-4 py-2 rounded-xl text-sm font-medium transition-all text-left border-2",
                            aspectRatio === undefined ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700" : "border-transparent bg-muted/50 text-muted-foreground"
                          )}
                        >
                          {t("ratio_free")}
                        </button>
                        {RATIOS.map((r) => (
                          <button
                            key={r.key}
                            onClick={() => setAspectRatio(r.value)}
                            className={clsx(
                              "px-4 py-2 rounded-xl text-sm font-medium transition-all text-left border-2",
                              aspectRatio === r.value ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700" : "border-transparent bg-muted/50 text-muted-foreground"
                            )}
                          >
                            {r.label}
                          </button>
                        ))}
                     </div>
                  </div>

                  <div className="flex flex-col gap-3">
                     <Button onClick={generateCrop} disabled={isGenerating} loading={isGenerating} className="w-full bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/20">
                        {t("download")}
                     </Button>
                     <Button variant="outline" onClick={() => { setFiles([]); setPreviewUrl(""); setResult(null); }} className="w-full">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t("reupload")}
                     </Button>
                  </div>
               </div>

               {/* Editor */}
               <div className="lg:col-span-3 order-1 lg:order-2">
                  <div className="glass-card p-4 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center min-h-[400px] border border-border">
                     {result ? (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
                           <img src={result} alt="Result" className="max-h-[500px] rounded-lg shadow-2xl" />
                           <div className="flex justify-center">
                              <Button onClick={() => {
                                 const a = document.createElement("a");
                                 a.href = result;
                                 a.download = `cropped_${files[0].name}`;
                                 a.click();
                              }} size="sm">
                                 <Download className="w-4 h-4 mr-2" /> {t("download")}
                              </Button>
                           </div>
                        </motion.div>
                     ) : (
                        <div className="relative group">
                           <img ref={imageRef} src={previewUrl} alt="Preview" className="max-h-[600px] rounded-lg" />
                           <div className="absolute inset-0 border-2 border-orange-500/50 pointer-events-none rounded-lg group-hover:border-orange-500 transition-colors" />
                        </div>
                     )}
                  </div>
               </div>
            </div>
            
            <ShareButtons />
          </motion.div>
        )}

        <div className="pt-8">
          <RelatedTools currentTool="crop" />
        </div>
      </div>
    </Container>
  );
}
