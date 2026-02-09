# 🚀 部署指南

## 方式一：Vercel 部署（推荐，最简单）

### 步骤 1：准备代码
```bash
# 确保你在项目目录
cd "C:\Users\32503\OneDrive\桌面\ai-image-tools"

# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: AI Image Tools"
```

### 步骤 2：创建 GitHub 仓库
1. 访问 https://github.com/new
2. 输入仓库名：`ai-image-tools`
3. 选择 Public（免费）
4. 不要初始化 README（我们已经有了）
5. 点击 **Create repository**

### 步骤 3：推送到 GitHub
```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/ai-image-tools.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤 4：部署到 Vercel
1. 访问 https://vercel.com
2. 点击 **Sign Up**，选择 **Continue with GitHub**
3. 授权 Vercel 访问你的 GitHub 账号
4. 点击 **New Project**
5. 选择 `ai-image-tools` 仓库
6. 保持默认设置，点击 **Deploy**

✅ 等待 1-2 分钟，部署完成后会显示链接：`https://ai-image-tools-xxx.vercel.app`

---

## 方式二：Netlify 部署

### 步骤 1：构建项目
```bash
cd "C:\Users\32503\OneDrive\桌面\ai-image-tools"
npm run build
```

### 步骤 2：部署
1. 访问 https://app.netlify.com/drop
2. 将 `.next` 文件夹拖入（或者使用 GitHub 连接）
3. 自动部署完成

---

## 方式三：GitHub Pages（免费，但有局限）

### 配置 next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

### 构建并部署
```bash
npm run build
# 然后将 dist 文件夹内容推送到 gh-pages 分支
```

⚠️ **注意**：GitHub Pages 不支持服务端功能，AI 去背景功能可能无法正常工作。

---

## 🌐 自定义域名（可选）

### 购买域名
推荐平台：
- 阿里云/腾讯云（国内，需要备案）
- Namecheap / Cloudflare（国外，无需备案，约 $10/年）

### Vercel 配置自定义域名
1. 在 Vercel 项目页面点击 **Settings** → **Domains**
2. 输入你的域名（如：`ai-tools.com`）
3. 根据提示在域名服务商处添加 DNS 记录
4. 等待 DNS 生效（通常 5-30 分钟）

---

## 📊 添加统计分析

### Google Analytics 4（免费）
1. 访问 https://analytics.google.com
2. 创建账号 → 创建属性
3. 获取测量 ID（如：`G-XXXXXXXXXX`）
4. 安装依赖：`npm install @next/third-parties@latest next@latest`
5. 在 `layout.tsx` 中添加：

```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  )
}
```

### Umami（隐私友好，推荐）
1. 在 Vercel 一键部署 Umami：https://github.com/umami-software/umami
2. 获取追踪代码
3. 添加到 `layout.tsx`

---

## 💰 接入广告变现

### Google AdSense（最主流）
1. 访问 https://www.google.com/adsense
2. 注册账号，提交网站审核
3. 审核通过后（1-3天），获取广告代码
4. 在 `src/components/ads/AdBanner.tsx` 中添加：

```typescript
'use client'

import { useEffect } from 'react'

export function AdBanner() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot="XXXXXXXXXX"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
```

### 其他广告平台
- **Media.net**（雅虎/必应联盟）
- **PropellerAds**（门槛低，适合新站）
- **Ezoic**（需要一定流量）

---

## 🔍 SEO 优化清单

### 1. 提交搜索引擎
- **Google**: https://search.google.com/search-console
- **百度**: https://ziyuan.baidu.com

### 2. 验证网站所有权
选择 **HTML 文件验证**，下载验证文件放入 `public/` 目录

### 3. 提交 Sitemap
在 Search Console 中提交：
```
https://your-domain.com/sitemap.xml
```

### 4. 社交媒体卡片优化（已完成）
项目已包含 Open Graph 和 Twitter Card 元数据

---

## 🔧 部署后维护

### 更新代码
```bash
# 修改代码后
git add .
git commit -m "Update: xxx feature"
git push origin main
```
Vercel 会自动重新部署！

### 监控性能
- Vercel Analytics（免费版足够）
- Google PageSpeed Insights: https://pagespeed.web.dev

---

## ❓ 常见问题

**Q: 部署后中文显示乱码？**  
A: 确保 `layout.tsx` 中有 `<html lang="zh-CN">`

**Q: AI 去背景加载很慢？**  
A: 首次加载需要下载 40MB 的 AI 模型，建议添加加载提示

**Q: 如何绑定国内域名？**  
A: 国内域名需要备案，建议先用国外域名（如 .com/.net）

**Q: 免费额度够用吗？**  
A: Vercel 免费版每月 100GB 带宽，足够起步使用

---

## 📞 需要帮助？

Next.js 文档：https://nextjs.org/docs  
Vercel 文档：https://vercel.com/docs  
React 文档：https://react.dev

---

**祝你部署顺利，早日盈利！** 🎉
