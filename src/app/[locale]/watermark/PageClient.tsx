"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Type, Image as ImageIcon, Download, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { AdBannerAuto } from "@/components/ads/AdBanner";
import { useTranslations } from "next-intl";

interface WatermarkSettings {
  type: "text" | "image";
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  watermarkImage?: string;
  scale: number;
  rotate: number;
}

export default function WatermarkPage() {
  const t = useTranslations("Watermark");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [settings, setSettings] = useState<WatermarkSettings>({
    type: "text",
    text: "Sample Watermark",
    fontSize: 32,
    color: "#ffffff",
    opacity: 0.5,
    position: "bottom-right",
    scale: 0.2,
    rotate: 0,
  });
  const [watermarkImageFile, setWatermarkImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);
  const { success, error: toastError } = useToast();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl("");
  }, []);

  const handleWatermarkImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    setWatermarkImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSettings(prev => ({ ...prev, watermarkImage: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl("");
    }
  }, []);

  const getPosition = (canvasWidth: number, canvasHeight: number, contentWidth: number, contentHeight: number) => {
    const padding = 20;
    switch (settings.position) {
      case "top-left":
        return { x: padding, y: padding + contentHeight };
      case "top-right":
        return { x: canvasWidth - contentWidth - padding, y: padding + contentHeight };
      case "bottom-left":
        return { x: padding, y: canvasHeight - padding };
      case "bottom-right":
        return { x: canvasWidth - contentWidth - padding, y: canvasHeight - padding };
      case "center":
        return { x: (canvasWidth - contentWidth) / 2, y: (canvasHeight + contentHeight) / 2 };
      default:
        return { x: canvasWidth - contentWidth - padding, y: canvasHeight - padding };
    }
  };

  const applyWatermark = async () => {
    if (!selectedFile) return;

    try {
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;

      ctx.drawImage(img, 0, 0);

      ctx.save();
      ctx.globalAlpha = settings.opacity;

      if (settings.type === "text") {
        ctx.font = `${settings.fontSize}px Arial`;
        ctx.fillStyle = settings.color;
        const metrics = ctx.measureText(settings.text);
        const pos = getPosition(canvas.width, canvas.height, metrics.width, settings.fontSize);
        ctx.fillText(settings.text, pos.x, pos.y);
      } else if (settings.type === "image" && settings.watermarkImage) {
        const wmImg = new Image();
        wmImg.src = settings.watermarkImage;
        await new Promise((resolve, reject) => {
          wmImg.onload = resolve;
          wmImg.onerror = reject;
        });

        const wmWidth = img.width * settings.scale;
        const wmHeight = (wmImg.height / wmImg.width) * wmWidth;
        const pos = getPosition(canvas.width, canvas.height, wmWidth, wmHeight);

        ctx.translate(pos.x + wmWidth / 2, pos.y - wmHeight / 2);
        ctx.rotate((settings.rotate * Math.PI) / 180);
        ctx.drawImage(wmImg, -wmWidth / 2, -wmHeight / 2, wmWidth, wmHeight);
      }

      ctx.restore();

      setResultUrl(canvas.toDataURL("image/png"));
      success(t("success_added"));
    } catch (error) {
      console.error(error);
      toastError(t("error_failed"));
    }
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `watermarked-${Date.now()}.png`;
    link.click();
    success(t("download_started"));
  };

  const clearAll = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setResultUrl("");
    setWatermarkImageFile(null);
    setSettings(prev => ({ ...prev, watermarkImage: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (watermarkInputRef.current) watermarkInputRef.current.value = "";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
      <h1 className="text-3xl font-bold text-center mb-2">{t("title")}</h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        {t("description")}
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
            {t("upload_text", { defaultMessage: "点击或拖拽上传图片" })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("upload_hint")}
          </p>
        </div>
      )}

      {selectedFile && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{resultUrl ? t("preview_result") : t("preview_original")}</h3>
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <X className="w-4 h-4 mr-1" />
                  {t("clear")}
                </Button>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
                <img
                  src={resultUrl || previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-[500px] object-contain"
                />
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {!resultUrl ? (
                <Button onClick={applyWatermark} size="lg">
                  {t("apply")}
                </Button>
              ) : (
                <>
                  <Button onClick={downloadResult} size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    {t("download")}
                  </Button>
                  <Button variant="outline" onClick={() => setResultUrl("")} size="lg">
                    {t("edit")}
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-6">{t("settings")}</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t("type")}</label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.type === "text" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, type: "text" }))}
                    className="flex-1"
                  >
                    <Type className="w-4 h-4 mr-1" />
                    {t("type_text")}
                  </Button>
                  <Button
                    variant={settings.type === "image" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSettings(prev => ({ ...prev, type: "image" }))}
                    className="flex-1"
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    {t("type_image")}
                  </Button>
                </div>
              </div>

              {settings.type === "text" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("text_content")}</label>
                    <input
                      type="text"
                      value={settings.text}
                      onChange={(e) => setSettings(prev => ({ ...prev, text: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("font_size")}: {settings.fontSize}px</label>
                    <input
                      type="range"
                      min="12"
                      max="100"
                      value={settings.fontSize}
                      onChange={(e) => setSettings(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("text_color")}</label>
                    <input
                      type="color"
                      value={settings.color}
                      onChange={(e) => setSettings(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full h-10 rounded-lg"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("image_upload")}</label>
                    <input
                      ref={watermarkInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleWatermarkImageSelect}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => watermarkInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      {watermarkImageFile ? t("change_image") : t("select_image")}
                    </Button>
                    {watermarkImageFile && (
                      <p className="text-xs text-gray-500 mt-1">{watermarkImageFile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("scale")}: {Math.round(settings.scale * 100)}%</label>
                    <input
                      type="range"
                      min="0.05"
                      max="0.5"
                      step="0.05"
                      value={settings.scale}
                      onChange={(e) => setSettings(prev => ({ ...prev, scale: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("rotate")}: {settings.rotate}°</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={settings.rotate}
                      onChange={(e) => setSettings(prev => ({ ...prev, rotate: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">{t("opacity")}: {Math.round(settings.opacity * 100)}%</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={settings.opacity}
                  onChange={(e) => setSettings(prev => ({ ...prev, opacity: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("position")}</label>
                <select
                  value={settings.position}
                  onChange={(e) => setSettings(prev => ({ ...prev, position: e.target.value as WatermarkSettings["position"] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="top-left">{t("pos_tl")}</option>
                  <option value="top-right">{t("pos_tr")}</option>
                  <option value="bottom-left">{t("pos_bl")}</option>
                  <option value="bottom-right">{t("pos_br")}</option>
                  <option value="center">{t("pos_center")}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
