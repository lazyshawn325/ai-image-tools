"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Download, ZoomIn, MoveHorizontal, Zap, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";
import { SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";
import { SEOContent } from "@/components/seo/SEOContent";
import { useTranslations } from "next-intl";

interface UpscaledImage {
  original: File;
  previewOriginal: string;
  previewUpscaled: string;
  originalWidth: number;
  originalHeight: number;
  targetWidth: number;
  targetHeight: number;
  scale: number;
  blob: Blob;
}

type ScaleOption = 2 | 3 | 4;
type Algorithm = "smooth" | "sharp";

export default function UpscalePage() {
  const t = useTranslations("Upscale");
  const seoData = {
    title: t("SEO.title"),
    description: t("SEO.description"),
    features: t.raw("SEO.features"),
    howToUse: t.raw("SEO.howToUse"),
    faq: t.raw("SEO.faq")
  };

  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState<ScaleOption>(2);
  const [algorithm, setAlgorithm] = useState<Algorithm>("sharp");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<UpscaledImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResult(null);
      setError(null);
    }
  };

  const upscaleImage = async (
    sourceFile: File,
    scaleFactor: number,
    algo: Algorithm
  ): Promise<UpscaledImage> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(sourceFile);
      
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;
        const targetWidth = originalWidth * scaleFactor;
        const targetHeight = originalHeight * scaleFactor;
        
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Canvas context failed"));
          return;
        }

        if (algo === "smooth") {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        } else {
          let currentWidth = originalWidth;
          let currentHeight = originalHeight;
          
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          
          if (!tempCtx) {
             URL.revokeObjectURL(url);
             reject(new Error("Temp canvas failed"));
             return;
          }

          tempCanvas.width = currentWidth;
          tempCanvas.height = currentHeight;
          tempCtx.drawImage(img, 0, 0);

          let steps = 0;
          while (currentWidth < targetWidth && steps < 10) {
            const nextWidth = Math.min(Math.floor(currentWidth * 1.5), targetWidth);
            const nextHeight = Math.min(Math.floor(currentHeight * 1.5), targetHeight);
            
            const stepCanvas = document.createElement("canvas");
            stepCanvas.width = nextWidth;
            stepCanvas.height = nextHeight;
            const stepCtx = stepCanvas.getContext("2d");
            if (!stepCtx) break;
            
            stepCtx.imageSmoothingEnabled = true;
            stepCtx.imageSmoothingQuality = "high";
            
            stepCtx.drawImage(tempCanvas, 0, 0, nextWidth, nextHeight);
            
            tempCanvas.width = nextWidth;
            tempCanvas.height = nextHeight;
            tempCtx?.drawImage(stepCanvas, 0, 0);
            
            currentWidth = nextWidth;
            currentHeight = nextHeight;
            steps++;
            
            if (currentWidth >= targetWidth) break;
          }
          
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);
        }

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (!blob) {
              reject(new Error("Generate failed"));
              return;
            }
            
            resolve({
              original: sourceFile,
              previewOriginal: url, 
              previewUpscaled: URL.createObjectURL(blob),
              originalWidth,
              originalHeight,
              targetWidth,
              targetHeight,
              scale: scaleFactor,
              blob,
            });
          },
          sourceFile.type === "image/png" ? "image/png" : "image/jpeg",
          0.92
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Image load failed"));
      };
      
      img.src = url;
    });
  };

  const processImage = useCallback(async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const res = await upscaleImage(file, scale, algorithm);
      
      if (result) {
        URL.revokeObjectURL(result.previewUpscaled);
      }
      
      setResult(res);
      success(t("success_completed"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("error_failed");
      const displayMsg = msg === "Canvas context failed" ? t("error_canvas_context") :
                         msg === "Temp canvas failed" ? t("error_temp_canvas") :
                         msg === "Generate failed" ? t("error_generate_failed") :
                         msg === "Image load failed" ? t("error_load_failed") : msg;
      setError(displayMsg);
      toastError(displayMsg);
    } finally {
      setIsProcessing(false);
    }
  }, [file, scale, algorithm, result, success, toastError, t]);

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.previewUpscaled;
    const originalName = result.original.name.replace(/\.[^/.]+$/, "");
    a.download = `${originalName}_${result.scale}x_upscaled.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    } else {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      <SoftwareApplicationJsonLd
        name={t("title")}
        description={t("description")}
        url="https://ai-image-tools-h41u.vercel.app/upscale"
      />
      <Container className="py-8">
      <div className="max-w-5xl mx-auto">

        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
            <ZoomIn className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            {t("title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("description")}
          </p>
        </div>

        <div className="mb-8">
          <FileUploader
            accept="image/*"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            onError={setError}
            className="mb-6"
          />
        </div>

        {file && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    {t("settings_title")}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("scale_factor")}
                      </label>
                      <div className="flex gap-3">
                        {[2, 3, 4].map((s) => (
                          <button
                            key={s}
                            onClick={() => setScale(s as ScaleOption)}
                            className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                              scale === s
                                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500"
                                : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                            }`}
                          >
                            <span className="text-lg font-bold">{s}x</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("algorithm")}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setAlgorithm("smooth")}
                          className={`py-2 px-4 rounded-lg border text-left transition-all ${
                            algorithm === "smooth"
                                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500"
                                : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          <div className="font-medium">{t("algo_smooth")}</div>
                          <div className="text-xs opacity-70 mt-1">{t("algo_smooth_desc")}</div>
                        </button>
                        <button
                          onClick={() => setAlgorithm("sharp")}
                          className={`py-2 px-4 rounded-lg border text-left transition-all ${
                            algorithm === "sharp"
                                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500"
                                : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          <div className="font-medium">{t("algo_sharp")}</div>
                          <div className="text-xs opacity-70 mt-1">{t("algo_sharp_desc")}</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{t("original_size")}</span>
                    <span className="font-mono">{result ? result.originalWidth : "---"} x {result ? result.originalHeight : "---"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-blue-600 dark:text-blue-400 font-medium">
                    <span>{t("upscaled_size")}</span>
                    <span className="font-mono">
                      {result ? result.targetWidth : (file ? "---" : "---")} x {result ? result.targetHeight : (file ? "---" : "---")}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={processImage}
                  disabled={isProcessing}
                  loading={isProcessing}
                  className="w-full h-12 text-lg"
                >
                  {isProcessing ? t("processing") : t("start_upscale")}
                </Button>
                
                {result && (
                  <Button
                    onClick={downloadResult}
                    variant="outline"
                    className="w-full mt-3 border-green-500 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {t("download_image")}
                  </Button>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 min-h-[400px] flex items-center justify-center">
                {!result ? (
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p>{t("preview_hint")}</p>
                  </div>
                ) : (
                  <div className="relative w-full aspect-square max-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
                      <span>{t("original_stretched")}</span>
                      <span>{t("processed")}</span>
                    </div>
                    
                    <div 
                      ref={containerRef}
                      className="relative flex-1 w-full overflow-hidden rounded-lg cursor-col-resize select-none border border-gray-200 dark:border-gray-700"
                      onMouseMove={handleMouseMove}
                      onTouchMove={handleMouseMove}
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleMouseDown}
                    >
                      <div className="absolute inset-0">
                         <img
                            src={URL.createObjectURL(result.original)}
                            className="w-full h-full object-contain"
                            style={{ filter: 'blur(0.5px)' }}
                            draggable={false}
                            alt="Original preview"
                          />
                      </div>
                      
                      <div 
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${sliderPosition}%` }}
                      >
                         <img
                            src={result.previewUpscaled}
                            className="h-full object-contain" 
                            style={{ 
                              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                              maxWidth: 'none'
                            }}
                            draggable={false}
                            alt="Upscaled preview"
                          />
                      </div>

                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize shadow-lg flex items-center justify-center"
                        style={{ left: `calc(${sliderPosition}% - 2px)` }}
                      >
                        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400">
                          <MoveHorizontal className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                        {t("processed")}
                      </div>
                      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                        {t("original")}
                      </div>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-2">
                      {t("drag_compare")}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}
      </div>
    </Container>
    <SEOContent {...seoData} />
    </>
  );
}
