"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Download, Sparkles, Loader2, Eraser, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { FileUploader } from "@/components/shared/FileUploader";
import { AdBannerAuto } from "@/components/ads/AdBanner";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { SEOContent } from "@/components/seo/SEOContent";
import { useImageTool } from "@/hooks/useImageTool";

async function preprocessImage(img: HTMLImageElement): Promise<Float32Array> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  canvas.width = 512;
  canvas.height = 512;
  ctx.drawImage(img, 0, 0, 512, 512);
  const imageData = ctx.getImageData(0, 0, 512, 512).data;

  const floatData = new Float32Array(3 * 512 * 512);
  for (let i = 0; i < 512 * 512; i++) {
    floatData[i] = (imageData[i * 4] / 255 - 0.485) / 0.229;
    floatData[i + 512 * 512] = (imageData[i * 4 + 1] / 255 - 0.456) / 0.224;
    floatData[i + 2 * 512 * 512] = (imageData[i * 4 + 2] / 255 - 0.406) / 0.225;
  }
  return floatData;
}

export default function RemoveBgPage() {
  const t = useTranslations("RemoveBg");
  const workerRef = useRef<Worker | null>(null);
  const [modelReady, setModelReady] = useState(false);

  // 安全读取环境变量
  const adSlot = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_AD_SLOT_BANNER : "";

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 延迟初始化 Web Worker
    const initWorker = async () => {
      try {
        workerRef.current = new Worker(new URL('@/workers/remove-bg.worker.ts', import.meta.url));
        workerRef.current.postMessage({ type: 'INIT' });
        
        workerRef.current.onmessage = (e) => {
          if (e.data.type === 'READY') setModelReady(true);
        };
      } catch (err) {
        console.error("Worker initialization failed:", err);
      }
    };

    initWorker();

    return () => workerRef.current?.terminate();
  }, []);

  const handleProcess = useCallback(async (file: File) => {
    if (!workerRef.current || !modelReady) throw new Error(t("loading_model"));
    
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => (img.onload = resolve));

    const inputData = await preprocessImage(img);

    return new Promise((resolve, reject) => {
      workerRef.current!.onmessage = (e) => {
        if (e.data.type === 'SUCCESS') {
          const { maskData } = e.data;
          
          const maskCanvas = document.createElement("canvas");
          maskCanvas.width = 512;
          maskCanvas.height = 512;
          const maskCtx = maskCanvas.getContext("2d")!;
          const maskImageData = maskCtx.createImageData(512, 512);

          for (let i = 0; i < 512 * 512; i++) {
            const alpha = maskData[i] * 255;
            maskImageData.data[i * 4] = 0;
            maskImageData.data[i * 4 + 1] = 0;
            maskImageData.data[i * 4 + 2] = 0;
            maskImageData.data[i * 4 + 3] = alpha;
          }
          maskCtx.putImageData(maskImageData, 0, 0);

          const resultCanvas = document.createElement("canvas");
          resultCanvas.width = img.width;
          resultCanvas.height = img.height;
          const ctx = resultCanvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          ctx.globalCompositeOperation = "destination-in";
          ctx.drawImage(maskCanvas, 0, 0, img.width, img.height);

          resolve({ url: resultCanvas.toDataURL("image/png"), fileName: file.name });
        } else if (e.data.type === 'ERROR') {
          reject(new Error(e.data.message));
        }
      };

      workerRef.current!.postMessage({ 
        type: 'PROCESS', 
        imageData: inputData 
      }, [inputData.buffer]);
    });
  }, [modelReady, t]);

  const { files, setFiles, isProcessing, result, process, reset } = useImageTool({
    toolName: "removeBg",
    onProcess: handleProcess
  });

  let seoData;
  try {
    seoData = {
      title: t("SEO.title"),
      description: t("SEO.description"),
      features: t.raw("SEO.features"),
      howToUse: t.raw("SEO.howToUse"),
      faq: t.raw("SEO.faq")
    };
  } catch (e) {
    // 极致兜底：如果翻译系统崩了，至少保证构建能过
    seoData = {
      title: "AI Background Remover",
      description: "Remove backgrounds instantly",
      features: [],
      howToUse: [],
      faq: []
    };
  }

  return (
    <>
      <SoftwareApplicationJsonLd
        name={t("title")}
        description={t("description")}
        url="https://ai-image-tools-h41u.vercel.app/remove-bg"
      />
      <Container className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto space-y-8">
          <AdBannerAuto slot={adSlot} />

          <div className="text-center space-y-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-2">
              <Eraser className="w-8 h-8" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500">
              {t("title")}
            </motion.h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("description")}</p>
          </div>

          {!result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <FileUploader
                accept="image/*"
                onFilesSelected={(f) => { setFiles(f); }}
                className="glass-card !border-dashed !border-2 !border-indigo-500/20 hover:!border-indigo-500/40 transition-colors"
              />
              {!modelReady && (
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-indigo-500 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("loading_ai")}
                </div>
              )}
            </motion.div>
          )}

          <AnimatePresence>
            {files.length > 0 && !result && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <div className="flex flex-col items-center gap-6 mt-8">
                  <Button onClick={() => process()} disabled={isProcessing || !modelReady} loading={isProcessing} size="lg" className="min-w-[240px] bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20">
                    <Sparkles className="w-5 h-5 mr-2" /> {isProcessing ? t("processing_ai") : t("start_process")}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
              <div className="glass-card overflow-hidden rounded-3xl border-2 border-indigo-500/20 shadow-2xl bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
                 <div className="relative aspect-auto min-h-[300px] flex items-center justify-center p-4">
                    <img src={result.url} alt="Result" className="max-w-full max-h-[600px] object-contain drop-shadow-2xl" />
                 </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                 <div className="flex gap-4">
                    <Button onClick={() => {
                       const a = document.createElement("a");
                       a.href = result.url;
                       a.download = `no_bg_${result.fileName}`;
                       a.click();
                    }} size="lg" className="min-w-[200px] shadow-xl shadow-indigo-500/20">
                       <Download className="w-5 h-5 mr-2" /> {t("download")}
                    </Button>
                    <Button variant="outline" size="lg" onClick={reset}>
                       <RefreshCcw className="w-5 h-5 mr-2" /> {t("process_new")}
                    </Button>
                 </div>
                 <ShareButtons />
              </div>
            </motion.div>
          )}

          <div className="pt-12">
            <RelatedTools currentTool="removeBg" />
          </div>
        </div>
      </Container>
      <SEOContent {...seoData} />
    </>
  );
}
