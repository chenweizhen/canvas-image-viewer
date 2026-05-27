import type { ImageViewerOptions, ImageState } from './types'
import { Icons } from './icon'

export class ImageViewer {
  private options: Required<ImageViewerOptions>
  private container: HTMLElement
  private mainCanvas!: HTMLCanvasElement
  private thumbCanvas!: HTMLCanvasElement
  private mainCtx!: CanvasRenderingContext2D
  private thumbCtx!: CanvasRenderingContext2D
  private toolbarContainer!: HTMLElement
  private thumbScrollContainer!: HTMLElement
  private scaleDisplay!: HTMLElement
  private infoDisplay!: HTMLElement
  private fitBtn!: HTMLButtonElement
  private fullscreenBtn!: HTMLButtonElement
  private showThumbnails = true
  private isFitMode = true
  private isFullscreen = false

  private currentIndex = 0
  private imageList: HTMLImageElement[] = []
  private imageState: ImageState = { scale: 1, x: 0, y: 0, rotation: 0 }

  private isDragging = false
  private lastX = 0
  private lastY = 0

  private readonly TW = 80
  private readonly TH = 45

  constructor(options: ImageViewerOptions) {
    this.options = Object.assign({
      width: 1000,
      height: 650,
      thumbnailHeight: 70,
      toolbarHeight: 40,
      roundRadius: 4,
      onDelete: () => {}
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
    this.container.style.overflow = 'hidden'

    this.mainCanvas = document.createElement('canvas')
    this.mainCanvas.width = this.options.width
    this.mainCanvas.height = this.options.height - this.options.thumbnailHeight - this.options.toolbarHeight
    this.mainCanvas.style.cursor = 'grab'
    this.mainCanvas.style.display = 'block'
    this.mainCtx = this.mainCanvas.getContext('2d')!

    this.thumbScrollContainer = document.createElement('div')
    this.thumbScrollContainer.style.position = 'relative'
    this.thumbScrollContainer.style.width = '100%'
    this.thumbScrollContainer.style.height = this.options.thumbnailHeight + 'px'
    this.thumbScrollContainer.style.overflowX = 'auto'
    this.thumbScrollContainer.style.overflowY = 'hidden'
    this.thumbScrollContainer.style.background = '#2a2a2a'

    this.thumbCanvas = document.createElement('canvas')
    this.thumbCanvas.height = this.options.thumbnailHeight
    this.thumbCanvas.style.cursor = 'pointer'
    this.thumbCanvas.style.display = 'block'
    this.thumbCtx = this.thumbCanvas.getContext('2d')!

    this.thumbScrollContainer.appendChild(this.thumbCanvas)

    this.toolbarContainer = document.createElement('div')
    this.toolbarContainer.style.height = this.options.toolbarHeight + 'px'
    this.toolbarContainer.style.background = '#252525'
    this.toolbarContainer.style.display = 'flex'
    this.toolbarContainer.style.alignItems = 'center'
    this.toolbarContainer.style.justifyContent = 'space-between'
    this.toolbarContainer.style.padding = '0 16px'
    this.toolbarContainer.style.borderTop = '1px solid #3a3a3a'

    this.infoDisplay = document.createElement('div')
    this.infoDisplay.style.color = '#888888'
    this.infoDisplay.style.fontSize = '12px'
    this.infoDisplay.style.flex = '1'

    const leftSection = document.createElement('div')
    leftSection.style.display = 'flex'
    leftSection.style.alignItems = 'center'
    leftSection.style.gap = '8px'
    leftSection.appendChild(this.infoDisplay)

    const centerSection = document.createElement('div')
    centerSection.style.display = 'flex'
    centerSection.style.alignItems = 'center'
    centerSection.style.gap = '8px'

    const prevBtn = this.createToolbarButton('ArrowLeft', () => this.prev())
    centerSection.appendChild(prevBtn)

    const pageInfo = document.createElement('span')
    pageInfo.style.color = '#cccccc'
    pageInfo.style.fontSize = '12px'
    pageInfo.style.minWidth = '60px'
    pageInfo.style.textAlign = 'center'
    pageInfo.id = 'page-info'
    pageInfo.textContent = '1/0'
    centerSection.appendChild(pageInfo)

    const nextBtn = this.createToolbarButton('ArrowRight', () => this.next())
    centerSection.appendChild(nextBtn)

    this.fitBtn = this.createToolbarButton('FitToScreen', () => this.toggleFitMode())
    this.fitBtn.title = '适应屏幕'
    centerSection.appendChild(this.fitBtn)

    const scaleContainer = document.createElement('div')
    scaleContainer.style.position = 'relative'
    scaleContainer.style.background = '#3a3a3a'
    scaleContainer.style.border = 'none'
    scaleContainer.style.padding = '0'
    scaleContainer.style.fontSize = '12px'
    scaleContainer.style.borderRadius = '4px'
    scaleContainer.style.width = '64px'

    const scaleInput = document.createElement('input')
    scaleInput.type = 'text'
    scaleInput.style.background = 'transparent'
    scaleInput.style.color = '#ffffff'
    scaleInput.style.border = 'none'
    scaleInput.style.padding = '4px 22px 4px 4px'
    scaleInput.style.fontSize = '12px'
    scaleInput.style.width = '72px'
    scaleInput.style.textAlign = 'center'
    scaleInput.style.cursor = 'text'
    scaleInput.style.outline = 'none'
    scaleInput.value = '100%'

    const scaleArrow = document.createElement('button')
    scaleArrow.innerHTML = Icons.ArrowDropDown
    scaleArrow.style.position = 'absolute'
    scaleArrow.style.right = '2px'
    scaleArrow.style.top = '50%'
    scaleArrow.style.transform = 'translateY(-50%)'
    scaleArrow.style.background = 'transparent'
    scaleArrow.style.border = 'none'
    scaleArrow.style.color = '#cccccc'
    scaleArrow.style.fontSize = '10px'
    scaleArrow.style.width = '18px'
    scaleArrow.style.height = '18px'
    scaleArrow.style.cursor = 'pointer'
    scaleArrow.style.display = 'flex'
    scaleArrow.style.alignItems = 'center'
    scaleArrow.style.justifyContent = 'center'
    scaleArrow.title = '缩放选项'

    scaleArrow.addEventListener('mouseenter', () => { scaleArrow.style.color = '#ffffff' })
    scaleArrow.addEventListener('mouseleave', () => { scaleArrow.style.color = '#cccccc' })

    scaleContainer.appendChild(scaleInput)
    scaleContainer.appendChild(scaleArrow)

    const scaleDropdown = document.createElement('div')
    scaleDropdown.style.position = 'absolute'
    scaleDropdown.style.bottom = '100%'
    scaleDropdown.style.left = '-8px'
    scaleDropdown.style.background = '#2a2a2a'
    scaleDropdown.style.border = '1px solid #3a3a3a'
    scaleDropdown.style.width = '80px'
    scaleDropdown.style.display = 'none'
    scaleDropdown.style.zIndex = '100'
    scaleDropdown.style.borderRadius = '4px'
    scaleDropdown.style.marginBottom = '4px'
    scaleDropdown.style.textAlign = 'center'

    const presetScales = ['25', '50', '75', '100', '150', '200', '300', '400']
    presetScales.forEach(scale => {
      const item = document.createElement('div')
      item.textContent = scale + '%'
      item.style.padding = '4px 12px'
      item.style.color = '#cccccc'
      item.style.cursor = 'pointer'
      item.style.fontSize = '12px'
      item.style.textAlign = 'center'
      item.addEventListener('mouseenter', () => { item.style.background = '#3a3a3a'; item.style.color = '#ffffff' })
      item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; item.style.color = '#cccccc' })
      item.addEventListener('click', () => {
        const scaleValue = parseFloat(scale) / 100
        this.imageState.scale = Math.max(0.1, Math.min(10, scaleValue))
        scaleInput.value = `${Math.round(this.imageState.scale * 100)}%`
        this.isFitMode = false
        this.updateFitButton()
        this.renderMainImage()
        scaleDropdown.style.display = 'none'
      })
      scaleDropdown.appendChild(item)
    })

    scaleContainer.appendChild(scaleDropdown)

    scaleArrow.addEventListener('click', (e) => {
      e.stopPropagation()
      scaleDropdown.style.display = scaleDropdown.style.display === 'none' ? 'block' : 'none'
    })

    document.addEventListener('click', () => {
      scaleDropdown.style.display = 'none'
    })

    scaleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = scaleInput.value.replace('%', '').trim()
        const scaleValue = parseFloat(value)
        if (!isNaN(scaleValue)) {
          const clampedScale = Math.max(10, Math.min(1000, scaleValue))
          const intScale = Math.round(clampedScale)
          this.imageState.scale = intScale / 100
          scaleInput.value = `${intScale}%`
          this.isFitMode = false
          this.updateFitButton()
          this.renderMainImage()
        } else {
          scaleInput.value = `${Math.round(this.imageState.scale * 100)}%`
        }
      }
    })

    scaleInput.addEventListener('blur', () => {
      const value = scaleInput.value.replace('%', '').trim()
      const scaleValue = parseFloat(value)
      if (!isNaN(scaleValue)) {
        const clampedScale = Math.max(10, Math.min(1000, scaleValue))
        const intScale = Math.round(clampedScale)
        this.imageState.scale = intScale / 100
        scaleInput.value = `${intScale}%`
        this.isFitMode = false
        this.updateFitButton()
        this.renderMainImage()
      } else {
        scaleInput.value = `${Math.round(this.imageState.scale * 100)}%`
      }
    })

    this.scaleDisplay = scaleInput

    centerSection.appendChild(scaleContainer)

    const zoomInBtn = this.createToolbarButton('ZoomIn', () => this.zoom(1.1))
    zoomInBtn.title = '放大'
    centerSection.appendChild(zoomInBtn)

    const zoomOutBtn = this.createToolbarButton('ZoomOut', () => this.zoom(0.9))
    zoomOutBtn.title = '缩小'
    centerSection.appendChild(zoomOutBtn)

    const rotateLeftBtn = this.createToolbarButton('RotateLeft', () => this.rotate(-90))
    rotateLeftBtn.title = '向左旋转'
    centerSection.appendChild(rotateLeftBtn)

    const rotateRightBtn = this.createToolbarButton('RotateRight', () => this.rotate(90))
    rotateRightBtn.title = '向右旋转'
    centerSection.appendChild(rotateRightBtn)

    const flipHBtn = this.createToolbarButton('FlipHorizontal', () => this.flipHorizontal())
    flipHBtn.title = '水平翻转'
    centerSection.appendChild(flipHBtn)

    const flipVBtn = this.createToolbarButton('FlipVertical', () => this.flipVertical())
    flipVBtn.title = '垂直翻转'
    centerSection.appendChild(flipVBtn)

    const deleteBtn = this.createToolbarButton('Delete', () => this.handleDelete())
    deleteBtn.title = '删除'
    centerSection.appendChild(deleteBtn)

    const rightSection = document.createElement('div')
    rightSection.style.display = 'flex'
    rightSection.style.alignItems = 'center'
    rightSection.style.gap = '8px'

    const thumbToggleBtn = this.createToolbarButton('Slideshow', () => this.toggleThumbnails())
    thumbToggleBtn.title = '切换缩略图显示'
    rightSection.appendChild(thumbToggleBtn)

    this.fullscreenBtn = this.createToolbarButton('Fullscreen', () => this.toggleFullscreen())
    this.fullscreenBtn.title = '切换全屏'
    rightSection.appendChild(this.fullscreenBtn)

    this.toolbarContainer.appendChild(leftSection)
    this.toolbarContainer.appendChild(centerSection)
    this.toolbarContainer.appendChild(rightSection)

    this.container.appendChild(this.mainCanvas)
    this.container.appendChild(this.thumbScrollContainer)
    this.container.appendChild(this.toolbarContainer)
  }

  private createToolbarButton(iconName: keyof typeof Icons, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button')
    btn.innerHTML = Icons[iconName]
    btn.style.background = 'transparent'
    btn.style.border = 'none'
    btn.style.color = '#cccccc'
    btn.style.fontSize = '14px'
    btn.style.padding = '4px'
    btn.style.width = '24px'
    btn.style.height = '24px'
    btn.style.borderRadius = '4px'
    btn.style.cursor = 'pointer'
    btn.style.display = 'flex'
    btn.style.alignItems = 'center'
    btn.style.justifyContent = 'center'
    btn.addEventListener('mouseenter', () => { btn.style.background = '#3a3a3a'; btn.style.color = '#ffffff' })
    btn.addEventListener('mouseleave', () => { btn.style.background = 'transparent'; btn.style.color = '#cccccc' })
    btn.addEventListener('click', onClick)
    return btn
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
      this.updatePageInfo()
      this.updateImageInfo()
      this.fitToScreen()
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

    this.updateScaleDisplay()
  }

  private renderThumbnails() {
    const ctx = this.thumbCtx
    const canvas = this.thumbCanvas

    const totalWidth = this.imageList.length * (this.TW + 15) + 20
    canvas.width = Math.max(totalWidth, this.options.width)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    this.imageList.forEach((img, index) => {
      const x = index * (this.TW + 15) + 10
      const y = (canvas.height - this.TH) / 2

      if (index === this.currentIndex) {
        ctx.fillStyle = '#0099ff'
        this.fillRoundRect(ctx, x - 3, y - 3, this.TW + 6, this.TH + 6, this.options.roundRadius)
      }

      ctx.fillStyle = '#3a3a3a'
      this.fillRoundRect(ctx, x - 2, y - 2, this.TW + 4, this.TH + 4, this.options.roundRadius)

      const imgRatio = img.width / img.height
      const containerRatio = this.TW / this.TH
      let drawW = this.TW
      let drawH = this.TH
      let drawX = x
      let drawY = y

      if (imgRatio > containerRatio) {
        drawH = this.TW / imgRatio
        drawY = y + (this.TH - drawH) / 2
      } else {
        drawW = this.TH * imgRatio
        drawX = x + (this.TW - drawW) / 2
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH)
    })
  }

  private bindEvents() {
    this.thumbCanvas.addEventListener('click', (e) => {
      const rect = this.thumbCanvas.getBoundingClientRect()
      const x = e.clientX - rect.left + this.thumbScrollContainer.scrollLeft
      const idx = Math.floor((x - 10) / (this.TW + 15))

      if (idx >= 0 && idx < this.imageList.length) {
        this.currentIndex = idx
        this.updatePageInfo()
        this.updateImageInfo()
        if (this.isFitMode) {
          this.fitToScreen()
        } else {
          this.resetView()
        }
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
        this.isFitMode = false
        this.updateFitButton()
        this.renderMainImage()
      }
    }, { passive: false })

    this.mainCanvas.addEventListener('mouseleave', () => {
      this.isDragging = false
      this.mainCanvas.style.cursor = 'grab'
    })

    document.addEventListener('fullscreenchange', () => {
      const wasFullscreen = this.isFullscreen
      this.isFullscreen = !!document.fullscreenElement

      if (wasFullscreen !== this.isFullscreen) {
        this.updateFullscreenButton()
        this.handleFullscreenResize()
      }
    })
  }

  private fillRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
    ctx.fill()
  }

  private updateScaleDisplay() {
    const percentage = Math.round(this.imageState.scale * 100)
    ;(this.scaleDisplay as HTMLInputElement).value = `${percentage}%`
  }

  private updatePageInfo() {
    const pageInfo = this.toolbarContainer.querySelector('#page-info') as HTMLSpanElement
    if (pageInfo) {
      pageInfo.textContent = `${this.currentIndex + 1}/${this.imageList.length}`
    }
  }

  private updateImageInfo() {
    const img = this.imageList[this.currentIndex]
    if (!img) return

    const src = img.src
    const fileName = src.split('/').pop() || ''
    const size = `${img.width}×${img.height}像素`
    
    this.infoDisplay.textContent = `${fileName} ${size}`
  }

  private zoom(factor: number) {
    const newScale = this.imageState.scale * factor
    if (newScale >= 0.1 && newScale <= 10) {
      this.imageState.scale = newScale
      this.isFitMode = false
      this.updateFitButton()
      this.renderMainImage()
    }
  }

  private flipHorizontal() {
    this.imageState.scale = -this.imageState.scale
    this.renderMainImage()
  }

  private flipVertical() {
    const ctx = this.mainCtx
    const canvas = this.mainCanvas
    const img = this.imageList[this.currentIndex]
    if (!img) return

    const state = this.imageState

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((state.rotation * Math.PI) / 180)
    ctx.scale(1, -1)

    const w = img.width * Math.abs(state.scale)
    const h = img.height * Math.abs(state.scale)
    ctx.drawImage(img, -w / 2 + state.x, -h / 2 + state.y, w, h)

    ctx.restore()
    this.updateScaleDisplay()
  }

  public prev() {
    this.currentIndex = (this.currentIndex - 1 + this.imageList.length) % this.imageList.length
    this.updatePageInfo()
    this.updateImageInfo()
    if (this.isFitMode) {
      this.fitToScreen()
    } else {
      this.resetView()
    }
  }

  public next() {
    this.currentIndex = (this.currentIndex + 1) % this.imageList.length
    this.updatePageInfo()
    this.updateImageInfo()
    if (this.isFitMode) {
      this.fitToScreen()
    } else {
      this.resetView()
    }
  }

  public rotate(angle: number = 90) {
    this.imageState.rotation = (this.imageState.rotation + angle) % 360
    this.renderMainImage()
  }

  public resetView() {
    this.imageState = { scale: 1, x: 0, y: 0, rotation: 0 }
    this.isFitMode = false
    this.updateFitButton()
    this.renderMainImage()
  }

  public fitToScreen() {
    const img = this.imageList[this.currentIndex]
    if (!img) return

    const canvas = this.mainCanvas
    const scaleX = canvas.width / img.width
    const scaleY = canvas.height / img.height
    this.imageState.scale = Math.min(scaleX, scaleY)
    this.imageState.x = 0
    this.imageState.y = 0
    this.isFitMode = true
    this.updateFitButton()
    this.renderAll()
  }

  public toggleFitMode() {
    if (this.isFitMode) {
      this.resetView()
      this.isFitMode = false
    } else {
      this.fitToScreen()
      this.isFitMode = true
    }
    this.updateFitButton()
  }

  private updateFitButton() {
    if (this.fitBtn) {
      if (this.isFitMode) {
        this.fitBtn.innerHTML = Icons.AspectRatio
        this.fitBtn.title = '实际大小'
      } else {
        this.fitBtn.innerHTML = Icons.FitToScreen
        this.fitBtn.title = '适应屏幕'
      }
    }
  }

  public toggleThumbnails() {
    this.showThumbnails = !this.showThumbnails
    this.thumbScrollContainer.style.display = this.showThumbnails ? 'block' : 'none'
    this.mainCanvas.height = this.options.height - (this.showThumbnails ? this.options.thumbnailHeight : 0) - this.options.toolbarHeight
    this.renderMainImage()
  }

  public getCurrentIndex(): number {
    return this.currentIndex
  }

  public setCurrentIndex(index: number) {
    if (index >= 0 && index < this.imageList.length) {
      this.currentIndex = index
      this.updatePageInfo()
      this.updateImageInfo()
      if (this.isFitMode) {
        this.fitToScreen()
      } else {
        this.resetView()
      }
    }
  }

  public getImageCount(): number {
    return this.imageList.length
  }

  public handleDelete() {
    const index = this.currentIndex
    
    if (this.options.onDelete) {
      this.options.onDelete(index)
    } else {
      this.removeImage(index)
    }
  }

  public removeImage(index: number) {
    if (index < 0 || index >= this.imageList.length) return

    this.imageList.splice(index, 1)
    
    if (this.currentIndex >= this.imageList.length) {
      this.currentIndex = Math.max(0, this.imageList.length - 1)
    }

    this.updatePageInfo()
    this.updateImageInfo()
    
    if (this.imageList.length > 0) {
      if (this.isFitMode) {
        this.fitToScreen()
      } else {
        this.resetView()
      }
    } else {
      this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
      this.thumbCtx.clearRect(0, 0, this.thumbCanvas.width, this.thumbCanvas.height)
    }
  }

  public toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen?.().then(() => {
        this.isFullscreen = true
        this.updateFullscreenButton()
        this.handleFullscreenResize()
      }).catch(err => {
        console.error('Failed to enter fullscreen:', err)
      })
    } else {
      document.exitFullscreen?.().then(() => {
        this.isFullscreen = false
        this.updateFullscreenButton()
        this.handleFullscreenResize()
      }).catch(err => {
        console.error('Failed to exit fullscreen:', err)
      })
    }
  }

  private updateFullscreenButton() {
    if (this.fullscreenBtn) {
      if (this.isFullscreen) {
        this.fullscreenBtn.innerHTML = Icons.FullscreenExit
        this.fullscreenBtn.title = '退出全屏'
      } else {
        this.fullscreenBtn.innerHTML = Icons.Fullscreen
        this.fullscreenBtn.title = '切换全屏'
      }
    }
  }

  private handleFullscreenResize() {
    if (this.isFullscreen) {
      const width = window.innerWidth
      const height = window.innerHeight

      this.container.style.width = width + 'px'
      this.container.style.height = height + 'px'
      this.container.style.position = 'fixed'
      this.container.style.top = '0'
      this.container.style.left = '0'
      this.container.style.zIndex = '9999'

      this.mainCanvas.width = width
      this.mainCanvas.height = height - this.options.thumbnailHeight - this.options.toolbarHeight

      this.thumbScrollContainer.style.width = width + 'px'
      this.thumbCanvas.width = Math.max(this.imageList.length * (this.TW + 15) + 20, width)
      this.thumbCanvas.height = this.options.thumbnailHeight

      this.toolbarContainer.style.width = width + 'px'
    } else {
      this.container.style.width = this.options.width + 'px'
      this.container.style.height = this.options.height + 'px'
      this.container.style.position = 'relative'
      this.container.style.top = 'auto'
      this.container.style.left = 'auto'
      this.container.style.zIndex = 'auto'

      this.mainCanvas.width = this.options.width
      this.mainCanvas.height = this.options.height - this.options.thumbnailHeight - this.options.toolbarHeight

      this.thumbScrollContainer.style.width = this.options.width + 'px'
      this.thumbCanvas.width = Math.max(this.imageList.length * (this.TW + 15) + 20, this.options.width)
      this.thumbCanvas.height = this.options.thumbnailHeight

      this.toolbarContainer.style.width = this.options.width + 'px'
    }

    if (this.imageList.length > 0) {
      this.renderThumbnails()
      if (this.isFitMode) {
        this.fitToScreen()
      } else {
        this.resetView()
      }
    }
  }

  public destroy() {
    this.container.innerHTML = ''
    this.imageList = []
    this.imageState = { scale: 1, x: 0, y: 0, rotation: 0 }
  }
}