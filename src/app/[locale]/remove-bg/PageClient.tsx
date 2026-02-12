"use client";

import { useState, useCallback, useRef } from "react";
// Dynamically import onnxruntime-web to avoid SSR issues
import type * as ORT from "onnxruntime-web";
import { Upload, Loader2, Download, Layers, Sparkles, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { AdBannerAuto } from "@/components/ads/AdBanner";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { Container } from "@/components/layout/Container";
import { addToHistory } from "@/lib/historyUtils";

import { SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { SEOContent } from "@/components/seo/SEOContent";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface ProcessedImage {
  original: string;
  result: string;
  width: number;
  height: number;
}

export default function RemoveBackgroundPage() {
  const t = useTranslations("RemoveBg");
  const seoData = {
    title: t("SEO.title"),
    description: t("SEO.description"),
    features: t.raw("SEO.features"),
    howToUse: t.raw("SEO.howToUse"),
    faq: t.raw("SEO.faq")
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [processed, setProcessed] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error: toastError } = useToast();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      const msg = t("error_select_file");
      setError(msg);
      toastError(msg);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      const msg = t("error_file_size");
      setError(msg);
      toastError(msg);
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setProcessed(null);
  }, [toastError, t]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        const msg = t("error_file_size");
        setError(msg);
        toastError(msg);
        return;
      }
      setError("");
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProcessed(null);
    }
  }, [toastError, t]);

  const preprocessImage = async (imgElement: HTMLImageElement): Promise<Float32Array> => {
    const targetSize = 320;
    const canvas = document.createElement("canvas");
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext("2d")!;

    const scale = Math.max(targetSize / imgElement.width, targetSize / imgElement.height);
    const scaledWidth = imgElement.width * scale;
    const scaledHeight = imgElement.height * scale;
    const x = (targetSize - scaledWidth) / 2;
    const y = (targetSize - scaledHeight) / 2;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, targetSize, targetSize);
    ctx.drawImage(imgElement, x, y, scaledWidth, scaledHeight);

    const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
    const data = imageData.data;
    const floatData = new Float32Array(3 * targetSize * targetSize);
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    for (let i = 0; i < targetSize * targetSize; i++) {
      floatData[i] = (data[i * 4] / 255.0 - mean[0]) / std[0];
      floatData[i + targetSize * targetSize] = (data[i * 4 + 1] / 255.0 - mean[1]) / std[1];
      floatData[i + 2 * targetSize * targetSize] = (data[i * 4 + 2] / 255.0 - mean[2]) / std[2];
    }

    return floatData;
  };

  const postprocessMask = (maskData: Float32Array, originalWidth: number, originalHeight: number): ImageData => {
    const targetSize = 320;
    const canvas = document.createElement("canvas");
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext("2d")!;

    let min = Infinity;
    let max = -Infinity;
    for (let i = 0; i < maskData.length; i++) {
      min = Math.min(min, maskData[i]);
      max = Math.max(max, maskData[i]);
    }
    const range = max - min || 1;

    const maskImageData = ctx.createImageData(targetSize, targetSize);
    for (let i = 0; i < maskData.length; i++) {
      const value = ((maskData[i] - min) / range) * 255;
      maskImageData.data[i * 4] = value;
      maskImageData.data[i * 4 + 1] = value;
      maskImageData.data[i * 4 + 2] = value;
      maskImageData.data[i * 4 + 3] = 255;
    }

    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = originalWidth;
    outputCanvas.height = originalHeight;
    const outputCtx = outputCanvas.getContext("2d")!;
    
    ctx.putImageData(maskImageData, 0, 0);
    outputCtx.drawImage(canvas, 0, 0, originalWidth, originalHeight);

    return outputCtx.getImageData(0, 0, originalWidth, originalHeight);
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(t("loading_model"));
    setError("");

    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const originalWidth = img.width;
      const originalHeight = img.height;

      setProgress(t("preprocessing"));
      const inputData = await preprocessImage(img);

      setProgress(t("loading_ai"));
      // Dynamically import onnxruntime-web to avoid SSR issues
      const ort = (await import("onnxruntime-web")) as any;
      ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.1/dist/";

      const session = await ort.InferenceSession.create(
        "https://huggingface.co/park168/ai-removebg-model/resolve/main/u2netp.onnx",
        {
          executionProviders: ["wasm"],
          graphOptimizationLevel: "basic",
        }
      );

      setProgress(t("processing_ai"));
      const tensor = new ort.Tensor("float32", inputData, [1, 3, 320, 320]);
      const feeds = { input: tensor };
      const results = await session.run(feeds);
      const output = results.output;

      setProgress(t("generating"));
      const maskData = output.data as Float32Array;
      const maskImageData = postprocessMask(maskData, originalWidth, originalHeight);

      const resultCanvas = document.createElement("canvas");
      resultCanvas.width = originalWidth;
      resultCanvas.height = originalHeight;
      const resultCtx = resultCanvas.getContext("2d")!;

      resultCtx.drawImage(img, 0, 0);
      const imageData = resultCtx.getImageData(0, 0, originalWidth, originalHeight);

      for (let i = 0; i < maskImageData.data.length / 4; i++) {
        const alpha = maskImageData.data[i * 4] / 255;
        imageData.data[i * 4 + 3] = Math.floor(alpha * 255);
      }

      resultCtx.putImageData(imageData, 0, 0);
      const resultUrl = resultCanvas.toDataURL("image/png");

      setProcessed({
        original: previewUrl,
        result: resultUrl,
        width: originalWidth,
        height: originalHeight,
      });

      // Add to history
      addToHistory({
        tool: "removeBg",
        fileName: selectedFile.name,
        thumbnail: resultUrl
      });

      setProgress(t("completed"));
      session.release();
      success(t("success_completed"));
    } catch (err) {
      console.error("处理失败:", err);
      const msg = t("error_failed");
      setError(msg);
      toastError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!processed) return;
    const link = document.createElement("a");
    link.href = processed.result;
    link.download = `remove-bg-${Date.now()}.png`;
    link.click();
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setProcessed(null);
    setError("");
    setProgress("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <SoftwareApplicationJsonLd
        name={t("title")}
        description={t("description")}
        url="https://ai-image-tools-h41u.vercel.app/remove-bg"
      />
      
      <Container className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
          
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-2"
            >
              <Layers className="w-8 h-8" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
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

          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer relative overflow-hidden"
              >
                 <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] pointer-events-none" />
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-10 h-10" />
                  </div>
                  <p className="text-xl font-medium text-foreground mb-2">
                    {t("upload_text")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("upload_hint")}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="workspace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {!processed ? (
                  <div className="glass-card p-6 md:p-8 rounded-2xl space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-indigo-500" />
                        {t("preview")}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-red-500">
                        {t("clear")}
                      </Button>
                    </div>
                    
                    <div className="flex justify-center bg-gray-100 dark:bg-gray-900/50 rounded-xl overflow-hidden border border-border p-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-[500px] w-auto h-auto rounded-lg shadow-sm"
                      />
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-4">
                      <Button
                        onClick={processImage}
                        disabled={isProcessing}
                        size="lg"
                        className="w-full md:w-auto min-w-[200px] text-lg h-12 shadow-xl shadow-indigo-500/20"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            {t("processing")}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            {t("start_process")}
                          </>
                        )}
                      </Button>
                      
                      {isProcessing && progress && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-muted-foreground flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full"
                        >
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                          {progress}
                        </motion.div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                      {/* Original */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-4 rounded-2xl"
                      >
                        <div className="flex items-center justify-between mb-4 px-2">
                          <h3 className="font-semibold text-lg text-muted-foreground">{t("original")}</h3>
                        </div>
                        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-900/50 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-border">
                          <img
                            src={processed.original}
                            alt="Original"
                            className="max-w-full max-h-full object-contain rounded-lg"
                          />
                        </div>
                      </motion.div>

                      {/* Result */}
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-4 rounded-2xl ring-2 ring-indigo-500/20 dark:ring-indigo-400/20"
                      >
                         <div className="flex items-center justify-between mb-4 px-2">
                          <h3 className="font-semibold text-lg text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            {t("result")}
                          </h3>
                          <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
                            PNG
                          </span>
                        </div>
                        <div 
                          className="aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center p-2 border border-border"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath fill-rule='evenodd' d='M0 0h10v10H0V0zm10 10h10v10H10V10z'/%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundColor: 'var(--background)'
                          }}
                        >
                          <img
                            src={processed.result}
                            alt="Result"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </motion.div>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <div className="flex flex-wrap justify-center gap-4">
                        <Button
                          onClick={downloadResult}
                          size="lg"
                          className="min-w-[160px] shadow-lg shadow-indigo-500/20"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          {t("download")}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={clearAll}
                          size="lg"
                          className="min-w-[160px]"
                        >
                          {t("process_new")}
                        </Button>
                      </div>
                      
                      <div className="w-full max-w-md">
                        <ShareButtons />
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="pt-8">
            <RelatedTools currentTool="removeBg" />
          </div>
        </div>
      </Container>
      
      <SEOContent {...seoData} />
    </>
  );
}
