# Google AdSense 审批与变现指南

为了让你的网站通过 AdSense 审批并开始产生收益，请遵循以下步骤：

## 1. 完善必要页面 (已完成)
Google 要求网站必须具备以下页面：
- **Privacy Policy (隐私政策)**: 已在 `/privacy` 实装。
- **Terms of Service (服务条款)**: 已在 `/terms` 实装。
- **Contact Us (联系我们)**: 已在 `/contact` 实装。
- **About (关于我们)**: 已在 `/about` 实装。

## 2. 内容丰富度
Google 不喜欢“空壳”工具站。建议：
- 在 `/faq` 页面添加至少 5-10 个关于图片处理的常见问题。
- 在每个工具页面的下方（`RelatedTools` 之后）添加 300 字左右的文字说明，介绍该工具的使用场景和技术原理。

## 3. 申请 AdSense
1. 前往 [Google AdSense](https://www.google.com/adsense/start/)。
2. 提交你的域名：`https://ai-image-tools-h41u.vercel.app`。
3. 将你的 `publisher-id` 填入 `.env` 文件中的 `NEXT_PUBLIC_ADSENSE_CLIENT_ID`。
4. 确保 `public/ads.txt` 已经配置（我会帮你创建）。

## 4. 收益最大化策略
- **首屏广告**: 已经在 `Hero` 下方留有位置。
- **结果页广告**: 建议在 `PageClient.tsx` 的 `results` 渲染逻辑中插入 `AdBannerAuto`。
- **侧边栏/固定位**: 在宽屏设备上使用 `AdBannerRectangle`。

## 5. 提交 Search Console (流量来源)
- 登录 [Google Search Console](https://search.google.com/search-console)。
- 提交 `sitemap.xml`。
- 这是获取免费自然流量的最快方式。
