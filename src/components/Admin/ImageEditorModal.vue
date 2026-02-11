<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  image: { type: Object, required: true },
  show: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'confirm'])

/* ======================  State ====================== */
const canvas = ref(null)
const selectedType = ref('desktop')
const scale = ref(.1)
const offsetX = ref(0)
const offsetY = ref(0)

let imgObj = null
let isDragging = false
let lastX = 0
let lastY = 0
const moveStep = 10 // Aumentado para um movimento mais perceptível

/* ====================== Helpers ====================== */
const getCanvasSizeByType = (type) => {
  if (type === 'desktop') return { width: 800, height: 450 }
  if (type === 'mobile') return { width: 360, height: 640 }
  if (type === 'original' && imgObj) {
    return { width: imgObj.naturalWidth, height: imgObj.naturalHeight }
  }
  return { width: 800, height: 450 }
}

/* ======================  Canvas Logic ====================== */
const draw = () => {
  if (!canvas.value || !imgObj) return
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.drawImage(
    imgObj,
    offsetX.value,
    offsetY.value,
    imgObj.width * scale.value,
    imgObj.height * scale.value
  )
}

const setType = async (type) => {
  selectedType.value = type
  await nextTick()

  const cvs = canvas.value
  if (!cvs) return

  imgObj = new Image()
  imgObj.src = props.image.preview

  imgObj.onload = () => {
    const { width, height } = getCanvasSizeByType(type)
    const maxW = window.innerWidth * 0.8
    const maxH = window.innerHeight * 0.6 // Reduzido um pouco para dar espaço aos botões
    const viewScale = Math.min(maxW / width, maxH / height, 1)

    cvs.width = width * viewScale
    cvs.height = height * viewScale

    if (type === 'original') {
      scale.value = viewScale
      offsetX.value = 0
      offsetY.value = 0
    } else {
      scale.value = Math.max(cvs.width / imgObj.width, cvs.height / imgObj.height)
      offsetX.value = (cvs.width - imgObj.width * scale.value) / 2
      offsetY.value = (cvs.height - imgObj.height * scale.value) / 2
    }
    draw()
  }
}

/* ====================== Interactions ====================== */
const zoom = (factor) => {
  scale.value *= factor
  draw()
}

const move = (x, y) => {
  offsetX.value += x
  offsetY.value += y
  draw()
}

const onWheel = (e) => {
  e.preventDefault()
  zoom(e.deltaY < 0 ? 1.1 : 0.9)
}

const startDrag = (e) => {
  isDragging = true
  lastX = e.offsetX
  lastY = e.offsetY
}

const drag = (e) => {
  if (!isDragging) return
  move(e.offsetX - lastX, e.offsetY - lastY)
  lastX = e.offsetX
  lastY = e.offsetY
}

const endDrag = () => { isDragging = false }

/* ====================== Actions ====================== */
const confirmEdit = () => {
  const displayCanvas = canvas.value
  const tempCanvas = document.createElement('canvas')
  const ctx = tempCanvas.getContext('2d')
  const target = getCanvasSizeByType(selectedType.value)

  tempCanvas.width = target.width
  tempCanvas.height = target.height

  // Proporção entre o canvas real e o que o usuário vê na tela
  const ratio = target.width / displayCanvas.width

  ctx.drawImage(
    imgObj,
    offsetX.value * ratio,
    offsetY.value * ratio,
    imgObj.width * scale.value * ratio,
    imgObj.height * scale.value * ratio
  )

  emit('confirm', {
    preview: tempCanvas.toDataURL('image/webp', 0.8),
    name: props.image.name.replace(/\.[^/.]+$/, '') + '.webp',
    type: selectedType.value
  })
  emit('close')
}

watch(() => props.show, (val) => {
  if (val) setType('desktop')
})
</script>

<template>
  <div v-if="show" class="modal">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')">✖</button>

      <div class="image-area">
        <div class="canvas-container">
          <div class="canvas-wrapper">
            <canvas
              ref="canvas"
              @mousedown="startDrag"
              @mousemove="drag"
              @mouseup="endDrag"
              @mouseleave="endDrag"
              @wheel="onWheel"
            />
          </div>
        </div>

        <div class="image-actions">
          <div class="editor-controls">
            <div class="control-group">
              <button class="control-btn" @click="zoom(1.1)" title="Zoom In">+</button>
              <button class="control-btn" @click="zoom(0.9)" title="Zoom Out">−</button>
            </div>

            <div class="control-group">
              <button class="control-btn" @click="move(0, -moveStep)">↑</button>
              <button class="control-btn" @click="move(-moveStep, 0)">←</button>
              <button class="control-btn" @click="move(moveStep, 0)">→</button>
              <button class="control-btn" @click="move(0, moveStep)">↓</button>
            </div>
          </div>

          <div class="type-selector">
            <button :class="{ active: selectedType === 'desktop' }" @click="setType('desktop')">
              Desktop (16:9)
            </button>
            <button :class="{ active: selectedType === 'mobile' }" @click="setType('mobile')">
              Mobile (9:16)
            </button>
            <button :class="{ active: selectedType === 'original' }" @click="setType('original')">
              Original
            </button>
          </div>

          <button class="btn-save-edit" @click="confirmEdit">
            Confirmar Edição
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* novo */
/* Overlay do modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.8); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}


.modal-content {
  background: #000; /* fundo preto */
  padding: 2rem;
  border-radius: 8px;
  position: relative;
  width: 80%;
  max-width: 900px;
  text-align: center;
  color: #fff;
  max-height: 95vh;
}

/* Botão fechar */
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #fff;
  cursor: pointer;
}

/* Botões Desktop/Mobile */
.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  /* margin-top: 2rem; */
}

.modal-buttons button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #444;
  color: #fff;
  transition: background 0.3s;
}

.modal-buttons button:hover {
  background: #666;
}

/* Área da imagem + botões abaixo */
.image-area {
  margin-top: .5rem;
}

.image-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.image-actions button {
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #444;
  color: #fff;
}

.canvas-container {
  max-height: 80vh;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.canvas-wrapper {
  position: relative;
  border: 2px dashed rgba(255,255,255,0.5);
  /* padding: 4px; */
  max-height: 80vh;
  max-width: 100%;
}

.canvas-wrapper canvas {
  display: block;
  max-height: 80vh;
  max-width: 100%;
  height: auto;
  width: auto;
}

canvas {
  display: block;
  background: #111;
  cursor: grab;
}

canvas:active {
  cursor: grabbing;
}

.editor-controls {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  /* margin-top: 1.5rem; */
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  width: 30px;
  height: 30px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  background: #333;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.control-btn:hover {
  background: #555;
}

.control-btn:active {
  transform: scale(0.95);
}

.type-selector button.active {
  background-color: var(--cor-azul-medio);
  color: white;
  border-color: transparent;
}

.type-selector{
    display: flex;
    flex-direction: row;
    gap: .5rem;
}
</style>