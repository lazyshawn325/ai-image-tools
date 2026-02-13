import { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/Toast";
import { addToHistory } from "@/lib/historyUtils";

interface UseImageToolOptions {
  toolName: string;
  onProcess: (file: File, ...args: any[]) => Promise<any>;
  onSuccess?: (result: any) => void;
}

export function useImageTool({ toolName, onProcess, onSuccess }: UseImageToolOptions) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  const process = useCallback(async (...args: any[]) => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const mainFile = files[0];
      const output = await onProcess(mainFile, ...args);
      
      setResult(output);
      
      if (output.thumbnail || output.url) {
        addToHistory({
          tool: toolName,
          fileName: mainFile.name,
          thumbnail: output.thumbnail || output.url
        });
      }

      if (onSuccess) onSuccess(output);
      // success("处理完成！"); // 暂时注释掉，让具体页面控制文案
    } catch (err) {
      const msg = err instanceof Error ? err.message : '处理失败，请重试';
      setError(msg);
      toastError(msg);
    } finally {
      setIsProcessing(false);
    }
  }, [files, toolName, onProcess, onSuccess, toastError]);

  const reset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
  }, []);

  return {
    files,
    setFiles,
    isProcessing,
    result,
    error,
    process,
    reset
  };
}
