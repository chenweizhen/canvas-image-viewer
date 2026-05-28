<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ImageViewer } from '@mk/canvas-image-viewer'

const containerRef = ref<HTMLElement | null>(null)
let viewer: ImageViewer | null = null

const currentIndex = ref(0)
const imageCount = ref(0)

const imageList = [
  'https://picsum.photos/id/1018/800/600',
  'https://picsum.photos/id/1015/800/600',
  'https://picsum.photos/id/1019/800/600',
  'https://picsum.photos/id/1016/800/600',
  'https://picsum.photos/id/1021/800/600'
]

const handlePrev = () => {
  if (viewer) {
    viewer.prev()
    currentIndex.value = viewer.getCurrentIndex()
  }
}

const handleNext = () => {
  if (viewer) {
    viewer.next()
    currentIndex.value = viewer.getCurrentIndex()
  }
}

const handleRotate = () => {
  if (viewer) {
    viewer.rotate()
  }
}

const handleReset = () => {
  if (viewer) {
    viewer.resetView()
  }
}

onMounted(() => {
  if (containerRef.value) {
    viewer = new ImageViewer({
      container: containerRef.value,
      imageList: imageList,
      width: 1000,
      height: 650,
      thumbnailHeight: 120
    })
    imageCount.value = viewer.getImageCount()
  }
})

onUnmounted(() => {
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
})
</script>

<template>
  <div class="header">Canvas Image Viewer - Vue3</div>
  
  <div class="info">Image {{ currentIndex + 1 }} of {{ imageCount }}</div>
  
  <div class="controls">
    <button class="btn btn-primary" @click="handlePrev">Previous</button>
    <button class="btn btn-primary" @click="handleNext">Next</button>
    <button class="btn btn-secondary" @click="handleRotate">Rotate</button>
    <button class="btn btn-secondary" @click="handleReset">Reset View</button>
  </div>
  
  <div ref="containerRef" class="viewer-container"></div>
</template>
