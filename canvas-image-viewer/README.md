# Canvas Image Viewer

一个纯 Canvas 实现的图片查看器库，无任何框架依赖。

## 功能特性

- 🔍 **图片缩放** - 支持鼠标滚轮缩放，多种预设缩放比例
- 🔄 **图片旋转** - 支持顺时针/逆时针旋转90°
- 🔀 **图片翻转** - 支持水平和垂直翻转
- 🖼️ **缩略图导航** - 底部缩略图列表快速切换
- 🗺️ **鸟瞰图** - 右上角预览窗口，快速定位
- ⛶ **全屏模式** - 沉浸式图片查看体验
- ⌨️ **键盘快捷键** - 丰富的快捷键支持
- 🌐 **多语言支持** - 内置中文和英文

## 安装

```bash
npm install canvas-image-viewer
```

## 快速开始

```typescript
import { ImageViewer } from 'canvas-image-viewer';

// 获取容器元素
const container = document.getElementById('viewer-container');

// 创建图片查看器
const viewer = new ImageViewer({
  container: container,
  imageList: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ],
  width: 1000,
  height: 650,
});
```

## API 文档

### ImageViewer 构造函数

```typescript
new ImageViewer(options: ImageViewerOptions)
```

### ImageViewerOptions 配置项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| container | HTMLElement | - | 必需，容器元素 |
| imageList | string[] | - | 必需，图片URL列表 |
| width | number | 1000 | 查看器宽度（像素） |
| height | number | 650 | 查看器高度（像素） |
| thumbnailHeight | number | 80 | 缩略图区域高度 |
| toolbarHeight | number | 40 | 工具栏高度 |
| roundRadius | number | 4 | 圆角半径 |
| language | Language | 'zh-CN' | 语言设置 |
| customLanguage | LanguageOptions | - | 自定义语言文本 |
| colors | ViewerColors | - | 自定义颜色配置 |
| onDelete | (index: number) => void | - | 删除回调函数 |

### ViewerColors 颜色配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| containerBg | string | '#1a1a1a' | 容器背景色 |
| navigatorBg | string | 'rgba(0, 0, 0, 0.5)' | 导航箭头背景色 |
| toolbarBg | string | '#2a2a2a' | 工具栏背景色 |
| toolbarIcon | string | '#cccccc' | 工具栏图标颜色 |
| thumbnailBg | string | '#2a2a2a' | 缩略图背景色 |
| thumbnailActive | string | '#0099ff' | 缩略图选中状态颜色 |
| thumbnailBorder | string | '#3a3a3a' | 缩略图边框颜色 |
| overviewBg | string | '#2a2a2a' | 鸟瞰图背景色 |
| overviewBorder | string | '#3a3a3a' | 鸟瞰图边框颜色 |
| overviewMask | string | 'rgba(0, 153, 255, 0.3)' | 鸟瞰图遮罩颜色 |
| overviewMaskBorder | string | '#0099ff' | 鸟瞰图遮罩边框颜色 |
| textColor | string | '#888888' | 文字颜色 |
| scaleInputBg | string | '#3a3a3a' | 缩放输入框背景色 |
| scaleInputText | string | '#ffffff' | 缩放输入框文字颜色 |

### 公共方法

| 方法 | 说明 |
|------|------|
| `prev()` | 查看上一张图片 |
| `next()` | 查看下一张图片 |
| `first()` | 跳转到第一张图片 |
| `last()` | 跳转到最后一张图片 |
| `zoomIn()` | 放大图片（1.2倍） |
| `zoomOut()` | 缩小图片（1/1.2倍） |
| `rotate(angle: number)` | 旋转图片，默认90° |
| `resetView()` | 重置视图到原始状态 |
| `fitToScreen()` | 适应屏幕显示 |
| `toggleFitMode()` | 切换适应屏幕模式 |
| `toggleFullscreen()` | 切换全屏模式 |
| `toggleThumbnails()` | 显示/隐藏缩略图 |
| `toggleOverview()` | 显示/隐藏鸟瞰图 |
| `getCurrentIndex()` | 获取当前图片索引 |
| `setCurrentIndex(index: number)` | 设置当前图片索引 |
| `getImageCount()` | 获取图片总数 |
| `removeImage(index: number)` | 删除指定索引的图片 |

### 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| ← | 上一张图片 |
| → | 下一张图片 |
| + / = | 放大 |
| - | 缩小 |
| Home | 跳转到第一张 |
| End | 跳转到最后一张 |
| 空格 | 切换适应屏幕 |
| Escape | 退出全屏 |
| F / f | 切换全屏 |

### 语言支持

| 语言 | 值 |
|------|-----|
| 中文 | 'zh-CN' |
| 英文 | 'en-US' |

## 使用示例

### 自定义颜色主题

```typescript
const viewer = new ImageViewer({
  container: container,
  imageList: ['image1.jpg', 'image2.jpg'],
  colors: {
    containerBg: '#1e1e1e',
    toolbarBg: '#2d2d2d',
    toolbarIcon: '#e0e0e0',
    thumbnailActive: '#4CAF50',
  },
});
```

### 自定义语言文本

```typescript
const viewer = new ImageViewer({
  container: container,
  imageList: ['image1.jpg', 'image2.jpg'],
  language: 'en-US',
  customLanguage: {
    fitToScreen: 'Fit Screen',
    zoomIn: 'Zoom +',
    zoomOut: 'Zoom -',
  },
});
```

### 删除图片回调

```typescript
const viewer = new ImageViewer({
  container: container,
  imageList: ['image1.jpg', 'image2.jpg'],
  onDelete: (index) => {
    console.log(`Deleted image at index: ${index}`);
    // 在这里执行服务器删除操作
  },
});
```

## 浏览器兼容性

支持所有现代浏览器：

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

---

# Canvas Image Viewer

A pure Canvas-based image viewer library with no framework dependencies.

## Features

- 🔍 **Image Zoom** - Support mouse wheel zoom with multiple preset scales
- 🔄 **Image Rotation** - Support clockwise/counterclockwise rotation by 90°
- 🔀 **Image Flip** - Support horizontal and vertical flip
- 🖼️ **Thumbnail Navigation** - Bottom thumbnail list for quick switching
- 🗺️ **Overview Panel** - Top-right preview window for quick positioning
- ⛶ **Fullscreen Mode** - Immersive image viewing experience
- ⌨️ **Keyboard Shortcuts** - Rich keyboard support
- 🌐 **Multi-language** - Built-in Chinese and English support

## Installation

```bash
npm install canvas-image-viewer
```

## Quick Start

```typescript
import { ImageViewer } from 'canvas-image-viewer';

// Get container element
const container = document.getElementById('viewer-container');

// Create image viewer
const viewer = new ImageViewer({
  container: container,
  imageList: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ],
  width: 1000,
  height: 650,
});
```

## API Documentation

### ImageViewer Constructor

```typescript
new ImageViewer(options: ImageViewerOptions)
```

### ImageViewerOptions

| Parameter | Type | Default | Description |
|-----------|------|--------|-------------|
| container | HTMLElement | - | Required, container element |
| imageList | string[] | - | Required, list of image URLs |
| width | number | 1000 | Viewer width in pixels |
| height | number | 650 | Viewer height in pixels |
| thumbnailHeight | number | 80 | Thumbnail area height |
| toolbarHeight | number | 40 | Toolbar height |
| roundRadius | number | 4 | Border radius |
| language | Language | 'zh-CN' | Language setting |
| customLanguage | LanguageOptions | - | Custom language texts |
| colors | ViewerColors | - | Custom color configuration |
| onDelete | (index: number) => void | - | Delete callback function |

### ViewerColors

| Parameter | Type | Default | Description |
|-----------|------|--------|-------------|
| containerBg | string | '#1a1a1a' | Container background |
| navigatorBg | string | 'rgba(0, 0, 0, 0.5)' | Navigation arrow background |
| toolbarBg | string | '#2a2a2a' | Toolbar background |
| toolbarIcon | string | '#cccccc' | Toolbar icon color |
| thumbnailBg | string | '#2a2a2a' | Thumbnail background |
| thumbnailActive | string | '#0099ff' | Thumbnail active color |
| thumbnailBorder | string | '#3a3a3a' | Thumbnail border color |
| overviewBg | string | '#2a2a2a' | Overview panel background |
| overviewBorder | string | '#3a3a3a' | Overview panel border |
| overviewMask | string | 'rgba(0, 153, 255, 0.3)' | Overview mask color |
| overviewMaskBorder | string | '#0099ff' | Overview mask border |
| textColor | string | '#888888' | Text color |
| scaleInputBg | string | '#3a3a3a' | Scale input background |
| scaleInputText | string | '#ffffff' | Scale input text color |

### Public Methods

| Method | Description |
|--------|-------------|
| `prev()` | View previous image |
| `next()` | View next image |
| `first()` | Go to first image |
| `last()` | Go to last image |
| `zoomIn()` | Zoom in (1.2x) |
| `zoomOut()` | Zoom out (1/1.2x) |
| `rotate(angle: number)` | Rotate image, default 90° |
| `resetView()` | Reset view to original state |
| `fitToScreen()` | Fit to screen |
| `toggleFitMode()` | Toggle fit mode |
| `toggleFullscreen()` | Toggle fullscreen |
| `toggleThumbnails()` | Show/hide thumbnails |
| `toggleOverview()` | Show/hide overview panel |
| `getCurrentIndex()` | Get current image index |
| `setCurrentIndex(index: number)` | Set current image index |
| `getImageCount()` | Get total image count |
| `removeImage(index: number)` | Remove image at specified index |

### Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| ← | Previous image |
| → | Next image |
| + / = | Zoom in |
| - | Zoom out |
| Home | Go to first image |
| End | Go to last image |
| Space | Toggle fit mode |
| Escape | Exit fullscreen |
| F / f | Toggle fullscreen |

### Language Support

| Language | Value |
|----------|-------|
| Chinese | 'zh-CN' |
| English | 'en-US' |

## Usage Examples

### Custom Color Theme

```typescript
const viewer = new ImageViewer({
  container: container,
  imageList: ['image1.jpg', 'image2.jpg'],
  colors: {
    containerBg: '#1e1e1e',
    toolbarBg: '#2d2d2d',
    toolbarIcon: '#e0e0e0',
    thumbnailActive: '#4CAF50',
  },
});
```

### Custom Language Texts

```typescript
const viewer = new ImageViewer({
  container: container,
  imageList: ['image1.jpg', 'image2.jpg'],
  language: 'en-US',
  customLanguage: {
    fitToScreen: 'Fit Screen',
    zoomIn: 'Zoom +',
    zoomOut: 'Zoom -',
  },
});
```

### Delete Callback

```typescript
const viewer = new ImageViewer({
  container: container,
  imageList: ['image1.jpg', 'image2.jpg'],
  onDelete: (index) => {
    console.log(`Deleted image at index: ${index}`);
    // Perform server deletion here
  },
});
```

## Browser Compatibility

Supports all modern browsers:

- Chrome (Recommended)
- Firefox
- Safari
- Edge

## License

MIT License