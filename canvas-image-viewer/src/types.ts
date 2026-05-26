export interface ImageViewerOptions {
  container: HTMLElement;
  imageList: string[];
  width?: number;
  height?: number;
  thumbnailHeight?: number;
}

export interface ImageState {
  scale: number;
  x: number;
  y: number;
  rotation: number;
}
