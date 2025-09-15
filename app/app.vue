<script setup lang="ts">
useSeoMeta({
  title: '@wiyba',
  description: 'personal website of @wiyba',
  ogTitle: '@wiyba',
  ogDescription: 'personal website of @wiyba',
  ogUrl: 'https://wiyba.org',
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.ico' }
  ]
})
</script>

<template>
  <NuxtLayout>
    <Transition name="fade" mode="out-in">
      <NuxtPage />
    </Transition>
  </NuxtLayout>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.35s ease-in;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

