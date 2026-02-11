# Google AdSense 配置指南

## 前置条件

- 网站已部署上线（有可访问的URL）
- 网站有隐私政策页面 (/privacy) ✅ 已完成
- 网站有使用条款页面 (/terms) ✅ 已完成
- 网站有实质性内容 ✅ 6个工具已完成

## 第1步：注册 Google AdSense

1. 访问 https://www.google.com/adsense
2. 点击 **开始使用**
3. 使用你的 Google 账号登录
4. 填写网站信息：
   - 网站 URL：填写你的域名（如 `https://ai-image-tools.vercel.app`）
   - 选择国家/地区
   - 同意条款

## 第2步：验证网站所有权

AdSense 会给你一段验证代码，类似：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

**本项目已预置了AdSense集成代码**，你只需要：

1. 复制 `ca-pub-XXXXXXXXXXXXXXXX` 这个 Publisher ID
2. 在 Vercel 中配置环境变量
3. **重要：** 确保 `public/ads.txt` 文件包含你的 Publisher ID 信息（本项目已自动生成，请确认内容正确）

## 第3步：在 Vercel 配置环境变量

1. 打开你的 Vercel 项目
2. 点击 **Settings → Environment Variables**
3. 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | `ca-pub-XXXXXXXXXXXXXXXX` | 替换为你的 Publisher ID |
| `NEXT_PUBLIC_AD_SLOT_BANNER` | `1234567890` | 广告单元 Slot ID（创建广告单元后获取） |

4. 点击 **Save**
5. 重新部署项目（Deployments → 最新部署 → Redeploy）

## 第4步：等待 AdSense 审核

- 审核通常需要 1-3 天
- 审核期间网站需要正常运行
- 确保网站有足够的原创内容
- 审核通过后会收到邮件通知

## 第5步：创建广告单元

审核通过后：

1. 登录 AdSense 控制台
2. 点击 **广告 → 按广告单元**
3. 选择 **展示广告**
4. 输入广告单元名称（如 `banner-top`）
5. 选择广告尺寸：**响应式**
6. 点击 **创建**
7. 复制 `data-ad-slot` 的值（如 `1234567890`）
8. 在 Vercel 环境变量中配置 `NEXT_PUBLIC_AD_SLOT_BANNER`

## 常见问题

### Q: 审核被拒怎么办？
常见原因：
- 内容不足：确保每个工具页面都有说明文字
- 导航不清晰：确保所有链接都能正常访问
- 缺少隐私政策：本项目已包含 ✅

### Q: 广告不显示怎么办？
- 检查 AdBlock 是否禁用
- 确认环境变量配置正确
- 查看浏览器控制台是否有错误
- 新网站广告填充率可能较低，需要积累流量

### Q: 收入如何提现？
- 余额达到 $100 后可申请付款
- 支持西联汇款、电汇等方式
- 需要设置税务信息

## 预估收益

工具类网站 AdSense 收益参考：
- CPM（千次展示）：$0.5 - $2
- 日均 1000 PV：约 $0.5 - $2/天
- 需要持续 SEO 优化获取流量

## 其他变现方式（可选）

1. **赞助/打赏**：添加微信/支付宝收款码
2. **会员订阅**：高级功能付费（如批量处理）
3. **接定制开发**：在网站留下联系方式
