"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Download, Type, Image as ImageIcon, CheckCircle2, RefreshCw, Grid3X3, Settings, Edit3 } from "lucide-react";
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

type WatermarkType = "text" | "image";
type Position = "tl" | "tr" | "bl" | "br" | "center";

export default function WatermarkPage() {
  const t = useTranslations("Watermark");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [type, setType] = useState<WatermarkType>("text");
  const [text, setText] = useState("AI Image Tools");
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState<Position>("br");
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [watermarkPreview, setWatermarkPreview] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { success, error: toastError } = useToast();
  const imageRef = useRef<HTMLImageElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      setFiles(newFiles);
      setPreviewUrl(URL.createObjectURL(newFiles[0]));
    }
  };

  const handleWatermarkImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWatermarkFile(file);
      setWatermarkPreview(URL.createObjectURL(file));
    }
  };

  const drawWatermark = async () => {
    if (!imageRef.current) return;
    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context failed");

      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = opacity / 100;

      if (type === "text") {
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = color;
        const textMetrics = ctx.measureText(text);
        let x = 20, y = fontSize + 20;

        if (position === "tr") x = canvas.width - textMetrics.width - 20;
        if (position === "bl") y = canvas.height - 20;
        if (position === "br") {
          x = canvas.width - textMetrics.width - 20;
          y = canvas.height - 20;
        }
        if (position === "center") {
          x = (canvas.width - textMetrics.width) / 2;
          y = canvas.height / 2;
        }

        ctx.fillText(text, x, y);
      } else if (watermarkPreview) {
        const wImg = new Image();
        wImg.src = watermarkPreview;
        await new Promise(r => (wImg.onload = r));
        
        const wWidth = canvas.width * 0.2;
        const wHeight = (wImg.height * wWidth) / wImg.width;
        let x = 20, y = 20;

        if (position === "tr") x = canvas.width - wWidth - 20;
        if (position === "bl") y = canvas.height - wHeight - 20;
        if (position === "br") {
          x = canvas.width - wWidth - 20;
          y = canvas.height - wHeight - 20;
        }
        if (position === "center") {
          x = (canvas.width - wWidth) / 2;
          y = (canvas.height - wHeight) / 2;
        }
        ctx.drawImage(wImg, x, y, wWidth, wHeight);
      }

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `watermark_${files[0].name}`;
      a.click();

      addToHistory({
        tool: "watermark",
        fileName: files[0].name,
        thumbnail: dataUrl
      });
      success(t("success_added"));
    } catch (err) {
      toastError(t("error_failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="text-center space-y-4">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex p-3 rounded-2xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 mb-2">
            <Edit3 className="w-8 h-8" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500">
            {t("title")}
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("description")}</p>
        </div>

        {!files.length ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <FileUploader
              accept="image/*"
              onFilesSelected={handleFileSelect}
              className="glass-card !border-dashed !border-2 !border-sky-500/20 hover:!border-sky-500/40 transition-colors"
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Settings */}
            <div className="lg:col-span-1 space-y-6">
               <div className="glass-card p-6 rounded-2xl space-y-6">
                  <div className="space-y-4">
                     <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Settings className="w-4 h-4 text-sky-500" /> {t("settings")}
                     </label>
                     <div className="flex p-1 bg-muted/50 rounded-xl">
                        <button onClick={() => setType("text")} className={clsx("flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-bold transition-all", type === "text" ? "bg-white dark:bg-gray-800 text-sky-600 shadow-sm" : "text-muted-foreground")}>
                           <Type className="w-4 h-4 mr-1.5" /> {t("type_text")}
                        </button>
                        <button onClick={() => setType("image")} className={clsx("flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-bold transition-all", type === "image" ? "bg-white dark:bg-gray-800 text-sky-600 shadow-sm" : "text-muted-foreground")}>
                           <ImageIcon className="w-4 h-4 mr-1.5" /> {t("type_image")}
                        </button>
                     </div>
                  </div>

                  <AnimatePresence mode="wait">
                     {type === "text" ? (
                        <motion.div key="text" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-xs font-medium text-muted-foreground">{t("text_content")}</label>
                              <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-sky-500/20 outline-none" />
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                 <label className="text-xs font-medium text-muted-foreground">{t("font_size")}</label>
                                 <input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full px-3 py-1.5 rounded-lg border border-input bg-background/50" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-xs font-medium text-muted-foreground">{t("text_color")}</label>
                                 <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-9 rounded-lg border-none bg-transparent cursor-pointer" />
                              </div>
                           </div>
                        </motion.div>
                     ) : (
                        <motion.div key="image" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                           <Button variant="outline" size="sm" className="w-full border-dashed" onClick={() => watermarkInputRef.current?.click()}>
                              {watermarkPreview ? t("change_image") : t("select_image")}
                           </Button>
                           <input ref={watermarkInputRef} type="file" accept="image/*" className="hidden" onChange={handleWatermarkImage} />
                           {watermarkPreview && (
                              <div className="p-2 border rounded-xl bg-muted/30">
                                 <img src={watermarkPreview} className="max-h-20 mx-auto rounded-lg" alt="Watermark" />
                              </div>
                           )}
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <div className="space-y-4">
                     <label className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                        <span>{t("opacity")}</span>
                        <span className="text-sky-600 font-bold">{opacity}%</span>
                     </label>
                     <input type="range" min="10" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600" />
                  </div>

                  <div className="space-y-4">
                     <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Grid3X3 className="w-4 h-4 text-sky-500" /> {t("position")}
                     </label>
                     <div className="grid grid-cols-3 gap-1.5 aspect-square max-w-[120px] mx-auto">
                        {(["tl", "center", "tr", "bl", "center", "br"] as const).map((pos, i) => (
                           <button key={i} onClick={() => setPosition(pos as Position)} className={clsx("rounded border-2 transition-all", position === pos ? "bg-sky-500 border-sky-500" : "bg-muted/50 border-transparent hover:border-sky-200")} />
                        ))}
                     </div>
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <Button onClick={drawWatermark} loading={isProcessing} className="w-full bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-500/20">
                     <Download className="w-4 h-4 mr-2" /> {t("apply")}
                  </Button>
                  <Button variant="ghost" onClick={() => { setFiles([]); setPreviewUrl(""); }} className="w-full text-muted-foreground">
                     <RefreshCw className="w-4 h-4 mr-2" /> {t("clear")}
                  </Button>
               </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-3">
               <div className="glass-card p-8 rounded-3xl min-h-[500px] flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 border border-border overflow-hidden relative group">
                  <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/20" />
                  <div className="relative z-10">
                     <img ref={imageRef} src={previewUrl} className="max-h-[600px] max-w-full rounded-lg shadow-2xl transition-all" alt="Preview" />
                     {/* Floating preview of watermark (approximation for UI) */}
                     {type === "text" ? (
                        <div 
                          className={clsx("absolute font-bold pointer-events-none transition-all duration-300", 
                            position === "tl" && "top-4 left-4 text-left",
                            position === "tr" && "top-4 right-4 text-right",
                            position === "bl" && "bottom-4 left-4 text-left",
                            position === "br" && "bottom-4 right-4 text-right",
                            position === "center" && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                          )}
                          style={{ fontSize: fontSize/4, color: color, opacity: opacity/100 }}
                        >
                          {text}
                        </div>
                     ) : watermarkPreview && (
                        <div 
                          className={clsx("absolute pointer-events-none transition-all duration-300", 
                            position === "tl" && "top-4 left-4",
                            position === "tr" && "top-4 right-4",
                            position === "bl" && "bottom-4 left-4",
                            position === "br" && "bottom-4 right-4",
                            position === "center" && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          )}
                          style={{ opacity: opacity/100 }}
                        >
                          <img src={watermarkPreview} className="max-w-[80px]" alt="" />
                        </div>
                     )}
                  </div>
               </div>
               <div className="mt-6">
                 <ShareButtons />
               </div>
            </div>
          </motion.div>
        )}

        <div className="pt-12">
          <RelatedTools currentTool="watermark" />
        </div>
      </div>
    </Container>
  );
}
