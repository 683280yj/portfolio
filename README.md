# 小姚 · 个人作品集（静态站点）

接入本地 macOS 的端口式个人主页。纯静态（HTML/CSS/JS，零运行时依赖），
推送即部署（GitHub Pages 分支部署 + 自定义域名 idkyjun.me，Cloudflare 代理）。

## 线上地址

- 主地址：`https://idkyjun.me/portfolio/`（200，Cloudflare → GitHub Pages 代理）
- 兜底：`https://683280yj.github.io/portfolio/`（GitHub 会 301 跳转到上面自定义域名）

## 本地预览

```bash
cd portfolio
python3 -m http.server 5173
# 打开 http://127.0.0.1:5173
```

## 在哪里改内容（Gridea 式：改文件 = 改站点）

| 想改什么 | 改哪个文件 | 位置 |
| --- | --- | --- |
| 文案（关于 / 项目 / 联系） | `index.html` | 对应 `<section>` 内 |
| 颜色 / 字体 / 动效 | `assets/css/style.css` | `:root` 设计变量在最顶部 |
| 交互逻辑（光标 / 横向滚动 / 复制） | `assets/js/main.js` | 各 IIFE 模块 |
| 联系方式邮箱 | `index.html` | 搜 `yggcmm@outlook.com`（共 3 处） |
| 项目卡 | `index.html` `#projects` 区 + `assets/css/style.css` `.proj-card` | 横向滚动轨道 |

图标统一用 **Lucide**：在 HTML 写 `<i data-lucide="图标名"></i>` 即可，
图标名查 https://lucide.dev/icons 。**禁止 emoji**（当前全站 44 处图标，0 emoji）。

## 发布 / 修改（推送即上线，无需重建）

```bash
git add -A
git commit -m "update: 改了 xxx"
git push          # → 推到 main，GitHub Pages 自动从分支根目录部署
```

- 首次已建好：仓库 `683280yj/portfolio`（public），`main` 分支根即站点根。
- 部署方式：**分支部署（legacy）**，不是 GitHub Actions workflow —— 因为 gh 令牌
  缺 `workflow` scope，无法推送 workflow 文件。改用分支部署后无需 workflow，
  推送即生效。
- 自定义域名 `idkyjun.me` 已在仓库 **Pages 设置**里配置（不是靠仓库内 CNAME 文件），
  Cloudflare 橙色云代理到 GitHub Pages，因此仓库里不再放 `CNAME` 文件
  （GitHub 会自动写入）。要换域名：去仓库 Settings → Pages → Custom domain 改。

> 之后任何修改 = 编辑文件 + `git push`，几分钟（Cloudflare 缓存最长 10 分钟）后线上更新。
> 这就是这个站点的"Gridea"：没有数据库、没有后台，纯文件 + 推送部署。

## 无障碍与降级

- 全量 `prefers-reduced-motion` 降级：颗粒噪点、自定义光标、kinetic 逐字、
  横向滚动（转纵向堆叠）、boot 动画全部关闭。
- 触屏设备（`@media (hover:none)`）自动隐藏自定义光标。
