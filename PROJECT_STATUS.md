# AI 图片工具箱 - 项目进度记录

> 最后更新：2026-02-10
> 用于记录项目配置、外部服务账号、开发进度，方便后续维护

---

## 1. 项目概述

| 项目 | 信息 |
|------|------|
| **项目名称** | AI 图片工具箱 |
| **在线地址** | https://ai-image-tools-h41u.vercel.app |
| **GitHub 仓库** | https://github.com/lazyshawn325/ai-image-tools |
| **技术栈** | Next.js 15.3.9 + React 18 + Tailwind CSS 4 + TypeScript |
| **部署平台** | Vercel |

---

## 2. 外部服务配置

### 2.1 Vercel (部署平台)
- **网址**: https://vercel.com/dashboard
- **作用**: 托管和自动部署网站
- **操作**: 
  - 连接 GitHub 仓库后自动部署
  - 每次 push 代码会自动触发部署
  - 环境变量在 Settings → Environment Variables 配置

### 2.2 Google AdSense (广告收入)
- **网址**: https://www.google.com/adsense
- **Publisher ID**: `ca-pub-9668014976956623`
- **状态**: 等待审批（通常 1-14 天）
- **环境变量**: `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- **下一步**: 
  - 审批通过后，创建广告单元
  - 获取广告位 Slot ID，添加到环境变量 `NEXT_PUBLIC_AD_SLOT_BANNER`

### 2.3 Google Analytics (流量统计)
- **网址**: https://analytics.google.com
- **测量 ID**: `G-BWD1BM430Z`
- **环境变量**: `NEXT_PUBLIC_GA_ID`
- **查看数据**: 登录后可查看访问量、用户行为等数据
- **注意**: 新配置需要 24-48 小时才开始显示数据

### 2.4 Google Search Console (搜索引擎收录)
- **网址**: https://search.google.com/search-console
- **验证码**: `T_EnvdB-ZwE46vaFpyJwz8j55x5rREbNURGdvX8Mjkw`
- **环境变量**: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- **已完成**:
  - [x] 网站所有权验证
  - [x] Sitemap 提交 (sitemap.xml)
- **查看内容**:
  - 覆盖范围：查看哪些页面被索引
  - 效果：查看搜索展示和点击数据
  - Sitemap：查看提交状态

---

## 3. Vercel 环境变量清单

在 Vercel → Settings → Environment Variables 中配置：

| 变量名 | 值 | 用途 |
|--------|-----|------|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | `ca-pub-9668014976956623` | AdSense 广告 |
| `NEXT_PUBLIC_GA_ID` | `G-BWD1BM430Z` | Google Analytics |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | `T_EnvdB-ZwE46vaFpyJwz8j55x5rREbNURGdvX8Mjkw` | Search Console 验证 |
| `NEXT_PUBLIC_AD_SLOT_BANNER` | (待配置) | 广告位 ID，AdSense 审批后添加 |

---

## 4. 网站功能清单

### 4.1 图片处理工具 (6个)
| 工具 | 路径 | 实现方式 |
|------|------|----------|
| 图片压缩 | `/compress` | browser-image-compression 库 |
| 格式转换 | `/convert` | Canvas API |
| 尺寸调整 | `/resize` | Canvas API |
| 二维码生成 | `/qrcode` | qrcode 库 |
| AI 去背景 | `/remove-bg` | ONNX Runtime + u2netp 模型 |
| 水印工具 | `/watermark` | Canvas API |

### 4.2 信息页面 (5个)
| 页面 | 路径 | 用途 |
|------|------|------|
| 关于我们 | `/about` | 网站介绍 |
| 常见问题 | `/faq` | FAQ，提高 AdSense 通过率 |
| 联系我们 | `/contact` | 联系方式 |
| 隐私政策 | `/privacy` | 法律合规 |
| 使用条款 | `/terms` | 法律合规 |

---

## 5. 项目文件结构

```
ai-image-tools/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── page.tsx            # 首页
│   │   ├── layout.tsx          # 全局布局（AdSense、GA、验证码）
│   │   ├── sitemap.ts          # 自动生成 sitemap.xml
│   │   ├── robots.ts           # 自动生成 robots.txt
│   │   ├── compress/           # 图片压缩
│   │   ├── convert/            # 格式转换
│   │   ├── resize/             # 尺寸调整
│   │   ├── qrcode/             # 二维码
│   │   ├── remove-bg/          # AI 去背景
│   │   ├── watermark/          # 水印
│   │   ├── about/              # 关于我们
│   │   ├── faq/                # 常见问题
│   │   ├── contact/            # 联系我们
│   │   ├── privacy/            # 隐私政策
│   │   └── terms/              # 使用条款
│   └── components/
│       ├── analytics/          # Google Analytics 组件
│       ├── ads/                # AdSense 广告组件
│       ├── seo/                # JSON-LD 结构化数据
│       ├── layout/             # Header、Footer、Container
│       ├── ui/                 # Button、Card 等 UI 组件
│       └── shared/             # FileUploader 等共享组件
├── public/                     # 静态资源
├── .env.example                # 环境变量示例
├── PROJECT_STATUS.md           # 本文件
├── DEPLOY.md                   # 部署指南
├── ADSENSE_SETUP.md           # AdSense 设置指南
└── SEARCH_CONSOLE_SETUP.md    # Search Console 设置指南
```

---

## 6. 常用操作

### 6.1 本地开发
```bash
cd ai-image-tools
npm install
npm run dev
# 访问 http://localhost:3000
```

### 6.2 部署更新
```bash
git add .
git commit -m "你的提交信息"
git push
# Vercel 会自动部署
```

### 6.3 修改环境变量后
1. 登录 Vercel
2. 修改环境变量
3. 点击 Deployments → 最新部署 → Redeploy

---

## 7. 待办事项

### 高优先级
- [ ] 等待 AdSense 审批通过
- [ ] 审批通过后创建广告单元并配置 Slot ID
- [ ] 持续查看 Search Console 索引状态

### 中优先级
- [ ] 优化页面性能（Lighthouse 评分）
- [ ] 添加更多 SEO 优化
- [ ] 考虑添加更多工具功能

### 低优先级
- [ ] 考虑自定义域名
- [ ] 添加多语言支持
- [ ] 添加 PWA 支持

---

## 8. 问题排查

### AdSense 广告不显示
1. 检查 Vercel 环境变量是否正确
2. 确认 AdSense 已审批通过
3. 检查浏览器是否有广告拦截插件

### Google Analytics 没有数据
1. 新配置需要 24-48 小时
2. 检查 `NEXT_PUBLIC_GA_ID` 是否正确
3. 使用 GA 实时报告测试

### Search Console 验证失败
1. 检查 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 值是否完整
2. 确保已 Redeploy
3. 等待几分钟后再验证

---

## 9. 更新日志

### 2026-02-10
- 初始版本发布
- 完成 6 个图片处理工具
- 配置 AdSense、Analytics、Search Console
- 添加 About、FAQ、Contact 页面
- 添加 JSON-LD 结构化数据
- 优化 Footer 布局

---

> 提示：下次使用 AI 助手时，可以让它先阅读这个文件来了解项目状态
