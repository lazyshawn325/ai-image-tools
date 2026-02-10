"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Download, Crop as CropIcon, Monitor, Square, Smartphone } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AspectRatio {
  name: string;
  value: number | null;
  icon?: React.ReactNode;
}

const ASPECT_RATIOS: AspectRatio[] = [
  { name: "自由", value: null, icon: <CropIcon className="w-4 h-4" /> },
  { name: "1:1", value: 1, icon: <Square className="w-4 h-4" /> },
  { name: "4:3", value: 4 / 3, icon: <Monitor className="w-4 h-4" /> },
  { name: "16:9", value: 16 / 9, icon: <Monitor className="w-4 h-4" /> },
  { name: "3:2", value: 3 / 2, icon: <Smartphone className="w-4 h-4 rotate-90" /> },
  { name: "9:16", value: 9 / 16, icon: <Smartphone className="w-4 h-4" /> },
];

export default function CropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [startCrop, setStartCrop] = useState<CropArea | null>(null);
  const { success, error: toastError } = useToast();

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setImageSrc(url);
    }
  };

  const updatePreview = useCallback((image: HTMLImageElement, cropArea: CropArea) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );
  }, []);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    
    const width = naturalWidth * 0.8;
    const height = naturalHeight * 0.8;
    const x = (naturalWidth - width) / 2;
    const y = (naturalHeight - height) / 2;
    
    const initialCrop = { x, y, width, height };
    setCrop(initialCrop);
    updatePreview(e.currentTarget, initialCrop);
  };

  useEffect(() => {
    if (imageRef.current && crop.width > 0 && crop.height > 0) {
      updatePreview(imageRef.current, crop);
    }
  }, [crop, updatePreview]);

  const getClientCoordinates = (e: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, handle: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setActiveHandle(handle);
    setDragStart(getClientCoordinates(e));
    setStartCrop({ ...crop });
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !dragStart || !startCrop || !imageRef.current || !containerRef.current) return;

    e.preventDefault();

    const clientLoc = getClientCoordinates(e);
    const scale = imageRef.current.naturalWidth / imageRef.current.clientWidth;
    
    const deltaX = (clientLoc.x - dragStart.x) * scale;
    const deltaY = (clientLoc.y - dragStart.y) * scale;

    const newCrop = { ...startCrop };
    const imageWidth = imageRef.current.naturalWidth;
    const imageHeight = imageRef.current.naturalHeight;

    if (activeHandle === 'move') {
      newCrop.x = Math.max(0, Math.min(startCrop.x + deltaX, imageWidth - startCrop.width));
      newCrop.y = Math.max(0, Math.min(startCrop.y + deltaY, imageHeight - startCrop.height));
    } else if (activeHandle) {
      if (activeHandle.includes('e')) {
        newCrop.width = Math.min(Math.max(20, startCrop.width + deltaX), imageWidth - startCrop.x);
        if (aspectRatio) {
           newCrop.height = newCrop.width / aspectRatio;
        }
      }
      if (activeHandle.includes('w')) {
        const maxWidth = startCrop.x + startCrop.width;
        const newX = Math.max(0, Math.min(startCrop.x + deltaX, maxWidth - 20));
        newCrop.width = maxWidth - newX;
        newCrop.x = newX;
        if (aspectRatio) {
           newCrop.height = newCrop.width / aspectRatio;
        }
      }
      if (activeHandle.includes('s')) {
        newCrop.height = Math.min(Math.max(20, startCrop.height + deltaY), imageHeight - startCrop.y);
        if (aspectRatio && !activeHandle.includes('e') && !activeHandle.includes('w')) {
           newCrop.width = newCrop.height * aspectRatio;
        }
      }
      if (activeHandle.includes('n')) {
        const maxHeight = startCrop.y + startCrop.height;
        const newY = Math.max(0, Math.min(startCrop.y + deltaY, maxHeight - 20));
        newCrop.height = maxHeight - newY;
        newCrop.y = newY;
        if (aspectRatio && !activeHandle.includes('e') && !activeHandle.includes('w')) {
           newCrop.width = newCrop.height * aspectRatio;
        }
      }
      
      if (aspectRatio) {
        if (activeHandle.includes('n') || activeHandle.includes('s')) {
           if (newCrop.x + newCrop.width > imageWidth) {
             newCrop.width = imageWidth - newCrop.x;
             newCrop.height = newCrop.width / aspectRatio;
             if (activeHandle.includes('n')) newCrop.y = startCrop.y + startCrop.height - newCrop.height;
           }
        }
        if (activeHandle.includes('w') || activeHandle.includes('e')) {
           if (newCrop.y + newCrop.height > imageHeight) {
             newCrop.height = imageHeight - newCrop.y;
             newCrop.width = newCrop.height * aspectRatio;
             if (activeHandle.includes('w')) newCrop.x = startCrop.x + startCrop.width - newCrop.width;
           }
        }
      }
    }

    setCrop(newCrop);
  }, [isDragging, dragStart, startCrop, activeHandle, aspectRatio]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setActiveHandle(null);
    setDragStart(null);
    setStartCrop(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const applyAspectRatio = (ratio: number | null) => {
    setAspectRatio(ratio);
    if (ratio && imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      let newWidth = crop.width;
      let newHeight = newWidth / ratio;

      if (newHeight > naturalHeight) {
        newHeight = naturalHeight;
        newWidth = newHeight * ratio;
      }

      if (crop.x + newWidth > naturalWidth) {
         setCrop({
            ...crop,
            x: Math.max(0, naturalWidth - newWidth),
            width: newWidth,
            height: newHeight
         });
      } else if (crop.y + newHeight > naturalHeight) {
         setCrop({
            ...crop,
            y: Math.max(0, naturalHeight - newHeight),
            width: newWidth,
            height: newHeight
         });
      } else {
        setCrop({ ...crop, width: newWidth, height: newHeight });
      }
    }
  };

  const handleDownload = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !file) return;

    canvas.toBlob((blob) => {
      if (!blob) {
        toastError("裁剪图片生成失败");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      a.download = `${fileName}_cropped.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      success("裁剪图片下载开始");
    });
  };

  const getStyle = () => {
    if (!imageRef.current) return {};
    const scale = imageRef.current.clientWidth / imageRef.current.naturalWidth;
    return {
      left: `${crop.x * scale}px`,
      top: `${crop.y * scale}px`,
      width: `${crop.width * scale}px`,
      height: `${crop.height * scale}px`,
    };
  };

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          图片裁剪
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          自由裁剪图片，支持固定比例和自定义尺寸
        </p>

        {!file ? (
          <FileUploader
            accept="image/*"
            onFilesSelected={handleFilesSelected}
            className="mb-6"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-900 rounded-xl p-4 flex items-center justify-center overflow-hidden min-h-[400px] select-none">
               <div className="relative" ref={containerRef}>
                 <img 
                   ref={imageRef}
                   src={imageSrc!} 
                   alt="Source" 
                   className="max-w-full max-h-[70vh] object-contain pointer-events-none"
                   onLoad={onImageLoad}
                 />
                 
                 {imageRef.current && (
                   <>
                     <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                     <div 
                        className="absolute cursor-move outline outline-2 outline-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                        style={getStyle()}
                        onMouseDown={(e) => handleMouseDown(e, 'move')}
                        onTouchStart={(e) => handleMouseDown(e, 'move')}
                     >
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                          <div className="border-r border-white/30" />
                          <div className="border-r border-white/30" />
                          <div className="border-t border-white/30 col-span-3 row-start-2" />
                          <div className="border-t border-white/30 col-span-3 row-start-3" />
                        </div>

                        {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map((pos) => {
                           let cursor = '';
                           if (pos === 'nw' || pos === 'se') cursor = 'cursor-nwse-resize';
                           else if (pos === 'ne' || pos === 'sw') cursor = 'cursor-nesw-resize';
                           else if (pos === 'n' || pos === 's') cursor = 'cursor-ns-resize';
                           else cursor = 'cursor-ew-resize';

                           let styleClass = '';
                           if (pos.includes('n')) styleClass += ' -top-1.5';
                           else if (pos.includes('s')) styleClass += ' -bottom-1.5';
                           else styleClass += ' top-1/2 -translate-y-1/2';

                           if (pos.includes('w')) styleClass += ' -left-1.5';
                           else if (pos.includes('e')) styleClass += ' -right-1.5';
                           else styleClass += ' left-1/2 -translate-x-1/2';
                           
                           return (
                             <div
                               key={pos}
                               className={`absolute w-3 h-3 bg-white border border-blue-500 rounded-full z-10 ${styleClass} ${cursor}`}
                               onMouseDown={(e) => handleMouseDown(e, pos)}
                               onTouchStart={(e) => handleMouseDown(e, pos)}
                             />
                           );
                        })}
                     </div>
                   </>
                 )}
               </div>
            </div>

            <div className="space-y-6">
               <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">裁剪比例</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio.name}
                        onClick={() => applyAspectRatio(ratio.value)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                          aspectRatio === ratio.value
                            ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300"
                            : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        }`}
                      >
                        {ratio.icon}
                        <span className="text-xs mt-1">{ratio.name}</span>
                      </button>
                    ))}
                  </div>
               </div>

               <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">预览</h3>
                  <div className="w-full aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <canvas ref={previewCanvasRef} className="max-w-full max-h-full object-contain" />
                  </div>
               </div>

               <div className="flex gap-4">
                 <Button variant="outline" onClick={() => setFile(null)} className="flex-1">
                   重新上传
                 </Button>
                 <Button onClick={handleDownload} className="flex-1">
                   <Download className="w-4 h-4 mr-2" />
                   下载图片
                 </Button>
               </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
