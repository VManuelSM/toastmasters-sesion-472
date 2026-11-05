<script setup lang="ts">
// Adaptado del componente del Plan de éxito — Agosto 20.
withDefaults(defineProps<{
  x?: number
  y?: number
  tam?: number
  inverso?: boolean
  opacidad?: number
}>(), {
  x: 50,
  y: 50,
  tam: 260,
  inverso: false,
  opacidad: 0.16,
})
</script>

<template>
  <div
    class="aro"
    :class="{ 'aro--inverso': inverso }"
    :style="{
      left: `${x}%`,
      top: `${y}%`,
      width: `${tam}px`,
      height: `${tam}px`,
      opacity: opacidad,
    }"
    aria-hidden="true"
  >
    <span class="aro__nucleo" />
    <span v-for="i in 4" :key="i" class="aro__onda" :style="{ '--i': i - 1 }" />
  </div>
</template>

<style scoped>
.aro {
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition:
    left 620ms var(--transition-easing-in-out),
    top 620ms var(--transition-easing-in-out),
    width 620ms var(--transition-easing-in-out),
    height 620ms var(--transition-easing-in-out),
    opacity 420ms var(--transition-easing-in-out);
}

.aro__nucleo,
.aro__onda {
  position: absolute;
  inset: 0;
  border: 2px solid var(--brand-primary);
  border-radius: 50%;
  transition: border-color 420ms var(--transition-easing-in-out);
}

.aro__nucleo {
  border-style: dashed;
  animation: aro-gira 38s linear infinite;
}

.aro__onda {
  border-color: var(--brand-secondary);
  opacity: 0;
  animation: aro-onda 4s cubic-bezier(0, 0, 0.2, 1) infinite;
  animation-delay: calc(var(--i) * -1s);
}

.aro--inverso .aro__nucleo { border-color: #fff; }
.aro--inverso .aro__onda { border-color: var(--brand-accent); }

@keyframes aro-gira {
  to { transform: rotate(360deg); }
}

@keyframes aro-onda {
  from { opacity: 0.9; transform: scale(0.55); }
  to { opacity: 0; transform: scale(1.55); }
}

@media (prefers-reduced-motion: reduce), print {
  .aro { transition: none; }
  .aro__nucleo,
  .aro__onda { animation: none; }
  .aro__onda { display: none; }
}
</style>
