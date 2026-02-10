'use client';

import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { RefreshCw, Image as ImageIcon, FileCode } from 'lucide-react';
import { useToast } from "@/components/ui/Toast";
import { AdBannerAuto } from "@/components/ads/AdBanner";

export default function QRCodePage() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [dataUrl, setDataUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const [, setLoading] = useState(false);
  const { success, error: toastError } = useToast();

  const generateQRCode = useCallback(async () => {
    try {
      setLoading(true);
      const options = {
        width: size,
        margin: 1,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: level,
      };

      const url = await QRCode.toDataURL(text, options);
      const svg = await QRCode.toString(text, { ...options, type: 'svg' });
      
      setDataUrl(url);
      setSvgString(svg);
    } catch (err) {
      console.error(err);
      toastError("二维码生成失败");
    } finally {
      setLoading(false);
    }
  }, [text, size, fgColor, bgColor, level, toastError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (text) generateQRCode();
    }, 300);

    return () => clearTimeout(timer);
  }, [text, size, fgColor, bgColor, level, generateQRCode]);

  const downloadPNG = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success("二维码(PNG)下载开始");
  };

  const downloadSVG = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    success("二维码(SVG)下载开始");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AdBannerAuto slot={process.env.NEXT_PUBLIC_AD_SLOT_BANNER} />
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">
            二维码生成工具
          </h1>
          <p className="text-lg text-gray-600">
            在线生成个性化二维码，支持自定义颜色、尺寸和容错率
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden md:flex">
          <div className="p-8 md:w-1/2 bg-gray-50/50 border-r border-gray-100">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  内容输入
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="请输入网址或文本内容..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    尺寸 (px)
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value={128}>128 x 128</option>
                    <option value={256}>256 x 256</option>
                    <option value={512}>512 x 512</option>
                    <option value={1024}>1024 x 1024</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    容错率
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="L">低 (7%)</option>
                    <option value="M">中 (15%)</option>
                    <option value="Q">高 (25%)</option>
                    <option value="H">极高 (30%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    前景色
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-10 w-full rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    背景色
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-full rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:w-1/2 flex flex-col items-center justify-center bg-white min-h-[400px]">
            <div className="mb-8 relative group">
              {dataUrl ? (
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dataUrl}
                    alt="QR Code Preview"
                    className="max-w-[280px] w-full h-auto"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              ) : (
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
              )}
            </div>

            <div className="flex space-x-4 w-full max-w-[280px]">
              <button
                onClick={downloadPNG}
                disabled={!dataUrl}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                PNG
              </button>
              <button
                onClick={downloadSVG}
                disabled={!svgString}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FileCode className="w-4 h-4 mr-2" />
                SVG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
