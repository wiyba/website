<script setup lang="ts">
import { useSearchConfig } from '~/composables/useSearchConfig'

const { CONFIG, COMMANDS } = useSearchConfig()

type Bookmark = { key: string; name: string; url: string }

const bookmarks = computed<Bookmark[]>(() => {
  const out: Bookmark[] = []
  for (const [key, v] of COMMANDS.entries()) {
    if (v?.name && v?.url) out.push({ key, name: v.name, url: v.url })
  }
  return out
})
</script>

<template>
  <nav class="w-full">
    <ul class="flex flex-wrap items-center justify-center gap-3">
      <li v-for="b in bookmarks" :key="b.key" class="list-none">
        <a
          :href="b.url"
          :target="CONFIG.openLinksInNewTab ? '_blank' : undefined"
          rel="noopener noreferrer"
          class="group relative inline-flex h-16 w-16 items-center justify-center rounded-xl text-neutral-300 transition-all duration-200 focus:outline-none font-jbmono text"
          title=""
        >
          <span
            class="pointer-events-none absolute text-[20px] text-neutral-400 transition-all duration-200
                   group-hover:opacity-0 group-hover:translate-y-3"
          >
            {{ b.key }}
          </span>

          <span
            class="pointer-events-none opacity-0 -translate-y-3 scale-95 text-[18px] px-2 text-center
                   transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
          >
            {{ b.name }}
          </span>
        </a>
      </li>
    </ul>
  </nav>
</template>
