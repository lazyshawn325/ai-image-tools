"use client";

import { useState, useCallback, useRef } from "react";
import * as ort from "onnxruntime-web";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { AdBannerAuto } from "@/components/ads/AdBanner";

interface ProcessedImage {
  original: string;
  result: string;
  width: number;
  height: number;
}

export default function RemoveBackgroundPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [processed, setProcessed] = useState<ProcessedImage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error: toastError } = useToast();

  ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.1/dist/";

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      const msg = "请选择图片文件";
      setError(msg);
      toastError(msg);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      const msg = "图片大小不能超过 10MB";
      setError(msg);
      toastError(msg);
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setProcessed(null);
  }, [toastError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        const msg = "图片大小不能超过 10MB";
        setError(msg);
        toastError(msg);
        return;
      }
      setError("");
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProcessed(null);
    }
  }, [toastError]);

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
    setProgress("正在加载模型...");
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

      setProgress("正在预处理图片...");
      const inputData = await preprocessImage(img);

      setProgress("正在加载 AI 模型...");
      const session = await ort.InferenceSession.create(
        "https://huggingface.co/park168/ai-removebg-model/resolve/main/u2netp.onnx",
        {
          executionProviders: ["wasm"],
          graphOptimizationLevel: "basic",
        }
      );

      setProgress("正在 AI 抠图...");
      const tensor = new ort.Tensor("float32", inputData, [1, 3, 320, 320]);
      const feeds = { input: tensor };
      const results = await session.run(feeds);
      const output = results.output;

      setProgress("正在生成结果...");
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

      setProgress("完成！");
      session.release();
      success("AI 抠图完成");
    } catch (err) {
      console.error("处理失败:", err);
      const msg = "处理失败，请重试。如果问题持续，请尝试使用较小的图片。";
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
      <h1 className="text-3xl font-bold text-center mb-2">AI 智能去背景</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        一键智能抠图，自动移除图片背景，完全在浏览器运行，保护您的隐私
      </p>

      {!selectedFile && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            点击或拖拽上传图片
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            支持 JPG、PNG 格式，最大 10MB
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {selectedFile && !processed && (
        <div className="mt-6 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">预览</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
              >
                清除
              </Button>
            </div>
            <div className="flex justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-[400px] max-w-full rounded-lg object-contain"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={processImage}
              disabled={isProcessing}
              size="lg"
              loading={isProcessing}
            >
              {isProcessing ? "处理中..." : "开始 AI 抠图"}
            </Button>
          </div>

          {isProcessing && progress && (
            <div className="text-center text-gray-600 dark:text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
              {progress}
            </div>
          )}
        </div>
      )}

      {processed && (
        <div className="mt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3">原图</h3>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={processed.original}
                  alt="Original"
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3">抠图结果</h3>
              <div 
                className="rounded-lg overflow-hidden"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23cccccc' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 0h10v10H0V0zm10 10h10v10H10V10z'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundColor: '#f0f0f0'
                }}
              >
                <img
                  src={processed.result}
                  alt="Result"
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={downloadResult}
              size="lg"
            >
              下载 PNG 图片
            </Button>
            <Button
              variant="outline"
              onClick={clearAll}
              size="lg"
            >
              处理新图片
            </Button>
          </div>
        </div>
      )}

      <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
        <div className="p-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
          </div>
          <h3 className="font-medium mb-2">上传图片</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">支持拖拽上传或点击选择图片文件</p>
        </div>
        <div className="p-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
          </div>
          <h3 className="font-medium mb-2">AI 处理</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">AI 自动识别主体，智能移除背景</p>
        </div>
        <div className="p-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</span>
          </div>
          <h3 className="font-medium mb-2">下载结果</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">获取透明背景 PNG 图片</p>
        </div>
      </div>
    </div>
  );
}
