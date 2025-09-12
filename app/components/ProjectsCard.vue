<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="card p-6">
    <div class="flex gap-4 items-center">
      <Icon name="streamline:database-remix" class="text-neutral-400 dark:text-black icon" />
      <p class="text-neutral-400 dark:text-black text-[14px] font-jbmono">projects.json</p>
    </div>
    <div class="flex w-full mt-2">
      <NuxtLink to="/projects" class="tile">
        <div class="grid sm:flex gap-3 items-center">
          <Icon name="ci:text-align-left" class="text-neutral-400 dark:text-black icon" />
          <p class="font-semibold text-neutral-200 dark:text-black font-raleway">{{ t('projects.allProjects') }}</p>
        </div>
        <p class="text-neutral-400 dark:text-black text-[14px] text-pretty font-jbmono">
          {{ t('projects.allProjectsSub') }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>