# Google Search Console 设置指南

## 1. 访问 Google Search Console

打开：https://search.google.com/search-console

## 2. 添加网站资源

1. 点击左上角的下拉菜单，选择「添加资源」
2. 选择「网址前缀」方式
3. 输入你的网站地址：`https://ai-image-tools-h41u.vercel.app`
4. 点击「继续」

## 3. 验证所有权

推荐使用「HTML 标记」方式验证：

1. 在验证方法中选择「HTML 标记」
2. Google 会给你一个类似这样的 meta 标记：
   ```html
   <meta name="google-site-verification" content="你的验证码" />
   ```
3. 复制 `content` 中的验证码

### 添加验证码到网站

在 Vercel 环境变量中添加：
- 变量名：`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- 变量值：你的验证码

然后在 `src/app/layout.tsx` 的 metadata 中添加：
```typescript
export const metadata: Metadata = {
  // ... 现有配置
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};
```

重新部署后，回到 Search Console 点击「验证」。

## 4. 提交 Sitemap

验证成功后：

1. 在左侧菜单点击「Sitemap」
2. 在「添加新的站点地图」输入框中输入：`sitemap.xml`
3. 点击「提交」

你的 sitemap 地址是：
```
https://ai-image-tools-h41u.vercel.app/sitemap.xml
```

## 5. 请求编入索引

对于重要页面，可以手动请求索引：

1. 在顶部搜索框输入页面 URL，如：
   - `https://ai-image-tools-h41u.vercel.app/`
   - `https://ai-image-tools-h41u.vercel.app/compress`
   - `https://ai-image-tools-h41u.vercel.app/remove-bg`
2. 点击「请求编入索引」

## 6. 等待索引

- 首次索引通常需要 1-7 天
- 可以在「覆盖范围」报告中查看索引状态
- 「效果」报告会显示搜索展示和点击数据

## 7. 常见问题

**Q: 验证失败怎么办？**
A: 确保环境变量已添加并重新部署，然后清除浏览器缓存再验证。

**Q: Sitemap 显示「无法获取」？**
A: 确保网站已正确部署，可以直接访问 sitemap.xml 检查。

**Q: 多久能在 Google 搜索到？**
A: 通常 1-2 周，新网站可能需要更长时间。持续添加优质内容有助于加速索引。

---

## 快速检查清单

- [ ] 网站已通过验证
- [ ] Sitemap 已提交
- [ ] 首页已请求索引
- [ ] 主要工具页面已请求索引
- [ ] 关于/FAQ/联系页面已请求索引
