<script setup lang="ts">
import { computed, unref } from 'vue'
import { useSlideContext } from '@slidev/client'
import Aro from './components/Aro.vue'
import Figuras from './components/Figuras.vue'

/**
 * Capa de ambiente, persistente por encima de las láminas.
 *
 * Vive fuera del flujo de diapositivas a propósito: al cambiar de lámina el
 * aro **interpola** su posición en vez de reaparecer, y las manchas no
 * reinician su deriva. Es lo que hace que el fondo se sienta continuo en lugar
 * de rearmarse en cada clic. Mismo patrón que el deck del 8 de octubre, de
 * donde vienen `Aro.vue` y `Figuras.vue`.
 */
const { $slidev } = useSlideContext()

/**
 * Una entrada por lámina, en orden.
 *
 * El criterio es dónde **no** hay contenido. Las láminas de mentoría traen un
 * grafo centrado que ocupa casi toda la caja, así que ahí el aro se va a las
 * esquinas y baja de opacidad: una mancha detrás de una cara de 48 px se lee
 * como suciedad del proyector. Las láminas de gradiente —portada, los tres
 * cierres de bloque y el cierre final— usan `inverso`, que cambia el aro a
 * blanco y dorado y sube el cuerpo de las manchas.
 */
const POSICIONES = [
  { x: 86, y: 28, tam: 340, inverso: true, opacidad: 0.40 }, //  1 portada
  { x: 90, y: 80, tam: 280, opacidad: 0.14 }, //  2 cuatro cosas
  { x: 10, y: 24, tam: 240, opacidad: 0.12 }, //  3 concurso — cierra hoy
  { x: 84, y: 30, tam: 350, inverso: true, opacidad: 0.34 }, //  4 cierre · mentoría
  { x: 92, y: 22, tam: 250, opacidad: 0.12 }, //  5 qué es el programa
  { x: 50, y: 94, tam: 200, opacidad: 0.06 }, //  6 el mapa del club — ocho grafos
  { x: 6, y: 86, tam: 230, opacidad: 0.09 }, //  7 Víctor
  { x: 94, y: 86, tam: 230, opacidad: 0.09 }, //  8 Samuel
  { x: 50, y: 92, tam: 210, opacidad: 0.08 }, //  9 Carlos y Edgar
  { x: 50, y: 92, tam: 210, opacidad: 0.08 }, // 10 estrenan mentoría
  { x: 50, y: 90, tam: 220, opacidad: 0.09 }, // 11 una pareja cada uno
  { x: 85, y: 30, tam: 350, inverso: true, opacidad: 0.34 }, // 12 cierre · reconocimiento
  { x: 84, y: 72, tam: 280, opacidad: 0.15 }, // 13 Gabriela Alquicirez
  { x: 82, y: 30, tam: 360, inverso: true, opacidad: 0.36 }, // 14 cierre · toma de protesta
  { x: 50, y: 14, tam: 230, opacidad: 0.09 }, // 15 toma de protesta — cuatro retratos
  { x: 86, y: 26, tam: 380, inverso: true, opacidad: 0.32 }, // 16 cierre final
]

const pagina = computed(() => Number(unref($slidev?.nav?.currentPage) ?? 1))
const posicion = computed(() => POSICIONES[pagina.value - 1] ?? POSICIONES[0])
const inverso = computed(() => Boolean(posicion.value.inverso))
</script>

<template>
  <div class="tm-ambiente" aria-hidden="true">
    <Figuras :inverso="inverso" />
    <Aro v-bind="posicion" />
  </div>
</template>

<style scoped>
/*
 * `z-index: 10` deja el ambiente por encima del fondo de la lámina y por
 * debajo de todo lo que se toca, que Slidev monta más arriba.
 * `pointer-events: none` cierra el tema: la capa no se come un solo clic.
 */
.tm-ambiente {
  position: absolute;
  inset: 0;
  z-index: 10;
  overflow: hidden;
  pointer-events: none;
}
</style>
