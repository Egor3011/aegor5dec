<script setup>
defineProps({ name: String })
const paths = {
  arrow: ['M7 17 17 7', 'M7 7h10v10'],
  down: ['M12 4v16', 'm5 13 7 7 7-7'],
  calendar: ['M8 2v4M16 2v4', 'M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'm8 15 3 3 5-5'],
  pin: ['M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z', 'M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'],
  train: ['M6 3h12a2 2 0 0 1 2 2v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2Z', 'M4 11h16M12 3v8M8 15h.01M16 15h.01M8 19l-3 3M16 19l3 3'],
  van: ['M3 6h12l6 5v7H3V6Z', 'M15 6v6h6M3 12h12', 'M9 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM19 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z'],
  sun: ['M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z', 'M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5'],
  music: ['M9 18V5l12-3v13', 'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', 'M9 9l12-3'],
  house: ['m2 11 10-9 10 9', 'M5 9v12h14V9M9 21v-8h6v8'],
  check: ['m5 12 4 4L19 6'],
  close: ['m6 6 12 12M6 18 18 6'],
  copy: ['M9 9h12v12H9z', 'M15 9V3H3v12h6'],
  telegram: ['m22 2-7 20-4-9L2 9 22 2Z', 'M11 13 22 2'],
  sparkle: ['m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z'],
  pause: ['M8 5v14M16 5v14'],
  play: ['m8 4 12 8-12 8V4Z']
}
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path v-for="(path, index) in paths[name] || paths.arrow" :key="index" :d="path" />
  </svg>
</template>
