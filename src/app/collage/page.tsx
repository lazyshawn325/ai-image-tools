"use client";
// Image Collage Tool - Combine multiple images into one

import { useState, useCallback, useRef, useEffect } from "react";
import { Download, LayoutGrid, Grid2X2, Grid3X3, Rows, Columns } from "lucide-react";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";

interface CollageLayout {
  id: string;
  name: string;
  icon: React.ReactNode;
  minImages: number;
  maxImages: number;
}

const LAYOUTS: CollageLayout[] = [
  { id: "horizontal", name: "横向拼接", icon: <Columns className="w-5 h-5" />, minImages: 2, maxImages: 9 },
  { id: "vertical", name: "纵向拼接", icon: <Rows className="w-5 h-5" />, minImages: 2, maxImages: 9 },
  { id: "grid-2x2", name: "2x2 网格", icon: <Grid2X2 className="w-5 h-5" />, minImages: 4, maxImages: 4 },
  { id: "grid-3x3", name: "3x3 网格", icon: <Grid3X3 className="w-5 h-5" />, minImages: 9, maxImages: 9 },
  { id: "layout-1-2", name: "左1右2", icon: <LayoutGrid className="w-5 h-5 rotate-90" />, minImages: 3, maxImages: 3 },
  { id: "layout-2-1", name: "左2右1", icon: <LayoutGrid className="w-5 h-5 -rotate-90" />, minImages: 3, maxImages: 3 },
];

export default function CollagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [layoutId, setLayoutId] = useState<string>("horizontal");
  const [gap, setGap] = useState<number>(10);
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [swapSourceIndex, setSwapSourceIndex] = useState<number | null>(null);

  useEffect(() => {
    if (files.length === 0) {
      setImages([]);
      setPreviewUrl(null);
      return;
    }

    let isMounted = true;
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      for (const file of files) {
        try {
          await new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              loadedImages.push(img);
              resolve();
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
          });
        } catch (error) {
          console.error("Failed to load image", error);
        }
      }
      if (isMounted) {
        setImages(loadedImages);
      }
    };

    loadImages();

    return () => {
      isMounted = false;
      images.forEach(img => URL.revokeObjectURL(img.src));
    };
  }, [files]);

  useEffect(() => {
    const count = files.length;
    if (count === 0) return;

    const currentLayout = LAYOUTS.find(l => l.id === layoutId);
    if (!currentLayout || count < currentLayout.minImages || count > currentLayout.maxImages) {
      if (count === 4) setLayoutId("grid-2x2");
      else if (count === 9) setLayoutId("grid-3x3");
      else if (count === 3) setLayoutId("layout-1-2");
      else setLayoutId("horizontal");
    }
  }, [files.length]);

  const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
    const ratio = w / h;
    const imgRatio = img.width / img.height;
    
    let sx, sy, sw, sh;

    if (imgRatio > ratio) {
      sh = img.height;
      sw = sh * ratio;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = sw / ratio;
      sx = 0;
      sy = (img.height - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  };

  const drawCollage = useCallback(() => {
    if (images.length === 0 || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const baseSize = 1200; 
    let width = 0;
    let height = 0;
    
    if (layoutId === "horizontal") {
      const targetHeight = baseSize;
      const scaledWidths = images.map(img => (img.width / img.height) * targetHeight);
      width = scaledWidths.reduce((a, b) => a + b, 0) + (images.length - 1) * gap;
      height = targetHeight;
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      
      let currentX = 0;
      images.forEach((img, i) => {
        const w = scaledWidths[i];
        ctx.drawImage(img, currentX, 0, w, height);
        currentX += w + gap;
      });

    } else if (layoutId === "vertical") {
      const targetWidth = baseSize;
      const scaledHeights = images.map(img => (img.height / img.width) * targetWidth);
      width = targetWidth;
      height = scaledHeights.reduce((a, b) => a + b, 0) + (images.length - 1) * gap;
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      
      let currentY = 0;
      images.forEach((img, i) => {
        const h = scaledHeights[i];
        ctx.drawImage(img, 0, currentY, width, h);
        currentY += h + gap;
      });

    } else if (layoutId === "grid-2x2") {
      const size = baseSize * 2 + gap;
      width = size;
      height = size;
      canvas.width = width;
      canvas.height = height;
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const cellSize = baseSize;
      const positions = [
        { x: 0, y: 0 },
        { x: cellSize + gap, y: 0 },
        { x: 0, y: cellSize + gap },
        { x: cellSize + gap, y: cellSize + gap },
      ];

      images.slice(0, 4).forEach((img, i) => {
        drawImageCover(ctx, img, positions[i].x, positions[i].y, cellSize, cellSize);
      });

    } else if (layoutId === "grid-3x3") {
      const cellSize = baseSize / 1.5;
      width = cellSize * 3 + gap * 2;
      height = width;
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      images.slice(0, 9).forEach((img, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = col * (cellSize + gap);
        const y = row * (cellSize + gap);
        drawImageCover(ctx, img, x, y, cellSize, cellSize);
      });

    } else if (layoutId === "layout-1-2") {
      width = baseSize * 2 + gap;
      height = baseSize * 2 + gap;
      canvas.width = width;
      canvas.height = height;
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const bigW = baseSize;
      const bigH = height;
      if (images[0]) drawImageCover(ctx, images[0], 0, 0, bigW, bigH);

      const smallW = baseSize;
      const smallH = baseSize;
      if (images[1]) drawImageCover(ctx, images[1], bigW + gap, 0, smallW, smallH);

      if (images[2]) drawImageCover(ctx, images[2], bigW + gap, smallH + gap, smallW, smallH);

    } else if (layoutId === "layout-2-1") {
      width = baseSize * 2 + gap;
      height = baseSize * 2 + gap;
      canvas.width = width;
      canvas.height = height;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const smallW = baseSize;
      const smallH = baseSize;
      if (images[0]) drawImageCover(ctx, images[0], 0, 0, smallW, smallH);
      if (images[1]) drawImageCover(ctx, images[1], 0, smallH + gap, smallW, smallH);

      const bigW = baseSize;
      const bigH = height;
      if (images[2]) drawImageCover(ctx, images[2], smallW + gap, 0, bigW, bigH);
    }

    setPreviewUrl(canvas.toDataURL("image/png"));

  }, [images, layoutId, gap, bgColor]);

  useEffect(() => {
    if (images.length > 0) {
      drawCollage();
    }
  }, [images, layoutId, gap, bgColor, drawCollage]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `collage_${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    if (selectedFiles.length < 2) {
      alert("请至少选择2张图片");
      return;
    }
    if (selectedFiles.length > 9) {
      alert("最多支持9张图片");
      setFiles(selectedFiles.slice(0, 9));
    } else {
      setFiles(selectedFiles);
    }
  };

  const handleSwap = (index1: number, index2: number) => {
    const newFiles = [...files];
    const temp = newFiles[index1];
    newFiles[index1] = newFiles[index2];
    newFiles[index2] = temp;
    setFiles(newFiles);
  };

  const onImageClick = (index: number) => {
    if (swapSourceIndex === null) {
      setSwapSourceIndex(index);
    } else {
      if (swapSourceIndex !== index) {
        handleSwap(swapSourceIndex, index);
      }
      setSwapSourceIndex(null);
    }
  };

  return (
    <Container className="py-8">
      <div className="max-w-6xl mx-auto">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          图片拼接/拼图
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          免费在线制作拼图，支持多种布局、调节间距和背景色。
        </p>

        {files.length === 0 ? (
          <FileUploader
            accept="image/*"
            multiple
            onFilesSelected={handleFilesSelected}
            className="mb-6 min-h-[300px]"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 flex items-center justify-center min-h-[500px] border border-gray-200 dark:border-gray-800 overflow-hidden relative">
                 <canvas ref={canvasRef} className="hidden" />
                 
                 {previewUrl ? (
                   <img src={previewUrl} alt="Collage Preview" className="max-w-full max-h-[70vh] object-contain shadow-lg" />
                 ) : (
                   <div className="text-gray-400">正在生成预览...</div>
                 )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {files.map((file, idx) => (
                  <div 
                    key={idx}
                    onClick={() => onImageClick(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      swapSourceIndex === idx 
                        ? "border-blue-500 ring-2 ring-blue-300 transform scale-105" 
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Thumbnail ${idx}`} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-0 right-0 bg-black/50 text-white text-xs px-1 rounded-bl">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 text-center">
                点击两张图片进行交换位置
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">布局选择</h3>
                <div className="grid grid-cols-3 gap-2">
                  {LAYOUTS.map((layout) => {
                    const isDisabled = files.length < layout.minImages || files.length > layout.maxImages;
                    const isAlwaysValid = layout.id === "horizontal" || layout.id === "vertical";
                    const valid = isAlwaysValid || !isDisabled;
                    
                    return (
                      <button
                        key={layout.id}
                        disabled={!valid}
                        onClick={() => setLayoutId(layout.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                          layoutId === layout.id
                            ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300"
                            : valid 
                              ? "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                              : "border-gray-100 text-gray-300 cursor-not-allowed dark:border-gray-800 dark:text-gray-600"
                        }`}
                        title={!valid ? `需要 ${layout.minImages === layout.maxImages ? layout.minImages : `${layout.minImages}-${layout.maxImages}`} 张图片` : layout.name}
                      >
                        {layout.icon}
                        <span className="text-xs mt-1">{layout.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      图片间距
                    </label>
                    <span className="text-sm text-gray-500">{gap}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={gap}
                    onChange={(e) => setGap(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    背景颜色
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setBgColor("#ffffff")}
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 shadow-sm"
                        title="白色"
                      />
                      <button 
                        onClick={() => setBgColor("#000000")}
                        className="w-8 h-8 rounded-full bg-black border border-gray-600 shadow-sm"
                        title="黑色"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setFiles([])} className="flex-1">
                  重新开始
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
