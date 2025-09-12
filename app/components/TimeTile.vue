<script setup lang="ts">
const { now } = useClock()
</script>

<template>
  <div class="card">
    <div class="flex gap-3 items-center">
      <Icon name="uil:brackets-curly" class="text-neutral-400 dark:text-black icon" />
      <p class="text-neutral-400 dark:text-black text-[14px] font-jbmono">time.ts</p>
    </div>
    <p class="text-[#dcdcdc] dark:text-black text-[16px] sm:text-base font-jbmono">
      {{ now.toLocaleTimeString('ru-RU', { hour12: false, timeZone: 'Europe/Moscow' }) }}
      <span class="text-[12px] sm:text-[14px] opacity-60"><br />UTC+3</span>
    </p>
  </div>
</template>
