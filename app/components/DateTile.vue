<script setup lang="ts">
const { now } = useClock()
const { t, d } = useI18n()
</script>

<template>
  <div class="card">
    <div class="flex gap-3 items-center">
      <Icon name="uil:brackets-curly" class="text-neutral-400 dark:text-black icon" />
      <p class="text-neutral-400 dark:text-black text-[14px] font-jbmono">date.ts</p>
    </div>

    <p class="text-[#dcdcdc] dark:text-black text-[14px] sm:text-base font-jbmono">
      {{ d(now, { day: 'numeric', month: 'long', timeZone: 'Europe/Moscow' }) }}
      <span class="text-[12px] sm:text-[14px] opacity-60">
        <br />{{ t('date.yearLine', { y: d(now, { year: 'numeric', timeZone: 'Europe/Moscow' }) }) }}
      </span>
    </p>
  </div>
</template>
