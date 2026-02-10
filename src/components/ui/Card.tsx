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
        "relative p-6 rounded-2xl border transition-all duration-300 ease-out h-full",
        "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm",
        "border-slate-200 dark:border-slate-800",
        "group",
        (href || onClick) &&
          "cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 hover:-translate-y-1",
        className
      )}
      onClick={onClick}
      style={style}
    >
      {badge && (
        <span className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full">
          {badge}
        </span>
      )}
      <div className="flex flex-col h-full">
        {icon && (
          <div className="mb-5 w-14 h-14 flex items-center justify-center rounded-2xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white shadow-sm group-hover:shadow-indigo-500/30">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm flex-grow">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
