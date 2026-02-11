"use client";

import { useCallback, useState, useRef } from "react";
import { UploadCloud, X, FileImage } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface FileUploaderProps {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  onError?: (error: string) => void;
  className?: string;
  text?: string;
}

interface FileWithPreview {
  file: File;
  preview: string;
}

export function FileUploader({
  accept = "image/*",
  maxSize = 10 * 1024 * 1024,
  multiple = false,
  onFilesSelected,
  onError,
  className,
  text,
}: FileUploaderProps) {
  const t = useTranslations("Common");
  const uploadText = text || t("upload_text");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize) {
      return `文件 ${file.name} 超过大小限制 (${formatSize(maxSize)})`;
    }
    if (accept !== "*" && !file.type.match(accept.replace("*", ".*"))) {
      return `文件 ${file.name} 类型不支持`;
    }
    return null;
  }, [maxSize, accept]);

  const processFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;

      const newFiles: FileWithPreview[] = [];
      const errors: string[] = [];

      Array.from(fileList).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          newFiles.push({
            file,
            preview: URL.createObjectURL(file),
          });
        }
      });

      if (errors.length > 0) {
        onError?.(errors.join("; "));
      }

      if (newFiles.length > 0) {
        const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
        setFiles(updatedFiles);
        onFilesSelected(updatedFiles.map((f) => f.file));
      }
    },
    [files, multiple, onError, onFilesSelected, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    if (files[index]) {
      URL.revokeObjectURL(files[index].preview);
    }
    setFiles(newFiles);
    onFilesSelected(newFiles.map((f) => f.file));
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        className={clsx(
          "relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ease-out group overflow-hidden",
          isDragging
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.01] shadow-xl shadow-indigo-500/10"
            : "border-border hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-muted/30"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] pointer-events-none" />
        
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className={clsx(
            "p-4 rounded-full transition-all duration-300",
            isDragging ? "bg-indigo-100 text-indigo-600 scale-110" : "bg-muted text-muted-foreground group-hover:bg-indigo-50 group-hover:text-indigo-500 dark:group-hover:bg-indigo-900/30"
          )}>
            <UploadCloud className="w-10 h-10" />
          </div>
          
          <div className="space-y-1">
            <p className="text-xl font-semibold text-foreground">
              {uploadText}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("support_format", { accept, size: formatSize(maxSize) })}
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-muted/30"
              >
                {file.file.type.startsWith("image/") ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <FileImage className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground break-all line-clamp-2">
                      {file.file.name}
                    </span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors transform hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <p className="text-xs text-white truncate px-1">
                    {formatSize(file.file.size)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
