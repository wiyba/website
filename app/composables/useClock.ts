import { ref, onMounted, onUnmounted } from 'vue'

export function useClock() {
  const now = ref(new Date())
  let timer: number | undefined

  onMounted(() => {
    timer = window.setInterval(() => { now.value = new Date() }, 1000)
  })
  onUnmounted(() => { if (timer) clearInterval(timer) })

  return { now }
}
