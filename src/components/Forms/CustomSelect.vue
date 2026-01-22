<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Selecione'
  }
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const root = ref(null)

const selectedLabel = computed(() => {
  return props.options.find(o => o.value === props.modelValue)?.label
    || props.placeholder
})

const select = (option) => {
  emit('update:modelValue', option.value)
  open.value = false
}

// fecha ao clicar fora
const clickOutside = (e) => {
  if (root.value && !root.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', clickOutside))
onBeforeUnmount(() => document.removeEventListener('click', clickOutside))
</script>

<template>
  <div ref="root" class="custom-select">
    <div class="custom-select-trigger" @click="open = !open">
      <span>{{ selectedLabel }}</span>
      <span class="arrow" :class="{ open }">▾</span>
    </div>

    <ul v-if="open" class="custom-options">
      <li
        v-for="option in options"
        :key="option.value"
        :class="{ active: option.value === modelValue }"
        @click="select(option)"
      >
        <span> {{ option.label }} </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  font-size: 0.85rem;
  min-width: 100px;
}

.custom-select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0.6rem 0.8rem;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

.custom-select-trigger:hover {
  background: rgba(255,255,255,0.08);
}

.arrow {
  transition: transform 0.2s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

ul{
    list-style: none;
    margin: 0;
    padding: 0;
}

.custom-options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: #111;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 4px;
  z-index: 200;
  overflow: hidden;
}

.custom-options li {
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  color: #fff;
}

.custom-options li:hover {
  background: #222;
}

.custom-options li.active {
  background: #333;
}
</style>
