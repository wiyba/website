<script setup lang="ts">
const { weatherTextRU, weatherTextEN, weatherTempRU, weatherTempEN } = useWeather()
const { locale } = useI18n()

const isRU = computed(() => locale.value === 'ru')
const weatherText = computed(() => (isRU.value ? weatherTextRU.value : weatherTextEN.value))
const weatherTemp = computed(() => (isRU.value ? `${weatherTempRU.value} °C` : `${weatherTempEN.value} °F`))
</script>

<template>
  <div class="card flex-auto">
    <div class="flex gap-3 items-center">
      <Icon name="streamline:database-remix" class="text-neutral-400 dark:text-black icon" />
      <p class="text-neutral-400 dark:text-black text-[14px] font-jbmono">weather.json</p>
    </div>
    <p class="text-[#dcdcdc] dark:text-black text-[14px] sm:text-base font-jbmono">
      {{ weatherText }}
      <span class="text-[12px] sm:text-[14px] opacity-60"><br />{{ weatherTemp }}</span>
    </p>
  </div>
</template>
