# 🎨 AI 图片工具箱 (AI Image Tools)

> **专业、免费、隐私优先的在线图片处理工具集**

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)

访问在线版：[ai-image-tools-h41u.vercel.app](https://ai-image-tools-h41u.vercel.app)

## ✨ 项目特色

- **🛡️ 隐私优先**：采用 WebAssembly 和 Canvas 技术，所有图片处理**100%在浏览器本地完成**，无需上传服务器。
- **💎 Modern SaaS 设计**：全新的视觉语言，包含磨砂玻璃 (Glassmorphism)、点阵背景和丝滑交互动效。
- **⚡ 极致性能**：基于 Next.js 15 和 React 18 构建，加载速度飞快，支持 PWA。
- **📱 全端适配**：完美适配桌面、平板和移动端设备。

## 🛠️ 包含工具 (12+)

| 工具 | 描述 | 技术栈 |
|------|------|--------|
| **图片压缩** | 批量压缩，自定义质量，ZIP 下载 | `browser-image-compression` |
| **AI 去背景** | 智能识别主体，一键抠图 | `onnxruntime-web` + u2netp |
| **无损放大** | 2x/3x/4x 放大，平滑/锐利模式 | Canvas 智能插值 |
| **格式转换** | JPG/PNG/WebP 互转 | Canvas API |
| **尺寸调整** | 像素级调整，保持比例 | Canvas API |
| **图片裁剪** | 自由裁剪或预设比例 (16:9, 4:3) | Canvas API |
| **旋转翻转** | 90°旋转，水平/垂直翻转 | CSS Transform |
| **图片滤镜** | 亮度/对比度/饱和度/黑白等 | Canvas Filter |
| **图片拼图** | 多种布局模板 (2x2, 3x3, 拼长图) | Canvas API |
| **EXIF 查看** | 查看并清除照片元数据 | `exif-js` |
| **二维码** | 生成自定义二维码 | `qrcode` |
| **水印工具** | 添加文字/图片水印 | Canvas API |

## 🚀 本地运行

```bash
# 克隆项目
git clone https://github.com/lazyshawn325/ai-image-tools.git

# 进入目录
cd ai-image-tools

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000` 即可使用。

## 📦 部署

本项目针对 **Vercel** 进行了深度优化：

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量 (见下文)
4. 点击 Deploy

### 环境变量

| 变量名 | 说明 |
|--------|------|
| `NEXT_PUBLIC_SITE_URL` | 部署后的完整域名 (用于 SEO) |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense 发布商 ID |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |

## 📄 许可证

MIT License © 2026 AI Image Tools

