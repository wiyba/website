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
    <NuxtPage />
  </NuxtLayout>
</template>

