export interface ImageViewerOptions {
    container: HTMLElement;
    imageList: string[];
    width?: number;
    height?: number;
    thumbnailHeight?: number;
    toolbarHeight?: number;
    roundRadius?: number;
    onDelete?: (index: number) => void;
    colors?: ViewerColors;
}
export interface ViewerColors {
    containerBg?: string;
    toolbarBg?: string;
    toolbarIcon?: string;
    thumbnailBg?: string;
    thumbnailActive?: string;
    thumbnailBorder?: string;
    overviewBg?: string;
    overviewBorder?: string;
    overviewMask?: string;
    overviewMaskBorder?: string;
    textColor?: string;
    scaleInputBg?: string;
    scaleInputText?: string;
}
export interface ImageState {
    scale: number;
    x: number;
    y: number;
    rotation: number;
    flipH: boolean;
    flipV: boolean;
}
