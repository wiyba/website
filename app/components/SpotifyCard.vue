<script setup lang="ts">
const { track, tCurrent, tDuration, progressPct, accentStyle } = useSpotify()
</script>

<template>
  <div class="card h-full w-full lg:col-span-3" :style="accentStyle">
    <div class="flex gap-4 items-center">
      <Icon name="streamline:database-remix" class="text-neutral-400 dark:text-black icon" />
      <p class="text-neutral-400 dark:text-black text-[14px] font-jbmono">spotify.json</p>
    </div>

    <div class="flex gap-5 items-center mt-3">
      <div class="relative w-[80px] h-[80px] ml-1 shrink-0">
        <img v-if="track.image" :src="track.image"
          class="absolute inset-0 w-[80px] h-[80px] rounded-lg hover:shadow-2xl smooth hover:scale-[103%] active:scale-[107%] cursor-grab active:cursor-grabbing z-10"
          href="https://wiyba.org/" />
        <div v-if="track.image"
          class="absolute inset-[-12px] rounded-[14px] blur-[24px] opacity-60 pointer-events-none z-0"
          :style="{ background: 'var(--accent-glow)' }" />
        <div v-else class="absolute inset-0 w-[80px] h-[80px] rounded-lg bg-[#111111] flex items-center justify-center">
          <Icon name="iconoir:media-video" size="38" class="text-[#404040] dark:text-black icon" />
        </div>
      </div>

      <div class="grid gap-2">
        <a :href="track.trackId ? `https://open.spotify.com/track/${track.trackId}` : undefined" target="_blank"
          rel="noopener noreferrer"
          class="text-neutral-200 dark:text-black font-semibold text-lg font-raleway leading-snug"
          :class="!track.trackId && 'pointer-events-none cursor-default'">
          {{ track.title }}
        </a>
        <p class="text-neutral-400 dark:text-black text-sm font-jbmono leading-snug">{{ track.artist }}</p>

        <div class="mt-2 flex items-center gap-3 select-none">
          <span class="text-neutral-400 dark:text-black text-[12px] font-jbmono leading-em min-w-[3.5ch] text-right">{{
            tCurrent }}</span>
          <div class="timeline progress-rail relative rounded-full overflow-visible">
            <div class="progress-glow absolute inset-y-[-6px] left-0 rounded-full pointer-events-none"
              :style="{ width: progressPct + '%' }" />
            <div class="progress-fill absolute inset-y-0 left-0 rounded-full will-change-[width]"
              :style="{ width: progressPct + '%' }" />
          </div>
          <span class="text-neutral-400 dark:text-black text-[12px] font-jbmono leading-em min-w-[4.2ch]">{{ tDuration
            }}</span>
        </div>
      </div>
    </div>
  </div>
</template>