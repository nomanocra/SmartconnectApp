<template>
  <div class="resizable-container" :class="`resizable-container-${grabPosition}`">
    <div ref="resizableRef" class="resizable-section" :style="resizableStyle">
      <slot></slot>
    </div>
    <div
      ref="handleRef"
      class="resizable-section-handle"
      :class="handleClass"
      @mousedown="handleMouseDown"
      @touchstart="handleTouchStart"
      role="separator"
      :aria-label="getAriaLabel()"
      tabindex="0"
      @keydown="handleKeyDown"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

// Props
const props = defineProps({
  grabPosition: {
    type: String,
    default: 'right',
    validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value),
  },
  minSize: {
    type: Number,
    default: 200,
  },
  maxSize: {
    type: Number,
    default: 500,
  },
  defaultSize: {
    type: Number,
    default: 300,
  },
})

const emit = defineEmits(['size-updated'])

// Refs
const resizableRef = ref(null)
const handleRef = ref(null)
const currentSize = ref(props.defaultSize)
const isDragging = ref(false)
const startPos = ref({ x: 0, y: 0 })
const startSize = ref(0)

// Computed
const resizableStyle = computed(() => {
  const size = `${currentSize.value}px`
  const isHorizontal = props.grabPosition === 'left' || props.grabPosition === 'right'
  return isHorizontal ? { width: size } : { height: size }
})

const handleClass = computed(() => ({
  [`resizable-handle--${props.grabPosition}`]: true,
}))

// Methods
const getAriaLabel = () => {
  const labels = {
    top: 'Redimensionner vers le haut',
    right: 'Redimensionner vers la droite',
    bottom: 'Redimensionner vers le bas',
    left: 'Redimensionner vers la gauche',
  }
  return labels[props.grabPosition] || 'Redimensionner'
}

const getCursorStyle = () => {
  const cursors = {
    top: 'ns-resize',
    right: 'ew-resize',
    bottom: 'ns-resize',
    left: 'ew-resize',
  }
  return cursors[props.grabPosition] || 'ew-resize'
}

const handleMouseDown = (event) => {
  event.preventDefault()
  startDragging(event.clientX, event.clientY)
}

const handleTouchStart = (event) => {
  event.preventDefault()
  const touch = event.touches[0]
  startDragging(touch.clientX, touch.clientY)
}

const startDragging = (clientX, clientY) => {
  isDragging.value = true
  startPos.value = { x: clientX, y: clientY }
  startSize.value = currentSize.value

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', stopDragging)
  document.addEventListener('touchmove', handleTouchMove)
  document.addEventListener('touchend', stopDragging)

  // Prevent text selection during drag
  document.body.style.userSelect = 'none'
  document.body.style.cursor = getCursorStyle()
}

const handleMouseMove = (event) => {
  if (!isDragging.value) return
  updateSize(event.clientX, event.clientY)
}

const handleTouchMove = (event) => {
  if (!isDragging.value) return
  event.preventDefault()
  const touch = event.touches[0]
  updateSize(touch.clientX, touch.clientY)
}

const updateSize = (clientX, clientY) => {
  const isHorizontal = props.grabPosition === 'left' || props.grabPosition === 'right'
  const isInverted = props.grabPosition === 'left' || props.grabPosition === 'top'

  const delta = isHorizontal ? clientX - startPos.value.x : clientY - startPos.value.y

  const adjustedDelta = isInverted ? -delta : delta
  const newSize = startSize.value + adjustedDelta
  currentSize.value = Math.max(props.minSize, Math.min(props.maxSize, newSize))
}

const stopDragging = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopDragging)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', stopDragging)

  // Restore normal cursor and text selection
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
  emit('size-updated', currentSize.value)
}

const handleKeyDown = (event) => {
  const step = 10
  let newSize = currentSize.value
  const isInverted = props.grabPosition === 'left' || props.grabPosition === 'top'

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      newSize += isInverted ? -step : step
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      newSize += isInverted ? step : -step
      break
    case 'Home':
      event.preventDefault()
      newSize = props.minSize
      break
    case 'End':
      event.preventDefault()
      newSize = props.maxSize
      break
    default:
      return
  }

  currentSize.value = Math.max(props.minSize, Math.min(props.maxSize, newSize))
}

// Lifecycle
onUnmounted(() => {
  stopDragging()
})
</script>

<style scoped>
.resizable-container {
  display: flex;
  overflow: hidden;
  transition: none; /* Disable transitions during resize for smooth dragging */
}

.resizable-container-left {
  flex-direction: row-reverse;
}

.resizable-container-right {
  flex-direction: row;
}

.resizable-container-top {
  flex-direction: column-reverse;
}

.resizable-container-bottom {
  flex-direction: column;
}

.resizable-section {
  overflow: hidden;
}

.resizable-section-handle {
  transition: background-color 0.2s ease;
  z-index: 10;
}

.resizable-handle--right {
  width: 4px;
  height: 100%;
  cursor: ew-resize;
}

.resizable-handle--left {
  width: 4px;
  height: 100%;
  cursor: ew-resize;
}

.resizable-handle--bottom {
  height: 4px;
  width: 100%;
  cursor: ns-resize;
}

.resizable-handle--top {
  height: 4px;
  width: 100%;
  cursor: ns-resize;
}

.resizable-section-handle:hover {
  background-color: var(--p-border-lvl0);
}

.resizable-section-handle:active {
  background-color: var(--p-border-lvl1);
  user-select: none; /* Prevent text selection during drag */
}

/* Touch device optimizations */
@media (hover: none) {
  .resizable-section-handle {
    background-color: var(--p-border-lvl0);
    opacity: 0.6;
  }

  .resizable-handle--right,
  .resizable-handle--left {
    width: 8px;
  }

  .resizable-handle--bottom,
  .resizable-handle--top {
    height: 8px;
  }
}
</style>
