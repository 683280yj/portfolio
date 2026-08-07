# 小姚 · 个人作品集（静态站点）

接入本地 macOS 的端口式个人主页。纯静态（HTML/CSS/JS，零运行时依赖），
推送即部署（GitHub Pages + 自定义域名 idkyjun.me）。

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
| 联系方式邮箱 | `index.html` | 搜 `yggcmm@outlook.com` |
| 自定义域名 | `CNAME` | 一行 `idkyjun.me` |

图标统一用 **Lucide**：在 HTML 写 `<i data-lucide="图标名"></i>` 即可，
图标名查 https://lucide.dev/icons 。**禁止 emoji。**

## 发布 / 修改（推送即上线，无需重建）

```bash
git add -A
git commit -m "update: 改了 xxx"
git push          # → GitHub Actions 自动构建并部署到 Pages
```

- 首次需：在 GitHub 建仓库 → `git remote add origin <repo>` → `git push -u origin main`
- 开启 Pages：仓库 Settings → Pages → Source 选 `GitHub Actions`
- 自定义域名 `idkyjun.me` 由仓库内 `CNAME` 自动生效（还需在 Cloudflare 把该域名 CNAME 到 `<user>.github.io`）

> 之后任何修改 = 编辑文件 + `git push`，几秒后线上自动更新。
> 这就是这个站点的"Gridea"：没有数据库、没有后台，纯文件 + 推送部署。
