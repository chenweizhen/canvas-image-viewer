export type Language = "zh-CN" | "en-US";
export type LanguageKey = "fitToScreen" | "actualSize" | "rotateLeft" | "rotateRight" | "flipHorizontal" | "flipVertical" | "reset" | "zoomIn" | "zoomOut" | "toggleThumbnails" | "toggleFullscreen" | "exitFullscreen" | "delete" | "prev" | "next" | "overview" | "close" | "loading" | "pixels";
export type LanguageOptions = {
    [key in LanguageKey]: string;
};
export declare const Languages: Record<Language, LanguageOptions>;
export declare function createCustomLanguage(customTexts: Partial<LanguageOptions>): LanguageOptions;
