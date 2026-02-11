"use client";

import { useState } from "react";
import { Trash2, MapPin, Camera, Image as ImageIcon, Info } from "lucide-react";
import EXIF from "exif-js";
import { useToast } from "@/components/ui/Toast";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";

interface ExifData {
  Make?: string;
  Model?: string;
  DateTime?: string;
  ExposureTime?: number;
  FNumber?: number;
  ISOSpeedRatings?: number;
  FocalLength?: number;
  PixelXDimension?: number;
  PixelYDimension?: number;
  Orientation?: number;
  ColorSpace?: number;
  GPSLatitude?: number[];
  GPSLatitudeRef?: string;
  GPSLongitude?: number[];
  GPSLongitudeRef?: string;
  [key: string]: unknown;
}

interface ProcessedImage {
  file: File;
  preview: string;
  exif: ExifData | null;
  hasExif: boolean;
}

export default function ExifPage() {
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  const convertDMSToDD = (dms: number[], ref: string) => {
    if (!dms || dms.length < 3) return null;
    let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
    if (ref === "S" || ref === "W") {
      dd = dd * -1;
    }
    return dd;
  };

  const getExifData = (file: File): Promise<ExifData | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return resolve(null);
        
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          // @ts-expect-error - exif-js types might be slightly off regarding 'this' context or overload
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          EXIF.getData(img, function(this: any) {
            const allTags = EXIF.getAllTags(this);
            URL.revokeObjectURL(img.src);
            resolve(allTags && Object.keys(allTags).length > 0 ? allTags : null);
          });
        };
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          resolve(null);
        };
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) {
      setSelectedImage(null);
      return;
    }

    setError(null);
    try {
      const file = selectedFiles[0];
      const exif = await getExifData(file);
      
      setSelectedImage({
        file,
        preview: URL.createObjectURL(file),
        exif,
        hasExif: !!exif
      });
    } catch (err) {
      console.error(err);
      const msg = "读取图片信息失败";
      setError(msg);
      toastError(msg);
    }
  };

  const removeExifAndDownload = async () => {
    if (!selectedImage) return;

    try {
      const img = new Image();
      img.src = selectedImage.preview;
      await new Promise((resolve) => { img.onload = resolve; });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Could not create blob");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `clean_${selectedImage.file.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        success("清除EXIF并下载开始");
      }, selectedImage.file.type, 1.0);
    } catch (err) {
      console.error(err);
      const msg = "清除EXIF失败";
      setError(msg);
      toastError(msg);
    }
  };

  const renderExifValue = (value: unknown) => {
    if (value === undefined || value === null) return "未知";
    if (typeof value === 'number') return value;
    if (value instanceof Number) return value.valueOf();
    return String(value);
  };

  const renderGpsLink = () => {
    if (!selectedImage?.exif?.GPSLatitude || !selectedImage?.exif?.GPSLongitude) return null;
    
    const lat = convertDMSToDD(selectedImage.exif.GPSLatitude, selectedImage.exif.GPSLatitudeRef || "N");
    const lng = convertDMSToDD(selectedImage.exif.GPSLongitude, selectedImage.exif.GPSLongitudeRef || "E");

    if (lat === null || lng === null) return null;

    return (
      <a 
        href={`https://www.google.com/maps?q=${lat},${lng}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600 underline text-sm flex items-center gap-1 mt-1"
      >
        <MapPin className="w-3 h-3" /> 在地图上查看
      </a>
    );
  };

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          EXIF 信息查看器
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          在线查看和编辑图片 EXIF 信息，支持查看拍摄参数、GPS 位置等
        </p>

        <FileUploader
          accept="image/*"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          onError={setError}
          className="mb-6"
        />

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {selectedImage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage.preview}
                  alt={selectedImage.file.name}
                  className="w-full h-auto rounded-lg"
                />
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedImage.file.name}
                  </span>
                  <Button onClick={removeExifAndDownload} variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    清除信息并下载
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {!selectedImage.hasExif ? (
                 <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg flex items-center gap-2">
                   <Info className="w-5 h-5" />
                   此图片不包含 EXIF 信息
                 </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-gray-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">相机信息</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">设备制造厂商</span>
                        <span className="font-medium dark:text-gray-200">{renderExifValue(selectedImage.exif?.Make)}</span>
                        
                        <span className="text-gray-500 dark:text-gray-400">相机型号</span>
                        <span className="font-medium dark:text-gray-200">{renderExifValue(selectedImage.exif?.Model)}</span>
                        
                        <span className="text-gray-500 dark:text-gray-400">拍摄时间</span>
                        <span className="font-medium dark:text-gray-200">{renderExifValue(selectedImage.exif?.DateTime)}</span>
                        
                        <span className="text-gray-500 dark:text-gray-400">曝光时间</span>
                        <span className="font-medium dark:text-gray-200">{selectedImage.exif?.ExposureTime ? `1/${Math.round(1/selectedImage.exif.ExposureTime)}s` : '未知'}</span>
                        
                        <span className="text-gray-500 dark:text-gray-400">光圈值</span>
                        <span className="font-medium dark:text-gray-200">{selectedImage.exif?.FNumber ? `f/${selectedImage.exif.FNumber}` : '未知'}</span>
                        
                        <span className="text-gray-500 dark:text-gray-400">ISO 感光度</span>
                        <span className="font-medium dark:text-gray-200">{renderExifValue(selectedImage.exif?.ISOSpeedRatings)}</span>
                        
                        <span className="text-gray-500 dark:text-gray-400">焦距</span>
                        <span className="font-medium dark:text-gray-200">{selectedImage.exif?.FocalLength ? `${selectedImage.exif.FocalLength}mm` : '未知'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-gray-500" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">图片参数</h3>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">宽度</span>
                        <span className="font-medium dark:text-gray-200">{renderExifValue(selectedImage.exif?.PixelXDimension)} px</span>
                        
                        <span className="text-gray-500 dark:text-gray-400">高度</span>
                        <span className="font-medium dark:text-gray-200">{renderExifValue(selectedImage.exif?.PixelYDimension)} px</span>
                        
                        <span className="text-gray-500 dark:text-gray-400">色彩空间</span>
                        <span className="font-medium dark:text-gray-200">{selectedImage.exif?.ColorSpace === 1 ? 'sRGB' : 'Uncalibrated'}</span>
                        
                        <span className="text-gray-500 dark:text-gray-400">方向</span>
                        <span className="font-medium dark:text-gray-200">{renderExifValue(selectedImage.exif?.Orientation)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedImage.exif?.GPSLatitude && selectedImage.exif?.GPSLongitude && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">GPS 位置</h3>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span className="text-gray-500 dark:text-gray-400">纬度</span>
                          <span className="font-medium dark:text-gray-200">
                            {convertDMSToDD(selectedImage.exif.GPSLatitude, selectedImage.exif.GPSLatitudeRef || "N")?.toFixed(6)}° {selectedImage.exif.GPSLatitudeRef}
                          </span>
                          
                          <span className="text-gray-500 dark:text-gray-400">经度</span>
                          <span className="font-medium dark:text-gray-200">
                            {convertDMSToDD(selectedImage.exif.GPSLongitude, selectedImage.exif.GPSLongitudeRef || "E")?.toFixed(6)}° {selectedImage.exif.GPSLongitudeRef}
                          </span>
                        </div>
                        {renderGpsLink()}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
