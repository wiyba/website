<template>
  <div class="p-10 flex justify-between items-center">
    <div class="w-min"><TimeTile /></div>
    <Bookmarks />
    <div class="w-min"><WeatherTile /></div>
  </div>
  <client-only>
    <search-component class="font-jbmono" />
  </client-only>
</template>
