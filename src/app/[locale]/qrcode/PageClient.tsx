"use client";

import { useState, useCallback, useEffect } from "react";
import QRCode from "qrcode";
import { Download, QrCode as QrIcon, Settings, Palette, CheckCircle2, Link as LinkIcon, RefreshCw, Layers } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { addToHistory } from "@/lib/historyUtils";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";

export default function QRCodePage() {
  const t = useTranslations("QRCode");
  const [text, setText] = useState("https://ai-image-tools.app");
  const [size, setSize] = useState(300);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrUrl, setQrUrl] = useState("");
  const { success, error: toastError } = useToast();

  const generateQR = useCallback(async () => {
    if (!text) return;
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: level,
      });
      setQrUrl(url);
    } catch (err) {
      toastError(t("error_failed"));
    }
  }, [text, size, level, fgColor, bgColor, t, toastError]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  const downloadPNG = () => {
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `qrcode_${Date.now()}.png`;
    a.click();
    
    addToHistory({
      tool: "qrcode",
      fileName: `qrcode_${Date.now()}.png`,
      thumbnail: qrUrl
    });
    success(t("success_png"));
  };

  return (
    <Container className="py-12 md:py-20">
      <div className="max-w-5xl mx-auto space-y-8">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="text-center space-y-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-2">
            <QrIcon className="w-8 h-8" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500">
            {t("title")}
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("description")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
           {/* Editor */}
           <div className="space-y-6">
              <div className="glass-card p-6 rounded-3xl space-y-6">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                       <LinkIcon className="w-4 h-4 text-emerald-500" /> {t("input_label")}
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={t("input_placeholder")}
                      className="w-full h-32 px-4 py-3 rounded-2xl border border-input bg-background/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5" /> {t("level")}
                       </label>
                       <select value={level} onChange={(e) => setLevel(e.target.value as any)} className="w-full px-3 py-2 rounded-xl border border-input bg-background/50">
                          <option value="L">{t("level_l")}</option>
                          <option value="M">{t("level_m")}</option>
                          <option value="Q">{t("level_q")}</option>
                          <option value="H">{t("level_h")}</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                          <Settings className="w-3.5 h-3.5" /> {t("size")}
                       </label>
                       <input type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-input bg-background/50" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                          <Palette className="w-3.5 h-3.5 text-emerald-500" /> {t("fg_color")}
                       </label>
                       <div className="flex items-center gap-2 p-1.5 bg-muted/50 rounded-xl border border-border">
                          <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer" />
                          <span className="text-xs font-mono uppercase">{fgColor}</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                          <Palette className="w-3.5 h-3.5" /> {t("bg_color")}
                       </label>
                       <div className="flex items-center gap-2 p-1.5 bg-muted/50 rounded-xl border border-border">
                          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer" />
                          <span className="text-xs font-mono uppercase">{bgColor}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <Button onClick={downloadPNG} className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 h-12">
                    <Download className="w-5 h-5 mr-2" /> Download PNG
                 </Button>
                 <Button variant="ghost" onClick={() => setText("")} className="px-6 h-12">
                    <RefreshCw className="w-5 h-5" />
                 </Button>
              </div>
           </div>

           {/* Preview */}
           <div className="space-y-6">
              <div className="glass-card p-12 rounded-[2.5rem] bg-slate-100 dark:bg-slate-900/50 border border-border flex flex-col items-center justify-center min-h-[450px] relative group overflow-hidden">
                 <div className="absolute inset-0 bg-grid-emerald-500/[0.03] dark:bg-grid-white/[0.02]" />
                 <AnimatePresence mode="wait">
                    {qrUrl ? (
                       <motion.div key="qr" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 p-6 bg-white rounded-3xl shadow-2xl">
                          <img src={qrUrl} className="w-full max-w-[300px] h-auto" alt="QRCode" />
                          <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-full text-white shadow-lg">
                             <CheckCircle2 className="w-4 h-4" />
                          </div>
                       </motion.div>
                    ) : (
                       <div className="text-center text-muted-foreground space-y-2 relative z-10">
                          <QrIcon className="w-16 h-16 mx-auto opacity-10" />
                          <p>Enter text to generate QR</p>
                       </div>
                    )}
                 </AnimatePresence>
                 <div className="absolute bottom-6 right-6">
                    <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-bold border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                       Dynamic Preview
                    </div>
                 </div>
              </div>
              <ShareButtons />
           </div>
        </div>

        <div className="pt-12">
          <RelatedTools currentTool="qrcode" />
        </div>
      </div>
    </Container>
  );
}
