"use client";

import { useState, useEffect } from "react";
import { 
  Download, 
  RotateCw, 
  RotateCcw, 
  FlipHorizontal, 
  FlipVertical,
  Undo2
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";
import { useTranslations } from "next-intl";

export default function RotatePage() {
  const t = useTranslations("Rotate");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
    }
  };

  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  const processImage = async () => {
    if (!file || !previewUrl) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error(t("error_canvas"));
      }

      const rad = (rotation * Math.PI) / 180;
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      
      const newWidth = Math.abs(width * Math.cos(rad)) + Math.abs(height * Math.sin(rad));
      const newHeight = Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad));

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(rad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -width / 2, -height / 2);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const nameParts = file.name.split(".");
        const ext = nameParts.pop();
        const name = nameParts.join(".");
        a.download = `${name}_rotated.${ext}`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsProcessing(false);
        success(t("success_download"));
      }, file.type);

    } catch (error) {
      console.error("Error processing image:", error);
      toastError(error instanceof Error ? error.message : t("error_failed"));
      setIsProcessing(false);
    }
  };

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t("title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t("description")}
        </p>

        {!file ? (
          <FileUploader
            accept="image/*"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            className="mb-6"
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                    title={t("rotate_left_90")}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" /> -90°
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    title={t("rotate_right_90")}
                  >
                    <RotateCw className="w-4 h-4 mr-1" /> +90°
                  </Button>
                  
                  <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2 hidden sm:block"></div>
                  
                  <Button 
                    variant={flipH ? "secondary" : "outline"} 
                    size="sm" 
                    onClick={() => setFlipH(!flipH)}
                    title={t("flip_h")}
                  >
                    <FlipHorizontal className="w-4 h-4 mr-1" /> {t("flip_h")}
                  </Button>
                  <Button 
                    variant={flipV ? "secondary" : "outline"} 
                    size="sm" 
                    onClick={() => setFlipV(!flipV)}
                    title={t("flip_v")}
                  >
                    <FlipVertical className="w-4 h-4 mr-1" /> {t("flip_v")}
                  </Button>
                </div>

                <div className="flex gap-2">
                   <Button variant="ghost" size="sm" onClick={handleReset} title={t("reset")}>
                    <Undo2 className="w-4 h-4 mr-1" /> {t("reset")}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                    {t("reupload")}
                  </Button>
                </div>
              </div>

              <div className="relative p-8 min-h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-900/50 overflow-hidden bg-[url('/grid.svg')]">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                      transition: "transform 0.3s ease-in-out",
                      maxWidth: "100%",
                      maxHeight: "500px",
                      objectFit: "contain"
                    }}
                    className="shadow-lg"
                  />
                )}
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="flex-1 w-full md:max-w-md space-y-2">
                    <div className="flex justify-between text-sm">
                      <label className="font-medium text-gray-700 dark:text-gray-300">{t("rotation_angle")}</label>
                      <span className="text-blue-600 dark:text-blue-400 font-mono">{rotation}°</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <div className="flex gap-1">
                        {[0, 90, 180, 270].map((deg) => (
                          <button
                            key={deg}
                            onClick={() => setRotation(deg)}
                            className={`px-2 py-1 text-xs rounded border ${
                              rotation === deg 
                                ? "bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300" 
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                            }`}
                          >
                            {deg}°
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={processImage} 
                    disabled={isProcessing} 
                    loading={isProcessing}
                    size="lg"
                    className="w-full md:w-auto min-w-[160px]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("download")}
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
