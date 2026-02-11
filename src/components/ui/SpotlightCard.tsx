"use client";

import { useRef, useState, MouseEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children?: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(99, 102, 241, 0.15)", // Indigo-500 with opacity
  title,
  description,
  icon,
  href,
  badge,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative h-full overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm transition-all duration-300 group hover:shadow-xl dark:hover:shadow-indigo-500/10 dark:hover:border-zinc-700 hover:-translate-y-1",
        className
      )}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      
      {/* Content */}
      <div className="relative h-full flex flex-col p-6 z-10 pointer-events-none">
        {badge && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
              {badge}
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-4">
          {icon && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-indigo-100 dark:border-indigo-800">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {title}
            </h3>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-grow">
            {description}
          </p>
        )}
        
        {children}
      </div>

      {/* Clickable Overlay */}
      {href && (
        <Link href={href} className="absolute inset-0 z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-2xl">
          <span className="sr-only">View {title}</span>
        </Link>
      )}
    </div>
  );
}
