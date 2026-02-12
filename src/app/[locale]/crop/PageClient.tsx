"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { Download, RefreshCw, RotateCw, ZoomIn, Image as ImageIcon, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { FileUploader } from "@/components/shared/FileUploader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { AdBannerAuto } from "@/components/ads/AdBanner";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { addToHistory } from "@/lib/historyUtils";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import getCroppedImg from "@/lib/cropImage"; 

// Note: You'll need to create the getCroppedImg utility if it doesn't exist, 
// or I can include it inline. For now, I'll include the logic inline to be safe.

const RATIOS = [
  { label: "Free", value: undefined, icon: "Free" },
  { label: "1:1", value: 1, icon: "Square" },
  { label: "4:3", value: 4 / 3, icon: "Landscape" },
  { label: "16:9", value: 16 / 9, icon: "Wide" },
  { label: "3:2", value: 3 / 2, icon: "Classic" },
  { label: "9:16", value: 9 / 16, icon: "Story" },
];

export default function CropPage() {
  const t = useTranslations("Crop");
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const { success, error: toastError } = useToast();

  const onFileChange = async (files: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsCropping(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      if (!croppedImage) throw new Error("Crop failed");
      
      // Download directly
      const a = document.createElement("a");
      a.href = croppedImage;
      a.download = `cropped_${file?.name || "image.png"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      addToHistory({
        tool: "crop",
        fileName: file?.name || "image.png",
        thumbnail: croppedImage
      });
      
      success(t("download"));
    } catch (e) {
      console.error(e);
      toastError(t("error_generate_failed"));
    } finally {
      setIsCropping(false);
    }
  }, [imageSrc, croppedAreaPixels, rotation, file, t, success, toastError]);

  return (
    <Container className="py-8 md:py-12 min-h-screen">
       <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
       
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] min-h-[600px]">
        
        {/* Left Control Panel - Bento Style */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-full overflow-y-auto pr-2 custom-scrollbar">
          {/* Header Card */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-3xl"
          >
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500 mb-2">
              {t("title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </motion.div>

          {!imageSrc ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex-1 glass-card rounded-3xl p-8 flex flex-col items-center justify-center border-dashed border-2 border-orange-500/20"
             >
                <FileUploader
                  accept="image/*"
                  onFilesSelected={onFileChange}
                  className="w-full h-full min-h-[300px]"
                />
             </motion.div>
          ) : (
            <>
              {/* Aspect Ratio Grid */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6 rounded-3xl space-y-4"
              >
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" /> {t("aspect_ratio")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {RATIOS.map((r) => (
                    <button
                      key={r.label}
                      onClick={() => setAspect(r.value)}
                      className={clsx(
                        "relative px-2 py-3 rounded-xl text-xs font-medium transition-all border border-transparent",
                        aspect === r.value 
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" 
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {r.label}
                      {aspect === r.value && (
                        <motion.div layoutId="activeRatio" className="absolute inset-0 border-2 border-white/20 rounded-xl" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Adjustments */}
              <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.1 }}
                 className="glass-card p-6 rounded-3xl space-y-6"
              >
                 <div className="space-y-3">
                    <label className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <span className="flex items-center gap-2"><ZoomIn className="w-3 h-3" /> Zoom</span>
                      <span>{zoom.toFixed(1)}x</span>
                    </label>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                       <span className="flex items-center gap-2"><RotateCw className="w-3 h-3" /> Rotate</span>
                       <span>{rotation}°</span>
                    </label>
                    <input
                      type="range"
                      value={rotation}
                      min={0}
                      max={360}
                      step={1}
                      aria-labelledby="Rotation"
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                 </div>
              </motion.div>

              {/* Actions */}
              <div className="mt-auto grid grid-cols-2 gap-4">
                 <Button 
                   variant="outline" 
                   onClick={() => { setImageSrc(null); setFile(null); }}
                   className="rounded-xl h-14 border-muted hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                 >
                   <RefreshCw className="w-5 h-5" />
                 </Button>
                 <Button 
                   onClick={showCroppedImage}
                   loading={isCropping}
                   className="rounded-xl h-14 bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/20 text-lg font-bold"
                 >
                    <Download className="w-5 h-5 mr-2" />
                    {t("download")}
                 </Button>
              </div>
            </>
          )}
        </div>

        {/* Right Canvas - Interactive Area */}
        <div className="lg:col-span-8 h-full min-h-[500px] relative rounded-3xl overflow-hidden glass border-2 border-white/20 shadow-2xl bg-[#0f172a]">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              classes={{
                containerClassName: "rounded-3xl",
                cropAreaClassName: "!border-2 !border-orange-500 !shadow-[0_0_0_9999px_rgba(0,0,0,0.8)]"
              }}
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-white/20">
                <div className="text-center">
                   <ImageIcon className="w-24 h-24 mx-auto mb-4 opacity-20" />
                   <p className="text-lg font-medium">Upload an image to start cropping</p>
                </div>
             </div>
          )}
        </div>
      </div>
      
      <div className="mt-12">
        <RelatedTools currentTool="crop" />
      </div>
    </Container>
  );
}

// Utility for cropping image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<string | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  return canvas.toDataURL("image/jpeg");
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); 
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}
