import { computed, ref, watchEffect, onMounted, onUnmounted, nextTick } from 'vue'
import type { SpotifyResponse, SpotifyTrack } from '~/types'
import { clamp, fmtTime } from '~/utils/format'
import { defaultAccent, rgbToStyle, pickDominantColor, type RGB } from '~/utils/color'

type PublicTrack = {
  isActive: boolean
  playing: boolean
  trackId: string
  title: string
  artist: string
  duration: number
  image: string
  progress: number
}

export function useSpotify() {
  const apiBase = (useRuntimeConfig().public?.apiBase as string) || 'http://localhost:8000'

  const { data, refresh } = useAsyncData<SpotifyResponse>('spotify', () =>
    $fetch('/spotify', { baseURL: apiBase }),
    { server: false, immediate: true }
  )

  const raw = computed<SpotifyResponse>(() => data.value ?? { is_active: false, track: null })

  const track = computed<PublicTrack>(() => {
    const t = raw.value.track
    return {
      isActive: raw.value.is_active ?? false,
      playing: t?.is_playing ?? false,
      trackId: t?.track_id || '',
      title: t?.title || 'Сейчас ничего не играет',
      artist: t?.artist || 'Тут мог быть классный исполнитель',
      duration: t?.duration || 0,
      image: t?.image || '',
      progress: t?.progress || 0,
    }
  })

  // ——— лайв-прогресс между пуллами
  const baseProgressMs = ref(0)
  const lastSyncTs = ref(0)
  const tick = ref(0)

  const serverProgress = computed(() => (track.value.isActive && track.value.progress) || 0)

  watchEffect(() => {
    baseProgressMs.value = serverProgress.value || 0
    lastSyncTs.value = Date.now()
  })

  let visTimer: number | undefined
  onMounted(() => {
    visTimer = window.setInterval(() => { tick.value++ }, 200)
  })
  onUnmounted(() => { if (visTimer) clearInterval(visTimer) })

  const liveProgressMs = computed(() => {
    tick.value
    const dur = track.value.duration || 0
    if (!track.value.isActive) return 0
    if (!track.value.playing) return Math.min(baseProgressMs.value, dur)
    const elapsed = Date.now() - lastSyncTs.value
    return Math.min(baseProgressMs.value + elapsed, dur)
  })

  const progressPct = computed(() => {
    const d = track.value.duration || 0
    if (d <= 0) return 0
    return clamp((liveProgressMs.value / d) * 100, 0, 100)
  })

  const tCurrent = computed(() => track.value.duration > 0 ? fmtTime(liveProgressMs.value) : '0:00')
  const tDuration = computed(() => track.value.duration > 0 ? fmtTime(track.value.duration) : '0:00')

  let pollTimer: number | undefined
  let inFlight = false
  async function pollOnce() {
    if (inFlight) return
    inFlight = true
    try { await refresh() } finally { inFlight = false }
  }
  function loop() {
    pollOnce()
    pollTimer = window.setTimeout(loop, 1100)
  }
  onMounted(() => { loop() })
  onUnmounted(() => { if (pollTimer) clearTimeout(pollTimer) })

  const lastForced = ref(0)
  watchEffect(() => {
    const dur = track.value.duration || 0
    if (!track.value.playing || dur <= 0) return
    const remain = dur - liveProgressMs.value
    if (remain <= 600 && Date.now() - lastForced.value > 1500) {
      pollOnce()
      lastForced.value = Date.now()
    }
  })

  const accent = ref<RGB>(defaultAccent)
  const accentStyle = computed(() => rgbToStyle(accent.value))
  const uiReady = ref(false)

  watchEffect(async () => {
    if (!import.meta.client) return
    if (!track.value.image) { accent.value = defaultAccent; return }
    accent.value = await pickDominantColor(track.value.image)
  })

  onMounted(async () => {
    await nextTick()
    setTimeout(() => { uiReady.value = true }, 200)
  })

  const progressWidth = computed(() => uiReady.value ? `${progressPct.value}%` : '0%')
  const progressOn = computed(() => uiReady.value && !!track.value.image)

  return {
    track,
    tCurrent, tDuration,
    progressPct, progressWidth, progressOn,
    accentStyle,
  }
}
