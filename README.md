# 余白 · 个人网站 Demo

深石墨背景、青柠点缀、编辑式排版、可交互的抽象轨道。

纯静态 HTML / CSS / JavaScript，无运行依赖、数据库或外部网络请求。作品、文章和身份文案为标注的演示内容，可本地预览或发布到 GitHub Pages。

## 本地运行

在此目录运行 `node server.cjs`，打开程序输出的地址。默认 http://127.0.0.1:4178；如被占用，程序输出系统分配的新端口。也可以直接打开 dist/index.html，推荐通过本地服务预览。

## 可以体验

- 深浅主题、可随指针变化的 Canvas 轨道、动态暂停。
- 作品详情与三篇原创示例手记。支持按钮、Esc 和点击遮罩返回。
- Control / Command + K 打开终端：help、whoami、work、notes、about、home、ls、theme light/dark、motion on/off、clear。
- 命令历史、Tab 补全、Control + L 清屏。终端不执行系统代码。
- 移动适配、键盘操作与减少动态效果偏好。

## 修改位置

- dist/index.html：个人文案、导航、栏目。
- dist/style.css：配色、排版、响应式布局。
- dist/main.js：文章和作品示例、交互逻辑。
- dist/assets/light-study.png：原创生成数字艺术图。

## GitHub Pages 发布

仓库包含自动发布配置 `.github/workflows/pages.yml`。在仓库 Settings → Pages 中将 Source 设置为 GitHub Actions，之后推送到 main 分支会自动检查并发布 dist 目录。

发布内容仅包括 dist 中的网页、样式、交互脚本与图片，不包含本地预览服务和测试截图。全部资源使用相对路径，兼容 GitHub Pages 的项目子路径网址。

GitHub Actions 的部署结果会显示实际访问地址。免费账户使用公开仓库即可，不需要购买服务器、域名或设置数据库。

## 图片来源与提示词

使用内置 image_gen 生成模式，未使用独立付费 API。素材为虚构数字雕塑，不代表真实摄影、实体产品或用户的个人经历。

Prompt: Use case: stylized-concept. Asset type: original in-page artwork for a clearly labeled DEMO portfolio project titled 光的形状 on a personal creative website; an imaginary digital sculpture, not a factual photo. A translucent smoky glass ribbon forming an imperfect loop, with a luminous acid-lime inner edge and subtle reflections on a deep graphite black surface. Sophisticated contemporary editorial digital sculpture, precise sculptural 3D material rendering, fine film grain. Landscape 3:2, one expressive sculptural loop fully visible, considered negative space and elegant balance. Dramatic directional studio lighting, beautifully controlled specular reflections. Color palette: graphite #111310, ivory, acid lime #d4f77d; subtle muted cool-blue reflections acceptable. Translucent smoky glass, luminous edge, dark reflective surface, fine subtle grain. Exactly one clean image. No UI, no text, no logos, no watermark, no frame.
