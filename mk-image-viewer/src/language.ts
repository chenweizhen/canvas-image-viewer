export type Language = "zh-CN" | "en-US";

export type LanguageKey = 
  | "fitToScreen"
  | "actualSize"
  | "rotateLeft"
  | "rotateRight"
  | "flipHorizontal"
  | "flipVertical"
  | "reset"
  | "zoomIn"
  | "zoomOut"
  | "toggleThumbnails"
  | "toggleFullscreen"
  | "exitFullscreen"
  | "delete"
  | "prev"
  | "next"
  | "overview"
  | "close"
  | "loading"
  | "pixels";

export type LanguageOptions = {
  [key in LanguageKey]: string;
};

export const Languages: Record<Language, LanguageOptions> = {
  "zh-CN": {
    fitToScreen: "适应屏幕",
    actualSize: "实际大小",
    rotateLeft: "左旋90°",
    rotateRight: "右旋90°",
    flipHorizontal: "水平翻转",
    flipVertical: "垂直翻转",
    reset: "重置视图",
    zoomIn: "放大",
    zoomOut: "缩小",
    toggleThumbnails: "显示/隐藏缩略图",
    toggleFullscreen: "切换全屏",
    exitFullscreen: "退出全屏",
    delete: "删除",
    prev: "上一张",
    next: "下一张",
    overview: "鸟瞰图",
    close: "关闭",
    loading: "加载中...",
    pixels: "像素",
  },
  "en-US": {
    fitToScreen: "Fit to Screen",
    actualSize: "Actual Size",
    rotateLeft: "Rotate Left",
    rotateRight: "Rotate Right",
    flipHorizontal: "Flip Horizontal",
    flipVertical: "Flip Vertical",
    reset: "Reset View",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    toggleThumbnails: "Toggle Thumbnails",
    toggleFullscreen: "Toggle Fullscreen",
    exitFullscreen: "Exit Fullscreen",
    delete: "Delete",
    prev: "Previous",
    next: "Next",
    overview: "Overview",
    close: "Close",
    loading: "Loading...",
    pixels: "px",
  },
};

export function createCustomLanguage(customTexts: Partial<LanguageOptions>): LanguageOptions {
  return {
    ...Languages["zh-CN"],
    ...customTexts,
  };
}
