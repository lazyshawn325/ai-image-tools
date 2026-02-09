"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";
import Link from "next/link";

interface CardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  href?: string;
  badge?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({
  title,
  description,
  icon,
  href,
  badge,
  className,
  onClick,
  style,
}: CardProps) {
  const content = (
    <div
      className={clsx(
        "relative p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
        "transition-all duration-300 ease-out",
        "group",
        (href || onClick) &&
          "cursor-pointer hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-2",
        className
      )}
      onClick={onClick}
      style={style}
    >
      {badge && (
        <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
          {badge}
        </span>
      )}
      {icon && (
        <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
