# Canvas Image Viewer Monorepo

一个纯 Canvas 实现的图片查看器库及其 Demo 示例。

## 项目结构

```
mk-image-viewer/
├── mk-image-viewer/      # 核心库（发布到 npm）
│   ├── dist/                 # 构建产物
│   ├── src/                  # 源代码
│   └── package.json
├── mk-image-viewer-react/ # React Demo
│   ├── dist/                 # 构建产物
│   ├── src/                  # 源代码
│   └── package.json
└── mk-image-viewer-vue3/  # Vue3 Demo
    ├── dist/                 # 构建产物
    ├── src/                  # 源代码
    └── package.json
```

## 核心库

**mk-image-viewer** 是一个纯 Canvas 实现的图片查看器库，无任何框架依赖。

### 安装

```bash
npm install mk-image-viewer
# 或
pnpm add mk-image-viewer
# 或
yarn add mk-image-viewer
```

### 特性

- 🔍 图片缩放（鼠标滚轮 + 预设比例）
- 🔄 图片旋转（顺时针/逆时针）
- 🔀 图片翻转（水平/垂直）
- 🖼️ 缩略图导航
- 🗺️ 鸟瞰图预览
- ⛶ 全屏模式
- ⌨️ 键盘快捷键
- 🌐 多语言支持（中文/英文）

## Demo 示例

| Demo | 技术栈 | 说明 |
|------|--------|------|
| `mk-image-viewer-react` | React + TypeScript | React 框架集成示例 |
| `mk-image-viewer-vue3` | Vue3 + TypeScript | Vue3 框架集成示例 |

## 开发命令

```bash
# 构建所有项目
pnpm run build:all

# 启动 React Demo
pnpm run dev:react

# 启动 Vue3 Demo
pnpm run dev:vue

# 发布到远程仓库
pnpm run release
```

## 许可证

MIT License