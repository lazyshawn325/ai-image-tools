"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Download, Sliders, CheckCircle2, RefreshCw, Palette, Sun, Contrast, Wind, Eye } from "lucide-react";
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

const PRESETS = [
  { id: "original", label: "preset_original", filter: "none" },
  { id: "vintage", label: "preset_vintage", filter: "sepia(0.8) contrast(1.1)" },
  { id: "bw", label: "preset_bw", filter: "grayscale(1) contrast(1.2)" },
  { id: "warm", label: "preset_warm", filter: "sepia(0.3) saturate(1.4) hue-rotate(-10deg)" },
  { id: "cool", label: "preset_cool", filter: "saturate(1.2) hue-rotate(180deg) brightness(1.1)" },
  { id: "high_contrast", label: "preset_high_contrast", filter: "contrast(1.5) brightness(0.9)" },
];

export default function FiltersPage() {
  const t = useTranslations("Filters");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [blur, setBlur] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [activePreset, setActivePreset] = useState("original");
  const [isProcessing, setIsProcessing] = useState(false);
  const { success, error: toastError } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
     if (activePreset !== "original") {
        const p = PRESETS.find(p => p.id === activePreset);
        if (p?.id === "vintage") { setSepia(80); setContrast(110); }
        if (p?.id === "bw") { setGrayscale(100); setContrast(120); }
        // Simplified for UI
     }
  }, [activePreset]);

  const handleFileSelect = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      setFiles(newFiles);
      setPreviewUrl(URL.createObjectURL(newFiles[0]));
      resetFilters();
    }
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
    setBlur(0);
    setSepia(0);
    setActivePreset("original");
  };

  const downloadImage = async () => {
    if (!imageRef.current) return;
    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context failed");

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) blur(${blur}px) sepia(${sepia}%)`;
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `filter_${files[0].name}`;
      a.click();

      addToHistory({
        tool: "filters",
        fileName: files[0].name,
        thumbnail: dataUrl
      });
      success(t("download_start"));
    } catch (err) {
      toastError(t("process_fail"));
    } finally {
      setIsProcessing(false);
    }
  };

  const FilterSlider = ({ label, value, onChange, min = 0, max = 200, icon: Icon }: any) => (
    <div className="space-y-3">
       <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
             <Icon className="w-4 h-4 text-pink-500" /> {label}
          </label>
          <span className="text-xs font-bold bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full">
             {value}{min === 0 && max === 20 ? "px" : "%"}
          </span>
       </div>
       <input
         type="range"
         min={min}
         max={max}
         value={value}
         onChange={(e) => onChange(Number(e.target.value))}
         className="w-full h-1.5 bg-pink-100 dark:bg-pink-900/20 rounded-lg appearance-none cursor-pointer accent-pink-600"
       />
    </div>
  );

  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="text-center space-y-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex p-3 rounded-2xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 mb-2">
            <Palette className="w-8 h-8" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-red-500">
            {t("title")}
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("description")}</p>
        </div>

        {!files.length ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <FileUploader
              accept="image/*"
              onFilesSelected={handleFileSelect}
              className="glass-card !border-dashed !border-2 !border-pink-500/20 hover:!border-pink-500/40 transition-colors"
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-3 gap-8">
            {/* Editor Controls */}
            <div className="lg:col-span-1 space-y-6">
               <div className="glass-card p-6 rounded-2xl space-y-8">
                  <div className="space-y-4">
                     <h3 className="font-semibold flex items-center gap-2 text-foreground">
                        <Sliders className="w-4 h-4 text-pink-500" /> {t("params_title")}
                     </h3>
                     <div className="space-y-6">
                        <FilterSlider label={t("brightness")} value={brightness} onChange={setBrightness} icon={Sun} />
                        <FilterSlider label={t("contrast")} value={contrast} onChange={setContrast} icon={Contrast} />
                        <FilterSlider label={t("saturation")} value={saturation} onChange={setSaturation} icon={Palette} />
                        <FilterSlider label={t("grayscale")} value={grayscale} onChange={setGrayscale} icon={Wind} />
                        <FilterSlider label={t("blur")} value={blur} onChange={setBlur} max={20} icon={Eye} />
                     </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border/50">
                     <h3 className="font-semibold text-foreground">{t("presets_title")}</h3>
                     <div className="grid grid-cols-3 gap-2">
                        {PRESETS.map((p) => (
                           <button
                             key={p.id}
                             onClick={() => setActivePreset(p.id)}
                             className={clsx(
                               "py-2 px-1 text-[10px] font-bold rounded-lg border transition-all",
                               activePreset === p.id ? "bg-pink-600 text-white border-pink-600 shadow-md" : "bg-muted/50 text-muted-foreground border-transparent hover:border-pink-200"
                             )}
                           >
                             {t(p.label)}
                           </button>
                        ))}
                     </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
                     {t("reset")}
                  </Button>
               </div>

               <div className="flex flex-col gap-3">
                  <Button onClick={downloadImage} loading={isProcessing} className="w-full bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-500/20">
                     <Download className="w-4 h-4 mr-2" /> {t("download_image")}
                  </Button>
                  <Button variant="ghost" onClick={() => { setFiles([]); setPreviewUrl(""); }} className="w-full">
                     <RefreshCw className="w-4 h-4 mr-2" /> {t("change_image")}
                  </Button>
               </div>
            </div>

            {/* Live Preview */}
            <div className="lg:col-span-2 space-y-6">
               <div className="glass-card p-4 rounded-3xl min-h-[500px] flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 border border-border overflow-hidden relative group">
                  <div className="absolute inset-0 bg-grid-pink-500/[0.03] dark:bg-grid-white/[0.02]" />
                  <img
                    ref={imageRef}
                    src={previewUrl}
                    style={{
                      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) blur(${blur}px) sepia(${sepia}%)`,
                    }}
                    className="max-h-[600px] max-w-full rounded-xl shadow-2xl relative z-10 transition-[filter] duration-200"
                    alt="Preview"
                  />
                  <div className="absolute bottom-6 right-6 z-20">
                     <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-medium border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        Real-time Preview
                     </div>
                  </div>
               </div>
               <ShareButtons />
            </div>
          </motion.div>
        )}

        <div className="pt-12">
          <RelatedTools currentTool="filters" />
        </div>
      </div>
    </Container>
  );
}
