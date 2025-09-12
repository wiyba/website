<script setup lang="ts">
const { uiReady } = useUiReady(200)
</script>

<template>
  <div class="grid place-items-center min-h-screen pt-12 sm:pt-0 gap-20 xl:justify-center px-8 transition-all duration-500" :class="uiReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'">
    <div class="w-full max-w-[85rem] mx-auto">
      <div class="grid lg:grid-cols-2 items-stretch gap-8">

        <!-- Левая колонка -->
        <div class="hidden lg:grid lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] gap-6 w-full h-full min-h-0">
          <div class="w-full lg:col-span-3 gap-6 justify-between flex">
            <TimeTile />
            <DateTile />
            <WeatherTile />
          </div>

          <AboutCard />
          <SpotifyCard />
        </div>

        <!-- Правая колонка -->
        <div class="grid items-stretch gap-6">
          <ProjectsCard />
          <SkillsCard />
        </div>

      </div>
    </div>
  </div>
</template>
