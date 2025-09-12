import { ref, onMounted, nextTick } from 'vue'

export function useUiReady(delay = 200) {
  const uiReady = ref(false)
  onMounted(async () => {
    await nextTick()
    setTimeout(() => { uiReady.value = true }, delay)
  })
  return { uiReady }
}
