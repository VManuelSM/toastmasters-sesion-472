<script setup lang="ts">
import { computed } from 'vue'
import { renderSVG } from 'uqr'

/**
 * Código QR en SVG, generado en el navegador.
 *
 * `uqr` ya viene con Slidev, así que no hay dependencia nueva ni llamada a un
 * servicio de QR: la sede no siempre tiene internet y un `<img>` apuntando a
 * una API externa se vería como un hueco blanco justo cuando toca proyectarlo.
 * Al ser SVG escala sin pixelarse, que es lo que importa cuando alguien lo
 * escanea desde la última fila.
 */
const props = withDefaults(defineProps<{
  /** El contenido que se codifica. Normalmente una URL. */
  url: string
  /** Lado del código, en píxeles de lámina. */
  tam?: number
  /** Texto corto bajo el código. */
  pie?: string
}>(), {
  tam: 190,
})

/**
 * Corrección de errores alta: el QR sigue leyéndose con el logo encima, con
 * reflejo del proyector o si alguien se atraviesa a medio escaneo.
 */
const svg = computed(() => renderSVG(props.url, {
  ecc: 'H',
  border: 1,
  blackColor: '#004165',
  whiteColor: '#FFFFFF',
}))
</script>

<template>
  <figure class="qr">
    <!-- eslint-disable-next-line vue/no-v-html -- SVG generado localmente por uqr -->
    <div class="qr__codigo" :style="{ width: `${tam}px`, height: `${tam}px` }" v-html="svg" />
    <figcaption v-if="pie" class="qr__pie">{{ pie }}</figcaption>
  </figure>
</template>

<style scoped>
.qr {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
}

.qr__codigo {
  padding: var(--space-3);
  background: #fff;
  border: 2px solid var(--brand-accent);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
}

.qr__codigo :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.qr__pie {
  font-size: 0.62rem;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
</style>
