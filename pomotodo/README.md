# 🍅 Pomotodo

一个纯静态的番茄钟 + 任务管理单页应用，复刻 Pomotodo 核心功能。

## ✨ 功能

- **番茄钟** — 25/5/15 默认时长（可自定义），支持开始/暂停/跳过/重置，自动循环
- **任务管理** — 增删改查/完成/置顶/关联当前番茄，优先级标记
- **统计面板** — 今日/本周/本月数据，Chart.js 7 天趋势图，JSON 导入导出
- **设置面板** — 亮/暗主题切换，提示音开关与音量，自定义时长，自动开始，数据清除
- **快捷键** — Space 开始/暂停，R 重置，T 任务页，S 设置页
- **PWA** — 可安装到桌面，离线可用

## 🚀 本地运行

```bash
cd pomotodo
npm install
npm run dev
```

浏览器访问 `http://localhost:5173` 即可使用。

## 📦 构建

```bash
npm run build
```

产出目录：`../dist/pomotodo/`，可直接用任意静态服务器打开。

## 🌐 在线访问

GitHub Pages 部署后访问：`https://185www.github.io/pomotodo/`

## 💾 数据备份与恢复

- **导出**：统计页面点击「导出数据」，下载 JSON 文件
- **导入**：统计页面点击「导入数据」，选择之前导出的 JSON 文件
- 所有数据存储在浏览器本地（localStorage + IndexedDB），不会上传到任何服务器

## 📱 PWA 安装

1. 在 Chrome / Edge 等浏览器中打开应用
2. 点击地址栏右侧的安装图标或菜单中的「安装应用」
3. 安装后可离线使用

## 📂 项目结构

```
pomotodo/
├── index.html          # 主入口
├── public/
│   ├── manifest.json   # PWA 清单（scope: ./）
│   └── icons/          # PWA 图标
├── src/
│   ├── main.js         # 应用入口
│   ├── style.css       # 全局样式
│   ├── components/
│   │   ├── Timer.js    # 番茄钟组件
│   │   ├── TaskList.js # 任务列表组件
│   │   ├── Stats.js    # 统计面板组件
│   │   └── Settings.js # 设置面板组件
│   ├── utils/
│   │   ├── storage.js  # 存储层（IDB + localStorage）
│   │   ├── audio.js    # Web Audio API 提示音
│   │   ├── notifier.js # 浏览器通知
│   │   └── date.js     # 日期工具
│   └── state/
│       └── store.js    # 全局状态管理
├── vite.config.js      # Vite 配置（base: './'）
├── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions 自动部署
└── README.md
```

## 🔧 技术栈

- **构建**：Vite（纯 JS/ESM）
- **UI**：原生 CSS + CSS Variables（亮/暗主题）
- **存储**：localStorage + IndexedDB 降级
- **图表**：Chart.js（npm 本地打包）
- **PWA**：vite-plugin-pwa
- **音频**：Web Audio API（OscillatorNode）

## ⚠️ 子目录说明

本应用设计为在 `/pomotodo/` 子目录下运行，所有路径均为相对路径（`base: './'`），不会与根目录的 `index.html` 冲突。

## License

MIT
