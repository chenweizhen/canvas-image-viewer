export interface ImageViewerOptions {
    container: HTMLElement;
    imageList: string[];
    width?: number;
    height?: number;
    thumbnailHeight?: number;
    toolbarHeight?: number;
    roundRadius?: number;
    onDelete?: (index: number) => void;
}
export interface ImageState {
    scale: number;
    x: number;
    y: number;
    rotation: number;
    flipH: boolean;
    flipV: boolean;
}
