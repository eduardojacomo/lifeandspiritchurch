import { reactive } from 'vue'

let _toastsStore

function createToastStore() {
  const state = reactive({
    items: [] // Renomeado para evitar confusão com o nome da função
  })

  const remove = (id) => {
    const index = state.items.findIndex(t => t.id === id)
    if (index > -1) state.items.splice(index, 1)
  }

  const push = ({ message, type = 'info', duration = 5000 }) => {
    const id = Date.now() + Math.random()
    
    state.items.push({ id, message, type })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  return { state, push, remove }
}

export function useToast() {
  if (!_toastsStore) {
    _toastsStore = createToastStore()
  }

  return {
    // Retornamos o estado reativo diretamente
    toasts: _toastsStore.state.items, 
    success: (msg) => _toastsStore.push({ message: msg, type: 'success' }),
    error: (msg) => _toastsStore.push({ message: msg, type: 'error', duration: 7000 }),
    warning: (msg) => _toastsStore.push({ message: msg, type: 'warning' }),
    info: (msg) => _toastsStore.push({ message: msg, type: 'info' }),
    remove: _toastsStore.remove
  }
}