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
  spotlightColor = "rgba(99, 102, 241, 0.1)", 
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
        "relative h-full overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm transition-all duration-500 group hover:-translate-y-1",
        className
      )}
    >
      {/* Grain Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E')] mix-blend-overlay" />

      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      
      {/* Animated Border Gradient on Hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(129, 140, 248, 0.1), transparent 40%)`
        }}
      />
      
      {/* Content */}
      <div className="relative h-full flex flex-col p-8 z-10 pointer-events-none">
        {badge && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
              {badge}
            </span>
          </div>
        )}
        
        <div className="flex items-center gap-5 mb-5">
          {icon && (
            <div className="relative p-3.5 rounded-2xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm border border-indigo-100 dark:border-slate-700 group-hover:shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]">
               {/* Inner glow for icon */}
               <div className="absolute inset-0 rounded-2xl bg-indigo-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">{icon}</div>
            </div>
          )}
          {title && (
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {title}
            </h3>
          )}
        </div>
        
        {description && (
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed flex-grow font-light">
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
