<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="card p-6">
    <div class="flex gap-4 items-center">
      <Icon name="material-symbols:book-2" class="text-neutral-400 dark:text-black icon" />
      <p class="text-neutral-400 dark:text-black text-[14px] font-jbmono">skills.md</p>
    </div>

    <div class="grid items-start">
      <h1 class="text-neutral-200 dark:text-black font-semibold text-xl font-raleway ml-0.5 mb-1">{{ t('skills.title') }}
      </h1>
    </div>

    <div class="grid gap-8 lg:grid-cols-3 w-full">
      <div class="skill-card">
        <div class="flex gap-3 items-center">
          <Icon name="mdi:language-python" class="icon" />
          <p>Python</p>
        </div>
        <div class="flex gap-4 items-center relative">
          <svg height="14" width="14" xmlns="http://www.w3.org/2000/svg" class="text-emerald-500" fill="currentColor">
            <circle r="3" cx="7" cy="7" />
          </svg>
          <p class="text-[13px] text-emerald-500">{{ t('skills.inUse') }}</p>
          <div class="ellipsis-animation absolute left-[-16px]">
            <div class="size-12 rounded-full blur-[60px] opacity-60 bg-emerald-500"></div>
          </div>
        </div>
      </div>

      <div class="skill-card">
        <div class="flex gap-3 items-center">
          <Icon name="uim:vuejs" class="icon" />
          <p>Vue</p>
        </div>
        <div class="flex gap-4 items-center relative">
          <svg height="14" width="14" xmlns="http://www.w3.org/2000/svg" class="text-teal-500" fill="currentColor">
            <circle r="3" cx="7" cy="7" />
          </svg>
          <p class="text-[13px] text-teal-500">{{ t('skills.inProgress') }}</p>
          <div class="ellipsis-animation absolute left-[-16px]">
            <div class="size-12 rounded-full blur-[60px] opacity-60 bg-teal-500"></div>
          </div>
        </div>
      </div>

      <div class="skill-card">
        <div class="flex gap-3 items-center">
          <Icon name="hugeicons:java" class="icon" />
          <p>Java</p>
        </div>
        <div class="flex gap-4 items-center relative">
          <svg height="14" width="14" xmlns="http://www.w3.org/2000/svg" class="text-teal-500" fill="currentColor">
            <circle r="3" cx="7" cy="7" />
          </svg>
          <p class="text-[13px] text-teal-500">{{ t('skills.inProgress') }}</p>
          <div class="ellipsis-animation absolute left-[-16px]">
            <div class="size-12 rounded-full blur-[60px] opacity-60 bg-teal-500"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid items-start mt-1 mb-3 ml-1">
      <h1 class="text-neutral-200 dark:text-neutral-600 font-semibold text-xl font-raleway">
        {{ t('skills.titleSub') }}
      </h1>
    </div>

    <div class="flex w-full">
      <NuxtLink to="/newtab" class="tile">
        <div class="grid sm:flex gap-3 items-center">
          <Icon name="ci:text-align-left" class="text-neutral-400 dark:text-black icon" />
          <p class="font-semibold text-neutral-200 dark:text-black font-raleway">{{ t('skills.allSkills') }}</p>
        </div>
        <p class="text-neutral-400 dark:text-neutral-500 text-[14px] text-pretty font-jbmono">
          {{ t('skills.allSkillsSub') }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>