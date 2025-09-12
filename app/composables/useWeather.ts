import { computed, onMounted, onUnmounted } from 'vue'
import type { WeatherResponse } from '~/types'

export function useWeather() {
  const apiBase = (useRuntimeConfig().public?.apiBase as string) || 'http://localhost:8000'

  const { data, refresh } = useAsyncData<WeatherResponse>('weather', () =>
    $fetch('/weather', { baseURL: apiBase }),
    { server: false, immediate: true }
  )

  let t: number | undefined
  onMounted(() => {
    refresh()
    t = window.setInterval(refresh, 60_000)
  })
  onUnmounted(() => { if (t) clearInterval(t) })

  const weatherTextRU = computed(() => {
    const d = data.value?.description_ru ?? ''
    return d ? d[0].toUpperCase() + d.slice(1) : '—'
  })
  const weatherTextEN = computed(() => {
    const d = data.value?.description_en ?? ''
    return d ? d[0].toUpperCase() + d.slice(1) : '—'
  })
  const weatherTempRU = computed(() => {
    const v = data.value?.temp
    return v == null ? '—' : v.toFixed(1)
  })
  const weatherTempEN = computed(() => {
  const c = parseFloat(weatherTempRU.value)
  return Number.isFinite(c) ? ((c * 9) / 5 + 32).toFixed(1) : '—'
  })

  return { weatherTextRU, weatherTextEN, weatherTempRU, weatherTempEN }
}
