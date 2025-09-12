<script lang="ts" setup>
import avatar from '@/assets/img/wiyba.png'
const handle = '@wiyba'

const { t, locale, setLocale } = useI18n()

function toggleLang() {
  setLocale(locale.value === 'ru' ? 'en' : 'ru')
}
</script>

<template>
  <div class="card lg:col-span-3 flex-col p-6">
    <div class="flex gap-4 items-center pb-2">
      <Icon name="material-symbols:book-2" class="text-neutral-400 dark:text-black icon mr-0 pr-0" />
      <p class="text-neutral-400 dark:text-black text-[14px] font-jbmono ml-0 pl-0 pb-0.5">
        about.md
      </p>
    </div>

    <div class="grid md:flex gap-6 items-center">
      <img
        width="80" height="80" :alt="handle" :src="avatar"
        class="rounded-full hover:shadow-2xl smooth hover:scale-[103%] active:scale-[107%] cursor-grab active:cursor-grabbing"
      />
      <div class="grid gap-5 relative">
        <div class="ellipsis-animation absolute -top-8 left-36">
          <div class="size-24 rounded-full blur-[60px] opacity-20 bg-purple-500"></div>
        </div>

        <h1 class="font-semibold font-onest text-xl sm:text-2xl text-neutral-200 dark:text-black">
          {{ t('about.hello') }} <span class="gradient-text font-sans">@wiyba</span>
        </h1>

        <div class="hidden md:flex flex-wrap gap-4">
          <div class="chip text-neutral-200 font-raleway"><p><Icon name="mdi:language-python" size="13" class="icon mr-1 mb-1" /> Python</p></div>
          <div class="chip text-neutral-200 font-raleway"><p><Icon name="uim:vuejs" size="13" class="icon mr-1 mb-0.5" /> Vue</p></div>
          <div class="chip text-neutral-200 font-raleway"><p><Icon name="lineicons:nuxt" size="13" class="icon mr-1" /> Nuxt</p></div>
          <div class="chip text-neutral-200 font-raleway"><p><Icon name="mdi:tailwind" size="13" class="icon mr-1" /> Tailwind</p></div>
        </div>
      </div>
    </div>

    <p class="text-neutral-400 dark:text-black font-sans pt-0.5">
      <i18n-t keypath="about.desc" scope="global">
        <template #almost>
          <span class="text-[13px] opacity-70">{{ t('about.almost') }}</span>
        </template>
      </i18n-t>
    </p>

    <div class="grid lg:flex gap-4 w-full">
      <a href="https://github.com/wiyba" class="btn">
        <Icon name="mingcute:telegram-line" size="22" class="text-neutral-400 dark:text-black align-sub" />
        <p class="font-medium">{{ t('about.contact') }}</p>
      </a>

      <!-- Вариант 1: локальный тоггл языка -->
      <button class="btn" @click="toggleLang">
        <Icon name="heroicons:language-20-solid" size="22" class="text-neutral-400 dark:text-black align-sub" />
        <p class="font-medium pl-0">{{ t('about.switchLang') }}</p>
      </button>

      <!-- Вариант 2: готовый свитчер ссылками
      <LanguageSwitcher />
      -->
    </div>
  </div>
</template>