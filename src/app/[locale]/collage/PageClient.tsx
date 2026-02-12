"use client";

import { useState, useCallback, useEffect } from "react";
import { Download, Layout, Grid, Palette, RefreshCw, CheckCircle2, Layers } from "lucide-react";
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

type LayoutType = "horizontal" | "vertical" | "grid_2x2" | "grid_3x3" | "1_2" | "2_1";

export default function CollagePage() {
  const t = useTranslations("Collage");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutType>("grid_2x2");
  const [gap, setGap] = useState(10);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [files]);

  const generateCollage = async () => {
    if (files.length < 2) {
      toastError(t("error_min_images"));
      return;
    }
    setIsGenerating(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context failed");

      const images: HTMLImageElement[] = await Promise.all(previews.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = url;
        });
      }));

      // Simplified layout logic for the prototype
      const baseWidth = 1200;
      const baseHeight = 1200;
      canvas.width = baseWidth;
      canvas.height = baseHeight;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, baseWidth, baseHeight);

      if (layout === "grid_2x2") {
        const w = (baseWidth - gap * 3) / 2;
        const h = (baseHeight - gap * 3) / 2;
        images.slice(0, 4).forEach((img, i) => {
          const x = gap + (i % 2) * (w + gap);
          const y = gap + Math.floor(i / 2) * (h + gap);
          ctx.drawImage(img, x, y, w, h);
        });
      } else if (layout === "vertical") {
         const h = (baseHeight - gap * (images.length + 1)) / images.length;
         images.forEach((img, i) => {
            const y = gap + i * (h + gap);
            ctx.drawImage(img, gap, y, baseWidth - gap * 2, h);
         });
      } else {
         // Default fallback to 2x2 grid behavior for other layouts in this prototype
         const w = (baseWidth - gap * 3) / 2;
         const h = (baseHeight - gap * 3) / 2;
         images.slice(0, 4).forEach((img, i) => {
          const x = gap + (i % 2) * (w + gap);
          const y = gap + Math.floor(i / 2) * (h + gap);
          ctx.drawImage(img, x, y, w, h);
        });
      }

      const dataUrl = canvas.toDataURL("image/png");
      setResult(dataUrl);
      addToHistory({
        tool: "collage",
        fileName: `collage_${Date.now()}.png`,
        thumbnail: dataUrl
      });
      success(t("success_download"));
    } catch (err) {
      toastError(t("error_failed"));
    } finally {
      setIsGenerating(false);
    }
  };

  const LayoutOption = ({ type, icon: Icon, label }: { type: LayoutType, icon: any, label: string }) => (
     <button
        onClick={() => setLayout(type)}
        className={clsx(
           "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all group",
           layout === type ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 shadow-md" : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted"
        )}
     >
        <Icon className={clsx("w-5 h-5 mb-1 group-hover:scale-110 transition-transform", layout === type ? "text-amber-500" : "text-muted-foreground")} />
        <span className="text-[10px] font-bold uppercase">{t(label)}</span>
     </button>
  );

  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="text-center space-y-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-2">
            <Layout className="w-8 h-8" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500">
            {t("title")}
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("description")}</p>
        </div>

        {!files.length ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <FileUploader
              accept="image/*"
              multiple
              onFilesSelected={setFiles}
              className="glass-card !border-dashed !border-2 !border-amber-500/20 hover:!border-amber-500/40 transition-colors"
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-4 gap-8">
            {/* Collage Settings */}
            <div className="lg:col-span-1 space-y-6">
               <div className="glass-card p-6 rounded-2xl space-y-6">
                  <div className="space-y-4">
                     <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Grid className="w-4 h-4 text-amber-500" /> {t("select_layout")}
                     </label>
                     <div className="grid grid-cols-2 gap-2">
                        <LayoutOption type="grid_2x2" icon={Grid} label="layout_grid_2x2" />
                        <LayoutOption type="vertical" icon={Layout} label="layout_vertical" />
                        {/* More layout options could be added here */}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                        <span>{t("gap")}</span>
                        <span className="font-bold text-amber-600">{gap}px</span>
                     </label>
                     <input type="range" min="0" max="50" value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full h-1.5 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600" />
                  </div>

                  <div className="space-y-4">
                     <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Palette className="w-4 h-4 text-amber-500" /> {t("bg_color")}
                     </label>
                     <div className="flex gap-2">
                        {["#ffffff", "#000000", "#f3f4f6"].map(c => (
                           <button key={c} onClick={() => setBgColor(c)} className={clsx("w-8 h-8 rounded-full border-2 transition-all", bgColor === c ? "border-amber-500 scale-110" : "border-transparent")} style={{ backgroundColor: c }} />
                        ))}
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded-full border-none bg-transparent cursor-pointer" />
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <Button onClick={generateCollage} loading={isGenerating} className="w-full bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-500/20">
                     <CheckCircle2 className="w-4 h-4 mr-2" /> {result ? t("download") : t("generating_preview")}
                  </Button>
                  <Button variant="ghost" onClick={() => { setFiles([]); setPreviews([]); setResult(null); }} className="w-full text-muted-foreground">
                     <RefreshCw className="w-4 h-4 mr-2" /> {t("restart")}
                  </Button>
               </div>
            </div>

            {/* Collage Preview */}
            <div className="lg:col-span-3 space-y-6">
               <div className="glass-card p-6 rounded-3xl min-h-[500px] flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 border border-border relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/20" />
                  
                  {result ? (
                     <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 text-center space-y-4">
                        <img src={result} className="max-h-[600px] rounded-lg shadow-2xl" alt="Result" />
                        <Button onClick={() => {
                           const a = document.createElement("a");
                           a.href = result;
                           a.download = `collage_${Date.now()}.png`;
                           a.click();
                        }}>
                           <Download className="w-4 h-4 mr-2" /> {t("download")}
                        </Button>
                     </motion.div>
                  ) : (
                     <div className="grid grid-cols-2 gap-4 relative z-10 w-full max-w-2xl opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {previews.slice(0, 4).map((u, i) => (
                           <motion.div key={i} layoutId={`img-${i}`} className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-amber-200">
                              <img src={u} className="w-full h-full object-cover" alt="" />
                           </motion.div>
                        ))}
                        {files.length < 4 && Array.from({ length: 4 - files.length }).map((_, i) => (
                           <div key={`empty-${i}`} className="aspect-square rounded-xl border-2 border-dashed border-amber-200 flex items-center justify-center">
                              <span className="text-amber-300 text-xs">Waiting for images...</span>
                           </div>
                        ))}
                     </div>
                  )}

                  <div className="absolute top-4 right-4 z-20">
                     <div className="px-3 py-1 bg-amber-500/10 backdrop-blur-md rounded-full text-amber-600 text-[10px] font-bold border border-amber-500/20">
                        {layout.replace("_", " ").toUpperCase()}
                     </div>
                  </div>
               </div>
               <ShareButtons />
            </div>
          </motion.div>
        )}

        <div className="pt-12">
          <RelatedTools currentTool="collage" />
        </div>
      </div>
    </Container>
  );
}
