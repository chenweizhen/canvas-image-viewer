import { useRef, useEffect, useState } from 'react'
import { ImageViewer } from 'canvas-image-viewer'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<ImageViewer | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageCount, setImageCount] = useState(0)

  const imageList = [
    'https://picsum.photos/id/1018/800/600',
    'https://picsum.photos/id/1015/200/400',
    'https://picsum.photos/id/1019/400/400',
    'https://picsum.photos/id/1016/200/700',
    'https://picsum.photos/id/1021/200/500',
    'https://picsum.photos/id/1018/2800/2600',
    'https://picsum.photos/id/1015/200/400',
    'https://picsum.photos/id/1019/400/400',
    'https://picsum.photos/id/1016/200/700',
    'https://picsum.photos/id/1021/200/500'
  ]

  const handlePrev = () => {
    if (viewerRef.current) {
      viewerRef.current.prev()
      setCurrentIndex(viewerRef.current.getCurrentIndex())
    }
  }

  const handleNext = () => {
    if (viewerRef.current) {
      viewerRef.current.next()
      setCurrentIndex(viewerRef.current.getCurrentIndex())
    }
  }

  const handleRotate = () => {
    if (viewerRef.current) {
      viewerRef.current.rotate()
    }
  }

  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.resetView()
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      viewerRef.current = new ImageViewer({
        container: containerRef.current,
        imageList: imageList,
        width: 1000,
        height: 650,
        onDelete: (index) => {
          console.log(index)
          viewerRef.current?.removeImage(index)
          // 用户自定义删除逻辑（如发送API请求）
          // fetch(`/api/images/${index}`, { method: 'DELETE' })
          //   .then(() => {
          //     // 删除成功后调用内置方法更新UI
          //     viewerRef.current?.removeImage(index)
          //   })
        }
      })
      setImageCount(viewerRef.current.getImageCount())
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [])

  return (
    <>
      <div className="header">Canvas Image Viewer - React</div>

      <div className="info">Image {currentIndex + 1} of {imageCount}</div>

      <div className="controls">
        <button className="btn btn-primary" onClick={handlePrev}>Previous</button>
        <button className="btn btn-primary" onClick={handleNext}>Next</button>
        <button className="btn btn-secondary" onClick={handleRotate}>Rotate</button>
        <button className="btn btn-secondary" onClick={handleReset}>Reset View</button>
      </div>

      <div ref={containerRef} className="viewer-container"></div>
    </>
  )
}

export default App
