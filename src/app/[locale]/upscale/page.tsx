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
  const seoData = {
    title: "图片无损放大 - 免费在线图片画质增强工具",
    description: "采用先进的图像处理算法，免费在线放大图片尺寸。支持 2倍、3倍、4倍无损放大，提供平滑（Smooth）和锐利（Sharp）两种算法模式，有效消除锯齿和模糊。完全在浏览器本地运行，保护隐私。",
    features: [
      "🔍 无损放大：智能插值算法，放大图片同时保持边缘清晰，减少锯齿",
      "⚙️ 多种模式：提供 Smooth（适合人像）和 Sharp（适合插画/文字）两种算法",
      "🚀 本地处理：利用 Canvas API 和 WebAssembly 技术，所有计算在本地完成",
      "👀 实时对比：提供处理前后效果对比滑块，直观感受画质提升",
      "📱 全平台支持：兼容电脑、平板和手机浏览器，随时随地使用"
    ],
    howToUse: [
      "上传需要放大的图片（支持 JPG, PNG 等常见格式）",
      "选择放大倍数（2x, 3x, 4x）和处理算法（平滑或锐利）",
      "点击“开始放大”按钮，系统将自动进行像素增强处理",
      "使用对比滑块查看效果，满意后点击“下载图片”保存结果"
    ],
    faq: [
      {
        question: "无损放大是真的无损吗？",
        answer: "“无损”是指在放大过程中尽可能保留原始细节并减少失真。实际上，从低分辨率生成高分辨率必然涉及像素预测，我们使用优化的算法使结果尽可能接近无损效果。"
      },
      {
        question: "平滑（Smooth）和锐利（Sharp）有什么区别？",
        answer: "平滑模式适合照片、人像等自然图像，能减少噪点；锐利模式适合动漫、插画、文字截图，能保持边缘锋利清晰。"
      },
      {
        question: "为什么处理速度有时候会变慢？",
        answer: "处理速度取决于图片原始尺寸和放大倍数。例如将 1000px 图片放大 4 倍会生成 4000px 的大图，计算量呈指数级增长，请耐心等待。"
      }
    ]
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
          reject(new Error("无法创建Canvas上下文"));
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
             reject(new Error("无法创建临时Canvas"));
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
              reject(new Error("生成图片失败"));
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
        reject(new Error("图片加载失败"));
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
      success("图片无损放大完成");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "处理失败";
      setError(msg);
      toastError(msg);
    } finally {
      setIsProcessing(false);
    }
  }, [file, scale, algorithm, result, success, toastError]);

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
        name="图片无损放大工具"
        description="免费在线图片无损放大，支持 2x/3x/4x 放大"
        url="https://ai-image-tools-h41u.vercel.app/upscale"
      />
      <Container className="py-8">
      <div className="max-w-5xl mx-auto">

        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
            <ZoomIn className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            图片无损放大
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            使用智能算法放大图片，保持细节清晰，支持 2x/3x/4x 放大
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
                    放大设置
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        放大倍数
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
                        处理算法
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
                          <div className="font-medium">平滑 (Smooth)</div>
                          <div className="text-xs opacity-70 mt-1">适合人像/照片，柔和过渡</div>
                        </button>
                        <button
                          onClick={() => setAlgorithm("sharp")}
                          className={`py-2 px-4 rounded-lg border text-left transition-all ${
                            algorithm === "sharp"
                                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500"
                                : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          <div className="font-medium">锐利 (Sharp)</div>
                          <div className="text-xs opacity-70 mt-1">适合文字/插画，边缘清晰</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>原始尺寸:</span>
                    <span className="font-mono">{result ? result.originalWidth : "---"} x {result ? result.originalHeight : "---"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-blue-600 dark:text-blue-400 font-medium">
                    <span>放大后尺寸:</span>
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
                  {isProcessing ? "处理中..." : "开始放大"}
                </Button>
                
                {result && (
                  <Button
                    onClick={downloadResult}
                    variant="outline"
                    className="w-full mt-3 border-green-500 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    下载图片
                  </Button>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 min-h-[400px] flex items-center justify-center">
                {!result ? (
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p>点击&quot;开始放大&quot;查看预览效果</p>
                  </div>
                ) : (
                  <div className="relative w-full aspect-square max-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
                      <span>原图 (拉伸)</span>
                      <span>处理后</span>
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
                        处理后
                      </div>
                      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                        原图
                      </div>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-2">
                      左右拖动查看对比效果
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

