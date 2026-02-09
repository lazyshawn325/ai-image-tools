import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function Spinner({ size = "md", className, label }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={clsx("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={clsx("animate-spin text-blue-600 dark:text-blue-400", sizeClasses[size])} />
      {label && (
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {label}
        </p>
      )}
    </div>
  );
}
