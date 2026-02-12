"use client";

import { useState } from "react";
import EXIF from "exif-js";
import { Info, Download, Trash2, Camera, Calendar, MapPin, Maximize, Scan, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";

export default function ExifPage() {
  const t = useTranslations("Exif");
  const [file, setFile] = useState<File | null>(null);
  const [exifData, setExifData] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { success, error: toastError } = useToast();

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      
      EXIF.getData(selectedFile as any, function(this: any) {
        const allMetadata = EXIF.getAllTags(this);
        setExifData(Object.keys(allMetadata).length > 0 ? allMetadata : null);
      });
    }
  };

  const removeExif = async () => {
    if (!file) return;
    setIsProcessing(true);
    
    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise(r => (img.onload = r));
      
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `no_exif_${file.name}`;
      a.click();
      success(t("success_clear"));
    } catch (err) {
      toastError(t("error_clear"));
    } finally {
      setIsProcessing(false);
    }
  };

  const InfoTag = ({ icon: Icon, label, value }: any) => (
     <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-lg">
           <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
           <p className="text-sm font-semibold truncate">{value || t("unknown")}</p>
        </div>
     </div>
  );

  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-5xl mx-auto space-y-8">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="text-center space-y-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
            <Scan className="w-8 h-8" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            {t("title")}
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("description")}</p>
        </div>

        {!file ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FileUploader
              accept="image/jpeg,image/tiff"
              onFilesSelected={handleFileSelect}
              className="glass-card !border-dashed !border-2 !border-blue-500/20 hover:!border-blue-500/40 transition-colors"
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="space-y-6">
               <div className="glass-card p-4 rounded-3xl bg-slate-100 dark:bg-slate-900/50 border border-border flex items-center justify-center min-h-[400px]">
                  <img src={previewUrl} className="max-h-[500px] rounded-xl shadow-xl" alt="Preview" />
               </div>
               <div className="flex gap-4">
                  <Button onClick={removeExif} loading={isProcessing} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                     <Trash2 className="w-4 h-4 mr-2" /> {t("clear_download")}
                  </Button>
                  <Button variant="ghost" onClick={() => { setFile(null); setExifData(null); }} className="px-6">
                     <RefreshCw className="w-4 h-4" />
                  </Button>
               </div>
            </div>

            {/* Data Details */}
            <div className="space-y-6">
               <AnimatePresence mode="wait">
                  {exifData ? (
                     <motion.div key="data" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 rounded-3xl space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-border">
                           <Info className="w-5 h-5 text-blue-500" />
                           <h2 className="text-xl font-bold">{t("camera_info")}</h2>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <InfoTag icon={Camera} label={t("make")} value={exifData.Make} />
                           <InfoTag icon={Scan} label={t("model")} value={exifData.Model} />
                           <InfoTag icon={Calendar} label={t("datetime")} value={exifData.DateTime} />
                           <InfoTag icon={Maximize} label={t("image_params")} value={`${exifData.PixelXDimension} x ${exifData.PixelYDimension}`} />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                           <div className="p-4 bg-muted/50 rounded-2xl text-center">
                              <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">ISO</p>
                              <p className="text-lg font-bold">{exifData.ISOSpeedRatings || "-"}</p>
                           </div>
                           <div className="p-4 bg-muted/50 rounded-2xl text-center">
                              <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">Aperture</p>
                              <p className="text-lg font-bold">f/{exifData.FNumber || "-"}</p>
                           </div>
                           <div className="p-4 bg-muted/50 rounded-2xl text-center">
                              <p className="text-[10px] font-bold text-muted-foreground mb-1 uppercase">Shutter</p>
                              <p className="text-lg font-bold">{exifData.ExposureTime ? `1/${Math.round(1/exifData.ExposureTime)}` : "-"}</p>
                           </div>
                        </div>

                        {exifData.GPSLatitude && (
                           <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <MapPin className="w-5 h-5 text-green-600" />
                                 <span className="text-sm font-semibold text-green-700 dark:text-green-400">{t("gps")} Data Found</span>
                              </div>
                              <Button size="sm" variant="ghost" className="text-green-600">View Map</Button>
                           </div>
                        )}
                     </motion.div>
                  ) : (
                     <motion.div key="no-data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 rounded-3xl text-center flex flex-col items-center justify-center space-y-4">
                        <div className="p-4 bg-muted rounded-full">
                           <Trash2 className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-medium">{t("no_exif")}</p>
                     </motion.div>
                  )}
               </AnimatePresence>
               <ShareButtons />
            </div>
          </motion.div>
        )}

        <div className="pt-8">
          <RelatedTools currentTool="exif" />
        </div>
      </div>
    </Container>
  );
}
