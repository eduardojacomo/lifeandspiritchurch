<template>
  <div class="image-area">
    <div class="canvas-container">
      <div class="canvas-wrapper">
        <canvas
          ref="canvasEditor"
          @mousedown="startDrag"
          @mousemove="drag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
          @wheel="onWheel"
        />
      </div>
    </div>

    <div class="image-actions-panel">
      <div class="editor-controls">
        <div class="control-group">
          <button class="control-btn" @click="zoomIn">+</button>
          <button class="control-btn" @click="zoomOut">−</button>
        </div>
        <div class="control-group">
          <button class="control-btn" @click="moveUp">↑</button>
          <button class="control-btn" @click="moveLeft">←</button>
          <button class="control-btn" @click="moveRight">→</button>
          <button class="control-btn" @click="moveDown">↓</button>
        </div>
      </div>

      <div class="footer-actions">
        <button class="btn-cancel-edit" @click="$emit('cancel')">
          Cancelar
        </button>
        <button class="btn-save-edit" @click="saveEditedImage">
          Confirmar Edição
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'


const props = defineProps({
  imageSrc: { type: String, required: true },
  editType: {
    type: String,
    default: 'custom', // mobile | desktop | custom
    validator: v => ['mobile', 'desktop', 'custom'].includes(v)
  }
})

const emit = defineEmits(['confirm', 'cancel'])


const canvasEditor = ref(null)
const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const moveStep = 10

let imgObj = new Image()
let isDragging = false
let lastX = 0
let lastY = 0


const getCanvasSizeByType = (type) => {
  if (type === 'desktop') return { width: 1920, height: 1080 }
  if (type === 'mobile') return { width: 1080, height: 1920 }
  return { width: imgObj.width, height: imgObj.height }
}


const draw = () => {
  const canvas = canvasEditor.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.drawImage(
    imgObj,
    offsetX.value,
    offsetY.value,
    imgObj.width * scale.value,
    imgObj.height * scale.value
  )
}

const applyType = () => {
  const canvas = canvasEditor.value
  if (!canvas || !imgObj.width) return

  const { width, height } = getCanvasSizeByType(props.editType)

  const maxHeight = window.innerHeight * 0.5
  const maxWidth = window.innerWidth * 0.7
  const scaleView = Math.min(maxWidth / width, maxHeight / height, 1)

  canvas.width = width * scaleView
  canvas.height = height * scaleView

  if (props.editType === 'custom') {
    scale.value = scaleView
    offsetX.value = 0
    offsetY.value = 0
  } else {
    scale.value = Math.max(
      canvas.width / imgObj.width,
      canvas.height / imgObj.height
    )
    offsetX.value = (canvas.width - imgObj.width * scale.value) / 2
    offsetY.value = (canvas.height - imgObj.height * scale.value) / 2
  }

  draw()
}


const onWheel = (e) => {
  e.preventDefault()
  scale.value *= e.deltaY < 0 ? 1.05 : 0.95
  draw()
}

const startDrag = (e) => {
  isDragging = true
  lastX = e.offsetX
  lastY = e.offsetY
}

const drag = (e) => {
  if (!isDragging) return
  offsetX.value += e.offsetX - lastX
  offsetY.value += e.offsetY - lastY
  lastX = e.offsetX
  lastY = e.offsetY
  draw()
}

const endDrag = () => (isDragging = false)

const zoomIn = () => { scale.value *= 1.1; draw() }
const zoomOut = () => { scale.value *= 0.9; draw() }
const moveUp = () => { offsetY.value -= moveStep; draw() }
const moveDown = () => { offsetY.value += moveStep; draw() }
const moveLeft = () => { offsetX.value -= moveStep; draw() }
const moveRight = () => { offsetX.value += moveStep; draw() }


const saveEditedImage = () => {
  const displayCanvas = canvasEditor.value
  const tempCanvas = document.createElement('canvas')
  const ctx = tempCanvas.getContext('2d')

  const targetSize = getCanvasSizeByType(props.editType)
  tempCanvas.width = targetSize.width
  tempCanvas.height = targetSize.height

  const ratio = targetSize.width / displayCanvas.width

  ctx.drawImage(
    imgObj,
    offsetX.value * ratio,
    offsetY.value * ratio,
    imgObj.width * scale.value * ratio,
    imgObj.height * scale.value * ratio
  )

  tempCanvas.toBlob(blob => {
    emit('confirm', {
      blob,
      preview: URL.createObjectURL(blob),
      type: props.editType
    })
  }, 'image/webp', 0.85)
}

onMounted(() => {
  imgObj.src = props.imageSrc
  imgObj.onload = applyType
})

watch(() => props.editType, applyType)
</script>

<style scoped>
.image-area { display: flex; flex-direction: column; align-items: center; }
.canvas-container { background: #000; padding: 10px; border-radius: 8px; border: 1px solid #333; width: 100%; display: flex; justify-content: center; }
.canvas-wrapper { position: relative; cursor: grab; border: 3px dashed var(--color-text);}
.canvas-wrapper:active { cursor: grabbing; }
.image-actions-panel { width: 100%; margin-top: 20px; display: flex; flex-direction: column; gap: 15px; }
.editor-controls { display: flex; justify-content: center; gap: 20px; }
.control-group { display: flex; gap: 5px; }
.control-btn { width: 32px; height: 32px; background: #222; color: #fff; border: 1px solid #444; border-radius: 4px; cursor: pointer; }
.type-selector { display: flex; justify-content: center; gap: 8px; }
.type-selector button { padding: 8px 12px; background: #222; border: 1px solid #444; color: #999; border-radius: 6px; cursor: pointer; font-size: 12px; }
.type-selector button.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }
.footer-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; border-top: 1px solid #222; padding-top: 15px; }
.btn-save-edit { background: #fff; color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }
.btn-cancel-edit { background: transparent; color: #666; border: none; cursor: pointer; }
</style>