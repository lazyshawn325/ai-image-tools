"use client";

import { useState, useCallback } from "react";
import { Download, RotateCcw, Wand2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";
import { useTranslations } from "next-intl";

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturate: number;
  grayscale: number;
  blur: number;
  sepia: number;
}

const DEFAULT_SETTINGS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  blur: 0,
  sepia: 0,
};

export default function FiltersPage() {
  const t = useTranslations("Filters");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<FilterSettings>(DEFAULT_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const { success, error: toastError } = useToast();

  const PRESETS = [
    { name: t("preset_original"), settings: DEFAULT_SETTINGS },
    {
      name: t("preset_vintage"),
      settings: { ...DEFAULT_SETTINGS, sepia: 50, contrast: 110, brightness: 90 },
    },
    {
      name: t("preset_bw"),
      settings: { ...DEFAULT_SETTINGS, grayscale: 100, contrast: 120 },
    },
    {
      name: t("preset_warm"),
      settings: { ...DEFAULT_SETTINGS, sepia: 30, saturate: 120, brightness: 105 },
    },
    {
      name: t("preset_cool"),
      settings: { ...DEFAULT_SETTINGS, saturate: 90, contrast: 110, brightness: 105 },
    },
    {
      name: t("preset_high_contrast"),
      settings: { ...DEFAULT_SETTINGS, contrast: 150, saturate: 120 },
    },
  ];

  const getFilterString = (s: FilterSettings) => {
    return `brightness(${s.brightness}%) contrast(${s.contrast}%) saturate(${s.saturate}%) grayscale(${s.grayscale}%) blur(${s.blur}px) sepia(${s.sepia}%)`;
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const updateSetting = (key: keyof FilterSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownload = useCallback(async () => {
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
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.filter = getFilterString(settings);
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `filtered_${file.name}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            success(t("download_start"));
          } else {
            toastError(t("download_fail"));
          }
        }, file.type);
      }
    } catch (error) {
      console.error("Failed to process image", error);
      toastError(t("process_fail"));
    } finally {
      setIsProcessing(false);
    }
  }, [file, previewUrl, settings, success, toastError, t]);

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto">
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
            onError={(err) => console.error(err)}
            className="mb-6"
            text={t("upload_text")}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 flex items-center justify-center min-h-[400px] border border-gray-200 dark:border-gray-700">
              <div className="relative max-w-full max-h-[600px] overflow-hidden rounded-lg shadow-sm">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl!}
                  alt="Preview"
                  className="max-w-full h-auto object-contain"
                  style={{ filter: getFilterString(settings) }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-2">
                <FileUploader
                  accept="image/*"
                  multiple={false}
                  onFilesSelected={handleFilesSelected}
                  onError={(err) => console.error(err)}
                  className="hidden"
                />
                <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                        setFile(null);
                        setPreviewUrl(null);
                        setSettings(DEFAULT_SETTINGS);
                    }}
                >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {t("change_image")}
                </Button>
                <Button 
                    className="flex-1" 
                    onClick={handleDownload}
                    loading={isProcessing}
                >
                    <Download className="w-4 h-4 mr-2" />
                    {t("download_image")}
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    {t("presets_title")}
                  </h2>
                  <button
                    onClick={() => setSettings(DEFAULT_SETTINGS)}
                    className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {t("reset")}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setSettings(preset.settings)}
                      className="px-2 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 space-y-4">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t("params_title")}
                </h2>
                
                <FilterSlider
                  label={t("brightness")}
                  value={settings.brightness}
                  min={0}
                  max={200}
                  unit="%"
                  onChange={(v) => updateSetting("brightness", v)}
                />
                <FilterSlider
                  label={t("contrast")}
                  value={settings.contrast}
                  min={0}
                  max={200}
                  unit="%"
                  onChange={(v) => updateSetting("contrast", v)}
                />
                <FilterSlider
                  label={t("saturation")}
                  value={settings.saturate}
                  min={0}
                  max={200}
                  unit="%"
                  onChange={(v) => updateSetting("saturate", v)}
                />
                <FilterSlider
                  label={t("grayscale")}
                  value={settings.grayscale}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(v) => updateSetting("grayscale", v)}
                />
                <FilterSlider
                  label={t("blur")}
                  value={settings.blur}
                  min={0}
                  max={10}
                  unit="px"
                  step={0.5}
                  onChange={(v) => updateSetting("blur", v)}
                />
                <FilterSlider
                  label={t("sepia")}
                  value={settings.sepia}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(v) => updateSetting("sepia", v)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

interface FilterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  step?: number;
  onChange: (value: number) => void;
}

function FilterSlider({ label, value, min, max, unit, step = 1, onChange }: FilterSliderProps) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <span className="text-sm text-gray-500">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
      />
    </div>
  );
}
