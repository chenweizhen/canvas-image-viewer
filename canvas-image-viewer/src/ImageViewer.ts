import type { ImageViewerOptions, ImageState } from './types'

export class ImageViewer {
  private options: Required<ImageViewerOptions>
  private container: HTMLElement
  private mainCanvas!: HTMLCanvasElement
  private thumbCanvas!: HTMLCanvasElement
  private mainCtx!: CanvasRenderingContext2D
  private thumbCtx!: CanvasRenderingContext2D

  private currentIndex = 0
  private imageList: HTMLImageElement[] = []
  private imageState: ImageState = { scale: 1, x: 0, y: 0, rotation: 0 }

  private isDragging = false
  private lastX = 0
  private lastY = 0

  constructor(options: ImageViewerOptions) {
    this.options = Object.assign({
      width: 1000,
      height: 650,
      thumbnailHeight: 120
    }, options)

    this.container = options.container
    this.initCanvas()
    this.loadImages()
    this.bindEvents()
  }

  private initCanvas() {
    this.container.style.position = 'relative'
    this.container.style.background = '#1e1e1e'
    this.container.style.userSelect = 'none'

    this.mainCanvas = document.createElement('canvas')
    this.mainCanvas.width = this.options.width
    this.mainCanvas.height = this.options.height - this.options.thumbnailHeight
    this.mainCanvas.style.cursor = 'grab'
    this.mainCanvas.style.display = 'block'
    this.mainCtx = this.mainCanvas.getContext('2d')!

    this.thumbCanvas = document.createElement('canvas')
    this.thumbCanvas.width = this.options.width
    this.thumbCanvas.height = this.options.thumbnailHeight
    this.thumbCanvas.style.position = 'absolute'
    this.thumbCanvas.style.bottom = '0'
    this.thumbCanvas.style.cursor = 'pointer'
    this.thumbCanvas.style.display = 'block'
    this.thumbCtx = this.thumbCanvas.getContext('2d')!

    this.container.appendChild(this.mainCanvas)
    this.container.appendChild(this.thumbCanvas)
  }

  private loadImages() {
    const promises = this.options.imageList.map(src => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = src
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
      })
    })

    Promise.all(promises).then(imgs => {
      this.imageList = imgs
      this.renderAll()
    }).catch(error => {
      console.error('Error loading images:', error)
    })
  }

  private renderAll() {
    this.renderMainImage()
    this.renderThumbnails()
  }

  private renderMainImage() {
    const ctx = this.mainCtx
    const canvas = this.mainCanvas
    const img = this.imageList[this.currentIndex]

    if (!img) return

    const state = this.imageState

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((state.rotation * Math.PI) / 180)

    const w = img.width * state.scale
    const h = img.height * state.scale
    ctx.drawImage(img, -w / 2 + state.x, -h / 2 + state.y, w, h)

    ctx.restore()
  }

  private renderThumbnails() {
    const ctx = this.thumbCtx
    const canvas = this.thumbCanvas
    const th = canvas.height - 10

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    this.imageList.forEach((img, index) => {
      const x = index * (th + 15) + 10
      const ratio = img.width / img.height
      const tw = th * ratio

      if (index === this.currentIndex) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(x - 3, 2, tw + 6, th + 6)
      }

      ctx.fillStyle = '#3a3a3a'
      ctx.fillRect(x - 2, 3, tw + 4, th + 4)

      ctx.drawImage(img, x, 5, tw, th)
    })
  }

  private bindEvents() {
    this.thumbCanvas.addEventListener('click', (e) => {
      const rect = this.thumbCanvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const th = this.thumbCanvas.height - 10
      const idx = Math.floor((x - 10) / (th + 15))

      if (idx >= 0 && idx < this.imageList.length) {
        this.currentIndex = idx
        this.resetView()
        this.renderAll()
      }
    })

    this.mainCanvas.addEventListener('mousedown', (e) => {
      this.isDragging = true
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.mainCanvas.style.cursor = 'grabbing'
    })

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return
      this.imageState.x += e.clientX - this.lastX
      this.imageState.y += e.clientY - this.lastY
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.renderMainImage()
    })

    window.addEventListener('mouseup', () => {
      this.isDragging = false
      this.mainCanvas.style.cursor = 'grab'
    })

    this.mainCanvas.addEventListener('wheel', (e) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = this.imageState.scale * delta

      if (newScale >= 0.1 && newScale <= 10) {
        this.imageState.scale = newScale
        this.renderMainImage()
      }
    }, { passive: false })

    this.mainCanvas.addEventListener('mouseleave', () => {
      this.isDragging = false
      this.mainCanvas.style.cursor = 'grab'
    })
  }

  public prev() {
    this.currentIndex = (this.currentIndex - 1 + this.imageList.length) % this.imageList.length
    this.resetView()
    this.renderAll()
  }

  public next() {
    this.currentIndex = (this.currentIndex + 1) % this.imageList.length
    this.resetView()
    this.renderAll()
  }

  public rotate() {
    this.imageState.rotation = (this.imageState.rotation + 90) % 360
    this.renderMainImage()
  }

  public resetView() {
    this.imageState = { scale: 1, x: 0, y: 0, rotation: 0 }
    this.renderMainImage()
  }

  public getCurrentIndex(): number {
    return this.currentIndex
  }

  public setCurrentIndex(index: number) {
    if (index >= 0 && index < this.imageList.length) {
      this.currentIndex = index
      this.resetView()
      this.renderAll()
    }
  }

  public getImageCount(): number {
    return this.imageList.length
  }

  public destroy() {
    this.container.innerHTML = ''
    this.imageList = []
    this.imageState = { scale: 1, x: 0, y: 0, rotation: 0 }
  }
}
