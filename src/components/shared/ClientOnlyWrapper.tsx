"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// 动态导入各个页面的 Client 部分
const RemoveBgClient = dynamic(() => import('@/app/[locale]/remove-bg/PageClient'), { ssr: false });
const UpscaleClient = dynamic(() => import('@/app/[locale]/upscale/PageClient'), { ssr: false });

export const RemoveBgClientOnly = () => <RemoveBgClient />;
export const UpscaleClientOnly = () => <UpscaleClient />;
